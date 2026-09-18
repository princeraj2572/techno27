export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getRegisteredEventsAction } from "@/actions/event-actions";
import { getParticipatingTeams, getInvitedTeams } from "@/actions/team-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, Users, Mail, ArrowRight, CalendarDays, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 22) return "Good evening";
  return "Hello";
}

const STATUS_COLOR: Record<string, { bg: string; text: string; dot: string }> = {
  REGISTRATION_OPEN:   { bg: "bg-green-500/10",  text: "text-green-400",  dot: "bg-green-400" },
  EVENT_LIVE:          { bg: "bg-primary/10",     text: "text-primary",    dot: "bg-primary" },
  COMPLETED:           { bg: "bg-muted/50",       text: "text-muted-foreground", dot: "bg-muted-foreground" },
  CANCELLED:           { bg: "bg-destructive/10", text: "text-destructive", dot: "bg-destructive" },
  REGISTRATION_CLOSED: { bg: "bg-amber-500/10",   text: "text-amber-400",  dot: "bg-amber-400" },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_COLOR[status] ?? { bg: "bg-muted/50", text: "text-muted-foreground", dot: "bg-muted-foreground" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status.replace(/_/g, " ")}
    </span>
  );
}

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");
  if (!["INTERNAL_USER", "EXTERNAL_USER"].includes(user.role)) {
    if (user.role === "DEV_ADMIN") redirect("/dev");
    if (user.role === "MANAGEMENT_ADMIN") redirect("/admin");
    if (user.role === "EVENT_MANAGER") redirect("/event-manager");
  }

  const [registeredEvents, teams, allInvitations] = await Promise.all([
    getRegisteredEventsAction(user.email).catch(() => []),
    getParticipatingTeams().catch(() => []),
    getInvitedTeams().catch(() => []),
  ]);

  const pendingInvitations = (allInvitations as Array<{ status: string }>).filter(
    (i) => i.status === "PENDING"
  );

  const greeting = getGreeting();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

      {/* Greeting */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {greeting}, {user.fullName.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Here&apos;s your Technorollix 2027 overview.
          </p>
        </div>
        <div className="shrink-0">
          {user.profilePhotoUrl ? (
            <Image
              src={user.profilePhotoUrl}
              alt={user.fullName}
              width={48}
              height={48}
              className="rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold">
              {user.fullName[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Action required */}
      {pendingInvitations.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
          <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-amber-300">Action required</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              You have {pendingInvitations.length} pending team invitation{pendingInvitations.length > 1 ? "s" : ""} waiting for your response.
            </p>
          </div>
          <Link
            href="/team-details"
            className="shrink-0 text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
          >
            Review <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Link href="/events-selection">
          <Card className="hover:border-primary/40 transition-colors group">
            <CardContent className="pt-5 pb-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs text-muted-foreground">Events</span>
              </div>
              <div className="text-2xl font-bold tabular-nums">{(registeredEvents as unknown[]).length}</div>
              <p className="text-xs text-muted-foreground mt-0.5">registered</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/team-details">
          <Card className="hover:border-primary/40 transition-colors group">
            <CardContent className="pt-5 pb-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs text-muted-foreground">Teams</span>
              </div>
              <div className="text-2xl font-bold tabular-nums">{(teams as unknown[]).length}</div>
              <p className="text-xs text-muted-foreground mt-0.5">joined</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/team-details">
          <Card className={`hover:border-primary/40 transition-colors group ${pendingInvitations.length > 0 ? "border-amber-500/30" : ""}`}>
            <CardContent className="pt-5 pb-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <Mail className={`h-4 w-4 transition-colors ${pendingInvitations.length > 0 ? "text-amber-400" : "text-muted-foreground group-hover:text-primary"}`} />
                <span className="text-xs text-muted-foreground">Invites</span>
              </div>
              <div className={`text-2xl font-bold tabular-nums ${pendingInvitations.length > 0 ? "text-amber-400" : ""}`}>
                {pendingInvitations.length}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">pending</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Quick actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/events-selection">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="pt-4 pb-4 text-center">
                <Calendar className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="text-sm font-medium">Browse Events</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/team-details">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="pt-4 pb-4 text-center">
                <Users className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="text-sm font-medium">My Teams</div>
              </CardContent>
            </Card>
          </Link>
          {user.role === "EXTERNAL_USER" && (
            <>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group opacity-60">
                <CardContent className="pt-4 pb-4 text-center">
                  <Trophy className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
                  <div className="text-sm font-medium">Payments</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Coming soon</div>
                </CardContent>
              </Card>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group opacity-60">
                <CardContent className="pt-4 pb-4 text-center">
                  <Calendar className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
                  <div className="text-sm font-medium">Accommodation</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Coming soon</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Profile summary */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm truncate">{user.fullName}</span>
                <Badge variant={user.role === "INTERNAL_USER" ? "default" : "secondary"} className="text-xs">
                  {user.role === "INTERNAL_USER" ? "OPJU Student" : "External Participant"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                {user.department} · {user.program} · {user.branch} · {user.year} Year
              </p>
            </div>
            {(user.role === "EXTERNAL_USER" && user.participantId) ? (
              <span className="text-xs font-mono bg-muted/60 px-2 py-1 rounded shrink-0">
                {user.participantId}
              </span>
            ) : (user.role === "INTERNAL_USER" && user.enrollmentNumber) ? (
              <span className="text-xs font-mono bg-muted/60 px-2 py-1 rounded shrink-0">
                {user.enrollmentNumber}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Registered events */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Registered Events</h2>
          <Link href="/events-selection" className="text-xs text-primary hover:underline">
            Browse all →
          </Link>
        </div>

        {(registeredEvents as unknown[]).length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm font-medium text-muted-foreground">No events registered yet.</p>
              <Link href="/events-selection" className="text-sm text-primary hover:underline mt-2 block">
                Browse and register for events →
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(registeredEvents as Array<{ _id: string; name: string; status: string; category?: string }>).map((event) => (
              <Card key={event._id} className="hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-medium leading-snug">{event.name}</CardTitle>
                    <StatusPill status={event.status} />
                  </div>
                  {event.category && (
                    <p className="text-xs text-muted-foreground">{event.category}</p>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
