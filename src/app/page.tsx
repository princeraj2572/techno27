import Link from "next/link";
import { CARD, Marquee, PageShell, SectionTitle, display } from "@/components/indie";

const STATS = [
  { val: "20+",  label: "Events",                bg: "bg-[#f5c928]", rot: "-rotate-2" },
  { val: "2k+",  label: "Expected Participants", bg: "bg-[#ff6a00]", rot: "rotate-1"  },
  { val: "₹5L+", label: "Prize Pool",            bg: "bg-[#f5edd8]", rot: "-rotate-1" },
  { val: "3",    label: "Days",                  bg: "bg-[#ffb10f]", rot: "rotate-2"  },
];

const CATEGORIES = [
  { icon: "🏆", title: "Competitive Events", desc: "Hackathon, Robo Race, Coding Contest, Circuit Design, and many more.", tag: "Side A", bg: "bg-[#f5c928]" },
  { icon: "🎭", title: "Cultural & Fun",     desc: "LAN Gaming, Photography Challenge, Quiz, and interactive workshops.",  tag: "Side B", bg: "bg-[#ff6a00]" },
  { icon: "🤝", title: "Team Up",            desc: "Invite team members, track invitations, and compete together.",        tag: "Duet",   bg: "bg-[#ffb10f]" },
];

// Placeholder schedule — replace with the real plan.
const TRACKLIST = [
  { n: "01", day: "Day 1", title: "Opening & Workshops",        time: "Inauguration · hands-on sessions" },
  { n: "02", day: "Day 2", title: "Main Events",                time: "Hackathon · Robo Race · Coding Contest" },
  { n: "03", day: "Day 3", title: "Finals, Prizes & Closing",   time: "Final rounds · prize distribution" },
];

const STEPS = [
  { n: "1", title: "Sign up",         desc: "Use your OPJU email for free entry." },
  { n: "2", title: "Pick events",     desc: "Choose solo or team events." },
  { n: "3", title: "Pay & confirm",   desc: "Submit payment, get your QR pass." },
  { n: "4", title: "Show up",         desc: "Scan at check-in and compete." },
];

