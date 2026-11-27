"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignEventManager, revokeEventManager } from "@/features/management/management-actions";
import { CalendarDays, CheckSquare, Square, Trash2 } from "lucide-react";
import Link from "next/link";

interface EventRow { _id: string; name: string; status: string; category?: string }

interface Props {
  managerId: string;
  currentUserId: string;
  assignmentId: string | null;
  allEvents: EventRow[];
  initialAssignedIds: string[];
}

const STATUS_COLOR: Record<string, string> = {
  REGISTRATION_OPEN:   "text-emerald-600",
  EVENT_LIVE:          "text-[#0f6b63]",
  REGISTRATION_CLOSED: "text-amber-600",
  COMPLETED:           "text-slate-400",
  CANCELLED:           "text-red-500",
  TEMPORARILY_CLOSED:  "text-orange-500",
  DRAFT:               "text-slate-400",
  UPCOMING:            "text-sky-600",
};
const STATUS_LABEL: Record<string, string> = {
  REGISTRATION_OPEN:   "Open",
  EVENT_LIVE:          "Live",
  REGISTRATION_CLOSED: "Closed",
  COMPLETED:           "Completed",
  CANCELLED:           "Cancelled",
  TEMPORARILY_CLOSED:  "Paused",
  DRAFT:               "Draft",
  UPCOMING:            "Upcoming",
};
const DEFAULT_PERMISSIONS = ["participants.read", "checkin.manage", "reports.read"];

export default function AssignForm({ managerId, currentUserId, assignmentId, allEvents, initialAssignedIds }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set(initialAssignedIds));
  const [saving, setSaving] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [hasAssignment, setHasAssignment] = useState(!!assignmentId);
  const [currentAssignmentId, setCurrentAssignmentId] = useState(assignmentId);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    });

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const result = await assignEventManager(managerId, [...selected], DEFAULT_PERMISSIONS, currentUserId);
      setHasAssignment(true);
      setCurrentAssignmentId(result._id);
      setMsg({ type: "success", text: `Saved — ${selected.size} event(s) assigned.` });
      router.refresh();
    } catch (e: unknown) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Failed to save." });
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async () => {
    if (!currentAssignmentId) return;
    if (!confirm("Remove all event access for this manager?")) return;
    setRevoking(true);
    try {
      await revokeEventManager(currentAssignmentId, currentUserId);
      setHasAssignment(false);
      setCurrentAssignmentId(null);
      setSelected(new Set());
      setMsg({ type: "success", text: "All event access revoked." });
      router.refresh();
    } catch (e: unknown) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Failed to revoke." });
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: "0.06s" }}>
        <div className={`rounded-2xl px-4 py-4 ${selected.size > 0 ? "bg-[#1c1812] border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]" : "bg-slate-50 border border-slate-100"}`}>
          <p className={`text-xs font-medium mb-1 ${selected.size > 0 ? "text-white/70" : "text-slate-500"}`}>Assigned events</p>
          <p className={`text-3xl font-bold tabular-nums leading-none ${selected.size > 0 ? "text-white" : "text-slate-700"}`}>{selected.size}</p>
        </div>
        <div className="bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] rounded-2xl px-4 py-4">
          <p className="text-xs font-medium text-slate-500 mb-1">Total events</p>
          <p className="text-3xl font-bold tabular-nums leading-none text-slate-900">{allEvents.length}</p>
        </div>
      </div>

      {/* Event checklist */}
      <div className="animate-slide-up" style={{ animationDelay: "0.09s" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-slate-500">Assign events</p>
          <div className="flex gap-2">
            <button onClick={() => setSelected(new Set(allEvents.map((e) => e._id)))} className="text-xs text-[#0f6b63] hover:text-[#0f6b63] font-medium">
              Select all
            </button>
            <span className="text-slate-200">·</span>
            <button onClick={() => setSelected(new Set())} className="text-xs text-slate-500 hover:text-slate-600 font-medium">
              Clear
            </button>
          </div>
        </div>

        {allEvents.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-100 py-10 text-center">
            <CalendarDays className="h-7 w-7 mx-auto mb-2 text-slate-200" />
            <p className="text-sm text-slate-500">No events found.</p>
            <Link href="/dev/seed" className="text-xs text-[#0f6b63] hover:underline mt-1 block">Seed events →</Link>
          </div>
        ) : (
          <div className="space-y-1.5">
            {allEvents.map((event) => {
              const checked = selected.has(event._id);
              return (
                <button
                  key={event._id}
                  onClick={() => toggle(event._id)}
                  className={`w-full text-left bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 ${
                    checked
                      ? "border-2 border-[#0f6b63]"
                      : "border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]"
                  } card-lift`}
                >
                  {checked
                    ? <CheckSquare className="h-4 w-4 text-[#0f6b63] shrink-0" />
                    : <Square className="h-4 w-4 text-slate-300 shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{event.name}</p>
                    {event.category && <p className="text-xs text-slate-500">{event.category}</p>}
                  </div>
                  <span className={`text-xs font-medium shrink-0 ${STATUS_COLOR[event.status] ?? "text-slate-500"}`}>
                    {STATUS_LABEL[event.status] ?? event.status.replace(/_/g, " ")}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Permissions note */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <p className="text-xs font-medium text-slate-500 mb-1">Default permissions granted</p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {DEFAULT_PERMISSIONS.map((p) => (
            <code key={p} className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-lg">{p}</code>
          ))}
        </div>
      </div>

      {/* Message */}
      {msg && (
        <p className={`text-xs px-3 py-2 rounded-xl ${
          msg.type === "success"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-600 border border-red-200"
        }`}>
          {msg.text}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: "0.12s" }}>
        <button
          onClick={handleSave}
          disabled={saving || allEvents.length === 0}
          className="flex-1 h-10 rounded-xl bg-[#0f6b63] text-white text-sm font-medium hover:bg-[#0b4f49] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : `Save assignment (${selected.size} event${selected.size !== 1 ? "s" : ""})`}
        </button>
        {hasAssignment && (
          <button
            onClick={handleRevoke}
            disabled={revoking}
            className="h-10 px-4 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {revoking ? "Revoking..." : "Revoke all"}
          </button>
        )}
      </div>

    </div>
  );
}
