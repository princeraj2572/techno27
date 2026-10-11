export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getRegisteredEventsAction } from "@/actions/event-actions";
import { getPaymentSummaryForUser } from "@/actions/payment-actions";
import { getParticipatingTeams, getInvitedTeams } from "@/actions/team-actions";
import {
  AlertCircle, AlertTriangle, Calendar, Users, CalendarDays, Trophy, QrCode,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Crumbs, BackButton } from "@/components/app-shell";
import { Band, CARD, Marquee, PageShell, display, serif } from "@/components/indie";

function greeting() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 22) return "Good evening";
  return "Hello";
}

// Status colours, tuned for cream paper cards
const STATUS_BORDER: Record<string, string> = {
  REGISTRATION_OPEN:   "border-l-[#1f8a3a]",
  EVENT_LIVE:          "border-l-[#0b2a6b]",
  COMPLETED:           "border-l-black/30",
  CANCELLED:           "border-l-[#a1001a]",
  REGISTRATION_CLOSED: "border-l-[#e8851a]",
  TEMPORARILY_CLOSED:  "border-l-[#ff6a00]",
};
const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-[#1f8a3a]" },
  EVENT_LIVE:          { text: "Live now",  color: "text-[#0b2a6b]" },
  COMPLETED:           { text: "Completed", color: "text-black/45"  },
  CANCELLED:           { text: "Cancelled", color: "text-[#a1001a]" },
  REGISTRATION_CLOSED: { text: "Closed",    color: "text-[#b4630b]" },
  TEMPORARILY_CLOSED:  { text: "Paused",    color: "text-[#c8421f]" },
};

