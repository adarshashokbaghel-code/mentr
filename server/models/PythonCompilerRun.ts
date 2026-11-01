import mongoose, { Schema, type Types } from "mongoose";

/** Where the learner pressed Run. No source code is stored. */
export const PYTHON_COMPILER_SURFACES = ["open", "lms", "project"] as const;
export type PythonCompilerSurface = (typeof PYTHON_COMPILER_SURFACES)[number];

export const PYTHON_COMPILER_STATUSES = ["ok", "error", "timeout", "stopped", "load-failed"] as const;
export type PythonCompilerStatus = (typeof PYTHON_COMPILER_STATUSES)[number];

export interface IPythonCompilerRun {
  surface: PythonCompilerSurface;
  /** Final Challenge id, only when surface is project. */
  projectId?: string;
  ok: boolean;
  status: PythonCompilerStatus;
  /** Project check passed, when this run was a Final Challenge. */
  passed?: boolean;
  errorType?: string;
  errorMessage?: string;
  line?: number;
  durationMs: number;
  /** Length of the program. The text itself is not stored. */
  chars: number;
  userId?: Types.ObjectId;
  createdAt: Date;
}

const schema = new Schema<IPythonCompilerRun>(
  {
    surface: { type: String, enum: PYTHON_COMPILER_SURFACES, required: true },
    projectId: { type: String, trim: true },
    ok: { type: Boolean, required: true },
    status: { type: String, enum: PYTHON_COMPILER_STATUSES, required: true },
    passed: { type: Boolean },
    errorType: { type: String, trim: true },
    errorMessage: { type: String, trim: true },
    line: { type: Number },
    durationMs: { type: Number, required: true, min: 0 },
    chars: { type: Number, required: true, min: 0 },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

schema.index({ createdAt: -1 });
schema.index({ surface: 1, createdAt: -1 });
schema.index({ projectId: 1, createdAt: -1 });

export const PythonCompilerRun =
  mongoose.models.PythonCompilerRun ||
  mongoose.model<IPythonCompilerRun>("PythonCompilerRun", schema);
