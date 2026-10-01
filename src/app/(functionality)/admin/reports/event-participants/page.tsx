export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { Team } from "@/models/team.model";
import { Event } from "@/models/event.model";
import { Button } from "@/components/ui/button";
import FilterForm from "../FilterForm";
import { ChevronLeft, CalendarDays, Download, ChevronRight } from "lucide-react";
import Link from "next/link";

async function getData(params: { q: string; event: string; page: number; limit: number }) {
  const { q, event, page, limit } = params;
  await connectToDatabase();

  const filter: Record<string, unknown> = {};
  if (event) filter.event = event;
  if (q) filter.$or = [{ leader: new RegExp(q, "i") }];

  const [teams, total] = await Promise.all([
    Team.find(filter)
      .populate("event", "name status category")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Team.countDocuments(filter),
  ]);

  const leaderEmails = teams.map((t: { leader: string }) => t.leader);
  const users = await User.find({ email: { $in: leaderEmails } })
    .select("email fullName enrollmentNumber participantId")
    .lean();
  const nameMap = Object.fromEntries(
    JSON.parse(JSON.stringify(users)).map((u: { email: string; fullName: string }) => [u.email, u])
  );

  return {
    rows: JSON.parse(JSON.stringify(teams)).map((t: {
      _id: string; leader: string; members: string[];
      event?: { name?: string; category?: string };
    }) => ({ ...t, leaderUser: nameMap[t.leader] ?? null })),
    total,
  };
}

async function getEventOptions() {
  await connectToDatabase();
  const events = await Event.find().select("name").sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(events)) as { _id: string; name: string }[];
}

export default async function ReportEventParticipantsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const sp    = await searchParams;
  const q     = sp.q     ?? "";
  const event = sp.event ?? "";
  const page  = Math.max(1, parseInt(sp.page ?? "1"));
  const limit = [25, 50, 100].includes(parseInt(sp.limit ?? "25")) ? parseInt(sp.limit ?? "25") : 25;

  const [{ rows, total }, eventOptions] = await Promise.all([
    getData({ q, event, page, limit }).catch(() => ({ rows: [], total: 0 })),
    getEventOptions().catch(() => []),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Build export URL with current filters
  const exportParams = new URLSearchParams();
  if (q)     exportParams.set("q", q);
  if (event) exportParams.set("event", event);
  const exportHref = `/api/export/event-participants${exportParams.toString() ? `?${exportParams}` : ""}`;

  // Pagination base URL
  const pageParams = new URLSearchParams();
  if (q)                   pageParams.set("q", q);
  if (event)               pageParams.set("event", event);
  if (limit !== 25)        pageParams.set("limit", String(limit));
  const baseUrl = `/admin/reports/event-participants?${pageParams}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin/reports" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Reports
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Event Participants</h1>
            <p className="text-xs text-slate-400 mt-0.5">{total} team(s) found</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={exportHref} download className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 border border-teal-200 rounded-lg px-3 py-2">
              <Download className="h-3.5 w-3.5" />
              {q || event ? "Export filtered" : "Download Excel"}
            </a>
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <CalendarDays className="h-4 w-4 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="animate-slide-up" style={{ animationDelay: "0.04s" }}>
          <Suspense>
            <FilterForm
              view="event-participants"
              eventOptions={eventOptions.map((e) => ({ label: e.name, value: e._id }))}
            />
          </Suspense>
        </div>

        {/* Data */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.08s" }}>
          {rows.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-10 text-center">
              <p className="text-sm text-slate-400">No results</p>
            </div>
          ) : (
            rows.map((t: {
              _id: string; leader: string; members: string[];
              event?: { name?: string; category?: string };
              leaderUser?: { fullName?: string };
            }) => (
              <div key={t._id} className="bg-white border border-slate-100 border-l-4 border-l-teal-300 rounded-xl px-4 py-3.5 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700 shrink-0">
                  {(t.leaderUser?.fullName ?? t.leader)[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{t.leaderUser?.fullName ?? t.leader}</p>
                  <p className="text-xs text-slate-400 truncate">{t.leader}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium text-slate-700 truncate max-w-[160px]">{t.event?.name ?? "—"}</p>
                  <p className="text-xs text-slate-400">{t.members.length} member(s)</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400">
              {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                  <Link href={`${baseUrl}&page=${page - 1}`}>← Prev</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="h-8 text-xs" disabled>← Prev</Button>
              )}
              <span className="text-xs text-slate-400">{page} / {totalPages}</span>
              {page < totalPages ? (
                <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                  <Link href={`${baseUrl}&page=${page + 1}`}>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="h-8 text-xs" disabled>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
