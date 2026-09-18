"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateEventStatusAction, updateEventFeesAction, getEventByIdAction } from "@/actions/event-actions";
import { getUser } from "@/actions/user-actions";
import Link from "next/link";

const STATUS_ACTIONS = [
  { label: "Open Registration", status: "REGISTRATION_OPEN", variant: "default" as const },
  { label: "Close Registration", status: "REGISTRATION_CLOSED", variant: "outline" as const },
  { label: "Temporarily Pause", status: "TEMPORARILY_CLOSED", variant: "outline" as const },
  { label: "Go Live", status: "EVENT_LIVE", variant: "default" as const },
  { label: "Mark Completed", status: "COMPLETED", variant: "secondary" as const },
  { label: "Cancel Event", status: "CANCELLED", variant: "destructive" as const },
];

interface EventData {
  _id: string;
  name: string;
  description?: string;
  status: string;
  teamSize?: number;
  internalFee?: number;
  externalFee?: number;
  prizeMoney?: number;
  maxParticipants?: number;
  registeredCount?: number;
}

export default function DevEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [feeEditing, setFeeEditing] = useState(false);
  const [fees, setFees] = useState({ internalFee: 0, externalFee: 0, prizeMoney: 0, maxParticipants: 0 });
  const [error, setError] = useState("");
  const [eventId, setEventId] = useState("");

  useEffect(() => {
    params.then(p => setEventId(p.id));
  }, [params]);

  useEffect(() => {
    if (!eventId) return;
    const load = async () => {
      const u = await getUser();
      if (!u || u.role !== "DEV_ADMIN") { router.push("/dashboard"); return; }
      setUserId(String(u._id ?? ""));
      const data = await getEventByIdAction(eventId).catch(() => null);
      if (data) {
        setEvent(data as EventData);
        setFees({
          internalFee: data.internalFee ?? 0,
          externalFee: data.externalFee ?? 0,
          prizeMoney: data.prizeMoney ?? 0,
          maxParticipants: data.maxParticipants ?? 0,
        });
      }
      setLoading(false);
    };
    load();
  }, [eventId, router]);

  const handleStatusChange = async (status: string) => {
    if (!event || !userId) return;
    setActionLoading(status);
    setError("");
    try {
      await updateEventStatusAction(event._id, status as import("@/models/event.model").IEvent["status"], userId);
      setEvent((prev) => prev ? { ...prev, status } : prev);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setActionLoading("");
    }
  };

  const handleSaveFees = async () => {
    if (!event || !userId) return;
    setActionLoading("fees");
    setError("");
    try {
      await updateEventFeesAction(event._id, {
        internalFee: fees.internalFee,
        externalFee: fees.externalFee,
        prizeMoney: fees.prizeMoney,
        maxParticipants: fees.maxParticipants,
      }, userId);
      setEvent((prev) => prev ? { ...prev, ...fees } : prev);
      setFeeEditing(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save fees");
    } finally {
      setActionLoading("");
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-muted-foreground">Loading...</div>;
  if (!event) return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-muted-foreground">Event not found.</div>;

  const remaining = (event.maxParticipants ?? 0) > 0
    ? (event.maxParticipants ?? 0) - (event.registeredCount ?? 0)
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dev/events" className="text-sm text-muted-foreground hover:text-primary">← Events</Link>
          <h1 className="text-2xl font-bold mt-1">{event.name}</h1>
        </div>
        <Badge variant={event.status === "EVENT_LIVE" ? "default" : event.status === "REGISTRATION_OPEN" ? "secondary" : "outline"}>
          {event.status.replace(/_/g, " ")}
        </Badge>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs text-muted-foreground">Registered</div>
            <div className="text-2xl font-bold">{event.registeredCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs text-muted-foreground">Limit</div>
            <div className="text-2xl font-bold">{event.maxParticipants || "∞"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs text-muted-foreground">Remaining</div>
            <div className="text-2xl font-bold">{remaining !== null ? remaining : "∞"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs text-muted-foreground">Team Size</div>
            <div className="text-2xl font-bold">{event.teamSize ?? 1}</div>
          </CardContent>
        </Card>
      </div>

      {/* Registration status control */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registration Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {STATUS_ACTIONS.map((action) => (
              <Button
                key={action.status}
                variant={action.variant}
                size="sm"
                disabled={event.status === action.status || !!actionLoading}
                onClick={() => handleStatusChange(action.status)}
              >
                {actionLoading === action.status ? "..." : action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fees & prize pool */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Fees & Prize Pool</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFeeEditing(!feeEditing)}
            >
              {feeEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {feeEditing ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Internal Fee (₹)</Label>
                <Input
                  type="number"
                  value={fees.internalFee}
                  onChange={(e) => setFees((p) => ({ ...p, internalFee: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1">
                <Label>External Fee (₹)</Label>
                <Input
                  type="number"
                  value={fees.externalFee}
                  onChange={(e) => setFees((p) => ({ ...p, externalFee: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Prize Money (₹)</Label>
                <Input
                  type="number"
                  value={fees.prizeMoney}
                  onChange={(e) => setFees((p) => ({ ...p, prizeMoney: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Max Participants</Label>
                <Input
                  type="number"
                  value={fees.maxParticipants}
                  onChange={(e) => setFees((p) => ({ ...p, maxParticipants: Number(e.target.value) }))}
                />
              </div>
              <div className="col-span-2">
                <Button onClick={handleSaveFees} disabled={actionLoading === "fees"}>
                  {actionLoading === "fees" ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Internal Fee</span>
                <div className="font-semibold">₹{event.internalFee ?? 0}</div>
              </div>
              <div>
                <span className="text-muted-foreground">External Fee</span>
                <div className="font-semibold">₹{event.externalFee ?? 0}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Prize Pool</span>
                <div className="font-semibold">{event.prizeMoney ? `₹${event.prizeMoney}` : "—"}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Max Participants</span>
                <div className="font-semibold">{event.maxParticipants || "Unlimited"}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded">{error}</p>
      )}
    </div>
  );
}
