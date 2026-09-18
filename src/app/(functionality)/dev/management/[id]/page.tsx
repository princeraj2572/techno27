export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser, getUserById } from "@/actions/user-actions";
import { getAssignmentForUser } from "@/actions/management-actions";
import { getAllEventsAction } from "@/actions/event-actions";
import { ChevronLeft, Shield } from "lucide-react";
import Link from "next/link";
import AssignForm from "./AssignForm";

export default async function DevManagementManagerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getUser();
  if (!currentUser || currentUser.role !== "DEV_ADMIN") redirect("/dashboard");

  const { id } = await params;

  const [manager, assignment, allEvents] = await Promise.all([
    getUserById(id).catch(() => null),
    getAssignmentForUser(id).catch(() => null),
    getAllEventsAction().catch(() => []),
  ]);

  if (!manager) redirect("/dev/management");
  if (manager.role !== "EVENT_MANAGER") redirect("/dev/management");

  type EventRow = { _id: string; name: string; status: string; category?: string };

  const assignedIds: string[] = assignment
    ? (assignment.eventIds as Array<{ _id: string } | string>).map((e) =>
        typeof e === "string" ? e : String(e._id)
      )
    : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-start justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/dev/management" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Management
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{manager.fullName}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{manager.email}</p>
            {manager.department && <p className="text-xs text-slate-300 mt-0.5">{manager.department}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0 mt-1">
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
              EVENT MANAGER
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Shield className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
        </div>

        <AssignForm
          managerId={id}
          currentUserId={String(currentUser._id ?? "")}
          assignmentId={assignment?._id ?? null}
          allEvents={allEvents as EventRow[]}
          initialAssignedIds={assignedIds}
        />

      </div>
    </div>
  );
}
