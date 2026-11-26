import { Schema, model, Document, models } from "mongoose";

import { HELP_TOPICS, type HelpTopic } from "@/features/helpdesk/help-topics";

export interface IHelpQuery extends Document {
  userEmail: string;
  userName: string;
  topic: HelpTopic;
  subject: string;
  message: string;
  status: "OPEN" | "RESOLVED";
  reply?: string;
  repliedBy?: string;
  repliedAt?: Date;
  createdAt: Date;
}

const helpQuerySchema = new Schema<IHelpQuery>(
  {
    userEmail: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    topic: { type: String, enum: HELP_TOPICS, required: true },
    subject: { type: String, required: true, maxlength: 120 },
    message: { type: String, required: true, maxlength: 2000 },
    status: { type: String, enum: ["OPEN", "RESOLVED"], default: "OPEN", index: true },
    reply: { type: String, maxlength: 2000 },
    repliedBy: { type: String },
    repliedAt: { type: Date },
  },
  { timestamps: true },
);

export const HelpQuery = models?.HelpQuery || model<IHelpQuery>("HelpQuery", helpQuerySchema);
