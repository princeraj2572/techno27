export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/features/users/user-actions";
import { getRegisteredEventsAction } from "@/features/events/event-actions";
import { getPaymentSummaryForUser } from "@/features/payments/payment-actions";
import { getParticipatingTeams, getInvitedTeams } from "@/features/teams/team-actions";
import { AlertCircle, AlertTriangle, ArrowRight, CalendarDays, QrCode, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { display } from "@/components/indie";
import { mono, sans } from "@/components/home/fonts";
import { FestLogo, GoldBackdrop, INK, TicketTitle } from "@/components/indie/gold-poster";

function greeting() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 22) return "Good evening";
  return "Hello";
}

// Event status, shown on each ticket's ink stub
const STATUS_LABEL: Record<string, { text: string; dot: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      dot: "bg-[#3ddc84]" },
  EVENT_LIVE:          { text: "Live now",  dot: "bg-[#5aa9ff]" },
  COMPLETED:           { text: "Completed", dot: "bg-white/40"  },
  CANCELLED:           { text: "Cancelled", dot: "bg-[#ff4d5e]" },
  REGISTRATION_CLOSED: { text: "Closed",    dot: "bg-[#ffb000]" },
  TEMPORARILY_CLOSED:  { text: "Paused",    dot: "bg-[#ff8a3d]" },
};

