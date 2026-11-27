"use server";
import { Types } from "mongoose";

import { unstable_noStore as noStore } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { Event, IEvent } from "@/features/events/event.model";
import { ITeam, Team } from "@/features/teams/team.model";
import { IUser, User } from "@/features/users/user.model";
import { Invitation } from "@/features/teams/invitation.model";
import { AuditLog } from "@/features/management/auditLog.model";
import { MAX_EXTERNAL_EVENTS, seedEvents } from "@/features/events/data/seed-events";
// Display order for admin lists and exports: the order of the website (and the seed).
const SEED_ORDER = seedEvents.map((e) => e.slug);
const bySeedOrder = (a?: string, b?: string) => { const i = SEED_ORDER.indexOf(a ?? ""), j = SEED_ORDER.indexOf(b ?? ""); return (i < 0 ? 1e9 : i) - (j < 0 ? 1e9 : j); };
import { getUser } from "@/features/users/user-actions";
import { CheckIn } from "@/features/checkin/checkIn.model";

export async function getAllEventsAction() {
  await connectToDatabase();
  const allEvents = await Event.find().lean<IEvent[]>();
  return JSON.parse(JSON.stringify(allEvents));
}

export async function getEventsWithRegistrationCountsAction() {
  await connectToDatabase();

  const events = await Event.find().lean<IEvent[]>();
  const allTeams = await Team.find().select("event members").lean<{ event: unknown; members: string[] }[]>();

  const teamsByEvent = new Map<string, string[][]>();
  for (const team of allTeams) {
    const key = String(team.event);
    if (!teamsByEvent.has(key)) teamsByEvent.set(key, []);
    teamsByEvent.get(key)!.push(team.members);
  }

  const allEmails = [...new Set(allTeams.flatMap((t) => t.members))];
  const users = await User.find({ email: { $in: allEmails } }).select("email role").lean<{ email: string; role: string }[]>();
  const roleByEmail = new Map(users.map((u) => [u.email, u.role]));

  const eventsWithCounts = events.map((event) => {
    const memberLists = teamsByEvent.get(String(event._id)) ?? [];
    const uniqueEmails = [...new Set(memberLists.flat())];
    const teamCount = memberLists.length;
    const participantCount = uniqueEmails.length;
    const internalCount = uniqueEmails.filter((e) => roleByEmail.get(e) === "INTERNAL_USER").length;
    const externalCount = uniqueEmails.filter((e) => roleByEmail.get(e) === "EXTERNAL_USER").length;
    return { ...event, teamCount, participantCount, internalCount, externalCount };
  });

  const totalParticipants = allEmails.length;
  const totalInternal = users.filter((u) => u.role === "INTERNAL_USER").length;
  const totalExternal = users.filter((u) => u.role === "EXTERNAL_USER").length;
  const totalTeams = allTeams.length;

  return JSON.parse(JSON.stringify({ eventsWithCounts, totalParticipants, totalInternal, totalExternal, totalTeams }));
}

// Unique people registered for one website event (its own DB event + any sub-events), split OPJU / external.
export async function getEventRegistrationCountsAction(slug: string) {
  noStore();
  const zero = { total: 0, internal: 0, external: 0 };
  try {
    await connectToDatabase();
    const ids = (await Event.find({ mainEvent: slug }).select("_id").lean<{ _id: unknown }[]>()).map((e) => e._id);
    if (!ids.length) return zero;
    const teams = await Team.find({ event: { $in: ids } }).select("members").lean<{ members: string[] }[]>();
    const emails = [...new Set(teams.flatMap((t) => t.members))];
    const users = await User.find({ email: { $in: emails } }).select("role").lean<{ role: string }[]>();
    return {
      total: emails.length,
      internal: users.filter((u) => u.role === "INTERNAL_USER").length,
      external: users.filter((u) => u.role === "EXTERNAL_USER").length,
    };
  } catch {
    return zero; // DB unreachable: show zeros rather than break the public page
  }
}

export async function getEventByIdAction(eventId: string) {
  await connectToDatabase();
  const event = await Event.findById(eventId).lean<IEvent>();
  if (!event) return null;
  const registeredCount = await Team.countDocuments({ event: eventId });
  return JSON.parse(JSON.stringify({ ...event, registeredCount }));
}

