export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/features/users/user-actions";
import { getEventManagerPermissions } from "@/features/management/management-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/features/events/event.model";
import { Team } from "@/features/teams/team.model";
import { User } from "@/features/users/user.model";
import { Transaction } from "@/features/payments/transaction.model";
import { ChevronLeft, Users } from "lucide-react";
import Link from "next/link";
import ParticipantsClient from "./ParticipantsClient";

export interface ParticipantRow {
  email: string;
  fullName: string;
  role: string;
  enrollmentNumber: string | null;
  participantId: string | null;
  collegeName: string | null;
  mobileNumber: string | null;
  department: string | null;
  program: string | null;
  branch: string | null;
  year: string | null;
  paymentCleared: boolean | null;
  paymentPending: boolean | null;
  txCount: number | null;
}

async function getData(eventId: string) {
  await connectToDatabase();

  const event = await Event.findById(eventId).select("name status teamSize maxParticipants").lean();
  if (!event) return null;

  const teams = await Team.find({ event: eventId }).sort({ createdAt: -1 }).lean();

  const allEmails = [
    ...new Set(
      teams.flatMap((t: { leader: string; members: string[] }) => [t.leader, ...(t.members ?? [])])
    ),
  ];

  const users = await User.find({ email: { $in: allEmails } })
    .select("email fullName role enrollmentNumber participantId collegeName mobileNumber department program branch year")
    .lean();
  const userMap = Object.fromEntries(
    JSON.parse(JSON.stringify(users)).map((u: { email: string }) => [u.email, u])
  );

  // Payment status for external users
  const externalEmails = (users as { email: string; role: string }[])
    .filter((u) => u.role === "EXTERNAL_USER")
    .map((u) => u.email);

  const transactions = await Transaction.find({ userEmail: { $in: externalEmails } })
    .select("userEmail clearanceApproval acknowledgementByAdmin")
    .lean();

  const paymentMap: Record<string, { cleared: boolean; pending: boolean; txCount: number }> = {};
  for (const email of externalEmails) {
    const emailTxs = (transactions as { userEmail: string; clearanceApproval: boolean; acknowledgementByAdmin: boolean }[]).filter(
      (t) => t.userEmail === email
    );
    paymentMap[email] = {
      cleared:  emailTxs.some((t) => t.clearanceApproval),
      pending:  !emailTxs.some((t) => t.clearanceApproval) && emailTxs.length > 0,
      txCount:  emailTxs.length,
    };
  }

  // Build flat participant list (deduplicated)
  const seen = new Set<string>();
  const participants: ParticipantRow[] = [];
  for (const team of teams) {
    const emails = [
      (team as { leader: string }).leader,
      ...((team as { members: string[] }).members ?? []),
    ];
    for (const email of emails) {
      if (seen.has(email)) continue;
      seen.add(email);
      const u = (userMap[email] ?? { email }) as {
        email: string; fullName?: string; role?: string;
        enrollmentNumber?: string; participantId?: string;
        collegeName?: string; mobileNumber?: string;
        department?: string; program?: string; branch?: string; year?: string;
      };
      const isExternal = u.role === "EXTERNAL_USER";
      participants.push({
        email,
        fullName:       u.fullName       ?? email,
        role:           u.role           ?? "UNKNOWN",
        enrollmentNumber: u.enrollmentNumber ?? null,
        participantId:  u.participantId  ?? null,
        collegeName:    u.collegeName    ?? null,
        mobileNumber:   u.mobileNumber   ?? null,
        department:     u.department     ?? null,
        program:        u.program        ?? null,
        branch:         u.branch         ?? null,
        year:           u.year           ?? null,
        paymentCleared: isExternal ? (paymentMap[email]?.cleared ?? false) : null,
        paymentPending: isExternal ? (paymentMap[email]?.pending ?? false) : null,
        txCount:        isExternal ? (paymentMap[email]?.txCount ?? 0)     : null,
      });
    }
  }

  const internalCount = participants.filter((p) => p.role === "INTERNAL_USER").length;
  const externalCount = participants.filter((p) => p.role === "EXTERNAL_USER").length;
  const externalCleared = participants.filter((p) => p.role === "EXTERNAL_USER" && p.paymentCleared).length;

  return {
    event: JSON.parse(JSON.stringify(event)) as {
      _id: string; name: string; status: string; teamSize?: number; maxParticipants?: number;
    },
    participants,
    internalCount,
    externalCount,
    externalCleared,
  };
}

export default async function EventManagerParticipantsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN", "EVENT_MANAGER"].includes(user.role))
    redirect("/dashboard");

  const { eventId } = await params;

  if (user.role === "EVENT_MANAGER") {
    const { hasAccess } = await getEventManagerPermissions(String(user._id), eventId).catch(
      () => ({ hasAccess: false })
    );
    if (!hasAccess) redirect("/event-manager");
  }

  const data = await getData(eventId).catch(() => null);
  if (!data) redirect("/event-manager");

  const { event, participants, internalCount, externalCount, externalCleared } = data;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div
          className="flex items-start justify-between animate-slide-up"
          style={{ animationDelay: "0s" }}
        >
          <div>
            <Link
              href={`/event-manager/${eventId}`}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> {event.name}
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Participants</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {participants.length} total
              {event.maxParticipants ? ` · Limit: ${event.maxParticipants}` : ""}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-indigo-600" />
          </div>
        </div>

        {/* Stat cards */}
        <div
          className="grid grid-cols-3 gap-3 animate-slide-up"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="bg-indigo-600 rounded-2xl px-4 py-4">
            <p className="text-xs font-medium text-indigo-200 mb-1">Internal (OPJU)</p>
            <p className="text-3xl font-bold text-white tabular-nums leading-none">{internalCount}</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-4">
            <p className="text-xs font-medium text-amber-600 mb-1">External</p>
            <p className="text-3xl font-bold text-amber-900 tabular-nums leading-none">{externalCount}</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${externalCleared > 0 ? "bg-emerald-500" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${externalCleared > 0 ? "text-emerald-100" : "text-slate-400"}`}>
              Payments cleared
            </p>
            <p className={`text-3xl font-bold tabular-nums leading-none ${externalCleared > 0 ? "text-white" : "text-slate-700"}`}>
              {externalCleared}
            </p>
          </div>
        </div>

        {/* Client component handles filter tabs + Excel download + list */}
        <ParticipantsClient
          participants={participants}
          eventName={event.name}
          internalCount={internalCount}
          externalCount={externalCount}
        />

      </div>
    </div>
  );
}
