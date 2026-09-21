import { SNAP_GRADE_ALL_SEED } from "../data/snap-grade-class9-maths-bank";
import { SnapGradeQuestion } from "../models/SnapGrade";
import mongoose from "mongoose";

/** Bump when bank content changes so missing rows are inserted. */
const SEED_VERSION = "2026-03-29-ncert-pcm-bio-1112-v1";

type SeedMeta = {
  key: string;
  version: string;
  size: number;
  updatedAt: Date;
};

const SeedMetaModel =
  mongoose.models.SnapGradeSeedMeta ||
  mongoose.model<SeedMeta>(
    "SnapGradeSeedMeta",
    new mongoose.Schema(
      {
        key: { type: String, unique: true },
        version: String,
        size: Number,
        updatedAt: Date,
      },
      { collection: "snapgradeseedmetas" },
    ),
  );

let seedPromise: Promise<number> | null = null;
let lastSeedKey = "";

function isQuotaError(err: unknown): boolean {
  const msg = String((err as { message?: string })?.message || err);
  return /space quota|AtlasError|8000/i.test(msg);
}

function qKey(q: {
  classLevel: number;
  subject: string;
  chapterNumber: number;
  exercise: string;
  questionNumber: string;
}) {
  return `${q.classLevel}::${q.subject}::${q.chapterNumber}::${q.exercise}::${q.questionNumber}`;
}

/** Idempotent insert of missing CBSE NCERT bank rows (Maths 9–12 + Science 9–10 + Physics/Chemistry/Biology 11–12). */
export async function ensureSnapGradeSeed(): Promise<number> {
  const size = SNAP_GRADE_ALL_SEED.length;
  const key = `${SEED_VERSION}:${size}`;
  if (seedPromise && lastSeedKey === key) return seedPromise;

  lastSeedKey = key;
  seedPromise = (async () => {
    try {
      const meta = await SeedMetaModel.findOne({ key: "ncert-bank" }).lean();
      if (meta?.version === SEED_VERSION && meta?.size === size) {
        const count = await SnapGradeQuestion.countDocuments({
          board: "CBSE",
          active: true,
        });
        if (count >= Math.floor(size * 0.85)) return count;
      }
    } catch {
      /* continue */
    }

    // Load existing keys in one query — avoid 2k round-trips
    const existing = await SnapGradeQuestion.find({ board: "CBSE" })
      .select("classLevel subject chapterNumber exercise questionNumber")
      .lean();
    const have = new Set(existing.map(qKey));

    const missing = SNAP_GRADE_ALL_SEED.filter((q) => !have.has(qKey(q)));
    if (missing.length === 0) {
      try {
        await SeedMetaModel.findOneAndUpdate(
          { key: "ncert-bank" },
          { $set: { version: SEED_VERSION, size, updatedAt: new Date() } },
          { upsert: true },
        );
      } catch {
        /* ignore */
      }
      return have.size;
    }

    console.log(
      `[snap-grade-seed] inserting ${missing.length} missing of ${size} (have ${have.size})`,
    );

    let inserted = 0;
    let writeErrors = 0;

    // Insert in small batches
    const batchSize = 25;
    for (let i = 0; i < missing.length; i += batchSize) {
      const batch = missing.slice(i, i + batchSize).map((q) => ({
        board: q.board,
        classLevel: q.classLevel,
        subject: q.subject,
        chapterNumber: q.chapterNumber,
        exercise: q.exercise,
        questionNumber: q.questionNumber,
        chapterName: q.chapterName,
        questionText: q.questionText,
        referenceNotes: q.referenceNotes,
        maxMarks: q.maxMarks,
        rubric: q.rubric,
        markingSchemeNotes: q.markingSchemeNotes,
        weightSource: q.weightSource ?? "practice_cbse",
        adminLocked: false,
        creditsCost: q.creditsCost,
        sortOrder: q.sortOrder,
        active: true,
      }));

      try {
        const res = await SnapGradeQuestion.insertMany(batch, {
          ordered: false,
        });
        inserted += res.length;
      } catch (err) {
        writeErrors += 1;
        // insertMany with ordered:false may still insert some docs
        const insertedCount =
          (err as { insertedDocs?: unknown[] })?.insertedDocs?.length || 0;
        inserted += insertedCount;
        console.warn("[snap-grade-seed] batch write issue:", err);
        if (isQuotaError(err) || writeErrors >= 2) {
          console.warn(
            `[snap-grade-seed] aborting (inserted ~${inserted}/${missing.length})`,
          );
          break;
        }
      }
    }

    if (writeErrors === 0 && inserted >= missing.length) {
      try {
        await SeedMetaModel.findOneAndUpdate(
          { key: "ncert-bank" },
          { $set: { version: SEED_VERSION, size, updatedAt: new Date() } },
          { upsert: true },
        );
      } catch {
        /* ignore */
      }
    }

    return have.size + inserted;
  })().catch((err) => {
    seedPromise = null;
    lastSeedKey = "";
    console.warn("[snap-grade-seed] failed:", err);
    return 0;
  });

  return seedPromise;
}
