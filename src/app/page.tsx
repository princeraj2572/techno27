import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-festival-radial">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 space-y-6">
        <p className="text-xs uppercase tracking-[0.35em] text-aurora-300/80 font-medium">
          Op Jindal University • 2027
        </p>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          Techno<span className="text-aurora-400">rollix</span>
          <br />
          2027
        </h1>
        <p className="max-w-xl text-lg text-slate-300 leading-relaxed">
          The annual flagship technical festival of O.P. Jindal University.
          Compete, collaborate, and create — across 20+ events in Tech, Robotics, Coding &amp; more.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="rounded-full bg-aurora-300 px-8 py-3.5 font-semibold text-night-950 transition hover:bg-aurora-400 text-sm"
          >
            Register Now
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-aurora-300/40 px-8 py-3.5 font-semibold text-aurora-300 transition hover:bg-aurora-300/10 text-sm"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-20 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {[
          { val: "20+", label: "Events" },
          { val: "2k+", label: "Expected Participants" },
          { val: "₹5L+", label: "Prize Pool" },
          { val: "3", label: "Days" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <div className="text-3xl font-bold text-aurora-300">{s.val}</div>
            <div className="text-sm text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            icon: "🏆",
            title: "Competitive Events",
            desc: "Hackathon, Robo Race, Coding Contest, Circuit Design, and many more.",
          },
          {
            icon: "🎭",
            title: "Cultural & Fun",
            desc: "LAN Gaming, Photography Challenge, Quiz, and interactive workshops.",
          },
          {
            icon: "🤝",
            title: "Team Up",
            desc: "Invite team members, track invitations, and compete together.",
          },
        ].map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <div className="text-3xl mb-3">{c.icon}</div>
            <h3 className="font-semibold text-white text-lg mb-2">{c.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <div className="rounded-3xl border border-aurora-300/20 bg-aurora-300/5 p-10 shadow-glow">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to compete?</h2>
          <p className="text-slate-400 mb-6 text-sm">
            Register with your OPJU email to get free entry. External participants get a unique TRX27 ID.
          </p>
          <Link
            href="/auth/signup"
            className="rounded-full bg-aurora-300 px-8 py-3 font-semibold text-night-950 transition hover:bg-aurora-400 text-sm"
          >
            Create your account
          </Link>
        </div>
      </section>
    </main>
  );
}
