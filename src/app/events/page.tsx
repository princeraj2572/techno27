import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Trophy, Users } from "lucide-react";
import { PUBLIC_EVENTS } from "@/data/public-events";
import {
  EVENTS_BANNER, EVENT_FAQ, EVENT_MEDIA, EVENT_STEPS, FEST_START,
  SPONSOR_TIERS, getEventMock,
} from "@/data/dummy";
import { EventsCards } from "@/components/events-cards";
import { Countdown } from "@/components/countdown";
import { CountUp, Reveal } from "@/components/motion";
import { ImageSlot, LogoSlot } from "@/components/media";
import { CULTURES } from "@/components/culture-art";
import { Postmark, Stamp } from "@/components/stamp";
import { Band, BlockButton, Marquee, PageShell, TicketCta, display, serif } from "@/components/indie";

export const metadata = { title: "Events | Techno-aiMBiAtion 2027" };

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const totalSub = PUBLIC_EVENTS.reduce((n, e) => n + e.subEvents.length, 0);

  const cards = PUBLIC_EVENTS.map((e, i) => {
    const m = getEventMock(e.slug);
    const media = EVENT_MEDIA[e.slug] ?? {};
    return {
      slug: e.slug,
      number: i + 1,
      name: e.name,
      category: e.category,
      iconKey: e.iconKey,
      subEvents: e.subEvents,
      tagline: m.tagline,
      date: m.date,
      time: m.time,
      venue: m.venue,
      prize: m.prize,
      image: media.image,
      logo: media.logo,
    };
  });

  const totalPrize = cards.reduce((n, c) => n + parseInt(c.prize.replace(/[^\d]/g, ""), 10), 0);
  const featured = cards.reduce((a, b) => (b.subEvents.length > a.subEvents.length ? b : a));
  const presenters = SPONSOR_TIERS.flatMap((t) => t.sponsors).slice(0, 5);

  const stats = [
    { to: PUBLIC_EVENTS.length, suffix: "", label: "Events" },
    { to: totalSub, suffix: "+", label: "Competitions" },
    { to: Math.round(totalPrize / 1000), prefix: "₹", suffix: "K", label: "Total prizes" },
    { to: 5, suffix: "", label: "Days" },
  ];

  return (
    <PageShell>
      {/* Header: title + banner slot */}
      <Band tone="crimson" mandala ghost="Something for every genre" className="!pb-10 !pt-12">
        <div>
          <h1 className={`text-6xl sm:text-8xl leading-[0.9] indie-outline ${serif.className}`}>Events</h1>
          <p className="mt-2 text-xl sm:text-2xl font-bold uppercase text-[#f5edd8]">
            {PUBLIC_EVENTS.length} events · {totalSub}+ competitions · one fest
          </p>
        </div>
        <div className="relative mt-8">
          <ImageSlot
            src={EVENTS_BANNER}
            alt="Techno-aiMBiAtion events banner"
            label="Banner image"
            hint="1600 × 600"
            ratio="aspect-[21/8]"
            tone="from-[#ff6a00] to-[#7a1c1c]"
            className="border-2 border-black shadow-[6px_6px_0_0_#000]"
          />
          <span aria-hidden className="indie-float absolute -top-3 right-6 border-2 border-black bg-[#f5c928] px-3 py-1 text-xs font-bold uppercase tracking-widest text-black" style={{ ["--r" as string]: "5deg" }}>
            ★ {PUBLIC_EVENTS.length} events
          </span>
        </div>
      </Band>

      {/* Countdown + stats */}
      <Reveal>
        <Band tone="cream" className="!py-10">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#7a1c1c]">The fest starts in</p>
              <div className="mt-3"><Countdown to={FEST_START} /></div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-center sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className={`text-2xl sm:text-3xl text-[#7a1c1c] ${display.className}`}>
                    <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-black/70">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Band>
      </Reveal>

      {/* Spotlight — the featured event as a big stamp */}
      <Reveal>
        <Band tone="parchment" mandala className="!py-14">
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,24rem)_1fr]">
            <div className="group relative mx-auto w-full max-w-sm">
              <span className="absolute -left-3 -top-4 z-10 -rotate-6 border-2 border-black bg-[#ff2d8a] px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-black shadow-[3px_3px_0_0_#000]">
                ★ Spotlight
              </span>
              <Stamp slug={featured.slug} name={featured.name} category={featured.category} number={featured.number} image={featured.image} big />
              <Postmark lines={false} className="pointer-events-none absolute -bottom-9 -right-9 z-10 h-24 w-24 -rotate-12 opacity-70 mix-blend-multiply" />
            </div>

            <div className="flex flex-col gap-5 text-[#1a0505]">
              <div className="flex items-center gap-3">
                <LogoSlot src={featured.logo} alt={`${featured.name} logo`} label="Logo" size="h-14 w-14" shape="rounded-full" className="text-[#7a1c1c]" />
                <div>
                  <p className={`text-2xl uppercase tracking-[0.18em] text-[#7a1c1c] ${serif.className}`}>{CULTURES[featured.slug]?.state}</p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-black/60">Bharat · {CULTURES[featured.slug]?.landmark}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#c8421f]">{featured.category} · {featured.subEvents.length} competitions</p>
                <h2 className={`mt-1 text-5xl sm:text-6xl leading-none ${display.className}`}>{featured.name}</h2>
                <p className="mt-2 text-2xl font-semibold text-[#7a1c1c]">{featured.tagline}</p>
              </div>

              <ul className="grid grid-cols-2 gap-3">
                {[
                  [CalendarDays, "Date", `${featured.date} · ${featured.time}`],
                  [MapPin, "Venue", featured.venue],
                  [Trophy, "Prize pool", featured.prize],
                  [Users, "Format", `${featured.subEvents.length} competitions`],
                ].map(([Icon, label, value]) => {
                  const I = Icon as typeof CalendarDays;
                  return (
                    <li key={label as string} className="flex items-start gap-2.5 border-2 border-black bg-[#f5edd8] p-3 shadow-[3px_3px_0_0_#000]">
                      <I className="mt-0.5 h-5 w-5 shrink-0 text-[#c8421f]" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/55">{label as string}</p>
                        <p className="text-base font-bold leading-tight">{value as string}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <ul className="flex flex-wrap gap-1.5">
                {featured.subEvents.map((s) => (
                  <li key={s} className="border border-black/40 bg-black/5 px-2 py-0.5 text-xs font-bold uppercase tracking-wide">{s}</li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 pt-1">
                <BlockButton href={`/events/${featured.slug}`}>View event →</BlockButton>
                <BlockButton href="/auth/signup" tone="mustard">Register</BlockButton>
              </div>
            </div>
          </div>
        </Band>
      </Reveal>

      {/* All events */}
      <Band tone="crimson" mandala className="!pt-12">
        <h2 className={`mb-8 text-4xl sm:text-5xl text-[#f5c928] ${serif.className}`} style={{ textShadow: "3px 3px 0 #5a0010" }}>All events</h2>
        <EventsCards events={cards} initial={cat} />
        <p className="mt-10 text-center text-xs uppercase tracking-widest text-white/60">Sample details — dates, venues and prizes are placeholders.</p>
      </Band>

      <Marquee
        className="bg-black text-white font-bold uppercase tracking-wider text-lg py-2"
        text={`${PUBLIC_EVENTS.map((e) => e.name).join(" • ")} • `}
        speed={60}
      />

      {/* How it works */}
      <Reveal>
        <Band tone="orange" mandala>
          <h2 className={`mb-8 text-5xl leading-none text-black ${serif.className}`}>How it works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {EVENT_STEPS.map((s, i) => (
              <div key={s.n} className={`border-2 border-black bg-[#f5edd8] p-6 text-black shadow-[5px_5px_0_0_#000] ${i % 2 ? "rotate-1" : "-rotate-1"} transition-transform hover:rotate-0`}>
                <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-[#f5c928] text-xl ${display.className}`}>{s.n}</span>
                <p className="text-2xl font-bold uppercase tracking-wide">{s.title}</p>
                <p className="mt-1 text-lg leading-snug text-black/70">{s.text}</p>
              </div>
            ))}
          </div>
        </Band>
      </Reveal>

      {/* Presented by — logo slots */}
      <Reveal>
        <Band tone="cream" className="!py-12">
          <p className="mb-6 text-center text-sm font-bold uppercase tracking-[0.35em] text-[#7a1c1c]">Presented by</p>
          <div className="flex flex-wrap justify-center gap-5">
            {presenters.map((p) => (
              <div key={p.name} className="text-center">
                <LogoSlot label="Logo" size="h-20 w-36" className="text-[#7a1c1c]" />
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-black/60">{p.name}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/sponsors" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#7a1c1c] hover:text-[#c8421f]">
              All sponsors <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Band>
      </Reveal>

      {/* FAQ */}
      <Reveal>
        <Band tone="indigo">
          <h2 className={`mb-8 text-4xl sm:text-5xl text-[#f5c928] ${display.className}`}>Questions?</h2>
          <div className="divide-y-2 divide-dashed divide-black/30 overflow-hidden rounded-xl border-2 border-black bg-[#f5edd8] text-[#1a0505] shadow-[4px_4px_0_0_#000]">
            {EVENT_FAQ.map((f) => (
              <details key={f.q} className="group px-5 py-4 open:bg-[#f5c928]/25">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xl font-bold uppercase tracking-wide">
                  {f.q}
                  <span className="text-2xl text-[#ff6a00] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-lg leading-snug text-black/75">{f.a}</p>
              </details>
            ))}
          </div>
        </Band>
      </Reveal>

      <TicketCta
        title="Found your event?"
        text="Register with your OPJU email for free entry. External participants get a unique TRX27 ID."
        href="/auth/signup"
        label="Register now"
      />
    </PageShell>
  );
}
