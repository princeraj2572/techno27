import { Schema, model, Document, Types, models } from "mongoose";

export interface ITeam extends Document {
  leader: string;
  members: string[];
  event: Types.ObjectId;
  size: number;
  invites: Types.ObjectId[];
}

const teamSchema = new Schema<ITeam>(
  {
    leader: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    members: [
      {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    ],
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    size: { type: Number, required: true },
    invites: [{ type: Types.ObjectId, ref: "Invitation" }],
  },
  { timestamps: true }
);

teamSchema.index({ leader: 1 });
teamSchema.index({ event: 1 });

const Team = models?.Team || model<ITeam>("Team", teamSchema);
export { Team };
