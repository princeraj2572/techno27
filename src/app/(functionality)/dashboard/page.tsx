export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getRegisteredEventsAction } from "@/actions/event-actions";
import { getParticipatingTeams, getInvitedTeams } from "@/actions/team-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle, Calendar, Users, CalendarDays, Trophy, QrCode,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function greeting() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 22) return "Good evening";
  return "Hello";
}

const STATUS_BORDER: Record<string, string> = {
  REGISTRATION_OPEN:   "border-l-emerald-500",
  EVENT_LIVE:          "border-l-indigo-500",
  COMPLETED:           "border-l-slate-300",
  CANCELLED:           "border-l-red-400",
  REGISTRATION_CLOSED: "border-l-amber-400",
  TEMPORARILY_CLOSED:  "border-l-orange-400",
};

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  REGISTRATION_OPEN:   { text: "Open",        color: "text-emerald-600" },
  EVENT_LIVE:          { text: "Live now",     color: "text-indigo-600" },
  COMPLETED:           { text: "Completed",    color: "text-slate-400" },
  CANCELLED:           { text: "Cancelled",    color: "text-red-500" },
  REGISTRATION_CLOSED: { text: "Closed",       color: "text-amber-600" },
  TEMPORARILY_CLOSED:  { text: "Paused",       color: "text-orange-500" },
};

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");
  if (!["INTERNAL_USER", "EXTERNAL_USER"].includes(user.role)) {
    if (user.role === "DEV_ADMIN")        redirect("/dev");
    if (user.role === "MANAGEMENT_ADMIN") redirect("/admin");
    if (user.role === "EVENT_MANAGER")    redirect("/event-manager");
  }

  const [registeredEvents, teams, allInvitations] = await Promise.all([
    getRegisteredEventsAction(user.email).catch(() => []),
    getParticipatingTeams().catch(() => []),
    getInvitedTeams().catch(() => []),
  ]);

  const events  = registeredEvents as Array<{ _id: string; name: string; status: string; category?: string }>;
  const pending = (allInvitations  as Array<{ status: string }>).filter(i => i.status === "PENDING");

  const eventCount   = events.length;
  const teamCount    = (teams as unknown[]).length;
  const pendingCount = pending.length;
  const firstName    = user.fullName.split(" ")[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-7">

        {/* ── Greeting ────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between gap-4 animate-slide-up"
          style={{ animationDelay: "0s" }}
        >
          <div>
            <p className="text-sm text-slate-400 mb-0.5">{greeting()}</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {firstName}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Technorollix 2027</p>
          </div>
          {user.profilePhotoUrl ? (
            <Image
              src={user.profilePhotoUrl}
              alt={user.fullName}
              width={44}
              height={44}
              className="rounded-full object-cover ring-2 ring-slate-100 shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {firstName[0]?.toUpperCase()}
            </div>
          )}
        </div>

        {/* ── Pending banner ──────────────────────────────────── */}
        {pendingCount > 0 && (
          <div
            className="flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3.5 animate-slide-up"
            style={{ animationDelay: "0.04s" }}
          >
            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900">
                {pendingCount} pending invitation{pendingCount > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Respond before the team registration deadline.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 border-amber-300 text-amber-800 hover:bg-amber-100 text-xs"
              asChild
            >
              <Link href="/team-details">Review</Link>
            </Button>
          </div>
        )}

        {/* ── Stats ── three colored cards ───────────────────── */}
        <div
          className="grid grid-cols-3 gap-3 animate-slide-up"
          style={{ animationDelay: "0.08s" }}
        >
          {/* Events — primary indigo */}
          <Link href="/events-selection" className="group">
            <div className="bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-2xl p-4 h-full">
              <p className="text-xs font-medium text-indigo-200 mb-3">Events</p>
              <p className="text-4xl font-bold text-white tabular-nums leading-none">
                {eventCount}
              </p>
              <p className="text-xs text-indigo-300 mt-2">registered</p>
            </div>
          </Link>

          {/* Teams — light indigo */}
          <Link href="/team-details" className="group">
            <div className="bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-2xl p-4 h-full">
              <p className="text-xs font-medium text-indigo-400 mb-3">Teams</p>
              <p className="text-4xl font-bold text-indigo-900 tabular-nums leading-none">
                {teamCount}
              </p>
              <p className="text-xs text-indigo-400 mt-2">joined</p>
            </div>
          </Link>

          {/* Invites — amber if pending, slate if zero */}
          <Link href="/team-details" className="group">
            {pendingCount > 0 ? (
              <div className="bg-amber-500 hover:bg-amber-600 transition-colors rounded-2xl p-4 h-full">
                <p className="text-xs font-medium text-amber-100 mb-3">Invites</p>
                <p className="text-4xl font-bold text-white tabular-nums leading-none">
                  {pendingCount}
                </p>
                <p className="text-xs text-amber-200 mt-2">pending</p>
              </div>
            ) : (
              <div className="bg-slate-100 hover:bg-slate-200 transition-colors rounded-2xl p-4 h-full">
                <p className="text-xs font-medium text-slate-400 mb-3">Invites</p>
                <p className="text-4xl font-bold text-slate-700 tabular-nums leading-none">
                  {pendingCount}
                </p>
                <p className="text-xs text-slate-400 mt-2">pending</p>
              </div>
            )}
          </Link>
        </div>

        {/* ── Quick actions ───────────────────────────────────── */}
        <div
          className="animate-slide-up"
          style={{ animationDelay: "0.12s" }}
        >
          <p className="text-xs text-slate-400 font-medium mb-3 tracking-wide">Quick actions</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href="/events-selection">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Browse events
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/team-details">
                <Users className="h-3.5 w-3.5 mr-1.5" />
                My teams
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/dashboard/qr">
                <QrCode className="h-3.5 w-3.5 mr-1.5" />
                My QR
              </Link>
            </Button>
            {user.role === "EXTERNAL_USER" && (
              <>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/payment">
                    <Trophy className="h-3.5 w-3.5 mr-1.5" />
                    Payments
                  </Link>
                </Button>
                <Button size="sm" variant="outline" disabled>
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                  Accommodation
                  <Badge variant="secondary" className="ml-1.5 text-[10px] px-1 py-0 font-normal">
                    soon
                  </Badge>
                </Button>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* ── Profile ─────────────────────────────────────────── */}
        <Card
          className="shadow-none border-slate-100 animate-slide-up"
          style={{ animationDelay: "0.16s" }}
        >
          <CardContent className="px-5 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {firstName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-900 truncate">
                    {user.fullName}
                  </span>
                  <Badge
                    variant={user.role === "INTERNAL_USER" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {user.role === "INTERNAL_USER" ? "OPJU" : "External"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                {user.role === "INTERNAL_USER" && user.department && (
                  <p className="text-xs text-slate-400">
                    {[user.department, user.program, user.branch, user.year && `${user.year} Year`]
                      .filter(Boolean).join(" · ")}
                  </p>
                )}
                {user.role === "EXTERNAL_USER" && (user as Record<string, unknown>).collegeName && (
                  <p className="text-xs text-slate-400">
                    {[(user as Record<string, unknown>).collegeName as string, (user as Record<string, unknown>).city as string, (user as Record<string, unknown>).state as string]
                      .filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
              {(user.enrollmentNumber || user.participantId) && (
                <code className="text-xs bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg shrink-0 text-slate-500">
                  {user.enrollmentNumber ?? user.participantId}
                </code>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── External: participant ID card ──────────────────── */}
        {user.role === "EXTERNAL_USER" && user.participantId && (
          <div
            className="bg-indigo-600 rounded-2xl px-5 py-4 animate-slide-up"
            style={{ animationDelay: "0.18s" }}
          >
            <p className="text-xs text-indigo-300 mb-1">Participant ID</p>
            <code className="text-xl font-bold text-white font-mono tracking-wide">
              {user.participantId}
            </code>
            <p className="text-xs text-indigo-300 mt-1.5">
              Show this at the entrance check-in counter
            </p>
          </div>
        )}

        {/* ── Registered events ───────────────────────────────── */}
        <div
          className="animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-900">Registered events</p>
            <Link
              href="/events-selection"
              className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
            >
              Browse all
            </Link>
          </div>

          {eventCount === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No events yet</p>
              <Link
                href="/events-selection"
                className="text-xs text-indigo-600 hover:underline mt-1 block"
              >
                Register for your first event
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((event) => {
                const border = STATUS_BORDER[event.status] ?? "border-l-slate-200";
                const label  = STATUS_LABEL[event.status]  ?? { text: event.status.replace(/_/g, " "), color: "text-slate-400" };
                return (
                  <Link
                    key={event._id}
                    href={`/team-details?event=${event._id}`}
                    className={`block bg-white border border-slate-100 border-l-4 ${border} rounded-xl px-4 py-3.5 hover:bg-slate-50 transition-colors`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {event.name}
                        </p>
                        {event.category && (
                          <p className="text-xs text-slate-400 mt-0.5">{event.category}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-medium ${label.color}`}>
                          {label.text}
                        </span>
                        <span className="text-xs text-indigo-500 font-medium">Team →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