export async function getRegisteredEventsAction(userEmail?: string) {
  await connectToDatabase();
  const resolvedEmail = userEmail ?? (await getUser())?.email;
  if (!resolvedEmail) throw new Error("User not found");

  const user = await User.findOne({ email: resolvedEmail }).lean<IUser>();
  if (!user) return [];

  const eventDocs = [];
  for (const teamId of user.teams) {
    const team = await Team.findById(teamId).lean<ITeam>();
    if (team) {
      const event = await Event.findById(team.event).lean<IEvent>();
      if (event) eventDocs.push(event);
    }
  }
  return JSON.parse(JSON.stringify(eventDocs));
}

export async function getPendingInvitesAction() {
  await connectToDatabase();
  const user = await getUser();
  if (!user) throw new Error("User not found");

  const invitations = await Invitation.find({ inviteeEmail: user.email });
  const eventIds: string[] = [];
  for (const inv of invitations) {
    const team = await Team.findById(inv.teamId);
    if (team) eventIds.push(team.event.toString());
  }
  return JSON.parse(JSON.stringify({ invites: eventIds }));
}

export async function submitEventsAction(data: { eventIds: string[] }) {
  await connectToDatabase();
  const user = await getUser();
  if (!user) throw new Error("User not found");

  const existingUser = await User.findOne({ email: user.email });
  if (!existingUser) throw new Error("User not found");

  data = { eventIds: [...new Set(data.eventIds)].filter((id) => Types.ObjectId.isValid(id)) };
  if (!data.eventIds.length) throw new Error("Pick at least one event");
  // Already in a team for one of these events (as leader or member)?
  const dup = await Team.findOne({ event: { $in: data.eventIds }, $or: [{ leader: existingUser.email }, { members: existingUser.email }] }).select("event").lean<{ event: Types.ObjectId }>();
  if (dup) {
    const name = (await Event.findById(dup.event).select("name").lean<IEvent>())?.name ?? "this event";
    throw new Error(`You are already registered for "${name}".`);
  }

  const events = await Event.find({ _id: { $in: data.eventIds } });
  const eventsById = new Map(events.map((e) => [e._id.toString(), e]));

  for (const eventId of data.eventIds) {
    const event = eventsById.get(eventId);
    if (!event) throw new Error(`Event with ID ${eventId} not found`);

    if (event.status !== "REGISTRATION_OPEN") {
      throw new Error(`Registration for "${event.name}" is not open`);
    }
  }

  const eventsWithCap = events.filter((e) => e.maxParticipants);
  const teamCounts = await Promise.all(
    eventsWithCap.map((e) => Team.countDocuments({ event: e._id })),
  );
  eventsWithCap.forEach((event, i) => {
    const approxParticipants = teamCounts[i] * event.teamSize;
    if (approxParticipants >= event.maxParticipants!) {
      throw new Error(`"${event.name}" is full`);
    }
  });

  const userTeams = await Team.find({ _id: { $in: existingUser.teams } }).select("event");
  const userEvents = userTeams.map((team) => team.event.toString());

  const allEventsArray = [...userEvents, ...data.eventIds];
  const mainEventsCount = await getParticipatingEventsCountAction(allEventsArray);

  if (existingUser.role === "EXTERNAL_USER" && mainEventsCount.eventCount > MAX_EXTERNAL_EVENTS) {
    throw new Error(`External participants cannot register for more than ${MAX_EXTERNAL_EVENTS} events.`);
  }

  const newTeams = await Team.insertMany(
    data.eventIds.map((eventId) => {
      const event = eventsById.get(eventId)!;
      return {
        leader: existingUser.email,
        members: [existingUser.email],
        event: event._id,
        size: event.teamSize,
        invites: [],
      };
    }),
  );
  existingUser.teams.push(...newTeams.map((t) => t._id));

  await existingUser.save();
  return { success: true };
}

export async function getManagedEventsAction(eventIds: string[]) {
  await connectToDatabase();
  const managedEvents = await Event.find({ _id: { $in: eventIds } }).lean<IEvent[]>();
  return JSON.parse(JSON.stringify({ events: managedEvents }));
}

export async function getEventById(eventId: string): Promise<IEvent> {
  await connectToDatabase();
  const event = await Event.findById(eventId).lean<IEvent>();
  if (!event) throw new Error(`Event with ID ${eventId} not found`);
  return JSON.parse(JSON.stringify(event));
}

export async function getTeamsByEventId(
  eventId: string,
): Promise<(ITeam & { createdAt: Date })[]> {
  await connectToDatabase();
  const teams = await Team.find({ event: eventId })
    .select("event members leader createdAt")
    .lean();
  return JSON.parse(JSON.stringify(teams));
}

