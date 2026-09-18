"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { ManagementAssignment } from "@/models/managementAssignment.model";
import { User } from "@/models/user.model";
import { AuditLog } from "@/models/auditLog.model";

export async function assignEventManager(
  targetUserId: string,
  eventIds: string[],
  permissions: string[],
  performedById: string,
  expiresAt?: Date,
) {
  await connectToDatabase();
  const performer = await User.findById(performedById);
  if (!performer || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(performer.role)) {
    throw new Error("Unauthorized");
  }

  const target = await User.findById(targetUserId);
  if (!target || target.role !== "EVENT_MANAGER") {
    throw new Error("Target user must have EVENT_MANAGER role");
  }

  const existing = await ManagementAssignment.findOne({ userId: targetUserId, isActive: true });
  if (existing) {
    existing.eventIds = eventIds as never;
    existing.permissions = permissions;
    if (expiresAt) existing.expiresAt = expiresAt;
    await existing.save();
    return JSON.parse(JSON.stringify(existing));
  }

  const assignment = new ManagementAssignment({
    userId: targetUserId,
    eventIds,
    permissions,
    assignedBy: performedById,
    isActive: true,
    expiresAt,
  });
  await assignment.save();

  await new AuditLog({
    action: "EVENT_MANAGER_ASSIGNED",
    targetId: target._id,
    targetType: "User",
    performedBy: performer._id,
    metadata: { eventIds, permissions },
  }).save();

  return JSON.parse(JSON.stringify(assignment));
}

export async function revokeEventManager(assignmentId: string, performedById: string) {
  await connectToDatabase();
  const performer = await User.findById(performedById);
  if (!performer || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(performer.role)) {
    throw new Error("Unauthorized");
  }

  const assignment = await ManagementAssignment.findByIdAndUpdate(
    assignmentId,
    { isActive: false },
    { new: true },
  );
  if (!assignment) throw new Error("Assignment not found");

  await new AuditLog({
    action: "EVENT_MANAGER_REVOKED",
    targetId: assignment.userId,
    targetType: "User",
    performedBy: performer._id,
  }).save();

  return { success: true };
}

export async function getManagementAssignmentsByEvent(eventId: string) {
  await connectToDatabase();
  const assignments = await ManagementAssignment.find({
    eventIds: eventId,
    isActive: true,
  }).populate("userId", "fullName email mobileNumber role");
  return JSON.parse(JSON.stringify(assignments));
}

export async function getAssignmentForUser(userId: string) {
  await connectToDatabase();
  const assignment = await ManagementAssignment.findOne({ userId, isActive: true })
    .populate("eventIds", "name status category")
    .lean();
  return assignment ? JSON.parse(JSON.stringify(assignment)) : null;
}

export async function getEventManagerPermissions(userId: string, eventId: string) {
  await connectToDatabase();
  const assignment = await ManagementAssignment.findOne({
    userId,
    eventIds: eventId,
    isActive: true,
  });
  if (!assignment) return { hasAccess: false, permissions: [] };
  return { hasAccess: true, permissions: assignment.permissions };
}
