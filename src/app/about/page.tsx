import { PUBLIC_EVENTS } from "@/data/public-events";
import { CtaBand, PageShell, SceneHeader, SectionHead, serif } from "@/components/heritage";

export const metadata = { title: "About | Techno-aiMBiAtion 2027" };

const PILLARS = [
  { n: "01", title: "Create", desc: "Ideathons, hackathons and design challenges where ideas become working things." },
  { n: "02", title: "Build", desc: "Robotics, tech labs and coding contests for people who like to tinker." },
  { n: "03", title: "Perform", desc: "Music, fashion, art and food — the cultural side of the fest." },
  { n: "04", title: "Connect", desc: "Meet students from other colleges, form teams, and make friends." },
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
      <SceneHeader>
        <SectionHead
          title="ABOUT"
          sub="Innovation • Culture • Community"
          text="The annual flagship festival of O.P. Jindal University — where technology, creativity and culture share one stage."
        />
      </SceneHeader>

      {/* Story */}
      <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.4em]">Our story</span>
            <span className="h-px flex-1 bg-gradient-to-r from-[#9b111e] to-transparent" />
          </div>
          <h2 className={`text-4xl sm:text-5xl font-bold leading-[1.1] ${serif.className}`}>
            More Than A Fest,<br /><span className="text-[#7a0c14]">A Movement</span>
          </h2>
          <p className="text-lg leading-relaxed text-[#1c0b09]/80">
            Techno-aiMBiAtion brings OPJU&apos;s students together around the things they build and the things they love. Every year it grows — more events, more colleges, more people on stage.
          </p>
          <p className="text-lg leading-relaxed text-[#1c0b09]/80">
            It is run by students, for students: from the website and registrations to stage, sound and hospitality.
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/fort.jpg" alt="A hilltop fort glowing at sunrise" className="w-full h-auto rounded-xl" />
      </section>

      {/* Numbers */}
      <section className="her-brush her-mandala text-white">
        <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-3 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className={`text-4xl sm:text-6xl font-bold ${serif.className}`}>{s.val}</p>
              <p className="mt-2 text-[11px] sm:text-xs uppercase tracking-[0.3em] text-white/80">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <SectionHead title="What it's about" className="mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PILLARS.map((p) => (
            <div key={p.title} className="flex gap-4 rounded-xl border border-[#c9a27a]/60 bg-[#fffaf0]/90 p-5">
              <span className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-b from-[#c1121f] to-[#6e0b12] text-white text-sm font-bold flex items-center justify-center">
                {p.n}
              </span>
              <div>
                <h3 className={`text-xl font-bold ${serif.className}`}>{p.title}</h3>
                <p className="text-[#1c0b09]/75 leading-snug mt-1">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className={`text-3xl font-bold mb-6 ${serif.className}`}>Good to know</h2>
        <div className="rounded-xl border border-[#c9a27a]/60 bg-[#fffaf0]/90 divide-y divide-[#c9a27a]/40 overflow-hidden">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold">
                {f.q}
                <span className="text-2xl text-[#9b111e] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-[#1c0b09]/75 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <CtaBand
        title="Be part of it"
        text="Register with your OPJU email to get free entry, or sign up as an external participant."
        href="/auth/signup"
        label="Create your account"
      />
    </PageShell>
  );
}
