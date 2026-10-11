import { Schema, model, Document, Types, models } from "mongoose";

export interface IAuditLog extends Document {
  action: string;
  targetId?: Types.ObjectId;
  targetType?: string;
  performedBy: Types.ObjectId;
  reason?: string;
  timestamp: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId },
    targetType: { type: String },
    performedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: false }
);

auditLogSchema.index({ performedBy: 1, timestamp: -1 });

const AuditLog =
  models?.AuditLog || model<IAuditLog>("AuditLog", auditLogSchema);
export { AuditLog };
