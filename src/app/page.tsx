import Link from "next/link";
import { IndianRupee, Medal, Ticket, Users } from "lucide-react";
import { PUBLIC_EVENTS } from "@/features/events/data/public-events";
import { SCHEDULE } from "@/data/schedule";
import { EVENT_MEDIA, JUNOON_ACTS, JUNOON_NIGHTS, MYSTERY_HINTS, TESTIMONIALS } from "@/data/dummy";
import { CULTURES } from "@/components/indie/culture-art";
import { Postmark, Stamp } from "@/components/indie/stamp";
import { CutoutTitle } from "@/components/indie/cutout-title";
import { NimbuMirch } from "@/components/indie/nimbu-mirch";
import { EVENT_THEMES, patternStyle } from "@/features/events/data/event-themes";
import { CountUp, Reveal, Splash, TestimonialSlider } from "@/components/indie/motion";
import {
  Band, BlockButton, Marquee, Note, PageShell, Vinyl, Wheel, display, serif, MandalaSpin, blockHindi,
} from "@/components/indie";

const NOTES = [
  { tag: "Open", date: "Registrations", title: "Registrations are open", text: "Sign up with your OPJU email for free entry, or as an external participant with a TRX27 ID." },
  { tag: "Teams", date: "Dashboard", title: "Build your team", text: "Invite members from your dashboard and track who has accepted before the deadline." },
  { tag: "Stay", date: "Accommodation", title: "Need a place to stay?", text: "Apply for accommodation from your dashboard once you have registered for an event." },
];

const STAT_LOOKS = [
  { theme: "kalakriti", icon: Ticket },
  { theme: "robovation", icon: Medal },
  { theme: "masterchef", icon: Users },
  { theme: "codigo", icon: IndianRupee },
] as const;

const STEPS = [
  { n: "1", title: "Sign up", desc: "Use your OPJU email for free entry." },
  { n: "2", title: "Pick events", desc: "Choose solo or team events." },
  { n: "3", title: "Pay & confirm", desc: "Submit payment, get your QR pass." },
  { n: "4", title: "Show up", desc: "Scan at check-in and compete." },
];

