import { Schema, model, Document, Types, models } from "mongoose";

export interface IManagementAssignment extends Document {
  userId: Types.ObjectId;
  eventIds: Types.ObjectId[];
  permissions: string[];
  assignedBy: Types.ObjectId;
  isActive: boolean;
  expiresAt?: Date;
}

const managementAssignmentSchema = new Schema<IManagementAssignment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventIds: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    permissions: [{ type: String }],
    assignedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: false },
  },
  { timestamps: true }
);

managementAssignmentSchema.index({ userId: 1 });
managementAssignmentSchema.index({ eventIds: 1 });

const ManagementAssignment =
  models?.ManagementAssignment ||
  model<IManagementAssignment>("ManagementAssignment", managementAssignmentSchema);

export { ManagementAssignment };
