import { Schema, model, models } from "mongoose";

const PlacementSchema = new Schema(
  {
    id: { type: String, required: true },
    docId: { type: String, required: true, index: true },
    page: { type: Number, required: true },
    type: { type: String, required: true },
    percentX: Number,
    percentY: Number,
    percentWidth: Number,
    percentHeight: Number,
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Placement =
  models.Placement || model("Placement", PlacementSchema);