export async function getEventDetailsWithCounts() {
  await connectToDatabase();
  const events = await Event.find().lean<IEvent[]>();
  const users = await User.find().lean<IUser[]>();
  const userMap = new Map(users.map((u) => [u.email, u]));

  const eventDetailsWithCounts = [];
  for (const event of events) {
    const teams = await Team.find({ event: event._id }).lean<ITeam[]>();
    let insiderCount = 0;
    let outsiderCount = 0;
    for (const team of teams) {
      for (const memberEmail of team.members) {
        const u = userMap.get(memberEmail);
        if (u) {
          if (u.role === "EXTERNAL_USER") outsiderCount++;
          else insiderCount++;
        }
      }
    }
    eventDetailsWithCounts.push({
      eventName: event.name,
      slug: event.slug,
      teamCount: teams.length,
      userCount: insiderCount + outsiderCount,
      insiderCount,
      outsiderCount,
    });
  }
  return JSON.parse(JSON.stringify(eventDetailsWithCounts));
}

export async function getEventDetailsWithCountsPaginated(
  page: number = 1,
  limit: number = 10,
) {
  await connectToDatabase();
  const events = await Event.find().lean<IEvent[]>();
  const users = await User.find().lean<IUser[]>();
  const userMap = new Map(users.map((u) => [u.email, u]));

  const eventDetailsWithCounts = [];
  for (const event of events) {
    const teams = await Team.find({ event: event._id }).lean<ITeam[]>();
    let insiderCount = 0;
    let outsiderCount = 0;
    for (const team of teams) {
      for (const memberEmail of team.members) {
        const u = userMap.get(memberEmail);
        if (u) {
          if (u.role === "EXTERNAL_USER") outsiderCount++;
          else insiderCount++;
        }
      }
    }
    eventDetailsWithCounts.push({
      eventId: event._id.toString(),
      eventName: event.name,
      slug: event.slug,
      teamCount: teams.length,
      userCount: insiderCount + outsiderCount,
      insiderCount,
      outsiderCount,
      status: event.status,
      maxParticipants: event.maxParticipants,
    });
  }

  const sorted = eventDetailsWithCounts.sort((a, b) => bySeedOrder(a.slug, b.slug));

  const startIndex = (page - 1) * limit;
  const paginatedData = sorted.slice(startIndex, startIndex + limit);

  return JSON.parse(
    JSON.stringify({
      events: paginatedData,
      totalEvents: sorted.length,
      totalPages: Math.ceil(sorted.length / limit),
      currentPage: page,
    }),
  );
}

export async function generateEventCountExcel() {
  await connectToDatabase();
  const events = await Event.find().lean<IEvent[]>();
  const users = await User.find().lean<IUser[]>();
  const userMap = new Map(users.map((u) => [u.email, u]));

  const eventDetailsWithCounts = [];
  for (const event of events) {
    const teams = await Team.find({ event: event._id }).lean<ITeam[]>();
    let insiderCount = 0;
    let outsiderCount = 0;
    for (const team of teams) {
      for (const memberEmail of team.members) {
        const u = userMap.get(memberEmail);
        if (u) {
          if (u.role === "EXTERNAL_USER") outsiderCount++;
          else insiderCount++;
        }
      }
    }
    eventDetailsWithCounts.push({
      eventId: event._id.toString(),
      eventName: event.name,
      slug: event.slug,
      teamCount: teams.length,
      userCount: insiderCount + outsiderCount,
      insiderCount,
      outsiderCount,
    });
  }

  const sorted = eventDetailsWithCounts.sort((a, b) => bySeedOrder(a.slug, b.slug));

  const totalUserCount = sorted.reduce((acc, e) => acc + e.userCount, 0);
  const totalInsiderCount = sorted.reduce((acc, e) => acc + e.insiderCount, 0);
  const totalOutsiderCount = sorted.reduce((acc, e) => acc + e.outsiderCount, 0);

  const excelData = sorted.map((e) => ({
    EventName: e.eventName,
    UserCount: e.userCount,
    Insiders: e.insiderCount,
    Outsiders: e.outsiderCount,
  }));
  excelData.push({ EventName: "Total Count", UserCount: totalUserCount, Insiders: totalInsiderCount, Outsiders: totalOutsiderCount });

  return JSON.parse(JSON.stringify({ data: excelData }));
}

export async function getTeamsByEventIdPaginated(
  eventId: string,
  page: number = 1,
  limit: number = 10,
) {
  await connectToDatabase();
  const totalTeams = await Team.countDocuments({ event: eventId });
  const skip = (page - 1) * limit;
  const teams = await Team.find({ event: eventId })
    .select("event members leader createdAt")
    .skip(skip)
    .limit(limit)
    .lean();
  return JSON.parse(
    JSON.stringify({ teams, totalTeams, totalPages: Math.ceil(totalTeams / limit), currentPage: page }),
  );
}

