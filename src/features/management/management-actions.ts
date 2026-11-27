"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { ManagementAssignment } from "@/features/management/managementAssignment.model";
import { User } from "@/features/users/user.model";
import { Event, IEvent } from "@/features/events/event.model";
import { AuditLog } from "@/features/management/auditLog.model";
import { getUser } from "@/features/users/user-actions";
import { getEvent as getFestEvent } from "@/features/events/data/all-events";
import { randomBytes } from "crypto";

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
// ─── EVENT_MANAGER accounts: one per fest event (main event) ─────────────
// A manager gets every DB event of their fest event (e.g. all 7 Kalakriti competitions), nothing else.
// Who is acting is read from the session, never from the client.

async function requireDevAdmin() {
  const me = await getUser();
  if (!me || me.role !== "DEV_ADMIN") throw new Error("Unauthorized — DEV_ADMIN only");
  return me;
}

type EmCreds = { userId: string; fullName: string; email: string; password: string; alreadyExists: boolean };

/** Ensure the fest event that `eventId` belongs to has a manager assigned to all of its events. */
async function ensureFestManager(eventId: string, performerId: unknown): Promise<EmCreds & { fest: string; events: number }> {
  const event = await Event.findById(eventId).select("name mainEvent").lean<IEvent>();
  if (!event) throw new Error("Event not found");
  const fest = event.mainEvent || String(event._id);
  const siblings = event.mainEvent
    ? (await Event.find({ mainEvent: event.mainEvent }).select("_id").lean<{ _id: unknown }[]>()).map((e) => e._id)
    : [event._id];
  const festName = (event.mainEvent && getFestEvent(event.mainEvent)?.name) || (event.name as string);

  // Reuse an existing manager of any of these events and widen their access to the whole fest event.
  const existing = await ManagementAssignment.findOne({ eventIds: { $in: siblings }, isActive: true })
    .populate("userId", "fullName email password role")
    .lean();
  const u = existing?.userId as { _id: unknown; fullName: string; email: string; password: string; role: string } | undefined;
  if (existing && u?.role === "EVENT_MANAGER") {
    await ManagementAssignment.updateOne({ _id: existing._id }, { $addToSet: { eventIds: { $each: siblings } } });
    return { userId: String(u._id), fullName: u.fullName, email: u.email, password: u.password, alreadyExists: true, fest, events: siblings.length };
  }

  const base = fest.replace(/[^a-z0-9-]/gi, "").toLowerCase().slice(0, 40) || "event";
  let email = `em-${base}@techno27.internal`;
  if (await User.exists({ email })) email = `em-${base}-${randomBytes(2).toString("hex")}@techno27.internal`;
  // shortcut: stored in plain text like every account here; move to hashing with the rest of auth
  const password = randomBytes(6).toString("base64url");

  const emUser = await User.create({
    fullName: `${festName} Manager`,
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
    eventIds: siblings,
    permissions: ["participants.read", "checkin.manage", "reports.read"],
    assignedBy: performerId,
    isActive: true,
  });
  return { userId: String(emUser._id), fullName: emUser.fullName, email, password, alreadyExists: false, fest, events: siblings.length };
}

export async function generateEventManagerAction(eventId: string): Promise<EmCreds> {
  await connectToDatabase();
  const me = await requireDevAdmin();
  const r = await ensureFestManager(eventId, me._id);
  return JSON.parse(JSON.stringify({ userId: r.userId, fullName: r.fullName, email: r.email, password: r.password, alreadyExists: r.alreadyExists }));
}

// ─── Get the EVENT_MANAGER credentials for an event (DEV only) ────────────
export async function getEventManagerForEvent(
  eventId: string,
): Promise<{ userId: string; fullName: string; email: string; password: string } | null> {
  await connectToDatabase();
  await requireDevAdmin();
  const assignment = await ManagementAssignment.findOne({ eventIds: eventId, isActive: true })
    .populate("userId", "fullName email password role")
    .lean();
  if (!assignment) return null;
  const u = assignment.userId as { _id: unknown; fullName: string; email: string; password: string; role: string };
  if (!u || u.role !== "EVENT_MANAGER") return null;
  return JSON.parse(JSON.stringify({ userId: String(u._id), fullName: u.fullName, email: u.email, password: u.password }));
}

// ─── One EVENT_MANAGER per fest event, covering all of its competitions ───
export async function generateAllEventManagersAction() {
  await connectToDatabase();
  const me = await requireDevAdmin();
  const events = await Event.find().select("_id name mainEvent").lean<IEvent[]>();
  const firstOfFest = new Map<string, string>();
  for (const e of events) {
    const key = e.mainEvent || String(e._id);
    if (!firstOfFest.has(key)) firstOfFest.set(key, String(e._id));
  }
  const results: { eventId: string; name: string; status: string; email?: string; password?: string; events: number }[] = [];
  for (const eventId of firstOfFest.values()) {
    const r = await ensureFestManager(eventId, me._id);
    results.push({ eventId, name: r.fullName.replace(/ Manager$/, ""), status: r.alreadyExists ? "exists" : "created", email: r.email, password: r.password, events: r.events });
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
