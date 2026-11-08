import mongoose, { Schema, type Types } from "mongoose";

export interface IPythonWorkspaceEntry {
  path: string;
  kind: "file" | "folder";
  content: string;
}

export interface IPythonWorkspace {
  userId: Types.ObjectId;
  email: string;
  activePath: string;
  entries: IPythonWorkspaceEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const entrySchema = new Schema<IPythonWorkspaceEntry>(
  {
    path: { type: String, required: true },
    kind: { type: String, enum: ["file", "folder"], required: true },
    content: { type: String, default: "" },
  },
  { _id: false },
);

const schema = new Schema<IPythonWorkspace>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    activePath: { type: String, default: "" },
    entries: { type: [entrySchema], default: [] },
  },
  { timestamps: true },
);

schema.index({ email: 1 });

export const PythonWorkspace =
  mongoose.models.PythonWorkspace || mongoose.model<IPythonWorkspace>("PythonWorkspace", schema);
