import { Schema, model, Document, Types, models } from "mongoose";

export interface IInvitation extends Document {
  teamId: Types.ObjectId;
  inviterEmail: string;
  inviteeEmail: string;
  status: "ACCEPTED" | "PENDING" | "REJECTED" | "CANCELED";
}

const invitationSchema = new Schema<IInvitation>(
  {
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    inviterEmail: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    inviteeEmail: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    status: {
      type: String,
      enum: ["ACCEPTED", "PENDING", "REJECTED", "CANCELED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

invitationSchema.index({ inviteeEmail: 1, teamId: 1 });

const Invitation =
  models?.Invitation || model<IInvitation>("Invitation", invitationSchema);
export { Invitation };
