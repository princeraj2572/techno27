"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateEventStatusAction, updateEventFeesAction, getEventByIdAction } from "@/actions/event-actions";
import { generateEventManagerAction, getEventManagerForEvent } from "@/actions/management-actions";
import { getUser } from "@/actions/user-actions";
import { useRouter } from "next/navigation";
import { Copy, Check, UserCog, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const STATUS_LABEL: Record<string, { text: string; color: string; border: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-600", border: "border-emerald-500" },
  EVENT_LIVE:          { text: "Live now",  color: "text-indigo-600",  border: "border-indigo-500"  },
  COMPLETED:           { text: "Completed", color: "text-slate-400",   border: "border-slate-300"   },
  CANCELLED:           { text: "Cancelled", color: "text-red-500",     border: "border-red-400"     },
  REGISTRATION_CLOSED: { text: "Closed",    color: "text-amber-600",   border: "border-amber-400"   },
  TEMPORARILY_CLOSED:  { text: "Paused",    color: "text-orange-500",  border: "border-orange-400"  },
  DRAFT:               { text: "Draft",     color: "text-slate-400",   border: "border-slate-200"   },
  UPCOMING:            { text: "Upcoming",  color: "text-sky-600",     border: "border-sky-400"     },
};

const STATUS_ACTIONS: Array<{
  label: string; status: string;
  style: string;
}> = [
  { label: "Open Registration",  status: "REGISTRATION_OPEN",   style: "bg-emerald-600 text-white hover:bg-emerald-700" },
  { label: "Close Registration", status: "REGISTRATION_CLOSED", style: "border border-amber-300 text-amber-700 hover:bg-amber-50" },
  { label: "Temporarily Pause",  status: "TEMPORARILY_CLOSED",  style: "border border-orange-300 text-orange-700 hover:bg-orange-50" },
  { label: "Go Live",            status: "EVENT_LIVE",           style: "bg-indigo-600 text-white hover:bg-indigo-700" },
  { label: "Mark Completed",     status: "COMPLETED",            style: "border border-slate-200 text-slate-600 hover:bg-slate-50" },
  { label: "Cancel Event",       status: "CANCELLED",            style: "border border-red-200 text-red-600 hover:bg-red-50" },
];

interface EventData {
  _id: string; name: string; description?: string; status: string;
  teamSize?: number; internalFee?: number; externalFee?: number;
  prizeMoney?: number; maxParticipants?: number; registeredCount?: number;
  category?: string;
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

  // Event Manager
  type EMData = { userId: string; fullName: string; email: string; password: string };
  const [emData, setEmData] = useState<EMData | null | "loading">("loading");
  const [emGenerating, setEmGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setEventId(p.id));
  }, [params]);

  useEffect(() => {
    if (!eventId) return;
    const load = async () => {
      const u = await getUser();
      if (!u || u.role !== "DEV_ADMIN") { router.push("/dashboard"); return; }
      setUserId(String(u._id ?? ""));
      const [data, em] = await Promise.all([
        getEventByIdAction(eventId).catch(() => null),
        getEventManagerForEvent(eventId).catch(() => null),
      ]);
      if (data) {
        setEvent(data as EventData);
        setFees({
          internalFee: data.internalFee ?? 0,
          externalFee: data.externalFee ?? 0,
          prizeMoney: data.prizeMoney ?? 0,
          maxParticipants: data.maxParticipants ?? 0,
        });
      }
      setEmData(em as EMData | null);
      setLoading(false);
    };
    load();
  }, [eventId, router]);

  const handleGenerateEM = async () => {
    if (!eventId || !userId) return;
    setEmGenerating(true);
    try {
      const result = await generateEventManagerAction(eventId, userId);
      setEmData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate event manager");
    } finally {
      setEmGenerating(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

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
      await updateEventFeesAction(event._id, fees, userId);
      setEvent((prev) => prev ? { ...prev, ...fees } : prev);
      setFeeEditing(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save fees");
    } finally {
      setActionLoading("");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="space-y-3 animate-pulse w-full max-w-3xl px-4">
        <div className="h-4 bg-slate-100 rounded w-16" />
        <div className="h-8 bg-slate-100 rounded w-48" />
        <div className="h-32 bg-slate-100 rounded-2xl" />
        <div className="h-32 bg-slate-100 rounded-2xl" />
      </div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-sm text-slate-400">Event not found.</p>
    </div>
  );

  const statusInfo  = STATUS_LABEL[event.status] ?? { text: event.status.replace(/_/g, " "), color: "text-slate-400", border: "border-slate-200" };
  const pct         = (event.maxParticipants ?? 0) > 0 ? Math.round(((event.registeredCount ?? 0) / (event.maxParticipants ?? 1)) * 100) : 0;
  const remaining   = (event.maxParticipants ?? 0) > 0 ? (event.maxParticipants ?? 0) - (event.registeredCount ?? 0) : null;

  const inputClass  = "h-9 rounded-xl border-slate-200 text-sm focus:ring-indigo-300 focus:border-indigo-300";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-start justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/dev/events" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              ← Events
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{event.name}</h1>
            {event.category && <p className="text-xs text-slate-400 mt-0.5">{event.category}</p>}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${statusInfo.color} border-current bg-white`}>
            {statusInfo.text}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          {[
            { label: "Registered", value: event.registeredCount ?? 0,               bg: "bg-indigo-600", label_c: "text-indigo-200", val_c: "text-white" },
            { label: "Limit",      value: event.maxParticipants || "∞",             bg: "bg-sky-500",    label_c: "text-sky-100",    val_c: "text-white" },
            { label: "Remaining",  value: remaining !== null ? remaining : "∞",     bg: "bg-emerald-500",label_c: "text-emerald-100",val_c: "text-white" },
            { label: "Team size",  value: event.teamSize ?? 1,                      bg: "bg-violet-500", label_c: "text-violet-100", val_c: "text-white" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl px-4 py-4 shadow-sm ${stat.bg}`}>
              <p className={`text-xs font-medium mb-1 ${stat.label_c}`}>{stat.label}</p>
              <p className={`text-3xl font-bold tabular-nums leading-none ${stat.val_c}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Fill bar */}
        {(event.maxParticipants ?? 0) > 0 && (
          <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: "0.08s" }}>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-400" : pct >= 60 ? "bg-amber-400" : "bg-indigo-500"}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 tabular-nums w-10 text-right">{pct}%</span>
          </div>
        )}

        {/* Status controls */}
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-5 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-semibold text-slate-400 mb-4">Registration controls</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_ACTIONS.map((action) => {
              const isCurrent = event.status === action.status;
              return (
                <button
                  key={action.status}
                  disabled={isCurrent || !!actionLoading}
                  onClick={() => handleStatusChange(action.status)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors disabled:cursor-not-allowed ${
                    isCurrent
                      ? "bg-slate-900 text-white ring-2 ring-offset-1 ring-slate-900"
                      : `${action.style} disabled:opacity-40`
                  }`}
                >
                  {isCurrent && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {actionLoading === action.status ? "..." : isCurrent ? `${action.label} (current)` : action.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fees & prize pool */}
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-5 animate-slide-up" style={{ animationDelay: "0.13s" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-400">Fees &amp; prize pool</p>
            <button
              onClick={() => setFeeEditing(!feeEditing)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {feeEditing ? "Cancel" : "Edit"}
            </button>
          </div>
          {feeEditing ? (
            <div className="grid grid-cols-2 gap-4">
              {([
                ["Internal Fee (₹)",   "internalFee",   fees.internalFee],
                ["External Fee (₹)",   "externalFee",   fees.externalFee],
                ["Prize Money (₹)",    "prizeMoney",    fees.prizeMoney],
                ["Max Participants",   "maxParticipants", fees.maxParticipants],
              ] as [string, keyof typeof fees, number][]).map(([label, key, val]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-slate-600">{label}</Label>
                  <Input
                    type="number"
                    value={val}
                    onChange={(e) => setFees((p) => ({ ...p, [key]: Number(e.target.value) }))}
                    className={inputClass}
                  />
                </div>
              ))}
              <div className="col-span-2">
                <Button
                  onClick={handleSaveFees}
                  disabled={actionLoading === "fees"}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                >
                  {actionLoading === "fees" ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                ["Internal Fee",    `₹${event.internalFee ?? 0}`],
                ["External Fee",    `₹${event.externalFee ?? 0}`],
                ["Prize Pool",      event.prizeMoney ? `₹${event.prizeMoney}` : "—"],
                ["Max Participants", event.maxParticipants || "Unlimited"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event Manager credentials */}
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-5 animate-slide-up" style={{ animationDelay: "0.16s" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserCog className="h-4 w-4 text-indigo-500" />
              <p className="text-xs font-semibold text-slate-400">Event Manager account</p>
            </div>
            {emData && emData !== "loading" && (
              <Link href={`/event-manager/${eventId}/participants`} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                View participants →
              </Link>
            )}
          </div>

          {emData === "loading" ? (
            <div className="h-16 bg-slate-50 rounded-xl animate-pulse" />
          ) : emData ? (
            <div className="space-y-2">
              {[
                { label: "Email", value: emData.email, key: "email" },
                { label: "Password", value: emData.password, key: "pass" },
              ].map(({ label, value, key }) => (
                <div key={key} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-400 font-medium">{label}</p>
                    <code className="text-xs font-mono text-slate-800 break-all">{value}</code>
                  </div>
                  <button
                    onClick={() => copyText(value, key)}
                    className="shrink-0 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {copied === key
                      ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                      : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              ))}
              <p className="text-[10px] text-slate-400 mt-1">
                Share these credentials with the event manager. They can log in at{" "}
                <code className="font-mono">/auth/login</code>.
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-slate-500 mb-3">No event manager assigned yet.</p>
              <button
                onClick={handleGenerateEM}
                disabled={emGenerating}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${emGenerating ? "animate-spin" : ""}`} />
                {emGenerating ? "Generating..." : "Generate Event Manager ID"}
              </button>
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
            {error}
          </p>
        )}

      </div>
    </div>
  );
}
