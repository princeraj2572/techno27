import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EVENT_CATEGORIES, PUBLIC_EVENTS } from "@/data/public-events";
import { EventIcon } from "@/components/event-icons";
import {
  BTN_INK, BTN_RED, CtaBand, MAROON_GRADIENT, PageShell, SectionHead, blackletter, serif,
} from "@/components/heritage";

const CATEGORY_CARDS: Record<string, { iconKey: string; blurb: string }> = {
  Technical: { iconKey: "code", blurb: "Code, build, hack and design." },
  Cultural: { iconKey: "palette", blurb: "Music, art, dance and fashion." },
  Management: { iconKey: "trend", blurb: "Plan, pitch, debate and lead." },
  Fun: { iconKey: "compass", blurb: "Games, food and adventure." },
};

const STEPS = [
  { n: "01", title: "Sign up", desc: "Use your OPJU email for free entry." },
  { n: "02", title: "Pick events", desc: "Choose solo or team events." },
  { n: "03", title: "Pay & confirm", desc: "Submit payment, get your QR pass." },
  { n: "04", title: "Show up", desc: "Scan at check-in and compete." },
];

export default function HomePage() {
  const totalSub = PUBLIC_EVENTS.reduce((n, e) => n + e.subEvents.length, 0);
  const stats = [
    { val: `${PUBLIC_EVENTS.length}`, label: "Flagship events" },
    { val: `${totalSub}+`, label: "Competitions" },
    { val: "2k+", label: "Expected participants" },
    { val: "₹5L+", label: "Prize pool" },
  ];

  return (
    <PageShell>
      {/* Hero — plain paper, text only */}
      <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className={`text-6xl sm:text-8xl leading-none text-[#6e0b12] ${blackletter.className}`}>
          Techno-aiMBiAtion
          <span className="block mt-2 text-[#c1121f]">&apos;27</span>
        </h1>
        <p className="mt-6 text-[11px] sm:text-xs uppercase tracking-[0.45em] text-[#1c0b09]/70">
          Ideas · Innovation · People · Impact
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/events" className={BTN_RED}>Explore events <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/auth/signup" className={BTN_INK}>Register now <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      {/* About */}
      <section className="relative max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.4em]">About</span>
            <span className="h-px flex-1 bg-gradient-to-r from-[#9b111e] to-transparent" />
          </div>
          <h2 className={`text-4xl sm:text-5xl font-bold leading-[1.1] ${serif.className}`}>
            More Than<br />A Fest,<br />
            <span className="text-[#7a0c14]">A Movement</span>
          </h2>
          <p className="text-lg leading-relaxed text-[#1c0b09]/80 max-w-md">
            Techno-aiMBiAtion is where innovation meets culture, bringing together curious minds, bold ideas, and endless possibilities.
          </p>
          <Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#9b111e] hover:text-[#6e0b12]">
            Read our story <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/fort.jpg" alt="A hilltop fort glowing at sunrise" className="w-full h-auto rounded-xl" />
      </section>

      {/* Events by category */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <SectionHead
          title="Events"
          sub="Explore • Participate • Excel"
          text="A diverse range of technical, cultural, and management events designed to ignite your curiosity and showcase your talent."
        />
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {EVENT_CATEGORIES.map((c) => {
            const count = PUBLIC_EVENTS.filter((e) => e.category === c).length;
            return (
              <Link key={c} href={`/events?cat=${c}`} className="group">
                <div className="relative h-full rounded-t-[60px] rounded-b-xl bg-[#fffaf0]/90 border border-[#c9a27a]/60 shadow-[0_8px_20px_-12px_rgba(110,11,18,0.5)] px-4 pt-8 pb-5 text-center transition group-hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-[#fde3c6] to-[#fbf3e6] border border-[#c9a27a]/50">
                    <EventIcon name={CATEGORY_CARDS[c].iconKey} className="h-11 w-11 text-[#7a0c14]" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider">{c}<br />Events</h3>
                  <p className="text-xs text-[#1c0b09]/65 mt-1.5">{CATEGORY_CARDS[c].blurb}</p>
                  <p className="text-xs font-semibold text-[#9b111e] mt-1">{count} events</p>
                  <span className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#c1121f] to-[#6e0b12] text-white">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Numbers */}
      <section className="relative overflow-hidden her-brush her-mandala text-white">
        <div className="relative max-w-5xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className={`text-5xl sm:text-6xl font-bold ${serif.className}`}>{s.val}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/80">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="relative max-w-5xl mx-auto px-6 py-20">
        <h2 className={`text-4xl sm:text-5xl font-bold text-center mb-12 ${MAROON_GRADIENT} ${serif.className}`}>How to get in</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#9b111e] text-[#7a0c14] text-lg font-bold bg-[#fffaf0]">
                {s.n}
              </div>
              <p className={`text-xl font-bold ${serif.className}`}>{s.title}</p>
              <p className="text-sm text-[#1c0b09]/70 leading-snug mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBand
        title="Ready to compete?"
        text="Register with your OPJU email to get free entry. External participants get a unique TRX27 ID."
        href="/auth/signup"
        label="Create your account"
      />
    </PageShell>
  );
}
