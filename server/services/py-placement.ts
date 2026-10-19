import {
  PLACEMENT_BANK_TARGET,
  PLACEMENT_SESSION_SIZE,
  PLACEMENT_TIME_SEC,
  buildPlacementBank,
  scorePlacementSession,
  toPublicPlacementQuestion,
  type PlacementBankItem,
} from "../../src/lib/python-lms/placement-bank";
import { PLACEMENT_PASS_RATIO } from "../../src/lib/python-lms/placement";
import { PyPlacementQuestion } from "../models/PyPlacementQuestion";
import { User } from "../models/User";

const SESSION_MS = PLACEMENT_TIME_SEC * 1000;

type SessionDoc = {
  id: string;
  questionIds: string[];
  startedAt: Date;
  expiresAt: Date;
};

function bankFromDb(
  docs: {
    questionId: string;
    topic: number;
    type: "mcq" | "predict";
    prompt: string;
    code?: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[],
): PlacementBankItem[] {
  return docs.map((d) => {
    const base = {
      id: d.questionId,
      topic: d.topic,
      prompt: d.prompt,
      options: d.options,
      answer: d.correctIndex,
      explain: d.explanation,
    };
    if (d.type === "predict") {
      return { ...base, type: "predict" as const, code: d.code ?? "" };
    }
    return { ...base, type: "mcq" as const, ...(d.code ? { code: d.code } : {}) };
  });
}

async function loadBank(): Promise<PlacementBankItem[]> {
  const count = await PyPlacementQuestion.countDocuments({ active: true });
  if (count >= PLACEMENT_BANK_TARGET) {
    const docs = await PyPlacementQuestion.find({ active: true }).select("questionId topic type prompt code options correctIndex explanation").lean();
    return bankFromDb(docs);
  }
  return buildPlacementBank();
}

function pickFromBank(bank: PlacementBankItem[], seenIds: string[], size: number): PlacementBankItem[] {
  const seen = new Set(seenIds);
  const pool = bank.filter((q) => !seen.has(q.id));
  const source = pool.length >= size ? pool : bank;
  const picked: PlacementBankItem[] = [];
  const used = new Set<string>();
  let seed = (seenIds.length * 17 + size * 31) % 997;
  while (picked.length < size && picked.length < source.length) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const q = source[seed % source.length];
    if (used.has(q.id)) continue;
    used.add(q.id);
    picked.push(q);
  }
  return picked;
}

export async function startPyPlacementSession(userId: string): Promise<{
  sessionId: string;
  expiresAt: string;
  questions: ReturnType<typeof toPublicPlacementQuestion>[];
  totalInBank: number;
  sessionSize: number;
  timeLimitSec: number;
}> {
  const user = await User.findById(userId).select("learnPython.placementSeenIds learnPython.placementSession").lean();
  const seenIds = user?.learnPython?.placementSeenIds ?? [];
  const bank = await loadBank();
  const sessionItems = pickFromBank(bank, seenIds, PLACEMENT_SESSION_SIZE);
  const now = new Date();
  const session: SessionDoc = {
    id: `${userId}-${now.getTime()}`,
    questionIds: sessionItems.map((q) => q.id),
    startedAt: now,
    expiresAt: new Date(now.getTime() + SESSION_MS),
  };

  await User.updateOne(
    { _id: userId },
    {
      $set: {
        "learnPython.placementSession": session,
      },
    },
  );

  return {
    sessionId: session.id,
    expiresAt: session.expiresAt.toISOString(),
    questions: sessionItems.map(toPublicPlacementQuestion),
    totalInBank: bank.length,
    sessionSize: PLACEMENT_SESSION_SIZE,
    timeLimitSec: PLACEMENT_TIME_SEC,
  };
}

export async function submitPyPlacementSession(
  userId: string,
  sessionId: string,
  answers: Record<string, number>,
): Promise<{
  score: number;
  total: number;
  passed: boolean;
  byId: Record<string, boolean>;
  intermediateAccess: boolean;
}> {
  const user = await User.findById(userId).select("learnPython").lean();
  const session = user?.learnPython?.placementSession as SessionDoc | undefined;
  if (!session || session.id !== sessionId) {
    const err = new Error("Placement session expired — start again.");
    (err as { status?: number }).status = 400;
    throw err;
  }
  if (new Date() > new Date(session.expiresAt)) {
    const err = new Error("Time is up for this attempt.");
    (err as { status?: number }).status = 400;
    throw err;
  }

  const bank = await loadBank();
  const byId = new Map(bank.map((q) => [q.id, q]));
  const sessionQuestions = session.questionIds.map((id) => byId.get(id)).filter(Boolean) as PlacementBankItem[];
  if (sessionQuestions.length !== session.questionIds.length) {
    const err = new Error("Question bank out of date — retry after seed.");
    (err as { status?: number }).status = 503;
    throw err;
  }

  const result = scorePlacementSession(sessionQuestions, answers, PLACEMENT_PASS_RATIO);
  const newSeen = [...new Set([...(user?.learnPython?.placementSeenIds ?? []), ...session.questionIds])];

  const set: Record<string, unknown> = {
    "learnPython.placementSeenIds": newSeen.slice(-400),
    "learnPython.placementSession": null,
  };
  if (result.passed) {
    set["learnPython.intermediateAccess"] = true;
    set["learnPython.placement"] = {
      passed: true,
      score: result.score,
      total: result.total,
      at: new Date(),
    };
  }

  await User.updateOne({ _id: userId }, { $set: set });

  return {
    ...result,
    intermediateAccess: result.passed || Boolean(user?.learnPython?.intermediateAccess),
  };
}

export async function seedPyPlacementBank(): Promise<number> {
  const bank = buildPlacementBank();
  let upserted = 0;
  for (const q of bank) {
    await PyPlacementQuestion.updateOne(
      { questionId: q.id },
      {
        $set: {
          questionId: q.id,
          topic: q.topic,
          type: q.type,
          prompt: q.prompt,
          code: q.code,
          options: q.options,
          correctIndex: q.answer,
          explanation: q.explain,
          active: true,
        },
      },
      { upsert: true },
    );
    upserted += 1;
  }
  return upserted;
}
