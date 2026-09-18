export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { ManagementAssignment } from "@/models/managementAssignment.model";
import { Event } from "@/models/event.model";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShieldCheck, Plus } from "lucide-react";
import Link from "next/link";

async function getEventManagersWithAssignments() {
  await connectToDatabase();
  const managers = await User.find({ role: "EVENT_MANAGER" }).lean();
  const assignments = await ManagementAssignment.find({ isActive: true }).lean();
  const eventIds = [...new Set(assignments.flatMap((a: { eventIds: unknown[] }) => a.eventIds.map(String)))];
  const events = await Event.find({ _id: { $in: eventIds } }).select("name").lean();
  const eventMap = Object.fromEntries(events.map((e: { _id: unknown; name: string }) => [String(e._id), e.name]));

  return JSON.parse(JSON.stringify(managers.map((m: { _id: unknown }) => ({
    ...m,
    assignments: assignments
      .filter((a: { userId: unknown }) => String(a.userId) === String(m._id))
      .map((a: { eventIds: unknown[]; permissions: string[] }) => ({
        ...a,
        eventNames: a.eventIds.map((id) => eventMap[String(id)] ?? "Unknown"),
      })),
  }))));
}

export default async function AdminEventManagersPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const managers = await getEventManagersWithAssignments().catch(() => []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Event managers</h1>
            <p className="text-xs text-slate-400 mt-0.5">{managers.length} accounts</p>
          </div>
          <div className="flex items-center gap-3">
            {user.role === "DEV_ADMIN" && (
              <Button size="sm" asChild>
                <Link href="/dev/management/create">
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Create account
                </Link>
              </Button>
            )}
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
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
                <Link href="/dev/management/create" className="text-xs text-indigo-600 hover:underline mt-1 block">
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
                  isAssigned ? "border-l-indigo-500" : "border-l-slate-200"
                } rounded-xl px-4 py-3.5`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
                      {m.fullName[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{m.fullName}</p>
                      <p className="text-xs text-slate-400 truncate">{m.email}</p>
                      {eventNames.length > 0 && (
                        <p className="text-xs text-indigo-600 mt-0.5 truncate">{eventNames.join(", ")}</p>
                      )}
                    </div>
                    <div className="shrink-0">
                      {isAssigned ? (
                        <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded-full">
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
        </div>

      </div>
    </div>
  );
}
