import mongoose, { Schema } from "mongoose";

export interface IPythonShareEntry {
  path: string;
  kind: "file" | "folder";
  content: string;
}

export interface IPythonShare {
  shareId: string;
  title: string;
  stdin: string;
  activePath: string;
  entries: IPythonShareEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const entrySchema = new Schema<IPythonShareEntry>(
  {
    path: { type: String, required: true },
    kind: { type: String, enum: ["file", "folder"], required: true },
    content: { type: String, default: "" },
  },
  { _id: false },
);

const schema = new Schema<IPythonShare>(
  {
    shareId: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: "" },
    stdin: { type: String, default: "" },
    activePath: { type: String, default: "main.py" },
    entries: { type: [entrySchema], default: [] },
  },
  { timestamps: true },
);

export const PythonShare = mongoose.models.PythonShare || mongoose.model<IPythonShare>("PythonShare", schema);