const QUICK_BTN =
  "inline-flex items-center gap-2 border-2 border-black bg-[#f5c928] px-3 py-2 text-sm font-bold uppercase tracking-wider text-black shadow-[3px_3px_0_0_#000] transition hover:-translate-y-0.5 hover:bg-[#ff6a00]";

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

  // External participants who owe a fee but haven't submitted a transaction ID yet
  const payment = user.role === "EXTERNAL_USER"
    ? await getPaymentSummaryForUser(user.email).catch(() => null)
    : null;
  const needsPayment =
    !!payment && payment.eventRows.length > 0 && !payment.payClearance && payment.transactions.length === 0;

  const events  = registeredEvents as Array<{ _id: string; name: string; status: string; category?: string }>;
  const pending = (allInvitations  as Array<{ status: string }>).filter(i => i.status === "PENDING");

  const eventCount   = events.length;
  const teamCount    = (teams as unknown[]).length;
  const pendingCount = pending.length;
  const firstName    = user.fullName.split(" ")[0];
  const isExt        = user.role === "EXTERNAL_USER";

  const stats = [
    { href: "/events-selection", label: "Events",  count: eventCount,   sub: "registered", bg: "bg-[#f5c928]" },
    { href: "/team-details",     label: "Teams",   count: teamCount,    sub: "joined",     bg: "bg-[#ffb10f]" },
    { href: "/team-details",     label: "Invites", count: pendingCount, sub: "pending",    bg: pendingCount > 0 ? "bg-[#ff6a00]" : "bg-[#f5edd8]" },
  ];

  return (
    <PageShell>
      {/* Greeting */}
      <Band tone="crimson" mandala ghost="Dashboard" className="!py-8 sm:!py-10">
        <Crumbs items={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c928]">{greeting()}</p>
            <h1
              className={`mt-2 truncate text-5xl leading-[0.95] sm:text-7xl indie-outline ${serif.className}`}
            >
              {firstName}
            </h1>
            <p className="mt-3 text-lg font-bold uppercase text-[#f5edd8]">
              Techno-aiMBiAtion 2027 ·{" "}
              <span className="text-[#f5c928]">{isExt ? "External Participant" : "OPJU Student"}</span>
            </p>
            <BackButton href="/" label="Back to home" className="mt-5" />
          </div>
          {user.profilePhotoUrl ? (
            <Image
              src={user.profilePhotoUrl}
              alt={user.fullName}
              width={88}
              height={88}
              className="h-20 w-20 shrink-0 border-2 border-black object-cover shadow-[4px_4px_0_0_#000] sm:h-24 sm:w-24"
            />
          ) : (
            <div className={`flex h-20 w-20 shrink-0 items-center justify-center border-2 border-black bg-[#f5c928] text-4xl text-black shadow-[4px_4px_0_0_#000] sm:h-24 sm:w-24 ${display.className}`}>
              {firstName[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </Band>

      <Marquee
        className="-rotate-1 bg-[#ff6a00] py-1.5 text-xl font-bold uppercase tracking-wider text-black"
        text="Your pass ✦ Your events ✦ Your team ✦ "
        speed={60}
      />

      <Band tone="maroon" className="!py-10">
        <div className="mx-auto max-w-2xl space-y-8">

          {/* Payment reminder */}
          {needsPayment && payment && (
            <div role="alert" className="border-2 border-black bg-[#f5c928] px-5 py-4 text-black shadow-[6px_6px_0_0_#000]">
              <div className="flex items-start gap-3">
                <AlertTriangle className="indie-blink mt-0.5 h-7 w-7 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className={`text-2xl leading-tight ${display.className}`}>Payment pending</p>
                  <p className="mt-1 text-lg leading-snug">
                    You haven&apos;t submitted your transaction ID yet. Pay <strong>₹{payment.remaining || payment.payableAmount}</strong> and
                    submit the ID to confirm your registration.
                  </p>
                  <Link
                    href="/dashboard/payment"
                    className="mt-3 inline-flex items-center gap-2 border-2 border-black bg-black px-4 py-2 text-base font-bold uppercase tracking-wider text-white transition hover:bg-[#ff6a00] hover:text-black"
                  >
                    Pay &amp; submit transaction ID →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Pending invitations */}
          {pendingCount > 0 && (
            <div className={`flex items-start gap-3 px-4 py-3.5 ${CARD}`}>
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#c8421f]" />
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold uppercase leading-tight">
                  {pendingCount} pending invitation{pendingCount > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-black/65">Respond before the team registration deadline.</p>
              </div>
              <Link
                href="/team-details"
                className="shrink-0 border-2 border-black bg-black px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#f5c928] hover:text-black"
              >
                Review
              </Link>
            </div>
          )}

          {/* Stat stamps */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {stats.map((s) => (
              <Link key={s.label} href={s.href} className="group">
                <div className={`${s.bg} h-full border-2 border-black p-3 text-black shadow-[4px_4px_0_0_#000] transition group-hover:-translate-y-1 sm:p-4`}>
                  <p className="text-sm font-bold uppercase tracking-widest">{s.label}</p>
                  <p className={`mt-2 text-5xl leading-none tabular-nums sm:text-6xl ${display.className}`}>{s.count}</p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-black/60">{s.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick actions */}
          <div>
            <p className={`mb-3 text-2xl text-[#f5edd8] ${display.className}`} style={{ textShadow: "3px 3px 0 #7a1c1c" }}>
              Quick actions
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "/events-selection", icon: Calendar, label: "Browse events" },
                { href: "/team-details",     icon: Users,    label: "My teams"      },
                { href: "/dashboard/qr",     icon: QrCode,   label: "My QR"         },
              ].map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href} className={QUICK_BTN}>
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              {isExt && (
                <>
                  <Link href="/dashboard/payment" className={QUICK_BTN}>
                    <Trophy className="h-4 w-4" />
                    Payments
                  </Link>
                  <Link href="/dashboard/accommodation" className={QUICK_BTN}>
                    <CalendarDays className="h-4 w-4" />
                    Accommodation
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Profile card */}
          <div className={`px-5 py-4 ${CARD}`}>
            <div className="flex min-w-0 items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-[#7a1c1c] text-lg text-[#f5edd8] ${display.className}`}>
                {firstName[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-xl font-bold uppercase leading-tight">{user.fullName}</span>
                  <span className="bg-[#7a1c1c] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#f5edd8]">
                    {isExt ? "External" : "OPJU"}
                  </span>
                </div>
                <p className="truncate text-sm text-black/60">{user.email}</p>
                {!isExt && user.department && (
                  <p className="text-sm text-black/60">
                    {[user.department, user.program, user.branch, user.year && `${user.year} Year`]
                      .filter(Boolean).join(" · ")}
                  </p>
                )}
                {isExt && user.collegeName && (
                  <p className="text-sm text-black/60">
                    {[user.collegeName, user.city, user.state].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Participant / enrollment ticket */}
          {(isExt ? user.participantId : user.enrollmentNumber) && (
            <div className="relative overflow-hidden rounded-2xl border-2 border-black bg-[#f5c928] text-black shadow-[6px_6px_0_0_#000]">
              <span aria-hidden className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-black bg-[#4a0e0e]" />
              <span aria-hidden className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-black bg-[#4a0e0e]" />
              <div className="px-8 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-70">
                  Admit one · {isExt ? "Participant ID" : "Enrollment Number"}
                </p>
                <code className={`mt-1 block text-3xl tracking-wide ${display.className}`}>
                  {isExt ? user.participantId : user.enrollmentNumber}
                </code>
                <p className="mt-1.5 text-sm font-semibold uppercase tracking-wider text-black/70">
                  {isExt ? "Show this at the entrance check-in counter" : "Your OPJU enrollment number"}
                </p>
              </div>
            </div>
          )}

          {/* Registered events */}
          <div>
            <div className="mb-3 flex items-end justify-between">
              <p className={`text-2xl text-[#f5edd8] ${display.className}`} style={{ textShadow: "3px 3px 0 #7a1c1c" }}>
                Registered events
              </p>
              <Link href="/events-selection" className="text-sm font-bold uppercase tracking-widest text-[#f5c928] underline-offset-4 hover:underline">
                Browse all
              </Link>
            </div>

            {eventCount === 0 ? (
              <div className="border-2 border-dashed border-[#f5edd8]/40 py-12 text-center">
                <CalendarDays className="mx-auto mb-3 h-9 w-9 text-[#f5c928]" />
                <p className="text-xl font-bold uppercase text-[#f5edd8]">No events yet</p>
                <Link href="/events-selection" className="mt-1 block text-sm font-semibold uppercase tracking-wider text-[#f5c928] hover:underline">
                  Register for your first event
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event) => {
                  const border = STATUS_BORDER[event.status] ?? "border-l-black/20";
                  const label  = STATUS_LABEL[event.status]  ?? { text: event.status.replace(/_/g, " "), color: "text-black/45" };
                  return (
                    <Link
                      key={event._id}
                      href={`/team-details?event=${event._id}`}
                      className={`block border-l-8 px-4 py-3.5 transition hover:-translate-y-0.5 ${CARD} ${border}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-xl font-bold uppercase leading-tight">{event.name}</p>
                          {event.category && <p className="text-sm text-black/55">{event.category}</p>}
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className={`text-sm font-bold uppercase tracking-wider ${label.color}`}>{label.text}</span>
                          <span className="text-sm font-bold uppercase tracking-wider text-[#7a1c1c]">Team →</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </Band>
    </PageShell>
  );
}
