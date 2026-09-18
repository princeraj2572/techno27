import { Schema, model, Document, Types, models } from "mongoose";

export type EventStatus =
  | "DRAFT"
  | "UPCOMING"
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "TEMPORARILY_CLOSED"
  | "EVENT_LIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "ARCHIVED";

export interface IEvent extends Document {
  name: string;
  description?: string;
  category?: string;
  venue?: string;
  image?: string;
  teamSize: number;
  rules?: string;
  schedule?: string;
  status: EventStatus;
  registrationStart?: Date;
  registrationEnd?: Date;
  maxParticipants?: number;
  internalFee: number;
  externalFee: number;
  accommodationFee: number;
  prizeMoney: number;
  prizeBreakdown?: { position: string; amount: number }[];
  feeHistory?: {
    internalFee: number;
    externalFee: number;
    changedBy: Types.ObjectId;
    changedAt: Date;
    reason?: string;
  }[];
}

const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    venue: { type: String },
    image: { type: String },
    teamSize: { type: Number, required: true },
    rules: { type: String },
    schedule: { type: String },
    status: {
      type: String,
      enum: [
        "DRAFT", "UPCOMING", "REGISTRATION_OPEN", "REGISTRATION_CLOSED",
        "TEMPORARILY_CLOSED", "EVENT_LIVE", "COMPLETED", "CANCELLED", "ARCHIVED",
      ],
      default: "DRAFT",
    },
    registrationStart: { type: Date },
    registrationEnd: { type: Date },
    maxParticipants: { type: Number },
    internalFee: { type: Number, default: 0 },
    externalFee: { type: Number, default: 0 },
    accommodationFee: { type: Number, default: 0 },
    prizeMoney: { type: Number, default: 0 },
    prizeBreakdown: [{ position: String, amount: Number }],
    feeHistory: [
      {
        internalFee: Number,
        externalFee: Number,
        changedBy: { type: Schema.Types.ObjectId, ref: "User" },
        changedAt: { type: Date, default: Date.now },
        reason: String,
      },
    ],
  },
  { timestamps: true }
);

const Event = models?.Event || model<IEvent>("Event", eventSchema);
export { Event };
