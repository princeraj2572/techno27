export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getRegisteredEventsAction } from "@/actions/event-actions";
import { getParticipatingTeams, getInvitedTeams } from "@/actions/team-actions";
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

// Status colors — shared across both roles
const STATUS_BORDER: Record<string, string> = {
  REGISTRATION_OPEN:   "border-l-emerald-500",
  EVENT_LIVE:          "border-l-blue-500",
  COMPLETED:           "border-l-slate-300",
  CANCELLED:           "border-l-red-400",
  REGISTRATION_CLOSED: "border-l-amber-400",
  TEMPORARILY_CLOSED:  "border-l-orange-400",
};
const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-600" },
  EVENT_LIVE:          { text: "Live now",   color: "text-blue-600"   },
  COMPLETED:           { text: "Completed",  color: "text-slate-400"  },
  CANCELLED:           { text: "Cancelled",  color: "text-red-500"    },
  REGISTRATION_CLOSED: { text: "Closed",     color: "text-amber-600"  },
  TEMPORARILY_CLOSED:  { text: "Paused",     color: "text-orange-500" },
};

// ── Role-based theme tokens ──────────────────────────────────────────────────
type Theme = {
  heroBg:        string; // stat card hero bg
  heroText:      string; // stat card hero label
  heroSub:       string; // stat card hero sublabel
  lightBg:       string; // stat card secondary bg
  lightText:     string; // stat card secondary count
  lightSub:      string; // stat card secondary sublabel
  lightLabel:    string; // stat card secondary label
  avatarBg:      string; // initials avatar bg
  accent:        string; // links, "Browse all", arrows
  accentHover:   string;
  idCardBg:      string; // participant ID / enrollment card bg
  idCardLabel:   string;
  idCardSub:     string;
  quickBtn:      string; // quick action button border+text+hover
  profileBadge:  string; // role badge bg + text
  pendingBtn:    string; // pending invites review button
};