// A vertical, endlessly scrolling column of acts (content is duplicated for a seamless loop).
function ActColumn({ acts, dir }: { acts: typeof JUNOON_ACTS; dir: "up" | "down" }) {
  return (
    <div className="indie-vfade relative h-80 overflow-hidden">
      <div className={dir === "up" ? "indie-vup" : "indie-vdown"}>
        {[0, 1].map((rep) => (
          <div key={rep} aria-hidden={rep === 1} className="space-y-3 pb-3">
            {acts.map((a) => (
              <div key={a.name + rep} className="rounded-xl border border-white/20 bg-white/5 px-4 py-3">
                <p className={`text-lg text-[#f5edd8] leading-tight ${display.className}`}>{a.name}</p>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f5c928]">{a.genre}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// The skyline rises on load; clouds bob; a train drives across.
function HeroScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 sm:h-52 overflow-hidden">
      {[
        { l: "8%", t: "8%", w: "9rem", d: "0s" },
        { l: "42%", t: "0%", w: "11rem", d: "1s" },
        { l: "70%", t: "14%", w: "8rem", d: "0.5s" },
      ].map((c, i) => (
        <span
          key={i}
          className="indie-cloud absolute block h-6 rounded-full bg-[#fad68e]/35 blur-[1px]"
          style={{ left: c.l, top: c.t, width: c.w, animationDelay: c.d }}
        />
      ))}
      <svg viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice" className="indie-rise absolute bottom-0 h-full w-full">
        <circle cx="620" cy="190" r="110" fill="#ff9d2e" opacity="0.55" />
        <g fill="#2a0606">
          <path d="M70 200 V152 H130 V122 H160 V92 L190 48 L220 92 V122 H250 V152 H310 V200 Z" />
          <path d="M500 200 V90 a100 100 0 0 1 200 0 V200 H655 V104 a55 55 0 0 0 -110 0 V200 Z" />
          <path d="M880 200 V132 H1000 V200 Z M898 132 a42 42 0 0 1 84 0 Z M938 70 h4 v28 h-4 Z" />
          <path d="M1060 200 V150 H1130 V200 Z M1070 150 a25 25 0 0 1 50 0 Z" />
          <circle cx="360" cy="168" r="26" /><circle cx="404" cy="176" r="20" /><circle cx="760" cy="172" r="22" />
          <rect x="0" y="186" width="1200" height="14" />
        </g>
      </svg>
      <div className="indie-metro absolute bottom-3 left-0 flex">
        {[0, 1, 2, 3].map((c) => (
          <div key={c} className="relative mr-1 h-10 w-36 rounded-md border-2 border-black bg-[#e9e6df]">
            <div className="absolute inset-x-0 top-1/2 h-1 bg-[#c1121f]" />
            <div className="absolute left-2 right-2 top-1.5 flex gap-1.5">
              {[0, 1, 2, 3].map((w) => <span key={w} className="h-3 flex-1 rounded-sm border border-black bg-[#1a2a44]" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const totalSub = PUBLIC_EVENTS.reduce((n, e) => n + e.subEvents.length, 0);
  const stats = [
    { to: PUBLIC_EVENTS.length, prefix: "", suffix: "", label: "Flagship events" },
    { to: totalSub, prefix: "", suffix: "+", label: "Competitions" },
    { to: 2000, prefix: "", suffix: "+", label: "Expected participants" },
    { to: 5, prefix: "₹", suffix: "L+", label: "Prize pool" },
  ];
  const nextUp = SCHEDULE[0].items.slice(0, 4);

  return (
    <PageShell>
      <Splash />

      {/* Pinned sections: each slides up over the previous one (large screens) */}
      <div className="relative">
        {/* Hero */}
        <section className="panel relative overflow-hidden indie-mandala bg-[#7a1c1c]">
          <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(58,8,8,0.85) 0%, rgba(122,28,28,0.55) 50%, rgba(246,95,0,0.85) 100%)" }} />
          <HeroScene />
          <div className="panel-inner relative max-w-6xl mx-auto px-6 pt-16 pb-48 md:pb-44 grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-6 text-center md:text-left">
              <p className="inline-block bg-[#ff6a00] text-black text-sm font-bold uppercase tracking-[0.25em] px-3 py-1 border-2 border-black -rotate-1">
                Op Jindal University • 2027
              </p>
              <h1 className={`text-5xl sm:text-7xl leading-[0.95] text-[#f5c928] break-words ${serif.className}`} style={{ textShadow: "4px 4px 0 #3a0808" }}>
                Techno-<span className="text-[#f5edd8]">aiMBiAtion</span>
                <span className="block text-[#ff6a00]">&apos;27</span>
              </h1>
              <p className="max-w-lg text-xl sm:text-2xl font-semibold leading-snug text-[#f5edd8]/90 mx-auto md:mx-0">
                The annual flagship festival of O.P. Jindal University. Compete, collaborate and create — across Tech, Robotics, Culture &amp; more.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <BlockButton href="/auth/signup" tone="mustard">Register now</BlockButton>
                <BlockButton href="/events" tone="cream">Browse events</BlockButton>
              </div>
            </div>

            <span aria-hidden className="indie-float absolute left-4 top-6 hidden md:block bg-[#f5c928] text-black text-xs font-bold uppercase tracking-widest px-3 py-1 border-2 border-black" style={{ ["--r" as string]: "-6deg" }}>★ Vol. 1</span>

            <div className="relative mx-auto w-72 sm:w-96 md:w-[28rem] md:-mr-20 aspect-square">
              <Wheel className="h-full w-full drop-shadow-[10px_10px_0_rgba(0,0,0,0.45)]" />
              <Link
                href="/auth/signup"
                className="absolute left-1/2 top-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center text-[10px] sm:text-sm font-bold uppercase tracking-widest text-[#f5c928] hover:text-white"
              >
                Register
              </Link>
            </div>
          </div>
          <Marquee
            className="absolute inset-x-0 bottom-0 z-10 bg-[#ff6a00] text-black font-bold uppercase tracking-wider text-xl py-1.5 -rotate-1 scale-[1.02]"
            text="Join the riot ✦ Compete ✦ Collaborate ✦ Create ✦ "
          />
          <span aria-hidden className="indie-bob absolute bottom-14 left-1/2 z-10 hidden md:flex h-10 w-6 items-start justify-center rounded-full border-2 border-[#f5edd8]/80 pt-1.5">
            <span className="h-2 w-0.5 rounded bg-[#f5edd8]" />
          </span>
        </section>

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
              <Vinyl className="w-56 h-56 drop-shadow-[8px_8px_0_rgba(0,0,0,0.4)]" slow />
            </div>
          </div>
        </Band>

        {/* Junoon '27 */}
        <Band panel tone="indigo">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <p className="inline-block border border-[#f5c928]/60 px-3 py-0.5 text-xs font-bold uppercase tracking-[0.35em] text-[#f5c928]">After dark</p>
              <h2 className="mt-4 text-6xl sm:text-8xl font-bold uppercase leading-none text-[#f5edd8]">Junoon &apos;27</h2>
              <p className="mt-2 text-2xl sm:text-4xl font-bold uppercase">
                The nights that <span className="text-[#f5c928]">light up</span> the campus
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {JUNOON_NIGHTS.map((n) => (
                  <div key={n.n} className="rounded-lg border border-white/20 bg-white/5 p-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#f5c928]">Night {n.n}</p>
                    <p className="mt-1 text-sm font-bold uppercase leading-tight">{n.artist}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href="/junoon" className="inline-block border-2 border-[#f5edd8] px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-[#f5edd8] hover:text-black transition-colors">
                  Enter after dark ↗
                </Link>
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-[#f5c928]/60 px-3 py-2" title={MYSTERY_HINTS.join(" · ")}>
                  <span className={`indie-qshake inline-block text-4xl text-[#f5c928] ${display.className}`}>?</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#f5edd8]/80">Guess the headliner<br />— {MYSTERY_HINTS[0]}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ActColumn acts={JUNOON_ACTS.slice(0, 4)} dir="up" />
              <ActColumn acts={JUNOON_ACTS.slice(4)} dir="down" />
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
                <Stamp slug={e.slug} name={e.name} category={e.category} number={i + 1} image={EVENT_MEDIA[e.slug]?.image} compact />
                <div className="mt-4 text-[#f5edd8]">
                  <p className={`text-lg uppercase leading-tight tracking-[0.16em] ${serif.className}`}>{CULTURES[e.slug]?.state}</p>
                  <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.3em] text-[#f5c928]">
                    {e.subEvents.length > 0 ? `${e.subEvents.length} competitions` : "Marquee event"} · {e.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Band>

        {/* Numbers */}
        <Band panel tone="cream" toran overlay={<div aria-hidden className="absolute inset-0 opacity-[0.1]" style={patternStyle("diamonds", "#7a1c1c")} />}>
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
                                <CountUp to={st.to} prefix={st.prefix} suffix={st.suffix} />
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
              <MandalaSpin className="absolute -inset-16 h-[calc(100%+8rem)] w-[calc(100%+8rem)] opacity-60" stroke="#c8421f" reverse />
              <Vinyl className="relative h-full w-full drop-shadow-[8px_8px_0_rgba(0,0,0,0.35)]" slow />
              <Postmark lines={false} className="pointer-events-none absolute -bottom-3 -right-3 z-10 h-24 w-24 -rotate-12 opacity-70 mix-blend-multiply" />
              <NimbuMirch className="pointer-events-none absolute -left-4 -top-2 z-10 h-28 w-auto" delay="0.3s" />
              <span className="indie-wobble absolute right-0 top-2 border-2 border-black bg-[#f5c928] px-3 py-1 text-sm font-bold uppercase tracking-widest text-black">★ 5 days of fest</span>
              <span aria-hidden className="indie-float absolute bottom-6 left-0 border-2 border-black bg-[#f5edd8] px-3 py-1 text-xs font-bold uppercase tracking-widest text-black" style={{ ["--r" as string]: "-5deg" }}>TRX&apos;27</span>
            </div>
          </div>
        </Band>
      </div>

      {/* Everything below scrolls normally, above the pinned stack */}
      <div className="relative z-10">
        <Marquee
          className="bg-black text-white font-bold uppercase tracking-wider text-lg py-2"
          text={`${PUBLIC_EVENTS.map((e) => e.name).join(" • ")} • `}
          speed={60}
        />

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
          <div className="rounded-lg border-4 border-black bg-[#161616] shadow-[6px_6px_0_0_#000] overflow-hidden">
            <ul className="divide-y divide-white/10">
              {nextUp.map((r) => (
                <li key={r.time + r.title} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 px-4 py-3">
                  <span className="text-lg font-bold text-[#ffb000] tabular-nums">{r.time}</span>
                  <span className="truncate text-lg font-bold uppercase tracking-wide text-white">{r.title}</span>
                  <span className="border border-white/30 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white/80">{r.venue}</span>
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

        <section className="relative grid md:grid-cols-5 overflow-hidden bg-[#a1001a]">
          <div className="md:col-span-3 bg-[#f5edd8] text-[#1a0505] px-8 sm:px-14 py-16 md:rounded-r-[50%] md:pr-28 relative z-10">
            <h2 className={`text-4xl sm:text-6xl text-[#7a1c1c] leading-[0.95] ${serif.className}`}>Ready<br />to compete?</h2>
            <p className="text-xl leading-snug mt-4 max-w-md">
              Register with your OPJU email to get free entry. External participants get a unique TRX27 ID.
            </p>
            <div className="mt-7"><BlockButton href="/auth/signup">Create your account</BlockButton></div>
          </div>
          <div className="md:col-span-2 indie-mandala relative flex items-center justify-center py-12 md:border-l-4 md:border-dashed md:border-[#f5c928]">
            <Vinyl className="w-48 h-48 sm:w-56 sm:h-56 drop-shadow-[6px_6px_0_rgba(0,0,0,0.4)]" />
          </div>
        </section>

        <Marquee
          className="bg-[#ff6a00] text-black font-bold uppercase tracking-wider text-lg py-1.5"
          text="Techno-aiMBiAtion 2027 ✦ O.P. Jindal University ✦ See you there ✦ "
          speed={40}
        />
      </div>
    </PageShell>
  );
}
