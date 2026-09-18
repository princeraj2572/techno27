import { Schema, model, Document, Types, models } from "mongoose";

export interface IAccommodation extends Document {
  arrivalTime: Date;
  departureTime: Date;
  additionalDetails?: string;
  userId: Types.ObjectId;
  universityName: string;
  gender: "Male" | "Female" | "Other";
}

const accommodationSchema = new Schema<IAccommodation>(
  {
    arrivalTime: { type: Date, required: true },
    departureTime: { type: Date, required: true },
    additionalDetails: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    universityName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  },
  { timestamps: true }
);

accommodationSchema.index({ userId: 1 });

const Accommodation =
  models?.Accommodation ||
  model<IAccommodation>("Accommodation", accommodationSchema);
export { Accommodation };