function getTheme(role: string): Theme {
  if (role === "EXTERNAL_USER") {
    return {
      heroBg:       "bg-violet-600 hover:bg-violet-700",
      heroText:     "text-violet-200",
      heroSub:      "text-violet-300",
      lightBg:      "bg-violet-50 hover:bg-violet-100",
      lightText:    "text-violet-900",
      lightSub:     "text-violet-400",
      lightLabel:   "text-violet-400",
      avatarBg:     "bg-violet-600",
      accent:       "text-violet-600",
      accentHover:  "hover:text-violet-700",
      idCardBg:     "bg-violet-600",
      idCardLabel:  "text-violet-300",
      idCardSub:    "text-violet-300",
      quickBtn:     "border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300",
      profileBadge: "bg-violet-100 text-violet-700",
      pendingBtn:   "border-amber-300 text-amber-800 hover:bg-amber-100",
    };
  }
  // INTERNAL_USER — sky theme
  return {
    heroBg:       "bg-sky-600 hover:bg-sky-700",
    heroText:     "text-sky-200",
    heroSub:      "text-sky-300",
    lightBg:      "bg-sky-50 hover:bg-sky-100",
    lightText:    "text-sky-900",
    lightSub:     "text-sky-400",
    lightLabel:   "text-sky-400",
    avatarBg:     "bg-sky-600",
    accent:       "text-sky-600",
    accentHover:  "hover:text-sky-700",
    idCardBg:     "bg-sky-600",
    idCardLabel:  "text-sky-300",
    idCardSub:    "text-sky-300",
    quickBtn:     "border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300",
    profileBadge: "bg-sky-100 text-sky-700",
    pendingBtn:   "border-amber-300 text-amber-800 hover:bg-amber-100",
  };
}

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
  const isExt        = user.role === "EXTERNAL_USER";
  const t            = getTheme(user.role);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* ── 1. GREETING ─────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">{greeting()}</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{firstName}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Technorollix 2027 ·{" "}
              <span className={`font-semibold ${t.accent}`}>
                {isExt ? "External Participant" : "OPJU Student"}
              </span>
            </p>
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
            <div className={`w-11 h-11 rounded-full ${t.avatarBg} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
              {firstName[0]?.toUpperCase()}
            </div>
          )}
        </div>

        {/* ── 2. PENDING INVITATIONS BANNER ───────────────────── */}
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
            <Link
              href="/team-details"
              className={`shrink-0 text-xs font-semibold border px-3 py-1.5 rounded-lg transition-colors ${t.pendingBtn}`}
            >
              Review
            </Link>
          </div>
        )}

        {/* ── 3. STAT CARDS ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.08s" }}>
          {/* Events — primary */}
          <Link href="/events-selection" className="group">
            <div className={`${t.heroBg} transition-colors rounded-2xl p-4 h-full`}>
              <p className={`text-xs font-medium ${t.heroText} mb-3`}>Events</p>
              <p className="text-4xl font-bold text-white tabular-nums leading-none">{eventCount}</p>
              <p className={`text-xs ${t.heroSub} mt-2`}>registered</p>
            </div>
          </Link>

          {/* Teams — light */}
          <Link href="/team-details" className="group">
            <div className={`${t.lightBg} transition-colors rounded-2xl p-4 h-full`}>
              <p className={`text-xs font-medium ${t.lightLabel} mb-3`}>Teams</p>
              <p className={`text-4xl font-bold ${t.lightText} tabular-nums leading-none`}>{teamCount}</p>
              <p className={`text-xs ${t.lightSub} mt-2`}>joined</p>
            </div>
          </Link>

          {/* Invites — amber if pending, slate if zero */}
          <Link href="/team-details" className="group">
            {pendingCount > 0 ? (
              <div className="bg-amber-500 hover:bg-amber-600 transition-colors rounded-2xl p-4 h-full">
                <p className="text-xs font-medium text-amber-100 mb-3">Invites</p>
                <p className="text-4xl font-bold text-white tabular-nums leading-none">{pendingCount}</p>
                <p className="text-xs text-amber-200 mt-2">pending</p>
              </div>
            ) : (
              <div className="bg-slate-100 hover:bg-slate-200 transition-colors rounded-2xl p-4 h-full">
                <p className="text-xs font-medium text-slate-400 mb-3">Invites</p>
                <p className="text-4xl font-bold text-slate-700 tabular-nums leading-none">{pendingCount}</p>
                <p className="text-xs text-slate-400 mt-2">pending</p>
              </div>
            )}
          </Link>
        </div>

        {/* ── 4. QUICK ACTIONS ────────────────────────────────── */}
        <div className="animate-slide-up" style={{ animationDelay: "0.12s" }}>
          <p className="text-xs text-slate-400 font-medium mb-3">Quick actions</p>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/events-selection", icon: Calendar,     label: "Browse events" },
              { href: "/team-details",     icon: Users,        label: "My teams"      },
              { href: "/dashboard/qr",     icon: QrCode,       label: "My QR"         },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-1.5 text-xs font-medium border rounded-lg px-3 py-2 transition-colors ${t.quickBtn}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
            {isExt && (
              <>
                <Link
                  href="/dashboard/payment"
                  className={`inline-flex items-center gap-1.5 text-xs font-medium border rounded-lg px-3 py-2 transition-colors ${t.quickBtn}`}
                >
                  <Trophy className="h-3.5 w-3.5" />
                  Payments
                </Link>
                <Link
                  href="/dashboard/accommodation"
                  className={`inline-flex items-center gap-1.5 text-xs font-medium border rounded-lg px-3 py-2 transition-colors ${t.quickBtn}`}
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  Accommodation
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ── 5. PROFILE CARD ─────────────────────────────────── */}
        <div
          className="bg-white border border-slate-100 rounded-2xl px-5 py-4 animate-slide-up"
          style={{ animationDelay: "0.16s" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-full ${t.avatarBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {firstName[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-slate-900 truncate">{user.fullName}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.profileBadge}`}>
                  {isExt ? "External" : "OPJU"}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
              {!isExt && user.department && (
                <p className="text-xs text-slate-400">
                  {[user.department, user.program, user.branch, user.year && `${user.year} Year`]
                    .filter(Boolean).join(" · ")}
                </p>
              )}
              {isExt && (user as Record<string, unknown>).collegeName && (
                <p className="text-xs text-slate-400">
                  {[(user as Record<string, unknown>).collegeName as string,
                    (user as Record<string, unknown>).city  as string,
                    (user as Record<string, unknown>).state as string]
                    .filter(Boolean).join(", ")}
                </p>
              )}
            </div>
            {(user.enrollmentNumber || user.participantId) && (
              <code className={`text-xs px-2 py-1 rounded-lg shrink-0 border ${t.lightBg} ${t.lightText} ${t.lightSub} border-transparent`}>
                {user.enrollmentNumber ?? user.participantId}
              </code>
            )}
          </div>
        </div>

        {/* ── 6. PARTICIPANT / ENROLLMENT ID CARD ─────────────── */}
        {(isExt ? user.participantId : user.enrollmentNumber) && (
          <div
            className={`${t.idCardBg} rounded-2xl px-5 py-4 animate-slide-up`}
            style={{ animationDelay: "0.18s" }}
          >
            <p className={`text-xs ${t.idCardLabel} mb-1`}>
              {isExt ? "Participant ID" : "Enrollment Number"}
            </p>
            <code className="text-xl font-bold text-white font-mono tracking-wide">
              {isExt ? user.participantId : user.enrollmentNumber}
            </code>
            <p className={`text-xs ${t.idCardSub} mt-1.5`}>
              {isExt
                ? "Show this at the entrance check-in counter"
                : "Your OPJU enrollment number"}
            </p>
          </div>
        )}

        {/* ── 7. REGISTERED EVENTS ────────────────────────────── */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-900">Registered events</p>
            <Link href="/events-selection" className={`text-xs font-medium ${t.accent} ${t.accentHover} transition-colors`}>
              Browse all
            </Link>
          </div>

          {eventCount === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No events yet</p>
              <Link href="/events-selection" className={`text-xs ${t.accent} hover:underline mt-1 block`}>
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
                        <p className="text-sm font-semibold text-slate-900 truncate">{event.name}</p>
                        {event.category && (
                          <p className="text-xs text-slate-400 mt-0.5">{event.category}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-medium ${label.color}`}>{label.text}</span>
                        <span className={`text-xs font-semibold ${t.accent}`}>Team →</span>
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
