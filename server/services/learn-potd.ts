import { buildPotdSeedBank } from "../lib/learn-potd-seed";
import { LearnPotd, potdDayIndexForDate, POTD_CYCLE } from "../models/LearnPotd";
import { LearnPotdAttempt } from "../models/LearnPotdAttempt";

function dateKeyUTC(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function parseDateKey(dateKey: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!m) {
    throw Object.assign(new Error("Invalid date"), { status: 400 });
  }
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
}

let potdBankReady = false;

export async function ensurePotdBankSeeded() {
  if (potdBankReady) return POTD_CYCLE;
  const count = await LearnPotd.countDocuments({ active: true });
  if (count >= POTD_CYCLE) {
    potdBankReady = true;
    return count;
  }
  const bank = buildPotdSeedBank();
  await LearnPotd.bulkWrite(
    bank.map((row) => ({
      updateOne: {
        filter: { dayIndex: row.dayIndex },
        update: { $set: { ...row, active: true } },
        upsert: true,
      },
    })),
    { ordered: false },
  );
  potdBankReady = true;
  return LearnPotd.countDocuments({ active: true });
}

function serializePotd(potd: {
  potdId: string;
  moduleId: string;
  trackId: "cs" | "ai" | "math";
  title: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  dayIndex: number;
}) {
  return {
    potdId: potd.potdId,
    moduleId: potd.moduleId,
    trackId: potd.trackId,
    title: potd.title,
    prompt: potd.prompt,
    options: potd.options,
    correctIndex: potd.correctIndex,
    explanation: potd.explanation,
    difficulty: potd.difficulty,
    dayIndex: potd.dayIndex,
  };
}

export async function getPotdForDateKey(dateKey: string, userId?: string) {
  await ensurePotdBankSeeded();
  const date = parseDateKey(dateKey);
  const todayKey = dateKeyUTC(new Date());
  const isFuture = dateKey > todayKey;
  const dayIndex = potdDayIndexForDate(date);
  const potd = await LearnPotd.findOne({ dayIndex, active: true }).lean();
  if (!potd) {
    throw Object.assign(new Error("POTD missing"), { status: 404 });
  }

  let attempt: {
    selectedIndex: number;
    correct: boolean;
    attemptedAt: string;
  } | null = null;

  if (userId) {
    const row = await LearnPotdAttempt.findOne({
      user: userId,
      dateKey,
    }).lean();
    if (row) {
      attempt = {
        selectedIndex: row.selectedIndex,
        correct: row.correct,
        attemptedAt: row.attemptedAt.toISOString(),
      };
    }
  }

  if (isFuture) {
    return {
      cycle: POTD_CYCLE,
      dateKey,
      dayIndex,
      isToday: false,
      isFuture: true,
      unlocked: false,
      attempted: false,
      attempt: null,
      potd: {
        potdId: potd.potdId,
        moduleId: potd.moduleId,
        trackId: potd.trackId,
        title: potd.title,
        difficulty: potd.difficulty,
        dayIndex: potd.dayIndex,
      },
    };
  }

  const full = serializePotd(potd);
  // Hide answer until attempted (GFG-style)
  const potdPayload = attempt
    ? full
    : {
        potdId: full.potdId,
        moduleId: full.moduleId,
        trackId: full.trackId,
        title: full.title,
        prompt: full.prompt,
        options: full.options,
        difficulty: full.difficulty,
        dayIndex: full.dayIndex,
      };

  return {
    cycle: POTD_CYCLE,
    dateKey,
    dayIndex,
    isToday: dateKey === todayKey,
    isFuture: false,
    unlocked: true,
    attempted: Boolean(attempt),
    attempt,
    potd: potdPayload,
  };
}

export async function getTodayPotd(userId?: string, date = new Date()) {
  return getPotdForDateKey(dateKeyUTC(date), userId);
}

/** GFG-style month grid: regular calendar + attempt highlights. */
export async function getPotdMonth(
  userId: string,
  year: number,
  month: number, // 1-12
) {
  await ensurePotdBankSeeded();
  if (!Number.isFinite(year) || month < 1 || month > 12) {
    throw Object.assign(new Error("Invalid month"), { status: 400 });
  }

  const todayKey = dateKeyUTC(new Date());
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstDow = new Date(Date.UTC(year, month - 1, 1)).getUTCDay(); // 0 Sun

  const dateKeys: string[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    dateKeys.push(
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    );
  }

  const attempts = await LearnPotdAttempt.find({
    user: userId,
    dateKey: { $in: dateKeys },
  }).lean();
  const attemptByDate = new Map(attempts.map((a) => [a.dateKey, a]));

  const days = dateKeys.map((dateKey) => {
    const dayIndex = potdDayIndexForDate(parseDateKey(dateKey));
    const attempt = attemptByDate.get(dateKey);
    return {
      dateKey,
      day: Number(dateKey.slice(8, 10)),
      dayIndex,
      isToday: dateKey === todayKey,
      isFuture: dateKey > todayKey,
      attempted: Boolean(attempt),
      correct: attempt?.correct ?? null,
    };
  });

  return {
    year,
    month,
    firstDow,
    daysInMonth,
    todayKey,
    cycle: POTD_CYCLE,
    days,
  };
}

export async function recordPotdAttempt(
  userId: string,
  input: { dateKey: string; selectedIndex: number },
) {
  await ensurePotdBankSeeded();
  const date = parseDateKey(input.dateKey);
  const todayKey = dateKeyUTC(new Date());
  if (input.dateKey > todayKey) {
    throw Object.assign(new Error("Cannot attempt a future POTD"), {
      status: 400,
    });
  }

  const dayIndex = potdDayIndexForDate(date);
  const potd = await LearnPotd.findOne({ dayIndex, active: true }).lean();
  if (!potd) {
    throw Object.assign(new Error("POTD missing"), { status: 404 });
  }

  const correctIndex = potd.correctIndex;
  const correct = input.selectedIndex === correctIndex;

  const row = await LearnPotdAttempt.findOneAndUpdate(
    { user: userId, dateKey: input.dateKey },
    {
      $set: {
        potdId: potd.potdId,
        dayIndex,
        selectedIndex: input.selectedIndex,
        correct,
        attemptedAt: new Date(),
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  return {
    dateKey: input.dateKey,
    correct,
    selectedIndex: input.selectedIndex,
    correctIndex,
    explanation: potd.explanation,
    attempt: {
      selectedIndex: row!.selectedIndex,
      correct: row!.correct,
      attemptedAt: row!.attemptedAt.toISOString(),
    },
  };
}

/** @deprecated kept for older clients — prefer getPotdMonth */
export async function getPotdCalendar(userId?: string) {
  const now = new Date();
  return getPotdMonth(
    userId || "000000000000000000000000",
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
  );
}
