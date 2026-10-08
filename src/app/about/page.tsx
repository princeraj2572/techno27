import { Band, Marquee, Note, PageHero, PageShell, TicketCta, Vinyl, ACCENTS, CARD, display, serif } from "@/components/indie";
import { PUBLIC_EVENTS } from "@/data/public-events";
import { MILESTONES } from "@/data/dummy";

export const metadata = { title: "About | Techno-aiMBiAtion 2027" };

const PILLARS = [
  { icon: "💡", title: "Create", desc: "Ideathons, hackathons and design challenges where ideas become working things." },
  { icon: "🤖", title: "Build", desc: "Robotics, tech labs and coding contests for people who like to tinker." },
  { icon: "🎭", title: "Perform", desc: "Music, fashion, art and food — the cultural side of the fest." },
  { icon: "🤝", title: "Connect", desc: "Meet students from other colleges, form teams, and make friends." },
];

const FAQ = [
  { q: "Who can participate?", a: "Everyone. OPJU students register with their university email and get free entry. Students from other colleges register as external participants." },
  { q: "What is a TRX27 ID?", a: "External participants get a unique TRX27 ID on registration. It identifies you at check-in and on your QR pass." },
  { q: "Can I join as a team?", a: "Yes. Many events are team events. Invite members from your dashboard and track who has accepted." },
  { q: "Is accommodation available?", a: "Yes. You can apply for accommodation from your dashboard after registering." },
];

export default function AboutPage() {
  const totalSub = PUBLIC_EVENTS.reduce((n, e) => n + e.subEvents.length, 0);
  const stats = [
    { val: `${PUBLIC_EVENTS.length}`, label: "Flagship events" },
    { val: `${totalSub}+`, label: "Competitions" },
    { val: "2k+", label: "Expected participants" },
  ];

  return (
    <PageShell>
      <PageHero tone="crimson" title="About the fest" sub="More than a fest, a movement" ghost="Innovation meets culture" />

      <Marquee className="bg-[#f5c928] text-black font-bold uppercase tracking-[0.3em] text-xs py-1" text="Tech ● Robotics ● Coding ● Design ● Music ● Fashion ● Art ● Food ● " speed={45} reverse />

      {/* Story on pinned notes */}
      <Band tone="crimson" zigzag="#f5c928" mandala>
        <div className="grid md:grid-cols-3 gap-10 items-center">
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-8">
            <Note tag="Story" title="Where it started" tilt="-rotate-2">
              Techno-aiMBiAtion brings OPJU&apos;s students together around the things they build and the things they love. Every year it grows — more events, more colleges, more people on stage.
            </Note>
            <Note tag="People" title="Run by students" tilt="rotate-1">
              From the website and registrations to stage, sound and hospitality, every department has a convener and a co-convener who make it happen.
            </Note>
          </div>
          <div className="hidden md:flex justify-center">
            <Vinyl className="w-52 h-52 drop-shadow-[8px_8px_0_rgba(0,0,0,0.4)]" slow />
          </div>
        </div>
      </Band>

      {/* Numbers */}
      <Band tone="cream">
        <div className="grid grid-cols-3 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-5xl sm:text-7xl font-bold leading-none text-[#7a1c1c]">{s.val}</p>
              <p className="mt-1 text-sm sm:text-lg font-bold uppercase tracking-wider text-[#1a0505]">{s.label}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* Journey */}
      <Band tone="parchment" mandala>
        <h2 className={`text-5xl text-[#7a1c1c] leading-none mb-10 ${serif.className}`}>Our journey</h2>
        <ol className="relative border-l-4 border-dashed border-black/40 pl-8 space-y-8">
          {MILESTONES.map((m) => (
            <li key={m.year} className="relative">
              <span aria-hidden className="absolute -left-[2.85rem] top-1 h-5 w-5 rounded-full border-2 border-black bg-[#f5c928]" />
              <p className={`text-3xl text-[#7a1c1c] ${display.className}`}>{m.year}</p>
              <p className="text-xl font-bold uppercase tracking-wide text-black">{m.title}</p>
              <p className="text-lg leading-snug text-black/70">{m.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-xs uppercase tracking-widest text-black/50">Sample timeline — figures are placeholders.</p>
      </Band>

      {/* Pillars */}
      <Band tone="orange" mandala>
        <h2 className={`text-5xl text-black leading-none mb-8 ${serif.className}`}>What it&apos;s about</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PILLARS.map((p, i) => (
            <div key={p.title} className={`${CARD} rounded-xl p-6 flex gap-4 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#000] transition-all`}>
              <div className={`w-12 h-12 shrink-0 rounded-full ${ACCENTS[i]} border-2 border-black flex items-center justify-center text-2xl`}>{p.icon}</div>
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-wide leading-tight">{p.title}</h3>
                <p className="text-lg leading-snug text-[#1a0505]/70 mt-1">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Band>

      {/* FAQ */}
      <Band tone="indigo">
        <h2 className={`text-4xl sm:text-5xl text-[#f5c928] mb-8 ${display.className}`}>Good to know</h2>
        <div className={`${CARD} rounded-xl overflow-hidden divide-y-2 divide-dashed divide-black/30`}>
          {FAQ.map((f) => (
            <details key={f.q} className="group px-5 py-4 open:bg-[#f5c928]/25">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-xl font-bold uppercase tracking-wide">
                {f.q}
                <span className="text-2xl text-[#ff6a00] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-lg leading-snug text-[#1a0505]/75 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </Band>

      <TicketCta title="Be part of it" text="Register with your OPJU email to get free entry, or sign up as an external participant." href="/auth/signup" label="Create your account" />
    </PageShell>
  );
}
