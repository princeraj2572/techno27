"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllEventsAction, getRegisteredEventsAction, submitEventsAction } from "@/features/events/event-actions";
import { CalendarDays, CheckCircle2, Trophy, Users } from "lucide-react";
import AppShell from "@/components/layout/app-shell";
import { CARD, PageShell, display } from "@/components/indie";

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

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      cls: "bg-[#1f8a3a] text-white" },
  EVENT_LIVE:          { text: "Live now",  cls: "bg-[#0b2a6b] text-white" },
  COMPLETED:           { text: "Completed", cls: "bg-black/15 text-black/60" },
  CANCELLED:           { text: "Cancelled", cls: "bg-[#a1001a] text-white" },
  REGISTRATION_CLOSED: { text: "Closed",    cls: "bg-[#e8851a] text-black" },
  TEMPORARILY_CLOSED:  { text: "Paused",    cls: "bg-[#ff6a00] text-black" },
};

function Skeleton() {
  return (
    <PageShell footer={false}>
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-16">
        <div className="h-10 w-48 animate-pulse bg-[#f5edd8]/20" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 animate-pulse bg-[#f5edd8]/15" />
          ))}
        </div>
      </div>
    </PageShell>
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
    <>
      <AppShell
        title="Browse events"
        sub="Tap an open event to select it, then confirm registration."
        icon={<CalendarDays className="h-6 w-6" />}
        crumbs={[{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard" }, { label: "Browse events" }]}
        back={{ href: "/dashboard", label: "Back to dashboard" }}
        width="max-w-3xl"
      >
        {/* Status message */}
        {msg && (
          <div
            className={`border-2 border-black px-4 py-3 text-base font-semibold shadow-[4px_4px_0_0_#000] ${
              msg.type === "success" ? "bg-[#c9f0c9] text-[#0d3d1a]" : "bg-[#ffd0d0] text-[#6b0010]"
            }`}
          >
            {msg.type === "success" && <CheckCircle2 className="mr-1.5 inline h-4 w-4" />}
            {msg.text}
          </div>
        )}

        {/* Events grid */}
        {openEvents.length === 0 && otherEvents.length === 0 ? (
          <div className="border-2 border-dashed border-[#f5edd8]/40 py-16 text-center">
            <CalendarDays className="mx-auto mb-3 h-9 w-9 text-[#f5c928]" />
            <p className="text-xl font-bold uppercase text-[#f5edd8]">No events available right now</p>
            <p className="mt-1 text-sm text-[#f5edd8]/70">Check back soon or contact the organizers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {orderedEvents.map((event) => {
              const isRegistered = registeredIds.has(event._id);
              const isSelected   = selected.has(event._id);
              const isOpen       = event.status === "REGISTRATION_OPEN";
              const statusInfo   = STATUS_LABEL[event.status] ?? { text: event.status.replace(/_/g, " "), cls: "bg-black/15 text-black/60" };

              let cardClass = `${CARD} p-4 transition `;
              if (isRegistered)    cardClass += "border-l-8 border-l-[#1f8a3a] cursor-default";
              else if (isSelected) cardClass += "-translate-y-1 cursor-pointer !bg-[#f5c928] !shadow-[6px_6px_0_0_#000]";
              else if (isOpen)     cardClass += "cursor-pointer hover:-translate-y-1";
              else                 cardClass += "cursor-not-allowed opacity-60";

              return (
                <div
                  key={event._id}
                  className={cardClass}
                  onClick={() => isOpen && !isRegistered && toggleSelect(event._id)}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold uppercase leading-tight">{event.name}</h3>
                    {isRegistered ? (
                      <span className="flex shrink-0 items-center gap-1 bg-[#1f8a3a] px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                        <CheckCircle2 className="h-3 w-3" /> Registered
                      </span>
                    ) : (
                      <span className={`shrink-0 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider ${statusInfo.cls}`}>
                        {statusInfo.text}
                      </span>
                    )}
                  </div>

                  {event.category && (
                    <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#7a1c1c]">{event.category}</p>
                  )}

                  {event.description && (
                    <p className="mb-3 line-clamp-2 text-base leading-snug text-black/70">{event.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-black/20 pt-2 text-sm font-semibold uppercase tracking-wide text-black/65">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.teamSize ?? 1} per team
                    </span>
                    {event.internalFee !== undefined && <span>Internal ₹{event.internalFee}</span>}
                    {event.externalFee !== undefined && <span>External ₹{event.externalFee}</span>}
                    {event.prizeMoney && (
                      <span className="flex items-center gap-1 text-[#a1001a]">
                        <Trophy className="h-4 w-4" /> ₹{event.prizeMoney}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <p className="mt-2.5 flex items-center gap-1 text-sm font-bold uppercase tracking-wider">
                      <CheckCircle2 className="h-4 w-4" /> Selected — tap again to deselect
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {selected.size > 0 && (
          <p className="text-center text-sm font-bold uppercase tracking-widest text-[#f5edd8]/70">
            {selected.size} event{selected.size > 1 ? "s" : ""} selected
          </p>
        )}
      </AppShell>

      {/* Sticky CTA */}
      {selected.size > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-5">
          <button
            onClick={handleRegister}
            disabled={submitting}
            className={`pointer-events-auto border-2 border-black bg-[#f5c928] px-8 py-3 text-lg uppercase tracking-wider text-black shadow-[5px_5px_0_0_#000] transition hover:-translate-y-0.5 hover:bg-[#ff6a00] disabled:opacity-60 ${display.className}`}
          >
            {submitting
              ? "Registering…"
              : `Confirm registration · ${selected.size} event${selected.size > 1 ? "s" : ""}`}
          </button>
        </div>
      )}
    </>
  );
}
