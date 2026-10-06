import "dotenv/config";
import { connectDb } from "../server/db";
import { User } from "../server/models/User";
import { signAuthToken } from "../server/services/jwt";
import { PY_LESSON_INDEX, getPyLesson } from "../src/lib/python-lms";
import { getPyProject } from "../src/lib/python-lms/projects";

const API = "http://localhost:5000/api/learnpython";

(async () => {
  await connectDb();
  const u = await User.findOne({ email: "anan@gmail.com" }).select("email role learnPython").lean();
  const backup = u!.learnPython;
  const token = signAuthToken(String(u!._id), u!.email, u!.role);
  await User.updateOne({ _id: u!._id }, { $unset: { learnPython: 1 } });
  const day = new Date().toISOString().slice(0, 10);
  const call = async (path: string, init?: RequestInit) => {
    const r = await fetch(`${API}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    return { status: r.status, body: await r.json() };
  };
  const sync = (p: { lessons?: object; awards?: string[]; projects?: object }) =>
    call("/sync", { method: "POST", body: JSON.stringify({ day, awards: [], lessons: {}, achievements: {}, projects: {}, ...p }) }).then((r) => r.body);
  const ok = (label: string, cond: boolean) => console.log(cond ? "PASS" : "FAIL", label);

  try {
    const t0 = Date.now();
    const iso = (ms: number) => new Date(t0 + ms).toISOString();

    let s = await sync({ projects: { calculator: { completedAt: iso(0), code: getPyProject("calculator")!.starter } } });
    ok("starter code cannot complete calculator", !s.projects.calculator?.completedAt);

    s = await sync({
      projects: { "guess-number": { solutionViewedAt: iso(1000), completedAt: iso(2000), code: getPyProject("guess-number")!.solution } },
    });
    ok("solution viewed then completed in same sync is rejected", !s.projects["guess-number"]?.completedAt && !!s.projects["guess-number"]?.solutionViewedAt);

    s = await sync({ projects: { "guess-number": { completedAt: iso(5000), code: getPyProject("guess-number")!.solution } } });
    ok("later completion after solution viewed is rejected", !s.projects["guess-number"]?.completedAt);

    s = await sync({ awards: ["project:calculator"] });
    ok("client-sent project award ignored", !("project:calculator" in s.awarded));

    s = await sync({ projects: { "quiz-game": { completedAt: iso(0), hintsUsed: 3, code: getPyProject("quiz-game")!.solution } } });
    ok("quiz-game completes with real code", !!s.projects["quiz-game"]?.completedAt);
    ok("project:quiz-game awarded +10 by server", s.awarded["project:quiz-game"] === 10);

    s = await sync({ projects: { "quiz-game": { solutionViewedAt: iso(9000) } } });
    ok("viewing solution after completing keeps completion", !!s.projects["quiz-game"]?.completedAt);

    let c = await call("/certificate", { method: "POST" });
    ok(`claim before eligible is refused (${c.status}: ${c.body.error})`, c.status === 400);

    const lessons: Record<string, object> = {};
    const practice: string[] = [];
    const examples: string[] = [];
    for (const e of PY_LESSON_INDEX) {
      const l = getPyLesson(e.slug);
      if (!l) continue;
      lessons[e.slug] = { notesDone: true, slidesSeen: l.notes.length - 1, notesSlide: l.notes.length - 1 };
      practice.push(...l.practice.slice(0, 3).map((q) => `q:${e.slug}:${q.id}`));
      examples.push(...l.examples.slice(0, 6).map((x) => `${x.type === "trace" ? "trace" : "goal"}:${e.slug}:${x.id}`));
    }
    s = await sync({ lessons, awards: practice.slice(0, 19) });
    s = await sync({ awards: examples.slice(0, 49) });
    c = await call("/certificate", { method: "POST" });
    ok(`19 practice + 49 examples still refused (${c.body.error})`, c.status === 400);

    s = await sync({ awards: [practice[19], examples[49]] });
    const prof = await call("/profile");
    ok(`profile progress eligible: ${JSON.stringify(prof.body.progress.stats)}`, prof.body.progress.eligible === true);

    c = await call("/certificate", { method: "POST" });
    ok(`claim issues certificate ${c.body.id}`, c.status === 200 && /^MPY-/.test(c.body.id));
    console.log("   ", JSON.stringify(c.body));
    const again = await call("/certificate", { method: "POST" });
    ok("claim again returns the same id", again.body.id === c.body.id);

    const pub = await fetch(`${API}/certificate/${c.body.id}`);
    const pubBody = await pub.json();
    ok("public verify (no auth) finds it", pub.status === 200 && pubBody.name === c.body.name && !("email" in pubBody));
    const bad = await fetch(`${API}/certificate/MPY-AAAA-2222`);
    ok("unknown id is 404", bad.status === 404);

    const board = await call("/leaderboard");
    const me = board.body.me;
    ok(`leaderboard has me rank ${me?.rank} xp ${me?.xp} certified ${me?.certified}`, !!me && me.certified && me.projectsCompleted === 1);
    console.log("    top3:", board.body.rows.slice(0, 3).map((r: { rank: number; name: string; xp: number }) => `${r.rank}. ${r.name} ${r.xp}`).join(" | "));
    ok("leaderboard names hide surnames/emails", board.body.rows.every((r: { name: string }) => !r.name.includes("@")));
  } finally {
    await User.updateOne({ _id: u!._id }, backup ? { $set: { learnPython: backup } } : { $unset: { learnPython: 1 } });
    console.log("restored");
    process.exit(0);
  }
})();
