import { Schema, model, Document, Types, models } from "mongoose";

export interface ICheckIn extends Document {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  checkedInAt: Date;
  checkedInBy: Types.ObjectId;
  method: "QR" | "MANUAL";
}

const checkInSchema = new Schema<ICheckIn>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    checkedInAt: { type: Date, default: Date.now },
    checkedInBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    method: { type: String, enum: ["QR", "MANUAL"], default: "QR" },
  },
  { timestamps: true }
);

checkInSchema.index({ userId: 1, eventId: 1 });

const CheckIn = models?.CheckIn || model<ICheckIn>("CheckIn", checkInSchema);
export { CheckIn };