const CARD_LINE = { borderColor: INK, boxShadow: `0 4px 0 ${INK}` };

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

  const passId = isExt ? user.participantId : user.enrollmentNumber;
  const stats = [
    { href: "/events-selection", label: "Events",  count: eventCount,   sub: "registered", dot: "bg-[#0e5b57]" },
    { href: "/team-details",     label: "Teams",   count: teamCount,    sub: "joined",     dot: "bg-[#f5c928]" },
    { href: "/team-details",     label: "Invites", count: pendingCount, sub: "pending",    dot: pendingCount > 0 ? "bg-[#ef5a1c] animate-pulse" : "bg-[#ef5a1c]" },
  ];

  return (
    <div className={`mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 ${sans.className}`}>
      {/* Gold welcome banner */}
      <div className="relative overflow-hidden rounded-3xl border-[3px] px-5 py-6 sm:px-8 sm:py-8" style={{ borderColor: INK, boxShadow: `0 5px 0 ${INK}` }}>
        <GoldBackdrop at="90% 130%" sparkles={false} />
        <div className="relative flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] sm:text-sm" style={{ color: INK }}>{greeting()},</p>
            <TicketTitle className="truncate text-5xl leading-[1.05] sm:text-6xl">{firstName}</TicketTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border-2 bg-[#ef5a1c] px-3 py-1 text-[10px] font-extrabold uppercase text-white sm:text-xs" style={{ borderColor: INK }}>
                {isExt ? "External participant" : "OPJU student"}
              </span>
              {passId && (
                <span className={`rounded-full border-2 px-3 py-1 text-[10px] font-bold text-[#f3e8cf] sm:text-xs ${mono.className}`} style={{ borderColor: INK, background: INK }}>{passId}</span>
              )}
            </div>
          </div>
          {user.profilePhotoUrl ? (
            <Image
              src={user.profilePhotoUrl}
              alt={user.fullName}
              width={88}
              height={88}
              className="h-20 w-20 shrink-0 rounded-2xl border-[3px] object-cover sm:h-24 sm:w-24"
              style={{ borderColor: INK, boxShadow: `0 4px 0 ${INK}` }}
              unoptimized // uploads are added after the build, so load them directly (Nginx serves /uploads)
            />
          ) : (
            <FestLogo className="!mx-0 hidden w-40 sm:block" />
          )}
        </div>
      </div>

      {/* Payment reminder */}
      {needsPayment && payment && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border-[3px] bg-[#f5c928] px-5 py-4" style={{ ...CARD_LINE, color: INK }}>
          <AlertTriangle className="indie-blink mt-0.5 h-7 w-7 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className={`text-2xl leading-tight ${display.className}`}>Payment pending</p>
            <p className="mt-1 leading-snug">
              You haven&apos;t submitted your transaction ID yet. Pay <strong>₹{payment.remaining || payment.payableAmount}</strong> and submit the ID to confirm your registration.
            </p>
            <Link href="/dashboard/payment" className="mt-3 inline-flex items-center gap-2 rounded-full border-[3px] px-4 py-2 text-sm font-extrabold uppercase text-[#f3e8cf]" style={{ background: INK, borderColor: INK }}>
              Pay &amp; submit transaction ID <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Pending invitations */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border-[3px] bg-white px-4 py-3.5" style={CARD_LINE}>
          <AlertCircle className="h-5 w-5 shrink-0 text-[#ef5a1c]" />
          <div className="min-w-0 flex-1" style={{ color: INK }}>
            <p className="font-extrabold">{pendingCount} pending invitation{pendingCount > 1 ? "s" : ""}</p>
            <p className="text-sm text-black/60">Respond before the team registration deadline.</p>
          </div>
          <Link href="/team-details" className="shrink-0 rounded-full border-2 px-3 py-1.5 text-xs font-extrabold uppercase text-[#f3e8cf]" style={{ background: INK, borderColor: INK }}>Review</Link>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_17rem]">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {stats.map((st) => (
              <Link key={st.label} href={st.href} className="rounded-2xl border-[3px] bg-white p-3 transition hover:-translate-y-0.5 sm:p-5" style={CARD_LINE}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#ef5a1c] sm:text-xs">{st.label}</p>
                  <span className={`h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5 ${st.dot}`} />
                </div>
                <p className={`text-3xl tabular-nums sm:text-5xl ${display.className}`} style={{ color: INK }}>{st.count}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/45 sm:text-xs">{st.sub}</p>
              </Link>
            ))}
          </div>

          {/* Registered events as tickets */}
          <div>
            <div className="mb-3 flex items-end justify-between">
              <h2 className={`text-2xl sm:text-3xl ${display.className}`} style={{ color: INK }}>Your tickets</h2>
              <Link href="/events-selection" className="text-xs font-extrabold uppercase text-[#0e5b57] underline underline-offset-4 sm:text-sm">Browse events</Link>
            </div>
            {eventCount === 0 ? (
              <div className="rounded-2xl border-[3px] border-dashed bg-white/60 py-12 text-center" style={{ borderColor: `${INK}55` }}>
                <CalendarDays className="mx-auto mb-3 h-9 w-9 text-[#ef5a1c]" />
                <p className={`text-xl ${display.className}`} style={{ color: INK }}>No tickets yet</p>
                <Link href="/events-selection" className="mt-1 inline-block text-sm font-extrabold uppercase text-[#0e5b57] underline underline-offset-4">Register for your first event</Link>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                {events.map((event) => {
                  const st = STATUS_LABEL[event.status] ?? { text: event.status.replace(/_/g, " "), dot: "bg-white/40" };
                  return (
                    <Link key={event._id} href={`/team-details?event=${event._id}`} className="flex overflow-hidden rounded-xl border-[3px] bg-white transition hover:-translate-y-0.5" style={CARD_LINE}>
                      <div className="min-w-0 flex-1 p-3.5 sm:p-4">
                        {event.category && <p className={`truncate text-[10px] tracking-[0.3em] text-[#ef5a1c] ${mono.className}`}>{event.category.toUpperCase()}</p>}
                        <p className={`truncate text-lg sm:text-xl ${display.className}`} style={{ color: INK }}>{event.name}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs font-extrabold uppercase text-[#0e5b57] sm:text-sm">Team <ArrowRight className="h-3.5 w-3.5" /></p>
                      </div>
                      <div className="flex w-24 shrink-0 flex-col items-center justify-center gap-1.5 border-l-2 border-dashed text-[#f3e8cf]" style={{ borderColor: INK, background: INK }}>
                        <Users className="h-5 w-5 text-[#f5c928]" />
                        <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider"><span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />{st.text}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border-[3px] bg-white px-5 py-4" style={CARD_LINE}>
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[3px] bg-[#f5c928] text-lg ${display.className}`} style={{ borderColor: INK, color: INK }}>
              {firstName[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1" style={{ color: INK }}>
              <p className="truncate text-lg font-extrabold">{user.fullName}</p>
              <p className="truncate text-sm text-black/60">{user.email}</p>
              {!isExt && user.department && (
                <p className="text-sm text-black/60">{[user.department, user.program, user.branch, user.year && `${user.year} Year`].filter(Boolean).join(" · ")}</p>
              )}
              {isExt && user.collegeName && <p className="text-sm text-black/60">{[user.collegeName, user.city, user.state].filter(Boolean).join(", ")}</p>}
            </div>
          </div>
        </div>

        {/* The pass */}
        <Link href="/dashboard/qr" className="relative block overflow-hidden rounded-3xl border-[3px] p-6 text-center transition hover:-translate-y-0.5 xl:self-start" style={{ borderColor: INK, boxShadow: `0 6px 0 ${INK}` }}>
          <GoldBackdrop at="50% 50%" sparkles={false} />
          <div className="relative" style={{ color: INK }}>
            <p className={`text-[10px] tracking-[0.3em] ${mono.className}`}>ADMIT ONE</p>
            <p className="mt-0.5 text-[11px] font-extrabold uppercase tracking-wider">{isExt ? "Participant ID" : "Enrollment no."}</p>
            <div className="mx-auto my-4 grid h-28 w-28 place-items-center rounded-xl border-[3px] bg-white" style={{ borderColor: INK }}>
              <QrCode className="h-16 w-16" />
            </div>
            {passId && <p className={`whitespace-nowrap text-lg ${display.className}`}>{passId}</p>}
            <p className="text-sm font-bold text-black/70">{user.fullName}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border-2 bg-white px-3 py-1 text-xs font-extrabold uppercase" style={{ borderColor: INK }}>
              Open my QR <ArrowRight className="h-3.5 w-3.5" />
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
