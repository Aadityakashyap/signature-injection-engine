import { Schema, model, models } from "mongoose";

const DocumentSchema = new Schema({
  docId: { type: String, required: true, unique: true },
  fileName: String,
  filePath: String,
  pageCount: Number,
  createdAt: { type: Date, default: Date.now },
  originalHash: String,
});

export const DocumentModel =
  models.Document || model("Document", DocumentSchema);