export default function HomePage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 pt-16 pb-14 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 text-center md:text-left">
          <p className="inline-block bg-[#ff6a00] text-black text-sm font-bold uppercase tracking-[0.25em] px-3 py-1 border-2 border-black -rotate-1">
            Op Jindal University • 2027
          </p>
          <h1
            className={`text-4xl sm:text-6xl text-[#f5c928] leading-[1.05] break-words ${display.className}`}
            style={{ textShadow: "4px 4px 0 #7a1c1c" }}
          >
            Techno-<span className="text-[#ff6a00]">aiMBiAtion</span>
            <br />
            <span className="text-[#f5edd8]">2027</span>
          </h1>
          <p className="max-w-xl text-xl text-[#f5edd8]/80 leading-snug mx-auto md:mx-0">
            The annual flagship technical festival of O.P. Jindal University.
            Compete, collaborate, and create — across 20+ events in Tech, Robotics, Coding &amp; more.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link
              href="/auth/signup"
              className="bg-[#f5c928] text-black border-2 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] transition-all px-8 py-3 text-lg font-bold uppercase tracking-wider rounded-full"
            >
              Register Now
            </Link>
            <Link
              href="/auth/login"
              className="border-2 border-[#f5edd8] text-[#f5edd8] hover:bg-[#f5edd8] hover:text-black transition-colors px-8 py-3 text-lg font-bold uppercase tracking-wider rounded-full"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Turntable */}
        <div className="relative mx-auto w-72 sm:w-80 aspect-square">
          <div className="absolute inset-0 bg-[#e8b030] border-2 border-black rounded-3xl rotate-3 shadow-[8px_8px_0_0_#000]">
            <div className="absolute inset-2 border-2 border-dashed border-black/70 rounded-2xl" />
          </div>
          <svg viewBox="0 0 100 100" className="absolute inset-0 rotate-3" aria-hidden>
            <g className="indie-spin" style={{ transformOrigin: "46px 54px" }}>
              <circle cx="46" cy="54" r="32" fill="#7a1c1c" stroke="#000" strokeWidth="1" />
              {[27, 22, 17, 12].map((r) => (
                <circle key={r} cx="46" cy="54" r={r} fill="none" stroke="#000" strokeWidth="0.5" />
              ))}
              <circle cx="46" cy="54" r="9" fill="#c1880b" stroke="#000" strokeWidth="1" />
              <circle cx="46" cy="54" r="1.5" fill="#000" />
              <text x="46" y="38" textAnchor="middle" fontSize="5" fontWeight="700" fill="#f5edd8">TRX'27</text>
            </g>
            <g className="indie-tonearm">
              <rect x="78" y="8" width="12" height="12" rx="1" fill="#000" />
              <circle cx="84" cy="14" r="2" fill="#f5c928" />
              <line x1="84" y1="20" x2="62" y2="58" stroke="#000" strokeWidth="2" />
              <rect x="58" y="56" width="6" height="9" fill="none" stroke="#000" strokeWidth="1.5" transform="rotate(-30 61 60)" />
            </g>
            <circle cx="16" cy="90" r="4" fill="#5a3d00" stroke="#000" strokeWidth="1" />
          </svg>
          <span className="indie-wobble absolute -top-4 -left-3 bg-[#ff6a00] text-black text-xs font-bold uppercase tracking-widest px-3 py-1 border-2 border-black rounded-full">
            ★ Vol. 1
          </span>
          <span className="absolute -bottom-3 -right-2 bg-[#f5edd8] text-black text-xs font-bold uppercase tracking-widest px-3 py-1 border-2 border-black -rotate-3">
            3 days · 20+ events
          </span>
        </div>
      </section>

      {/* Banners */}
      <section className="py-4 space-y-0">
        <Marquee
          className="bg-[#ff6a00] text-black font-bold uppercase tracking-wider text-xl py-1.5 -rotate-1"
          text="Join the riot ✦ Compete ✦ Collaborate ✦ Create ✦ "
        />
        <Marquee
          className="bg-[#f5c928] text-black font-bold uppercase tracking-[0.3em] text-xs py-1 rotate-1 -mt-1"
          text="Hackathon ● Robo Race ● Coding Contest ● Circuit Design ● LAN Gaming ● Quiz ● "
          speed={45}
          reverse
        />
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-2 sm:grid-cols-4 gap-5 text-center">
        {STATS.map((s) => (
          <div
            key={s.label}
            className={`${s.bg} ${s.rot} text-black border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl p-5 hover:rotate-0 transition-transform`}
          >
            <div className={`text-4xl sm:text-5xl ${display.className}`}>{s.val}</div>
            <div className="text-sm font-bold uppercase tracking-wider mt-2 opacity-75">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <SectionTitle className="mb-8">Pick your record</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CATEGORIES.map((c) => (
            <div key={c.title} className={`${CARD} rounded-xl p-6 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#000] transition-all relative`}>
              <span className={`absolute -top-3 right-4 ${c.bg} text-black text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 border-2 border-black rotate-2`}>
                {c.tag}
              </span>
              <div className={`w-12 h-12 rounded-full ${c.bg} border-2 border-black flex items-center justify-center text-2xl mb-4`}>
                {c.icon}
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-wide leading-tight mb-2">{c.title}</h3>
              <p className="text-lg leading-snug text-[#1a0505]/70">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tracklist */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <SectionTitle className="mb-8">The tracklist</SectionTitle>
        <ol className={`${CARD} rounded-xl overflow-hidden divide-y-2 divide-dashed divide-black/30`}>
          {TRACKLIST.map((t) => (
            <li key={t.n} className="flex items-center gap-4 px-5 py-4 hover:bg-[#f5c928]/30 transition-colors">
              <span className={`text-3xl text-[#ff6a00] w-12 shrink-0 ${display.className}`}>{t.n}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xl font-bold uppercase tracking-wide leading-tight">{t.title}</p>
                <p className="text-base text-[#1a0505]/65">{t.time}</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest bg-black text-[#f5c928] px-2.5 py-1 rounded-full shrink-0">
                {t.day}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <SectionTitle className="mb-8">How to get in</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {STEPS.map((s, i) => (
            <div key={s.n} className={`border-2 border-dashed border-[#f5edd8]/60 rounded-xl p-5 ${i % 2 ? "rotate-1" : "-rotate-1"} hover:rotate-0 transition-transform`}>
              <div className={`w-10 h-10 rounded-full bg-[#f5c928] text-black border-2 border-black flex items-center justify-center text-lg mb-3 ${display.className}`}>
                {s.n}
              </div>
              <p className="text-xl font-bold uppercase tracking-wide">{s.title}</p>
              <p className="text-base text-[#f5edd8]/70 leading-snug mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA ticket */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="relative bg-[#f5c928] text-black border-2 border-black shadow-[6px_6px_0_0_#000] rounded-2xl flex items-stretch overflow-hidden">
          <span aria-hidden className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#4a0e0e] border-2 border-black" />
          <span aria-hidden className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#4a0e0e] border-2 border-black" />
          <div className="flex-1 px-8 py-8 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-70">Admit one · All access</p>
            <h2 className={`text-3xl leading-tight ${display.className}`}>Ready to compete?</h2>
            <p className="text-lg leading-snug">
              Register with your OPJU email to get free entry. External participants get a unique TRX27 ID.
            </p>
            <Link
              href="/auth/signup"
              className="inline-block bg-black text-[#f5c928] hover:bg-[#ff6a00] hover:text-black transition-colors px-7 py-2.5 text-lg font-bold uppercase tracking-wider rounded-full"
            >
              Create your account
            </Link>
          </div>
          <div className="hidden sm:flex border-l-2 border-dashed border-black px-6 flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">No.</p>
            <p className={`text-3xl ${display.className}`}>27</p>
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <Marquee
        className="bg-[#ff6a00] text-black font-bold uppercase tracking-wider text-lg py-1.5"
        text="Techno-aiMBiAtion 2027 ✦ O.P. Jindal University ✦ See you there ✦ "
        speed={40}
      />
    </PageShell>
  );
}
