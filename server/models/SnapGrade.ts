import mongoose, { Document, Schema, Types } from "mongoose";

export type RubricStep = {
  id: string;
  label: string;
  marks: number;
  /** What the student must show to earn this step */
  criteria: string;
};

export interface ISnapGradeQuestion extends Document {
  board: string;
  classLevel: number;
  subject: string;
  chapterNumber: number;
  chapterName: string;
  exercise: string;
  questionNumber: string;
  questionText: string;
  /** Optional short official / reference answer notes for the model */
  referenceNotes?: string;
  maxMarks: number;
  rubric: RubricStep[];
  /** CBSE-style marking notes shown to students + admin */
  markingSchemeNotes: string;
  /**
   * Where maxMarks/rubric came from:
   * practice_cbse = heuristic CBSE-style practice weights (NCERT has no official key)
   * admin_curated = edited in admin panel
   * official_sqp = imported from a board SQP marking scheme
   */
  weightSource: "practice_cbse" | "admin_curated" | "official_sqp";
  /** When true, seed will not overwrite rubric / maxMarks / notes */
  adminLocked: boolean;
  creditsCost: number;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const rubricStepSchema = new Schema<RubricStep>(
  {
    id: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    marks: { type: Number, required: true, min: 0 },
    criteria: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const snapGradeQuestionSchema = new Schema<ISnapGradeQuestion>(
  {
    board: { type: String, default: "CBSE", trim: true, index: true },
    classLevel: { type: Number, default: 9, index: true },
    subject: { type: String, required: true, trim: true, index: true },
    chapterNumber: { type: Number, required: true, index: true },
    chapterName: { type: String, required: true, trim: true },
    exercise: { type: String, required: true, trim: true, index: true },
    questionNumber: { type: String, required: true, trim: true },
    questionText: { type: String, required: true, trim: true },
    referenceNotes: { type: String, trim: true },
    maxMarks: { type: Number, required: true, min: 0.5 },
    rubric: { type: [rubricStepSchema], required: true },
    markingSchemeNotes: { type: String, default: "", trim: true },
    weightSource: {
      type: String,
      enum: ["practice_cbse", "admin_curated", "official_sqp"],
      default: "practice_cbse",
    },
    adminLocked: { type: Boolean, default: false, index: true },
    creditsCost: { type: Number, default: 5, min: 1 },
    active: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

snapGradeQuestionSchema.index(
  {
    board: 1,
    classLevel: 1,
    subject: 1,
    chapterNumber: 1,
    exercise: 1,
    questionNumber: 1,
  },
  { unique: true },
);

export const SnapGradeQuestion =
  mongoose.models.SnapGradeQuestion ||
  mongoose.model<ISnapGradeQuestion>(
    "SnapGradeQuestion",
    snapGradeQuestionSchema,
  );

export type StepAward = {
  stepId: string;
  label: string;
  marksPossible: number;
  marksAwarded: number;
  comment: string;
};

export interface ISnapGradeEvaluation extends Document {
  user: Types.ObjectId;
  question: Types.ObjectId;
  imageUrl: string;
  imagePath?: string;
  marksAwarded: number;
  maxMarks: number;
  creditsDeducted: number;
  steps: StepAward[];
  overallFeedback: string;
  /** OCR-style transcription of the photo (for audit + student transparency) */
  transcript?: string;
  /** Raw OCR before any student edit */
  originalTranscript?: string;
  transcriptEdited?: boolean;
  relevance?: string;
  aiModel: string;
  rawModelJson?: string;
  createdAt: Date;
  updatedAt: Date;
}

const stepAwardSchema = new Schema<StepAward>(
  {
    stepId: { type: String, required: true },
    label: { type: String, required: true },
    marksPossible: { type: Number, required: true },
    marksAwarded: { type: Number, required: true },
    comment: { type: String, default: "" },
  },
  { _id: false },
);

const snapGradeEvaluationSchema = new Schema<ISnapGradeEvaluation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "SnapGradeQuestion",
      required: true,
      index: true,
    },
    imageUrl: { type: String, required: true },
    imagePath: { type: String },
    marksAwarded: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    creditsDeducted: { type: Number, required: true },
    steps: { type: [stepAwardSchema], default: [] },
    overallFeedback: { type: String, default: "" },
    transcript: { type: String, default: "" },
    originalTranscript: { type: String, default: "" },
    transcriptEdited: { type: Boolean, default: false },
    relevance: { type: String, default: "" },
    aiModel: { type: String, default: "" },
    rawModelJson: { type: String },
  },
  { timestamps: true },
);

export const SnapGradeEvaluation =
  mongoose.models.SnapGradeEvaluation ||
  mongoose.model<ISnapGradeEvaluation>(
    "SnapGradeEvaluation",
    snapGradeEvaluationSchema,
  );

/** Compact text-only grade row (no images) for on-page history. */
export type SnapGradeHistoryEntry = {
  evaluationId: string;
  gradedAt: Date;
  board: string;
  classLevel: number;
  subject: string;
  chapterNumber: number;
  chapterName: string;
  exercise: string;
  questionNumber: string;
  questionText: string;
  marksAwarded: number;
  maxMarks: number;
  creditsDeducted: number;
  overallFeedback: string;
  transcript: string;
  relevance: string;
  steps: StepAward[];
};

export type SnapGradeRecharge = {
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amountPaise: number;
  credits: number;
  status: "created" | "paid" | "failed";
  createdAt: Date;
  paidAt?: Date;
  webhookEventId?: string;
};

export type SnapGradeLedgerEntry = {
  type: "free_grant" | "recharge" | "spend";
  credits: number;
  balanceAfter: number;
  note?: string;
  refId?: string;
  at: Date;
};

/**
 * One Snap & Grade account per parent/mentor: wallet, recharges,
 * Razorpay refs, text grade history, and ledger — compact, no images.
 */
export interface ISnapGradeWallet extends Document {
  user: Types.ObjectId;
  creditBalance: number;
  freeCreditsClaimed: boolean;
  freeCreditsGranted: number;
  totalRecharged: number;
  totalSpent: number;
  recharges: SnapGradeRecharge[];
  history: SnapGradeHistoryEntry[];
  ledger: SnapGradeLedgerEntry[];
  updatedAt: Date;
  createdAt: Date;
}

const historyEntrySchema = new Schema<SnapGradeHistoryEntry>(
  {
    evaluationId: { type: String, required: true },
    gradedAt: { type: Date, required: true },
    board: { type: String, default: "" },
    classLevel: { type: Number, default: 0 },
    subject: { type: String, default: "" },
    chapterNumber: { type: Number, default: 0 },
    chapterName: { type: String, default: "" },
    exercise: { type: String, default: "" },
    questionNumber: { type: String, default: "" },
    questionText: { type: String, default: "" },
    marksAwarded: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    creditsDeducted: { type: Number, required: true },
    overallFeedback: { type: String, default: "" },
    transcript: { type: String, default: "" },
    relevance: { type: String, default: "" },
    steps: { type: [stepAwardSchema], default: [] },
  },
  { _id: false },
);

const rechargeSchema = new Schema<SnapGradeRecharge>(
  {
    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String, index: true },
    razorpaySignature: { type: String },
    amountPaise: { type: Number, required: true, min: 1 },
    credits: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    createdAt: { type: Date, default: Date.now },
    paidAt: { type: Date },
    webhookEventId: { type: String },
  },
  { _id: false },
);

const ledgerSchema = new Schema<SnapGradeLedgerEntry>(
  {
    type: {
      type: String,
      enum: ["free_grant", "recharge", "spend"],
      required: true,
    },
    credits: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    note: { type: String },
    refId: { type: String },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const snapGradeWalletSchema = new Schema<ISnapGradeWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    creditBalance: { type: Number, default: 0, min: 0 },
    freeCreditsClaimed: { type: Boolean, default: false },
    freeCreditsGranted: { type: Number, default: 0, min: 0 },
    totalRecharged: { type: Number, default: 0, min: 0 },
    totalSpent: { type: Number, default: 0, min: 0 },
    recharges: { type: [rechargeSchema], default: [] },
    history: { type: [historyEntrySchema], default: [] },
    ledger: { type: [ledgerSchema], default: [] },
  },
  { timestamps: true },
);

snapGradeWalletSchema.index({ "recharges.razorpayOrderId": 1 });
snapGradeWalletSchema.index({ "recharges.razorpayPaymentId": 1 });

export const SnapGradeWallet =
  mongoose.models.SnapGradeWallet ||
  mongoose.model<ISnapGradeWallet>("SnapGradeWallet", snapGradeWalletSchema);
