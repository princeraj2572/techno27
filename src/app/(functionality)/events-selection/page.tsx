"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllEventsAction, getRegisteredEventsAction, submitEventsAction } from "@/actions/event-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays, CheckCircle2, ChevronLeft, Trophy, Users,
} from "lucide-react";
import Link from "next/link";

type Event = {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  status: string;
  teamSize?: number;
  internalFee?: number;
  externalFee?: number;
  prizeMoney?: number;
  maxParticipants?: number;
};

const STATUS_LABEL: Record<string, { text: string; color: string; bg: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  EVENT_LIVE:          { text: "Live now",   color: "text-indigo-700",  bg: "bg-indigo-50 border-indigo-200"  },
  COMPLETED:           { text: "Completed",  color: "text-slate-500",   bg: "bg-slate-50 border-slate-200"    },
  CANCELLED:           { text: "Cancelled",  color: "text-red-600",     bg: "bg-red-50 border-red-200"        },
  REGISTRATION_CLOSED: { text: "Closed",     color: "text-amber-700",   bg: "bg-amber-50 border-amber-200"    },
  TEMPORARILY_CLOSED:  { text: "Paused",     color: "text-orange-700",  bg: "bg-orange-50 border-orange-200"  },
};

function Skeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-3">
        <div className="h-8 w-40 bg-slate-100 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EventsSelectionPage() {
  const router = useRouter();
  const [events, setEvents]           = useState<Event[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [selected, setSelected]       = useState<Set<string>>(new Set());
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [msg, setMsg]                 = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [allEvents, regEvents] = await Promise.all([
          getAllEventsAction(),
          getRegisteredEventsAction(),
        ]);
        setEvents(allEvents);
        setRegisteredIds(new Set(regEvents.map((e: Event) => e._id)));
      } catch {
        setMsg({ type: "error", text: "Failed to load events." });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function toggleSelect(id: string) {
    if (registeredIds.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleRegister() {
    if (selected.size === 0) return;
    setSubmitting(true);
    setMsg(null);
    try {
      await submitEventsAction({ eventIds: [...selected] });
      setMsg({ type: "success", text: `Registered for ${selected.size} event${selected.size > 1 ? "s" : ""} successfully!` });
      selected.forEach((id) => setRegisteredIds((prev) => new Set([...prev, id])));
      setSelected(new Set());
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (e: unknown) {
      setMsg({ type: "error", text: (e as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Skeleton />;

  const openEvents     = events.filter((e) => e.status === "REGISTRATION_OPEN");
  const otherEvents    = events.filter((e) => e.status !== "REGISTRATION_OPEN");
  const orderedEvents  = [...openEvents, ...otherEvents];

  return (
    <div className="min-h-screen bg-white pb-28">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-7">

        {/* ── Header ───────────────────────────────────────── */}
        <div
          className="flex items-center justify-between animate-slide-up"
          style={{ animationDelay: "0s" }}
        >
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Browse events</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Tap an open event to select it, then confirm registration.
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
            <CalendarDays className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* ── Status message ───────────────────────────────── */}
        {msg && (
          <div
            className={`px-4 py-3 rounded-2xl text-sm border animate-slide-up ${
              msg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
            style={{ animationDelay: "0.04s" }}
          >
            {msg.type === "success" && <CheckCircle2 className="inline h-3.5 w-3.5 mr-1.5 text-emerald-600" />}
            {msg.text}
          </div>
        )}

        {/* ── Events grid ──────────────────────────────────── */}
        <div
          className="animate-slide-up"
          style={{ animationDelay: "0.06s" }}
        >
          {openEvents.length === 0 && otherEvents.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-16 text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No events available right now</p>
              <p className="text-xs text-slate-400 mt-1">Check back soon or contact the organizers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {orderedEvents.map((event, i) => {
                const isRegistered = registeredIds.has(event._id);
                const isSelected   = selected.has(event._id);
                const isOpen       = event.status === "REGISTRATION_OPEN";
                const statusInfo   = STATUS_LABEL[event.status] ?? { text: event.status.replace(/_/g, " "), color: "text-slate-500", bg: "bg-slate-50 border-slate-200" };

                let cardClass = "bg-white border border-slate-100 rounded-2xl p-4 transition-all ";
                if (isRegistered) {
                  cardClass += "border-l-4 border-l-emerald-500 cursor-default";
                } else if (isSelected) {
                  cardClass += "border-2 border-indigo-500 bg-indigo-50/50 cursor-pointer shadow-sm";
                } else if (isOpen) {
                  cardClass += "hover:border-indigo-200 hover:shadow-sm cursor-pointer";
                } else {
                  cardClass += "opacity-50 cursor-not-allowed";
                }

                return (
                  <div
                    key={event._id}
                    className={cardClass}
                    onClick={() => isOpen && !isRegistered && toggleSelect(event._id)}
                    style={{ animationDelay: `${0.06 + i * 0.03}s` }}
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {event.name}
                      </h3>
                      {isRegistered ? (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Registered
                        </span>
                      ) : (
                        <span className={`text-xs font-medium border px-1.5 py-0.5 rounded-full shrink-0 ${statusInfo.bg} ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      )}
                    </div>

                    {/* Category */}
                    {event.category && (
                      <p className="text-xs text-slate-400 mb-2">{event.category}</p>
                    )}

                    {/* Description */}
                    {event.description && (
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {event.teamSize ?? 1} per team
                      </span>
                      {event.internalFee !== undefined && (
                        <span>Internal ₹{event.internalFee}</span>
                      )}
                      {event.externalFee !== undefined && (
                        <span>External ₹{event.externalFee}</span>
                      )}
                      {event.prizeMoney && (
                        <span className="flex items-center gap-1 text-amber-600 font-medium">
                          <Trophy className="h-3.5 w-3.5" /> ₹{event.prizeMoney}
                        </span>
                      )}
                    </div>

                    {/* Selected hint */}
                    {isSelected && (
                      <p className="mt-2.5 text-xs text-indigo-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Selected — tap again to deselect
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selection summary */}
        {selected.size > 0 && (
          <p className="text-xs text-slate-400 text-center animate-slide-up">
            {selected.size} event{selected.size > 1 ? "s" : ""} selected
          </p>
        )}

      </div>

      {/* ── Sticky CTA ──────────────────────────────────────── */}
      {selected.size > 0 && (
        <div className="fixed bottom-0 inset-x-0 flex justify-center pb-5 px-4 pointer-events-none z-10">
          <Button
            onClick={handleRegister}
            disabled={submitting}
            className="pointer-events-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-8 text-sm font-semibold shadow-xl shadow-indigo-200 disabled:opacity-60"
          >
            {submitting
              ? "Registering…"
              : `Confirm registration · ${selected.size} event${selected.size > 1 ? "s" : ""}`}
          </Button>
        </div>
      )}
    </div>
  );
}
