"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllEventsAction, getRegisteredEventsAction, submitEventsAction } from "@/actions/event-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  REGISTRATION_OPEN: "secondary",
  EVENT_LIVE: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

export default function EventsSelectionPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const openEvents = events.filter((e) => e.status === "REGISTRATION_OPEN");

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
      setMsg({ type: "success", text: `Registered for ${selected.size} event(s) successfully!` });
      selected.forEach((id) => setRegisteredIds((prev) => new Set([...prev, id])));
      setSelected(new Set());
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (e: unknown) {
      setMsg({ type: "error", text: (e as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-muted-foreground">
        Loading events...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Browse Events</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Select events to register. You can register for multiple events.
          </p>
        </div>
        {selected.size > 0 && (
          <button
            onClick={handleRegister}
            disabled={submitting}
            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "Registering..." : `Register for ${selected.size} event(s)`}
          </button>
        )}
      </div>

      {msg && (
        <div
          className={`px-4 py-3 rounded-lg text-sm ${
            msg.type === "success"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
        >
          {msg.text}
        </div>
      )}

      {openEvents.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <div className="text-4xl mb-4">🎪</div>
            <p className="font-medium">No events are open for registration right now.</p>
            <p className="text-sm mt-2">Check back soon or contact admin.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.map((event) => {
            const isRegistered = registeredIds.has(event._id);
            const isSelected = selected.has(event._id);
            const isOpen = event.status === "REGISTRATION_OPEN";

            return (
              <Card
                key={event._id}
                onClick={() => isOpen && toggleSelect(event._id)}
                className={`transition-all ${
                  isOpen && !isRegistered ? "cursor-pointer" : "cursor-default"
                } ${
                  isRegistered
                    ? "border-green-500/30 bg-green-500/5"
                    : isSelected
                      ? "border-primary ring-2 ring-primary/40"
                      : isOpen
                        ? "hover:border-primary/50"
                        : "opacity-60"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{event.name}</CardTitle>
                    {isRegistered ? (
                      <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                        Registered
                      </Badge>
                    ) : (
                      <Badge variant={STATUS_VARIANT[event.status] ?? "outline"} className="text-xs">
                        {event.status.replace(/_/g, " ")}
                      </Badge>
                    )}
                  </div>
                  {event.category && (
                    <p className="text-xs text-muted-foreground">{event.category}</p>
                  )}
                </CardHeader>
                <CardContent>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>Team size: {event.teamSize ?? 1}</span>
                    {event.internalFee !== undefined && (
                      <span>Internal: ₹{event.internalFee}</span>
                    )}
                    {event.externalFee !== undefined && (
                      <span>External: ₹{event.externalFee}</span>
                    )}
                    {event.prizeMoney && (
                      <span className="text-amber-400">Prize: ₹{event.prizeMoney}</span>
                    )}
                  </div>
                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium">
                      <span>✓</span>
                      <span>Selected — click again to deselect</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selected.size > 0 && (
        <div className="sticky bottom-4 flex justify-center">
          <button
            onClick={handleRegister}
            disabled={submitting}
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm shadow-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "Registering..." : `Confirm Registration (${selected.size} event${selected.size > 1 ? "s" : ""})`}
          </button>
        </div>
      )}
    </div>
  );
}