export async function generateEventParticipantsExcel(eventId: string) {
  await connectToDatabase();
  const event = await Event.findById(eventId).lean<IEvent>();
  if (!event) throw new Error(`Event with ID ${eventId} not found`);

  const teams = await Team.find({ event: eventId })
    .select("event members leader createdAt")
    .lean<(ITeam & { createdAt: Date })[]>();

  const allEmails = teams.flatMap((t) => t.members);
  const uniqueEmails = [...new Set(allEmails)];
  const normalizedEmails = uniqueEmails.map((e) => e.toLowerCase().trim());
  const users = await User.find({ email: { $in: normalizedEmails } }).lean<(IUser & { createdAt: Date })[]>();
  const userMap = new Map(users.map((u) => [u.email, u]));

  const excelData = teams.flatMap((team) => {
    const leader = userMap.get(team.leader);
    return team.members.map((memberEmail: string) => {
      const member = userMap.get(memberEmail);
      return {
        Name: member?.fullName || "",
        Email: member?.email || "",
        Branch: member?.branch || "",
        EnrollmentNumber: member?.enrollmentNumber || "",
        isOutsider: member?.role === "EXTERNAL_USER" ? "Yes" : "No",
        Mobile: member?.mobileNumber || "",
        Address: member?.address || "",
        TeamLeaderName: leader?.fullName || "",
        TeamLeaderEmail: leader?.email || "",
        UserCreatedAt: member?.createdAt || "",
        TeamCreatedAt: team.createdAt || "",
      };
    });
  });

  const totalUsers = users.length;
  const outsiders = users.filter((u) => u.role === "EXTERNAL_USER").length;

  return JSON.parse(
    JSON.stringify({ data: excelData, eventName: event.name, stats: { totalUsers, outsiders, insiders: totalUsers - outsiders } }),
  );
}

/** How many different fest events these DB events belong to; and whether `newEventId`'s fest event is already among them. */
export async function getParticipatingEventsCountAction(eventIds: string[], newEventId?: string) {
  await connectToDatabase();
  const ids = [...new Set([...eventIds, ...(newEventId ? [newEventId] : [])])].filter((id) => Types.ObjectId.isValid(id));
  const rows = await Event.find({ _id: { $in: ids } }).select("mainEvent").lean<{ _id: Types.ObjectId; mainEvent?: string }[]>();
  // Events without a mainEvent (created by hand) count as their own fest event.
  const fest = new Map(rows.map((r) => [String(r._id), r.mainEvent || String(r._id)]));
  const main = new Set(eventIds.map((id) => fest.get(id)).filter(Boolean));
  return { eventCount: main.size, isNewEventIncluded: newEventId ? main.has(fest.get(newEventId)) : false };
}

// ===================== DEV_ADMIN ONLY =====================

export interface EventStats {
  totalUsers: number;
  internalCount: number;
  externalCount: number;
  eventStats: Array<{
    eventId: string;
    name: string;
    registered: number;
    limit: number | null;
    status: string;
  }>;
}

export async function getEventStatsAction(): Promise<EventStats> {
  await connectToDatabase();
  const totalUsers = await User.countDocuments({ role: { $in: ["INTERNAL_USER", "EXTERNAL_USER"] } });
  const internalCount = await User.countDocuments({ role: "INTERNAL_USER" });
  const externalCount = await User.countDocuments({ role: "EXTERNAL_USER" });

  const events = await Event.find().lean<IEvent[]>();
  const eventStats = await Promise.all(
    events.map(async (event) => {
      const registered = await Team.countDocuments({ event: event._id });
      return {
        eventId: event._id.toString(),
        name: event.name,
        registered,
        limit: event.maxParticipants ?? null,
        status: event.status,
      };
    }),
  );

  return JSON.parse(JSON.stringify({ totalUsers, internalCount, externalCount, eventStats }));
}

export async function createEventAction(
  data: Partial<IEvent>,
  performedById: string,
) {
  await connectToDatabase();
  const performer = await User.findById(performedById);
  if (!performer || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(performer.role)) {
    throw new Error("Unauthorized");
  }
  const newEvent = new Event({ ...data, status: data.status ?? "DRAFT" });
  await newEvent.save();
  return JSON.parse(JSON.stringify(newEvent));
}

