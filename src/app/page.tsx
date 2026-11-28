import Link from "next/link";
import { seedEvents } from "@/features/events/data/seed-events";
import { ArrowRight, IndianRupee, LayoutGrid, Medal, Ticket } from "lucide-react";
import { PUBLIC_EVENTS } from "@/features/events/data/public-events";
import { ALL_EVENTS } from "@/features/events/data/all-events";
import { SCHEDULE } from "@/data/schedule";
// import { RevealPopup } from "@/components/indie/reveal-popup";
import { EVENT_MEDIA, GALLERY, JUNOON_NIGHTS, TESTIMONIALS } from "@/data/dummy";
import { CULTURES } from "@/components/indie/culture-art";
import { Postmark, Stamp } from "@/components/indie/stamp";
import { CutoutTitle } from "@/components/indie/cutout-title";
import { NimbuMirch } from "@/components/indie/nimbu-mirch";
import { EVENT_THEMES, patternStyle } from "@/features/events/data/event-themes";
import { CountUp, Reveal, TestimonialSlider } from "@/components/indie/motion";
import { Intro } from "@/components/indie/intro";
import { Hero } from "@/components/home/hero";
import {
  Band, BlockButton, Marquee, Note, PageShell, Vinyl, display, serif, MandalaSpin, blockHindi,
} from "@/components/indie";

// Prize pools straight from the event pages ("To be announced" counts as 0).
const PRIZES = ALL_EVENTS.map((e) => Number(e.prize.replace(/[^\d]/g, "")) || 0).filter(Boolean);
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const NOTES = [
  { tag: "New", date: "16–18 Feb 2027", title: "The schedule is out", text: "All three days, with every event's time and venue, are on the schedule page." },
  { tag: "Prizes", date: `${PRIZES.length} events`, title: `${rupees(PRIZES.reduce((a, b) => a + b, 0))} prize pool`, text: `Every event page now shows its prize pool, from ${rupees(Math.min(...PRIZES))} to ${rupees(Math.max(...PRIZES))}.` },
  { tag: "Soon", date: "Registrations", title: "Registrations open soon", text: "Sign up now with your OPJU email (free) or as an external participant, then pick your events when registration opens." },
];

// Competitions you can register for inside a fest event (0 = it is a single event).
const competitionsOf = (slug: string) => seedEvents.filter((x) => x.mainEvent === slug && x.slug !== slug).length;
const time12 = (t: string) => { const [h, m] = t.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };

// The posters (Crystal Jubilee, Coming soon, We are ready) read badly when small, so the strip shows live photos only.
const FLASHBACK = GALLERY.filter((g) => g.image && g.tag !== "Fest" && g.caption !== "We are ready" && g.caption !== "Convenors sign off");

const STAT_LOOKS = [
  { theme: "kalakriti", icon: Ticket },
  { theme: "robovation", icon: Medal },
  { theme: "masterchef", icon: LayoutGrid },
  { theme: "codigo", icon: IndianRupee },
] as const;

const STEPS = [
  { n: "1", title: "Sign up", desc: "Use your OPJU email for free entry." },
  { n: "2", title: "Pick events", desc: "Choose solo or team events." },
  { n: "3", title: "Pay & confirm", desc: "Submit payment, get your QR pass." },
  { n: "4", title: "Show up", desc: "Scan at check-in and compete." },
];

