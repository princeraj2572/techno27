export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { ManagementAssignment } from "@/models/managementAssignment.model";
import { Event } from "@/models/event.model";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShieldCheck, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";

async function getEventManagersWithAssignments(page: number, limit: number) {
  await connectToDatabase();
  const [managers, total] = await Promise.all([
    User.find({ role: "EVENT_MANAGER" }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    User.countDocuments({ role: "EVENT_MANAGER" }),
  ]);
  const managerIds = managers.map((m: { _id: unknown }) => m._id);
  const assignments = await ManagementAssignment.find({ userId: { $in: managerIds }, isActive: true }).lean();
  const eventIds = [...new Set(assignments.flatMap((a: { eventIds: unknown[] }) => a.eventIds.map(String)))];
  const events = await Event.find({ _id: { $in: eventIds } }).select("name").lean();
  const eventMap = Object.fromEntries(events.map((e: { _id: unknown; name: string }) => [String(e._id), e.name]));

  const rows = managers.map((m: { _id: unknown }) => ({
    ...m,
    assignments: assignments
      .filter((a: { userId: unknown }) => String(a.userId) === String(m._id))
      .map((a: { eventIds: unknown[]; permissions: string[] }) => ({
        ...a,
        eventNames: a.eventIds.map((id) => eventMap[String(id)] ?? "Unknown"),
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
  const page = Math.max(1, parseInt(rawPage ?? "1"));
  const limit = 25;

  const { rows: managers, total } = await getEventManagersWithAssignments(page, limit).catch(() => ({ rows: [], total: 0 }));
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Event managers</h1>
            <p className="text-xs text-slate-400 mt-0.5">{total} accounts</p>
          </div>
          <div className="flex items-center gap-3">
            {user.role === "DEV_ADMIN" && (
              <Button size="sm" asChild>
                <Link href="/dev/management/create">
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Create account
                </Link>
              </Button>
            )}
            <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Managers list */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          {managers.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <ShieldCheck className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No event manager accounts yet</p>
              {user.role === "DEV_ADMIN" && (
                <Link href="/dev/management/create" className="text-xs text-teal-600 hover:underline mt-1 block">
                  Create the first one
                </Link>
              )}
            </div>
          ) : (
            managers.map((m: {
              _id: string; fullName: string; email: string;
              assignments: { eventNames: string[]; permissions: string[] }[];
            }) => {
              const assignment   = m.assignments[0];
              const isAssigned   = !!assignment;
              const eventNames   = assignment?.eventNames ?? [];
              return (
                <div key={m._id} className={`bg-white border border-slate-100 border-l-4 ${
                  isAssigned ? "border-l-teal-500" : "border-l-slate-200"
                } rounded-xl px-4 py-3.5`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700 shrink-0">
                      {m.fullName[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{m.fullName}</p>
                      <p className="text-xs text-slate-400 truncate">{m.email}</p>
                      {eventNames.length > 0 && (
                        <p className="text-xs text-teal-600 mt-0.5 truncate">{eventNames.join(", ")}</p>
                      )}
                    </div>
                    <div className="shrink-0">
                      {isAssigned ? (
                        <span className="text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-full">
                          Unassigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-400">
                {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                    <Link href={`/admin/event-managers?page=${page - 1}`}>← Prev</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="h-8 text-xs" disabled>← Prev</Button>
                )}
                <span className="text-xs text-slate-400">{page} / {totalPages}</span>
                {page < totalPages ? (
                  <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                    <Link href={`/admin/event-managers?page=${page + 1}`}>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="h-8 text-xs" disabled>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
