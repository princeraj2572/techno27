"use client";
import { useState } from "react";
import { updateEventStatusAction } from "@/actions/event-actions";

interface Props {
  eventId: string;
  currentStatus: string;
  currentUserId: string;
}

export default function QuickStatusToggle({ eventId, currentStatus, currentUserId }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const isOpen = status === "REGISTRATION_OPEN";

  const toggle = async () => {
    const next = isOpen ? "REGISTRATION_CLOSED" : "REGISTRATION_OPEN";
    setLoading(true);
    try {
      await updateEventStatusAction(eventId, next as import("@/models/event.model").IEvent["status"], currentUserId);
      setStatus(next);
    } catch {
      // revert optimistic update on error
    } finally {
      setLoading(false);
    }
  };

  if (["COMPLETED", "CANCELLED", "EVENT_LIVE"].includes(status)) return null;

  return (
    <button
      onClick={(e) => { e.preventDefault(); toggle(); }}
      disabled={loading}
      className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors disabled:opacity-50 shrink-0 ${
        isOpen
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
          : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
      }`}
    >
      {loading ? "..." : isOpen ? "Close reg." : "Open reg."}
    </button>
  );
}
