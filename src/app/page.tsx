import Link from "next/link";
import { PUBLIC_EVENTS } from "@/data/public-events";
import { SCHEDULE } from "@/data/schedule";
import { PRONITES } from "@/data/dummy";
import {
  ACCENTS, Band, BlockButton, Marquee, Note, PageShell, Vinyl, Wheel, display, serif,
} from "@/components/indie";

const NOTES = [
  { tag: "Open", date: "Registrations", title: "Registrations are open", text: "Sign up with your OPJU email for free entry, or as an external participant with a TRX27 ID." },
  { tag: "Teams", date: "Dashboard", title: "Build your team", text: "Invite members from your dashboard and track who has accepted before the deadline." },
  { tag: "Stay", date: "Accommodation", title: "Need a place to stay?", text: "Apply for accommodation from your dashboard once you have registered for an event." },
];

const STEPS = [
  { n: "1", title: "Sign up", desc: "Use your OPJU email for free entry." },
  { n: "2", title: "Pick events", desc: "Choose solo or team events." },
  { n: "3", title: "Pay & confirm", desc: "Submit payment, get your QR pass." },
  { n: "4", title: "Show up", desc: "Scan at check-in and compete." },
];

export default function HomePage() {
  const totalSub = PUBLIC_EVENTS.reduce((n, e) => n + e.subEvents.length, 0);
  const stats = [
    { val: `${PUBLIC_EVENTS.length}`, label: "Flagship events" },
    { val: `${totalSub}+`, label: "Competitions" },
    { val: "2k+", label: "Expected participants" },
    { val: "₹5L+", label: "Prize pool" },
  ];
  const nextUp = SCHEDULE[0].items.slice(0, 4);

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden indie-mandala bg-[#7a1c1c]">
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(58,8,8,0.85) 0%, rgba(122,28,28,0.55) 50%, rgba(246,95,0,0.85) 100%)" }} />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-24 md:pb-32 grid md:grid-cols-2 gap-6 items-center min-h-[34rem]">
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

          {/* the wheel */}
          <div className="relative mx-auto w-72 sm:w-96 md:w-[30rem] md:-mr-24 aspect-square">
            <Wheel className="h-full w-full drop-shadow-[10px_10px_0_rgba(0,0,0,0.45)]" />
            <Link
              href="/auth/signup"
              className="absolute left-1/2 top-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center text-[10px] sm:text-sm font-bold uppercase tracking-widest text-[#f5c928] hover:text-white"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      <Marquee
        className="bg-[#ff6a00] text-black font-bold uppercase tracking-wider text-xl py-1.5 -rotate-1 -mt-5 relative z-10"
        text="Join the riot ✦ Compete ✦ Collaborate ✦ Create ✦ "
      />

      {/* What's new — crimson band with pinned notes */}
      <Band tone="crimson" zigzag="#f5c928" mandala>
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

      {/* Pronites — purple band */}
      <Band tone="indigo">
        <div className="text-center">
          <p className="inline-block border border-[#f5c928]/60 px-3 py-0.5 text-xs font-bold uppercase tracking-[0.35em] text-[#f5c928]">After dark</p>
          <h2 className="mt-4 text-6xl sm:text-8xl font-bold uppercase leading-none text-[#f5edd8]">Pronites</h2>
          <p className="mt-2 text-2xl sm:text-4xl font-bold uppercase">
            The nights that <span className="text-[#f5c928]">light up</span> the campus
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PRONITES.map((n, i) => (
            <div key={n.n} className={`rounded-2xl border border-white/20 bg-white/5 p-6 text-center ${i === 1 ? "sm:-translate-y-3" : ""}`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f5c928]">Night {n.n} · {n.date.split(", ").slice(1).join(", ").replace(", 2027", "")}</p>
              <p className={`mt-3 text-2xl text-[#f5edd8] ${display.className}`}>{n.artist}</p>
              <p className="mt-1 text-sm uppercase tracking-widest text-white/50">{n.genre} · {n.time}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/pronites" className="inline-block border-2 border-[#f5edd8] px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-[#f5edd8] hover:text-black transition-colors">
            Enter after dark ↗
          </Link>
        </div>
      </Band>

      {/* Events — blue band */}
      <Band tone="blue" ghost="Something for every genre" className="!px-0">
        <div className="px-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className={`text-6xl sm:text-8xl indie-outline ${serif.className}`}>Events</h2>
            <p className="text-3xl font-bold uppercase text-[#f5edd8] mt-2">
              Tune into the <span className="text-[#f5c928]">fest.</span>
            </p>
          </div>
          <BlockButton href="/events" tone="mustard">Browse all {PUBLIC_EVENTS.length} events →</BlockButton>
        </div>
        <div className="indie-hscroll flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 pb-6">
          {PUBLIC_EVENTS.map((e, i) => (
            <Link key={e.slug} href={`/events/${e.slug}`} className="snap-start shrink-0 w-64 group">
              <div className={`${ACCENTS[i % ACCENTS.length]} text-black border-2 border-black shadow-[5px_5px_0_0_#000] rounded-2xl p-5 h-48 flex flex-col justify-between group-hover:-translate-y-1 transition-transform`}>
                <span className="text-sm font-bold tracking-widest">{String(i + 1).padStart(2, "0")} / {PUBLIC_EVENTS.length}</span>
                <div>
                  <p className={`text-2xl leading-tight ${display.className}`}>{e.name}</p>
                  <p className="text-sm font-bold uppercase tracking-wider mt-1 opacity-70">
                    {e.subEvents.length > 0 ? `${e.subEvents.length} competitions` : "Marquee event"} · {e.category}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Band>
      <Marquee
        className="bg-black text-white font-bold uppercase tracking-wider text-lg py-2"
        text={`${PUBLIC_EVENTS.map((e) => e.name).join(" • ")} • `}
        speed={60}
      />

      {/* Numbers — cream band */}
      <Band tone="cream">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-5xl sm:text-6xl font-bold uppercase leading-none text-[#1a0505]">Fest by the</p>
            <p className="text-6xl sm:text-8xl font-bold uppercase leading-none text-[#7a1c1c]">Numbers</p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-5xl sm:text-6xl font-bold leading-none text-[#7a1c1c]">{s.val}</p>
                  <p className="text-lg font-bold uppercase tracking-wider text-[#1a0505]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-64 sm:w-80 aspect-square">
            <Vinyl className="w-full h-full drop-shadow-[8px_8px_0_rgba(0,0,0,0.35)]" slow />
            <span className="indie-wobble absolute top-2 right-0 bg-[#f5c928] text-black text-sm font-bold uppercase tracking-widest px-3 py-1 border-2 border-black">
              Hit record
            </span>
          </div>
        </div>
      </Band>

      {/* Departures preview — dark board on red */}
      <Band tone="crimson" mandala>
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
      </Band>

      {/* Creatorverse — pop-art band */}
      <Band tone="pink" halftone>
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
      </Band>

      {/* Steps — orange mandala */}
      <Band tone="orange" mandala>
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
      </Band>

      {/* CTA — cream arc + record */}
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
    </PageShell>
  );
}
