import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, MapPin, Trophy, Users, Wallet } from "lucide-react";
import { ALL_EVENTS } from "@/data/all-events";
import type { EventData } from "@/data/event-types";
import { patternStyle } from "@/data/event-themes";
import { CULTURES } from "@/components/culture-art";
import { Postmark, Stamp } from "@/components/stamp";
import { LogoSlot } from "@/components/media";
import { Marquee, PageShell, serif } from "@/components/indie";

// The shared event page layout. Each folder under src/app/events/<slug>/ passes in its own data.ts,
// so one event can be customised (or its page replaced entirely) without touching the others.
export function EventPage({ event }: { event: EventData }) {
  const index = ALL_EVENTS.findIndex((e) => e.slug === event.slug);
  const next = ALL_EVENTS[(index + 1) % ALL_EVENTS.length];
  const prev = ALL_EVENTS[(index + ALL_EVENTS.length - 1) % ALL_EVENTS.length];
  const media = event.media ?? {};
  const t = event.theme;
  const culture = CULTURES[event.slug];
  const pattern = patternStyle(t.pattern, t.patternColor);
  const coordinators = [event.contact, ...(event.moreContacts ?? [])];

  const facts = [
    { Icon: CalendarDays, label: "Date", value: event.date },
    { Icon: Clock, label: "Time", value: event.time },
    { Icon: MapPin, label: "Venue", value: event.venue },
    { Icon: Users, label: "Team size", value: event.teamSize },
    { Icon: Trophy, label: "Prize pool", value: event.prize },
    { Icon: Wallet, label: "Entry fee", value: event.fee },
  ];

  const cardStyle = { background: t.card, color: t.cardInk, border: `2px solid ${t.accent2}`, boxShadow: `5px 5px 0 ${t.accent2}` };
  const pill = { background: t.accent, color: t.accentInk, border: "2px solid #000", boxShadow: "3px 3px 0 #000" };

  return (
    <PageShell>
      {/* Hero — themed to the event's culture */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${t.bg} 0%, ${t.bg2} 100%)`, color: t.ink }}>
        <div aria-hidden className="absolute inset-0 opacity-30" style={pattern} />
        <p aria-hidden className="pointer-events-none absolute -bottom-8 -left-4 select-none whitespace-nowrap text-[9rem] sm:text-[13rem] font-extrabold uppercase leading-none opacity-[0.08]">
          {culture?.state ?? event.category}
        </p>

        <div className="relative mx-auto grid max-w-5xl items-center gap-12 px-6 py-14 md:grid-cols-[1fr_auto]">
          <div className="space-y-5">
            <Link href="/events" className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider hover:underline" style={{ color: t.soft }}>
              <ArrowLeft className="h-4 w-4" /> All events
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 text-sm font-bold uppercase tracking-[0.25em] -rotate-1" style={pill}>Event {String(index + 1).padStart(2, "0")}</span>
              <span className="border-2 px-3 py-0.5 text-sm font-bold uppercase tracking-widest" style={{ borderColor: t.ink }}>{event.category}</span>
            </div>

            <div className="flex items-center gap-3">
              <LogoSlot src={media.logo} alt={`${event.name} logo`} label="Logo" size="h-14 w-14" shape="rounded-full" className="bg-white/40" />
              <div>
                <p className={`text-2xl uppercase tracking-[0.18em] ${serif.className}`}>{culture?.state}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.4em]" style={{ color: t.soft }}>Bharat · {culture?.landmark}</p>
              </div>
            </div>

            <h1 className="text-6xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-8xl break-words">{event.name}</h1>
            <p className="text-2xl font-semibold sm:text-3xl" style={{ color: t.soft }}>{event.tagline}</p>

            <p className="flex flex-wrap gap-x-5 gap-y-1 text-lg font-semibold">
              <span className="flex items-center gap-1.5"><CalendarDays className="h-5 w-5" />{event.date}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-5 w-5" />{event.venue}</span>
              <span className="flex items-center gap-1.5"><Trophy className="h-5 w-5" />{event.prize}</span>
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/auth/signup" className="inline-block px-8 py-3 text-lg font-bold uppercase tracking-widest transition hover:-translate-y-0.5" style={pill}>Register now</Link>
              {event.subEvents.length > 0 && (
                <a href="#lineup" className="inline-block border-2 px-8 py-3 text-lg font-bold uppercase tracking-widest transition hover:-translate-y-0.5" style={{ borderColor: t.ink }}>See the lineup</a>
              )}
            </div>
          </div>

          <div className="group relative mx-auto w-64 sm:w-72">
            <Stamp slug={event.slug} name={event.name} category={event.category} number={index + 1} image={media.image} />
            <Postmark lines={false} className="pointer-events-none absolute -bottom-9 -right-9 z-10 h-24 w-24 -rotate-12 opacity-70 mix-blend-multiply" />
          </div>
        </div>
      </section>

      {/* Motif strip */}
      <Marquee
        className="-rotate-1 py-1.5 text-lg font-bold uppercase tracking-wider"
        style={{ background: t.accent, color: t.accentInk }}
        text={t.motif}
        speed={36}
      />

      {/* Body */}
      <section className="relative" style={{ background: t.bg2, color: t.ink }}>
        <div aria-hidden className="absolute inset-0 opacity-[0.14]" style={pattern} />
        <div className="relative mx-auto max-w-5xl space-y-14 px-6 py-14">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {facts.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 p-4" style={{ ...cardStyle, borderLeft: `8px solid ${t.accent}` }}>
                <Icon className="mt-0.5 h-6 w-6 shrink-0" style={{ color: t.accent }} />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] opacity-60">{label}</p>
                  <p className="text-lg font-bold leading-tight">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className={`mb-4 text-4xl ${serif.className}`} style={{ color: t.accent2 === t.accent ? t.ink : t.ink }}>About</h2>
              <p className="text-xl leading-snug">{event.about}</p>
              <p className="mt-4 border-l-4 pl-4 text-lg font-semibold italic" style={{ borderColor: t.accent, color: t.soft }}>
                Inspired by {culture?.landmark} · {culture?.state}
              </p>
            </div>
            <div>
              <h2 className={`mb-4 text-4xl ${serif.className}`}>Rules</h2>
              <ol className="divide-y-2 divide-dashed" style={{ ...cardStyle, borderColor: t.accent2 }}>
                {event.rules.map((r, i) => (
                  <li key={r} className="flex gap-3 px-4 py-3" style={{ borderColor: `${t.accent2}55` }}>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: t.accent, color: t.accentInk }}>{i + 1}</span>
                    <span className="text-lg leading-snug">{r}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {event.subEvents.length > 0 && (
            <div id="lineup" className="scroll-mt-24">
              <h2 className={`mb-4 text-4xl ${serif.className}`}>The lineup</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {event.subEvents.map((s, i) => (
                  <div key={s} className="flex items-center gap-4 px-4 py-3" style={cardStyle}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold" style={{ background: t.accent, color: t.accentInk }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-xl font-bold uppercase tracking-wide">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-6" style={cardStyle}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">
              Event coordinator{coordinators.length > 1 ? "s" : ""}
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {coordinators.map((c) => (
                <div key={`${c.name}-${c.phone}`} className="flex items-center gap-4">
                  {c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.image} alt={c.name} className="h-20 w-20 shrink-0 border-2 border-black object-cover shadow-[3px_3px_0_0_#000]" />
                  ) : (
                    <div
                      aria-hidden
                      className={`flex h-20 w-20 shrink-0 items-center justify-center border-2 border-black text-4xl shadow-[3px_3px_0_0_#000] ${serif.className}`}
                      style={{ background: t.accent, color: t.accentInk }}
                    >
                      {c.name[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className={`text-2xl leading-tight ${serif.className}`}>{c.name}</p>
                    <a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`} className="text-lg font-semibold tabular-nums hover:underline">{c.phone}</a>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest opacity-60">Sample details — all data is fictional.</p>
          </div>
        </div>
      </section>

      {/* Register + neighbours */}
      <section className="relative" style={{ background: t.accent2, color: "#fff" }}>
        <div aria-hidden className="absolute inset-0 opacity-20" style={patternStyle(t.pattern, "#ffffff")} />
        <div className="relative mx-auto max-w-5xl px-6 py-14">
          <div className="mx-auto max-w-2xl p-8 text-center" style={{ background: t.card, color: t.cardInk, border: "2px solid #000", boxShadow: "6px 6px 0 #000" }}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">Admit one · {culture?.state}</p>
            <h2 className={`mt-2 text-4xl sm:text-5xl ${serif.className}`}>Join {event.name}</h2>
            <p className="mt-2 text-xl leading-snug">Sign up with your OPJU email for free entry, then pick this event from your dashboard.</p>
            <Link href="/auth/signup" className="mt-5 inline-block px-8 py-3 text-lg font-bold uppercase tracking-widest transition hover:-translate-y-0.5" style={pill}>Register now</Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-lg font-bold uppercase tracking-wider">
            <Link href={`/events/${prev.slug}`} className="flex items-center gap-2 hover:underline"><ArrowLeft className="h-5 w-5" /> {prev.name}</Link>
            <Link href={`/events/${next.slug}`} className="flex items-center gap-2 hover:underline">{next.name} <ArrowRight className="h-5 w-5" /></Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function eventMetadata(event: EventData) {
  return { title: `${event.name} | Techno-aiMBiAtion 2027` };
}
