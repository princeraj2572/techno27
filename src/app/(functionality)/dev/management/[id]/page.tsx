export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser, getUserById } from "@/features/users/user-actions";
import { getAssignmentForUser } from "@/features/management/management-actions";
import { getAllEventsAction } from "@/features/events/event-actions";
import { Shield } from "lucide-react";
import AssignForm from "./AssignForm";
import { TicketTitle } from "@/components/indie/gold-poster";

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
    <div className="">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-start flex-wrap justify-between gap-x-4 gap-y-3">
          <div>
            <TicketTitle className="mb-2 text-3xl leading-[1.1] break-words sm:text-5xl">{manager.fullName}</TicketTitle>
            <p className="text-xs text-slate-500 mt-0.5">{manager.email}</p>
            {manager.department && <p className="text-xs text-slate-300 mt-0.5">{manager.department}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0 mt-1">
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full border bg-[#e3f1ef] text-[#0f6b63] border-[#0f6b63]/30">
              EVENT MANAGER
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#f6efdf] flex items-center justify-center">
              <Shield className="h-4 w-4 text-[#0f6b63]" />
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
