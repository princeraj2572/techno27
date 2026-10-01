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
import { ChevronLeft, Users, Download, ChevronRight } from "lucide-react";
import Link from "next/link";

type UserRow = {
  _id: string; fullName: string; email: string; role: string;
  department?: string; program?: string; branch?: string; year?: string;
  enrollmentNumber?: string; participantId?: string;
  collegeName?: string; city?: string; state?: string; mobileNumber?: string;
};

async function getData(params: { q: string; type: string; event: string; page: number; limit: number }) {
  const { q, type, event, page, limit } = params;
  await connectToDatabase();

  const filter: Record<string, unknown> = { role: { $in: ["INTERNAL_USER", "EXTERNAL_USER"] } };
  if (type === "internal") filter.role = "INTERNAL_USER";
  if (type === "external") filter.role = "EXTERNAL_USER";

  if (q) {
    const r = new RegExp(q, "i");
    filter.$or = [
      { fullName: r }, { email: r }, { mobileNumber: r },
      { enrollmentNumber: r }, { participantId: r }, { collegeName: r },
    ];
  }

  if (event) {
    const teams = await Team.find({ event }).select("leader members").lean();
    const emails = [...new Set(teams.flatMap((t: { leader: string; members: string[] }) => [t.leader, ...t.members]))];
    filter.email = { $in: emails };
    delete filter.$or;
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("fullName email role department program branch year enrollmentNumber participantId collegeName city state mobileNumber createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return { rows: JSON.parse(JSON.stringify(users)), total };
}

async function getEventOptions() {
  await connectToDatabase();
  const events = await Event.find().select("name").sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(events)) as { _id: string; name: string }[];
}

export default async function ReportRegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const sp    = await searchParams;
  const q     = sp.q     ?? "";
  const type  = sp.type  ?? "";
  const event = sp.event ?? "";
  const page  = Math.max(1, parseInt(sp.page ?? "1"));
  const limit = [25, 50, 100].includes(parseInt(sp.limit ?? "25")) ? parseInt(sp.limit ?? "25") : 25;

  const [{ rows, total }, eventOptions] = await Promise.all([
    getData({ q, type, event, page, limit }).catch(() => ({ rows: [], total: 0 })),
    getEventOptions().catch(() => []),
  ]);

  const totalPages = Math.ceil(total / limit);

  const exportParams = new URLSearchParams();
  if (q)     exportParams.set("q", q);
  if (type)  exportParams.set("type", type);
  if (event) exportParams.set("event", event);
  const exportHref = `/api/export/registrations${exportParams.toString() ? `?${exportParams}` : ""}`;

  const pageParams = new URLSearchParams();
  if (q)            pageParams.set("q", q);
  if (type)         pageParams.set("type", type);
  if (event)        pageParams.set("event", event);
  if (limit !== 25) pageParams.set("limit", String(limit));
  const baseUrl = `/admin/reports/registrations?${pageParams}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin/reports" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Reports
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Registrations</h1>
            <p className="text-xs text-slate-400 mt-0.5">{total} participant(s)</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={exportHref} download className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg px-3 py-2">
              <Download className="h-3.5 w-3.5" />
              {q || type || event ? "Export filtered" : "Download Excel"}
            </a>
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.04s" }}>
          <Suspense>
            <FilterForm
              view="registrations"
              eventOptions={eventOptions.map((e) => ({ label: e.name, value: e._id }))}
            />
          </Suspense>
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.08s" }}>
          {rows.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-10 text-center">
              <p className="text-sm text-slate-400">No results</p>
            </div>
          ) : (
            rows.map((p: UserRow) => {
              const isExternal = p.role === "EXTERNAL_USER";
              return (
                <div key={p._id} className="bg-white border border-slate-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isExternal ? "bg-amber-100 text-amber-700" : "bg-teal-100 text-teal-700"
                  }`}>
                    {p.fullName[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">{p.fullName}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${
                        isExternal ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-teal-50 text-teal-700 border-teal-200"
                      }`}>
                        {isExternal ? "External" : "OPJU"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{p.email}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {isExternal
                        ? [p.collegeName, p.city, p.state].filter(Boolean).join(", ")
                        : [p.department, p.program, p.branch, p.year].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {(p.enrollmentNumber ?? p.participantId) && (
                      <code className="text-xs font-mono text-slate-400 block">
                        {p.enrollmentNumber ?? p.participantId}
                      </code>
                    )}
                    {p.mobileNumber && <p className="text-xs text-slate-400">{p.mobileNumber}</p>}
                  </div>
                </div>
              );
            })
          )}
        </div>

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