// A vertical, endlessly scrolling column of unrevealed acts (content is duplicated for a seamless loop).
// Line-up is not announced yet: show redacted cards instead of names.
function ActColumn({ count, dir }: { count: number; dir: "up" | "down" }) {
  return (
    <div className="indie-vfade relative h-80 overflow-hidden">
      <div className={dir === "up" ? "indie-vup" : "indie-vdown"}>
        {[0, 1].map((rep) => (
          <div key={rep} aria-hidden={rep === 1} className="space-y-3 pb-3">
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-dashed border-[#f5c928]/40 bg-white/5 px-4 py-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f5c928]/60 text-xl text-[#f5c928] ${display.className}`}>?</span>
                <div className="min-w-0 flex-1">
                  <span aria-hidden className="block h-4 rounded-sm bg-[#f5edd8]/80" style={{ width: `${55 + ((i * 17) % 35)}%` }} />
                  <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5c928]">To be announced</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  // Every number here is derived from the real event list; events whose prize is still "To be announced" count as 0.
  const totalPrize = ALL_EVENTS.reduce((n, e) => n + (parseInt(e.prize.replace(/[^\d]/g, ""), 10) || 0), 0);
  // competitions = everything you can register for: sub-events (Tech-Lab, Drobotics, Kalakriti…) plus
  // standalone events (Codigo, Ideathon…); rounds and problem statements are not counted
  const totalSub = seedEvents.length;
  const categories = new Set(PUBLIC_EVENTS.map((e) => e.category)).size;
  const stats: { to?: number; text?: string; label: string }[] = [
    { to: PUBLIC_EVENTS.length, label: "Flagship events" },
    { to: totalSub, label: "Competitions" },
    { to: categories, label: "Categories" },
    { text: totalPrize ? `₹${(totalPrize / 100000).toFixed(2)}L` : "TBA", label: "Prize pool" },
  ];
  const nextUp = SCHEDULE[0].items.slice(0, 4);

  return (
    <PageShell>
      {/* Splash (maroon loader) parked: <Splash /> from @/components/indie/motion */}
      <Intro />
      {/* <RevealPopup /> */}

      {/* Pinned sections: each slides up over the previous one (large screens) */}
      <div className="relative">
        {/* Hero */}
        <Hero />

        {/* What's new */}
        <Band panel tone="crimson" zigzag="#f5c928" mandala>
          <div className="grid md:grid-cols-3 gap-10 items-start">
            <div className="md:col-span-2">
              <h2 className={`text-5xl sm:text-6xl text-[#f5c928] leading-[0.95] ${serif.className}`} style={{ textShadow: "3px 3px 0 #5a0010" }}>
                What&apos;s<br />new
              </h2>
              <p className="text-xl font-bold text-white mt-3 mb-10">All the latest, pinned to the board.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {NOTES.map((n, i) => (
                  <Note key={n.title} tag={n.tag} date={n.date} title={n.title} tilt={["-rotate-2", "rotate-1", "-rotate-1"][i]}>
                    {n.text}
                  </Note>
                ))}
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              {/* spin an HTML wrapper (GPU-composited) instead of the SVG group; plain circle as the shadow so no filter repaints */}
              <div className="relative h-56 w-56">
                <span aria-hidden className="absolute inset-0 translate-x-2 translate-y-2 rounded-full bg-black/40" />
                <div className="static-art indie-spin-slow relative h-full w-full"><Vinyl className="h-full w-full" /></div>
              </div>
            </div>
          </div>
        </Band>

        {/* Junoon '27 */}
        <Band
          panel
          tone="indigo"
          overlay={
            <div aria-hidden className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/gallery/junoon-2025.jpg" alt="" className="h-full w-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1b0f4a] via-[#1b0f4a]/70 to-[#1b0f4a]/20" />
            </div>
          }
        >
          <div className="relative grid gap-10 md:grid-cols-2 items-center">
            <div>
              <p className="inline-block border border-[#f5c928]/60 px-3 py-0.5 text-xs font-bold uppercase tracking-[0.35em] text-[#f5c928]">After dark</p>
              <h2 className="mt-4 text-6xl sm:text-8xl font-bold uppercase leading-none text-[#f5edd8]">Junoon &apos;27</h2>
              <p className="mt-2 text-2xl sm:text-4xl font-bold uppercase">
                The night that <span className="text-[#f5c928]">lights up</span> the campus
              </p>
              <div className="mt-6 grid gap-3">
                {JUNOON_NIGHTS.map((n) => (
                  <div key={n.n} className="rounded-lg border border-white/20 bg-white/5 p-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#f5c928]">Night {n.n}</p>
                    <p className="mt-1 text-sm font-bold uppercase leading-tight text-[#f5edd8]/90">{n.title}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#f5edd8]/50">Artist · Revealing soon</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#f5edd8]/80">{n.date} · {n.time} · {n.venue}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href="/junoon" className="inline-block border-2 border-[#f5edd8] px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-[#f5edd8] hover:text-black transition-colors">
                  Enter after dark ↗
                </Link>
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-[#f5c928]/60 px-3 py-2">
                  <span className={`indie-qshake inline-block text-4xl text-[#f5c928] ${display.className}`}>?</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#f5edd8]/80">Line-up to be announced<br />— stay tuned for the reveal</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ActColumn count={4} dir="up" />
              <ActColumn count={4} dir="down" />
            </div>
          </div>
        </Band>

        {/* Events */}
        <Band panel tone="blue" ghost="Something for every genre" className="!px-0">
          <div className="px-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <div>
              <CutoutTitle latin="Events" hindi="इवेंट्स" />
              <p className="text-3xl font-bold uppercase text-[#f5edd8] mt-2">
                Tune into the <span className="text-[#f5c928]">fest.</span>
              </p>
            </div>
            <BlockButton href="/events" tone="mustard">Browse all {PUBLIC_EVENTS.length} events →</BlockButton>
          </div>
          <div className="indie-hscroll flex gap-8 overflow-x-auto snap-x snap-mandatory px-6 pb-6 pt-2">
            {PUBLIC_EVENTS.map((e, i) => (
              <Link key={e.slug} href={`/events/${e.slug}`} className="group snap-start shrink-0 w-56">
                <Stamp slug={e.slug} name={e.name} category={e.category} number={i + 1} image={EVENT_MEDIA[e.slug]?.image} prize={ALL_EVENTS[i]?.prize} compact />
                <div className="mt-4 text-[#f5edd8]">
                  <p className={`text-lg uppercase leading-tight tracking-[0.16em] ${serif.className}`}>{CULTURES[e.slug]?.state}</p>
                  <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.3em] text-[#f5c928]">
                    {competitionsOf(e.slug) > 0 ? `${competitionsOf(e.slug)} competitions` : "Single event"} · {e.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Band>

        {/* Numbers */}
        <Band panel tone="cream" overlay={<div aria-hidden className="absolute inset-0 opacity-[0.1]" style={patternStyle("diamonds", "#7a1c1c")} />}>
          <div className="relative grid items-center gap-10 pt-6 md:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-[#c8421f]">The fest, by the</p>
              <CutoutTitle latin="Numbers" hindi="आँकड़े" color="#d62828" shadow="#4a0e0e" className="mt-1" />

              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8">
                {stats.map((st, i) => {
                  const look = STAT_LOOKS[i % STAT_LOOKS.length];
                  const t = EVENT_THEMES[look.theme];
                  const Icon = look.icon;
                  return (
                    <div key={st.label} className={`group ${i % 2 ? "rotate-1" : "-rotate-1"} transition-transform hover:rotate-0`}>
                      <div className="stamp-shadow">
                        <div className="stamp-cut bg-[#fde9bd] p-3">
                          <div className="bg-white p-1">
                            <div className="relative overflow-hidden px-3 py-3" style={{ background: `linear-gradient(160deg, ${t.bg}, ${t.bg2})`, color: t.ink }}>
                              <div aria-hidden className="absolute inset-0 opacity-30" style={patternStyle(t.pattern, t.patternColor)} />
                              <div className="relative flex items-start justify-between">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-[#f5edd8]" style={{ color: t.accent }}><Icon className="h-5 w-5" /></span>
                                <span className="text-[10px] font-bold tracking-[0.25em] opacity-70">{String(i + 1).padStart(2, "0")}</span>
                              </div>
                              <p className={`relative mt-2 text-[2.6rem] leading-none sm:text-5xl ${blockHindi.className}`} style={{ textShadow: "2px 2px 0 rgba(255,255,255,0.55)" }}>
                                {st.to !== undefined ? <CountUp to={st.to} /> : st.text}
                              </p>
                              <p className="relative mt-1 text-[11px] font-bold uppercase leading-tight tracking-[0.2em]" style={{ color: t.soft }}>{st.label}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* vinyl on a slowly turning mandala, with a postmark and a charm */}
            <div className="relative mx-auto w-72 sm:w-96 aspect-square">
              <div className="static-art indie-spin-rev absolute -inset-16 opacity-60"><MandalaSpin className="h-full w-full" stroke="#c8421f" reverse /></div>
              <span aria-hidden className="absolute inset-0 translate-x-2 translate-y-2 rounded-full bg-black/35" />
              <div className="static-art indie-spin-slow relative h-full w-full"><Vinyl className="h-full w-full" /></div>
              <Postmark lines={false} className="pointer-events-none absolute -bottom-3 -right-3 z-10 h-24 w-24 -rotate-12 opacity-70 mix-blend-multiply" />
              <NimbuMirch className="pointer-events-none absolute -left-4 -top-2 z-10 h-28 w-auto" delay="0.3s" />
              <span className="indie-wobble absolute right-0 top-2 border-2 border-black bg-[#f5c928] px-3 py-1 text-sm font-bold uppercase tracking-widest text-black">★ 3 days of fest</span>
              <span aria-hidden className="indie-float absolute bottom-6 left-0 border-2 border-black bg-[#f5edd8] px-3 py-1 text-xs font-bold uppercase tracking-widest text-black" style={{ ["--r" as string]: "-5deg" }}>TRX&apos;27</span>
            </div>
          </div>
        </Band>
      </div>

      {/* Everything below scrolls normally, above the pinned stack */}
      <div className="relative z-10">
        <Marquee
          className="pause-offscreen bg-black text-white font-bold uppercase tracking-wider text-lg py-2"
          text={`${PUBLIC_EVENTS.map((e) => e.name).join(" • ")} • `}
          speed={60}
        />

        {/* Flashback: real photos from past editions, endlessly drifting (list duplicated for a seamless loop) */}
        <Reveal><section className="overflow-hidden bg-[#1a0505] py-14 text-[#f5edd8] sm:py-20">
          <div className="mx-auto mb-10 flex max-w-6xl flex-col justify-between gap-4 px-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-[#f5c928]">Flashback · 2024 – 2026</p>
              <h2 className={`mt-2 text-5xl leading-none sm:text-7xl ${serif.className}`}>Last time at the fest</h2>
            </div>
            <BlockButton href="/gallery" tone="mustard">See the gallery →</BlockButton>
          </div>
          <div className="pause-offscreen indie-marquee flex w-max py-3 hover:[animation-play-state:paused]" style={{ animationDuration: "70s" }}>
            {[0, 1].map((rep) =>
              FLASHBACK.map((g, i) => (
                <Link
                  key={`${rep}-${g.image}`}
                  href="/gallery"
                  aria-hidden={rep === 1}
                  tabIndex={rep === 1 ? -1 : undefined}
                  className={`mr-8 block w-56 shrink-0 bg-[#f5edd8] p-2.5 pb-3 shadow-[6px_6px_0_0_#000] transition-transform hover:rotate-0 hover:-translate-y-2 sm:w-64 ${["-rotate-2", "rotate-2", "-rotate-1", "rotate-1"][i % 4]}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.image} alt={g.caption} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                  <p className={`mt-2 truncate text-center text-lg italic text-[#1a0505] ${serif.className}`}>{g.caption}</p>
                  <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-[#c8421f]">{g.tag} · {g.year}</p>
                </Link>
              )),
            )}
          </div>
        </section></Reveal>

        <Reveal><Band tone="indigo" mandala>
          <h2 className={`text-4xl sm:text-5xl text-center text-[#f5edd8] mb-10 ${serif.className}`}>What people say</h2>
          <TestimonialSlider items={TESTIMONIALS} />
        </Band></Reveal>

        <Reveal><Band tone="crimson" mandala>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className={`text-5xl sm:text-6xl text-[#f5c928] leading-none ${serif.className}`} style={{ textShadow: "3px 3px 0 #5a0010" }}>Schedule</h2>
              <p className="mt-2 text-xl font-bold uppercase">Next departures from Techno Junction</p>
            </div>
            <BlockButton href="/schedule" tone="cream">Full schedule →</BlockButton>
          </div>
          {/* same look as the /schedule board: tricolour, split-flap times */}
          <div className="overflow-hidden rounded-lg border-4 border-black bg-[#fffaf0] shadow-[6px_6px_0_0_#000]">
            <p className="flex items-center justify-between bg-[#138808] px-4 py-2 text-white">
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Departures · {SCHEDULE[0].label}</span>
              <span className={`text-lg ${display.className}`}>{SCHEDULE[0].date}</span>
            </p>
            <ul>
              {nextUp.map((r) => (
                <li key={r.time + r.title} className="grid grid-cols-[96px_1fr] items-center gap-x-3 border-t border-[#138808]/20 px-4 py-3 sm:grid-cols-[110px_1fr_auto]">
                  <span className="flex gap-0.5 font-mono text-lg font-bold" aria-label={time12(r.time)}>
                    {r.time.split("").map((c, i) => <span key={i} aria-hidden className="rounded-sm bg-[#0b2a6b] px-[3px] leading-tight text-white">{c}</span>)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg font-bold uppercase leading-tight tracking-wide text-[#c45500]">{r.title}</span>
                    <span className="mt-0.5 block text-sm font-semibold text-[#0b2a6b]/75 sm:hidden">{r.venue}</span>
                  </span>
                  <span className="hidden border border-[#138808]/30 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-[#0b2a6b] sm:block">{r.venue}</span>
                </li>
              ))}
            </ul>
          </div>
        </Band></Reveal>

        <Reveal><Band tone="pink" halftone>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-6xl sm:text-8xl font-bold uppercase leading-[0.9] indie-outline-dark">Make</p>
              <p className="text-6xl sm:text-8xl font-bold uppercase leading-[0.9] text-black">Share</p>
              <p className="text-6xl sm:text-8xl font-bold uppercase leading-[0.9] indie-outline-dark">Shine</p>
            </div>
            <div className="space-y-5">
              <p className="text-sm font-bold uppercase tracking-[0.3em]">Creatorverse</p>
              <p className="text-2xl font-semibold leading-snug">
                A platform for photographers, filmmakers, designers and writers to showcase their craft at the fest.
              </p>
              <BlockButton href="/creatorverse">Explore Creatorverse</BlockButton>
            </div>
          </div>
        </Band></Reveal>

        <Reveal><Band tone="orange" mandala>
          <h2 className={`text-5xl text-black leading-none mb-8 ${serif.className}`}>How to get in</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <div key={s.n} className={`bg-[#f5edd8] border-2 border-black shadow-[4px_4px_0_0_#000] p-5 ${i % 2 ? "rotate-1" : "-rotate-1"} hover:rotate-0 transition-transform`}>
                <div className={`w-10 h-10 rounded-full bg-[#f5c928] text-black border-2 border-black flex items-center justify-center text-lg mb-3 ${display.className}`}>{s.n}</div>
                <p className="text-xl font-bold uppercase tracking-wide text-black">{s.title}</p>
                <p className="text-base text-black/70 leading-snug mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </Band></Reveal>

        {/* Ready to compete: a boarding pass for Techno Junction */}
        <section className="relative overflow-hidden bg-[#f5edd8] px-4 py-16 text-[#1a0505] sm:px-12 sm:py-24">
          <div aria-hidden className="absolute inset-0 opacity-[0.08]" style={patternStyle("diamonds", "#7a1c1c")} />
          <div className="relative mx-auto max-w-5xl">
            <p className="text-center text-sm font-bold uppercase tracking-[0.35em] text-[#a1001a]">16–18 Feb 2027 &middot; O.P. Jindal University, Raigarh</p>
            <h2 className={`mt-3 text-center text-[clamp(44px,8vw,110px)] uppercase leading-[0.9] ${display.className}`}>
              Ready to <span className="text-transparent" style={{ WebkitTextStroke: "2px #a1001a" }}>compete?</span>
            </h2>

            <div className="mt-10 grid -rotate-1 border-4 border-black bg-[#fde9bd] shadow-[8px_8px_0_0_#000] transition-transform hover:rotate-0 md:grid-cols-[1fr_auto]">
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-black/40 pb-3">
                  <span className="text-xs font-bold uppercase tracking-[0.3em]">Boarding pass</span>
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#a1001a]">TRX&apos;27</span>
                </div>
                <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/60">From</p>
                    <p className={`text-2xl leading-none sm:text-4xl ${display.className}`}>You</p>
                  </div>
                  <ArrowRight className="h-8 w-8 text-[#a1001a]" aria-hidden />
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/60">To</p>
                    <p className={`text-2xl leading-none sm:text-4xl ${display.className}`}>Techno Jn.</p>
                  </div>
                </div>
                <dl className="mt-6 grid grid-cols-3 gap-3 border-t-2 border-dashed border-black/40 pt-4">
                  {[
                    ["Events", String(PUBLIC_EVENTS.length)],
                    ["Competitions", String(totalSub)],
                    ["Categories", String(categories)],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/60">{k}</dt>
                      <dd className={`text-2xl sm:text-3xl ${blockHindi.className}`}>{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-lg leading-snug">
                  <strong>OPJU students</strong> get in free with their college email. <strong>Everyone else</strong> gets a unique TRX27 ID.
                </p>
              </div>

              {/* tear-off stub */}
              <div className="relative flex flex-col items-center justify-center gap-4 border-t-4 border-dashed border-black bg-[#a1001a] p-6 text-[#f5edd8] md:w-64 md:border-l-4 md:border-t-0">
                <span aria-hidden className="absolute -left-4 -top-4 hidden h-8 w-8 rounded-full border-4 border-black bg-[#f5edd8] md:block" />
                <span aria-hidden className="absolute -bottom-4 -left-4 hidden h-8 w-8 rounded-full border-4 border-black bg-[#f5edd8] md:block" />
                <Ticket className="h-10 w-10 text-[#f5c928]" aria-hidden />
                <Link href="/auth/signup" className="w-full border-2 border-black bg-[#f5c928] px-5 py-3 text-center text-lg font-bold uppercase tracking-widest text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-y-0.5">
                  Register now
                </Link>
                <Link href="/events" className="text-sm font-bold uppercase tracking-[0.25em] underline-offset-4 hover:underline">
                  Browse events →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Marquee
          className="pause-offscreen bg-[#ff6a00] text-black font-bold uppercase tracking-wider text-lg py-1.5"
          text="Techno-aiMBiAtion 2027 ✦ O.P. Jindal University ✦ See you there ✦ "
          speed={40}
        />
      </div>
    </PageShell>
  );
}