export async function updateEventAction(
  eventId: string,
  data: Partial<IEvent>,
  performedById: string,
) {
  await connectToDatabase();
  const performer = await User.findById(performedById);
  if (!performer || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(performer.role)) {
    throw new Error("Unauthorized");
  }
  const event = await Event.findByIdAndUpdate(eventId, data, { new: true });
  if (!event) throw new Error("Event not found");
  return JSON.parse(JSON.stringify(event));
}

export async function updateEventStatusAction(
  eventId: string,
  status: IEvent["status"],
  performedById: string,
) {
  await connectToDatabase();
  const performer = await User.findById(performedById);
  if (!performer || performer.role !== "DEV_ADMIN") {
    throw new Error("Only DEV_ADMIN can change event registration status");
  }
  const event = await Event.findByIdAndUpdate(eventId, { status }, { new: true });
  if (!event) throw new Error("Event not found");

  await new AuditLog({
    action: "EVENT_STATUS_CHANGE",
    targetId: event._id,
    targetType: "Event",
    performedBy: performer._id,
    metadata: { status },
  }).save();

  return JSON.parse(JSON.stringify(event));
}

export async function updateEventFeesAction(
  eventId: string,
  fees: { internalFee?: number; externalFee?: number; prizeMoney?: number; maxParticipants?: number; reason?: string },
  performedById: string,
) {
  await connectToDatabase();
  const performer = await User.findById(performedById);
  if (!performer || performer.role !== "DEV_ADMIN") {
    throw new Error("Only DEV_ADMIN can change event fees");
  }
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  const historyEntry = {
    internalFee: fees.internalFee ?? event.internalFee,
    externalFee: fees.externalFee ?? event.externalFee,
    changedBy: performer._id,
    changedAt: new Date(),
    reason: fees.reason,
  };

  await Event.findByIdAndUpdate(eventId, {
    ...(fees.internalFee !== undefined && { internalFee: fees.internalFee }),
    ...(fees.externalFee !== undefined && { externalFee: fees.externalFee }),
    ...(fees.prizeMoney !== undefined && { prizeMoney: fees.prizeMoney }),
    ...(fees.maxParticipants !== undefined && { maxParticipants: fees.maxParticipants }),
    $push: { feeHistory: historyEntry },
  });

  return { success: true };
}

// ===================== PARTICIPANT: cart + unregister =====================

/** The signed-in participant's registrations (one per team they are in) and their event cap. */
export async function getMyRegistrationsAction() {
  noStore();
  const me = await getUser();
  if (!me) return { role: "", maxFestEvents: null as number | null, registrations: [] as { eventId: string; teamId: string; isLeader: boolean; members: number }[] };
  await connectToDatabase();
  const teams = await Team.find({ $or: [{ leader: me.email }, { members: me.email }] })
    .select("event leader members")
    .lean<{ _id: Types.ObjectId; event: Types.ObjectId; leader: string; members: string[] }[]>();
  return {
    role: me.role,
    maxFestEvents: me.role === "EXTERNAL_USER" ? MAX_EXTERNAL_EVENTS : null,
    registrations: teams.map((t) => ({ eventId: String(t.event), teamId: String(t._id), isLeader: t.leader === me.email, members: t.members.length })),
  };
}

/** Leave an event. A leader's team is removed (its members are unregistered too); a member just leaves.
 *  Not allowed once the event is live/over or after the participant has been checked in. */
export async function unregisterFromEventAction(eventId: string) {
  const me = await getUser();
  if (!me) return { ok: false, error: "Please sign in again." };
  if (!Types.ObjectId.isValid(eventId)) return { ok: false, error: "Event not found." };
  await connectToDatabase();

  const event = await Event.findById(eventId).select("name status").lean<IEvent>();
  if (!event) return { ok: false, error: "Event not found." };
  if (["EVENT_LIVE", "COMPLETED"].includes(event.status)) return { ok: false, error: `"${event.name}" has already started; you can't unregister now.` };

  const team = await Team.findOne({ event: eventId, $or: [{ leader: me.email }, { members: me.email }] });
  if (!team) return { ok: false, error: "You are not registered for this event." };
  if (await CheckIn.exists({ eventId, userId: me._id })) return { ok: false, error: "You are already checked in for this event." };

  if (team.leader === me.email) {
    await User.updateMany({ email: { $in: team.members } }, { $pull: { teams: team._id } });
    await Invitation.deleteMany({ teamId: team._id });
    await Team.deleteOne({ _id: team._id });
  } else {
    await Team.updateOne({ _id: team._id }, { $pull: { members: me.email } });
    await User.updateOne({ email: me.email }, { $pull: { teams: team._id } });
  }
  return { ok: true };
}
