import { Marquee, PageHeader, PageShell, SectionTitle, TicketCta, CARD, ACCENTS, display } from "@/components/indie";
import { PUBLIC_EVENTS } from "@/data/public-events";

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
    { val: "3", label: "Days" },
    { val: "2k+", label: "Expected participants" },
  ];

  return (
    <PageShell>
      <PageHeader
        kicker="About the fest"
        title="Techno-aiMBiAtion 2027"
        subtitle="The annual flagship festival of O.P. Jindal University — three days where technology, creativity and culture share one stage."
      />

      <section className="py-4">
        <Marquee
          className="bg-[#f5c928] text-black font-bold uppercase tracking-[0.3em] text-xs py-1 rotate-1"
          text="Tech ● Robotics ● Coding ● Design ● Music ● Fashion ● Art ● Food ● "
          speed={45}
          reverse
        />
      </section>

      {/* Story */}
      <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-3 space-y-4 text-xl leading-snug text-[#f5edd8]/85">
          <SectionTitle className="mb-2">Our story</SectionTitle>
          <p>
            Techno-aiMBiAtion started as a way to bring OPJU&apos;s students together around the things they
            build and the things they love. Every year it grows — more events, more colleges, more people on stage.
          </p>
          <p>
            It is run by students, for students: from the website and registrations to stage, sound and hospitality.
            Every department has a convener and a co-convener who make it happen.
          </p>
        </div>
        <div className={`${CARD} md:col-span-2 rounded-xl p-6 rotate-1 relative`}>
          <span className="absolute -top-3 left-5 bg-[#ff6a00] text-black text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 border-2 border-black -rotate-2">
            Liner notes
          </span>
          <p className={`text-2xl leading-tight mb-2 ${display.className}`}>Op Jindal University</p>
          <p className="text-lg text-[#1a0505]/70 leading-snug">Raigarh, Chhattisgarh · 2027 edition</p>
        </div>
      </section>

      {/* Numbers */}
      <section className="max-w-4xl mx-auto px-6 pb-14 grid grid-cols-2 sm:grid-cols-4 gap-5 text-center">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`${ACCENTS[i]} ${i % 2 ? "rotate-1" : "-rotate-1"} text-black border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl p-5 hover:rotate-0 transition-transform`}
          >
            <div className={`text-4xl sm:text-5xl ${display.className}`}>{s.val}</div>
            <div className="text-sm font-bold uppercase tracking-wider mt-2 opacity-75">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Pillars */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <SectionTitle className="mb-8">What it&apos;s about</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PILLARS.map((p, i) => (
            <div key={p.title} className={`${CARD} rounded-xl p-6 flex gap-4 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#000] transition-all`}>
              <div className={`w-12 h-12 shrink-0 rounded-full ${ACCENTS[i]} border-2 border-black flex items-center justify-center text-2xl`}>
                {p.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-wide leading-tight">{p.title}</h3>
                <p className="text-lg leading-snug text-[#1a0505]/70 mt-1">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-14">
        <SectionTitle className="mb-8">Good to know</SectionTitle>
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
      </section>

      <TicketCta
        title="Be part of it"
        text="Register with your OPJU email to get free entry, or sign up as an external participant."
        href="/auth/signup"
        label="Create your account"
      />
    </PageShell>
  );
}
