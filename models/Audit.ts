import { Schema, model, models } from "mongoose";

const AuditSchema = new Schema({
  docId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  hashBefore: String,
  hashAfter: String,
  payloadSummary: Schema.Types.Mixed,
});

export const Audit = models.Audit || model("Audit", AuditSchema);
