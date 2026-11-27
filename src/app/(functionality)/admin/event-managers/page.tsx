export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/features/users/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/features/users/user.model";
import { ManagementAssignment } from "@/features/management/managementAssignment.model";
import { Event } from "@/features/events/event.model";
import { ShieldCheck, Plus } from "lucide-react";
import { display } from "@/components/indie";
import { Pager } from "@/components/indie/pager";
import { getEvent as getFestEvent } from "@/features/events/data/all-events";
import Link from "next/link";
import { CARD_UI, TicketTitle } from "@/components/indie/gold-poster";

async function getEventManagersWithAssignments(page: number, limit: number) {
  await connectToDatabase();
  const [managers, total] = await Promise.all([
    User.find({ role: "EVENT_MANAGER" }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    User.countDocuments({ role: "EVENT_MANAGER" }),
  ]);
  const managerIds = managers.map((m: { _id: unknown }) => m._id);
  const assignments = await ManagementAssignment.find({ userId: { $in: managerIds }, isActive: true }).lean();
  const eventIds = [...new Set(assignments.flatMap((a: { eventIds: unknown[] }) => a.eventIds.map(String)))];
  const events = await Event.find({ _id: { $in: eventIds } }).select("name mainEvent").lean<{ _id: unknown; name: string; mainEvent?: string }[]>();
  const eventMap = Object.fromEntries(events.map((e) => [String(e._id), e.name]));
  const festMap = Object.fromEntries(events.map((e) => [String(e._id), e.mainEvent ? getFestEvent(e.mainEvent)?.name ?? e.mainEvent : e.name]));

  const rows = managers.map((m: { _id: unknown }) => ({
    ...m,
    assignments: assignments
      .filter((a: { userId: unknown }) => String(a.userId) === String(m._id))
      .map((a: { eventIds: unknown[]; permissions: string[] }) => ({
        ...a,
        eventNames: a.eventIds.map((id) => eventMap[String(id)] ?? "Unknown"),
        festNames: [...new Set(a.eventIds.map((id) => festMap[String(id)]).filter(Boolean))],
      })),
  }));

  return { rows: JSON.parse(JSON.stringify(rows)), total };
}

export default async function AdminEventManagersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const { page: rawPage } = await searchParams;
  const page = Math.max(1, parseInt(rawPage ?? "1") || 1);
  const limit = 25;

  const { rows: managers, total } = await getEventManagersWithAssignments(page, limit).catch(() => ({ rows: [], total: 0 }));

  return (
    <div className="">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <TicketTitle className="mb-2 text-3xl leading-[1.1] break-words sm:text-5xl">Event managers</TicketTitle>
            <p className="text-xs text-slate-500 mt-0.5">{total} accounts</p>
          </div>
          <div className="flex items-center gap-3">
            {user.role === "DEV_ADMIN" && (
              <Link href="/dev/management/create" className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#1c1812] bg-[#0f6b63] px-4 py-2 text-xs font-extrabold uppercase text-white transition-transform duration-150 active:scale-95">
                <Plus className="h-3.5 w-3.5" /> Create account
              </Link>
            )}
          </div>
        </div>

        {/* Managers: one card, a row per account */}
        <section className={`${CARD_UI} overflow-hidden`}>
          {managers.length === 0 ? (
            <div className="py-14 text-center">
              <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-black/25" />
              <p className="font-semibold text-black/60">No event manager accounts yet</p>
              {user.role === "DEV_ADMIN" && <Link href="/dev/events" className="mt-1 block text-sm font-bold text-[#0f6b63] hover:underline">Generate them from Developer → Events</Link>}
            </div>
          ) : (
            <ul className="divide-y divide-black/10">
              {managers.map((m: { _id: string; fullName: string; email: string; assignments: { eventNames: string[]; festNames: string[] }[] }) => {
                const names = m.assignments.flatMap((a) => a.eventNames);
                const fests = [...new Set(m.assignments.flatMap((a) => a.festNames))];
                const active = names.length > 0;
                return (
                  <li key={m._id} className="flex items-center gap-3 px-5 py-3.5">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-[#1c1812] text-base ${active ? "bg-[#f5c928]" : "bg-[#f6efdf]"} text-[#1c1812] ${display.className}`}>
                      {(fests[0] ?? m.fullName)[0]?.toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-[#1c1812]">{fests.length ? fests.join(", ") : m.fullName}</p>
                      <p className="truncate text-xs text-black/60">{m.email}</p>
                      {names.length > 1 && <p className="mt-0.5 text-xs text-black/60">{names.length} competitions</p>}
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${active ? "bg-[#0f6b63] text-white" : "bg-black/10 text-black/60"}`}>
                      {active ? "Active" : "No events"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <Pager page={page} pageSize={limit} total={total} href={(n) => `/admin/event-managers?page=${n}`} />
        </section>

      </div>
    </div>
  );
}
