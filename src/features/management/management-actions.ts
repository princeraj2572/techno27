"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { ManagementAssignment } from "@/features/management/managementAssignment.model";
import { User } from "@/features/users/user.model";
import { Event, IEvent } from "@/features/events/event.model";
import { AuditLog } from "@/features/management/auditLog.model";

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

// ─── Auto-generate an EVENT_MANAGER account for an event ─────────────────
export async function generateEventManagerAction(
  eventId: string,
  performedById: string,
): Promise<{ userId: string; fullName: string; email: string; password: string; alreadyExists: boolean }> {
  await connectToDatabase();

  const performer = await User.findById(performedById);
  if (!performer || performer.role !== "DEV_ADMIN") throw new Error("Unauthorized — DEV_ADMIN only");

  const event = await Event.findById(eventId).select("name").lean<IEvent>();
  if (!event) throw new Error("Event not found");

  // Return existing EM if one is already assigned
  const existingAssign = await ManagementAssignment.findOne({ eventIds: eventId, isActive: true })
    .populate("userId", "fullName email password role")
    .lean();

  if (existingAssign) {
    const u = existingAssign.userId as { _id: unknown; fullName: string; email: string; password: string; role: string };
    if (u && u.role === "EVENT_MANAGER") {
      return JSON.parse(JSON.stringify({ userId: String(u._id), fullName: u.fullName, email: u.email, password: u.password, alreadyExists: true }));
    }
  }

  const slug = (event.name as string).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12);
  let email = `em-${slug}@techno27.internal`;
  if (await User.findOne({ email })) email = `em-${slug}-${Date.now()}@techno27.internal`;

  const password =
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    Math.random().toString(36).slice(2, 6).toUpperCase();

  const emUser = await User.create({
    fullName: `${event.name} Manager`,
    email,
    password,
    role: "EVENT_MANAGER",
    mobileNumber: "0000000000",
    gender: "Other",
    emergencyContactName: "Admin",
    emergencyContactNumber: "0000000000",
  });

  await ManagementAssignment.create({
    userId: emUser._id,
    eventIds: [eventId],
    permissions: ["participants.read", "checkin.manage", "reports.read"],
    assignedBy: performer._id,
    isActive: true,
  });

  return JSON.parse(JSON.stringify({ userId: String(emUser._id), fullName: `${event.name} Manager`, email, password, alreadyExists: false }));
}

// ─── Get the EVENT_MANAGER credentials for an event (DEV only) ────────────
export async function getEventManagerForEvent(
  eventId: string,
): Promise<{ userId: string; fullName: string; email: string; password: string } | null> {
  await connectToDatabase();
  const assignment = await ManagementAssignment.findOne({ eventIds: eventId, isActive: true })
    .populate("userId", "fullName email password role")
    .lean();
  if (!assignment) return null;
  const u = assignment.userId as { _id: unknown; fullName: string; email: string; password: string; role: string };
  if (!u || u.role !== "EVENT_MANAGER") return null;
  return JSON.parse(JSON.stringify({ userId: String(u._id), fullName: u.fullName, email: u.email, password: u.password }));
}

// ─── Bulk-generate EVENT_MANAGER for every event that lacks one ────────────
export async function generateAllEventManagersAction(performedById: string) {
  await connectToDatabase();
  const performer = await User.findById(performedById);
  if (!performer || performer.role !== "DEV_ADMIN") throw new Error("Unauthorized");

  const events = await Event.find().select("name _id").lean<IEvent[]>();
  const results: { eventId: string; name: string; status: string; email?: string; password?: string }[] = [];

  for (const event of events) {
    const eventId = String(event._id);
    const existing = await ManagementAssignment.findOne({ eventIds: eventId, isActive: true })
      .populate("userId", "role email password")
      .lean();
    if (existing) {
      const u = existing.userId as { role: string; email: string; password: string };
      if (u?.role === "EVENT_MANAGER") {
        results.push({ eventId, name: event.name as string, status: "exists", email: u.email, password: u.password });
        continue;
      }
    }
    const gen = await generateEventManagerAction(eventId, performedById);
    results.push({ eventId, name: event.name as string, status: "created", email: gen.email, password: gen.password });
  }

  return JSON.parse(JSON.stringify(results));
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
