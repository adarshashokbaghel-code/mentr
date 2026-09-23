import mongoose, { Document, Schema, Types } from "mongoose";

/**
 * Premium mentor unlock of a parent's contact details.
 * Cap enforced in service: 3 reveals / mentor / calendar day (IST).
 */
export interface IParentContactReveal extends Document {
  _id: Types.ObjectId;
  mentor: Types.ObjectId;
  parent: Types.ObjectId;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  parentCity?: string;
  parentArea?: string;
  hasPosted: boolean;
  openPostsAtReveal: number;
  revealedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const parentContactRevealSchema = new Schema<IParentContactReveal>(
  {
    mentor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    parentName: { type: String, required: true, trim: true },
    parentPhone: { type: String, required: true, trim: true },
    parentEmail: { type: String, trim: true },
    parentCity: { type: String, trim: true },
    parentArea: { type: String, trim: true },
    hasPosted: { type: Boolean, default: false },
    openPostsAtReveal: { type: Number, default: 0, min: 0 },
    revealedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

parentContactRevealSchema.index(
  { mentor: 1, parent: 1 },
  { unique: true },
);
parentContactRevealSchema.index({ mentor: 1, revealedAt: -1 });

export const ParentContactReveal =
  mongoose.models.ParentContactReveal ||
  mongoose.model<IParentContactReveal>(
    "ParentContactReveal",
    parentContactRevealSchema,
  );
