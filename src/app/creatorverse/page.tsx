import { Band, BlockButton, Marquee, PageShell, TicketCta, display } from "@/components/indie";
import { CREATOR_PERKS, FEATURED_CREATIONS } from "@/data/dummy";
import { Reveal } from "@/components/indie/motion";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

// Official fest channels (same links as the site's social footer).
const COMMUNITY = [
  { name: "Instagram", text: "Behind-the-scenes, reels and the creator spotlight.", cta: "Follow", href: "https://www.instagram.com/technoaimbiation/", Icon: FaInstagram, bg: "bg-[#ff2d8a]" },
  { name: "WhatsApp", text: "Ask the team anything about Creatorverse.", cta: "Message", href: "https://wa.me/+918839171099", Icon: FaWhatsapp, bg: "bg-[#ffc107]" },
  { name: "Facebook", text: "Fest updates, photo drops and announcements.", cta: "Follow", href: "https://www.facebook.com/share/15rh7M4fp4/", Icon: FaFacebookF, bg: "bg-[#3b82f6]" },
];

export const metadata = { title: "Creatorverse | Techno-aiMBiAtion 2027" };

// PLACEHOLDER programme — replace with the real Creatorverse steps and perks.
const STEPS = [
  { n: "01", title: "Pick your craft", back: "Photography, film, design or writing — choose what you love.", bg: "bg-[#ffc107]" },
  { n: "02", title: "Make it", back: "Create something that captures the spirit of the fest.", bg: "bg-[#ff6a00]" },
  { n: "03", title: "Tag it right", back: "Share your work with the official festival tags.", bg: "bg-[#ff2d8a]" },
  { n: "04", title: "Get featured", back: "The best pieces are showcased across the festival.", bg: "bg-[#7c3aed] text-white" },
  { n: "05", title: "Stay in the loop", back: "Join the creator community for updates and perks.", bg: "bg-[#3b82f6] text-white" },
];

export default function CreatorversePage() {
  return (
    <PageShell>
      <Reveal><Band tone="pink" halftone className="!py-14">
        <p className="text-sm font-bold uppercase tracking-[0.3em]">Creatorverse</p>
        <h1 className="mt-3 leading-[0.88]">
          <span className="block text-7xl sm:text-9xl font-bold uppercase indie-outline-dark">Make</span>
          <span className="block text-7xl sm:text-9xl font-bold uppercase text-black">Share</span>
          <span className="block text-7xl sm:text-9xl font-bold uppercase indie-outline-dark">Shine</span>
        </h1>
        <p className="mt-6 max-w-xl text-2xl font-semibold leading-snug">
          A platform to showcase your creativity at the fest. Whether you create to entertain, inspire or simply express yourself — this is your stage.
        </p>
        <div className="mt-6"><BlockButton href="/auth/signup">Register</BlockButton></div>
      </Band></Reveal>

      <Reveal><Band tone="cream" className="!px-4">
        <h2 className={`text-4xl sm:text-5xl text-black mb-8 px-2 ${display.className}`}>What&apos;s your job?</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} tabIndex={0} className="flip h-56 outline-none">
              <div className="flip-inner h-full w-full">
                <div className={`flip-face flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-black ${s.bg} p-4 text-center shadow-[5px_5px_0_0_#000]`}>
                  <span className="rounded-full border border-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">Step {s.n}</span>
                  <span className="text-2xl font-bold uppercase leading-tight">{s.title}</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-70">Flip ↻</span>
                </div>
                <div className="flip-face flip-back flex items-center justify-center rounded-xl border-2 border-black bg-black p-4 text-center shadow-[5px_5px_0_0_#000]">
                  <span className="text-lg font-semibold leading-snug text-[#f5edd8]">{s.back}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Band></Reveal>

      <Marquee className="bg-white text-black font-bold uppercase tracking-widest text-lg py-1.5" text="Perks & rewards ✦ Features ✦ Merch ✦ Community ✦ " speed={40} />

      <Reveal><Band tone="pink" halftone className="!py-14">
        <h2 className={`text-4xl sm:text-5xl text-black mb-8 ${display.className}`}>Featured creations</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_CREATIONS.map((c, i) => (
            <figure key={c.title} className={`border-2 border-black bg-[#f5edd8] p-2.5 text-black shadow-[5px_5px_0_0_#000] ${i % 2 ? "rotate-1" : "-rotate-1"} transition-all hover:rotate-0 hover:-translate-y-1`}>
              <div className={`flex aspect-square items-center justify-center border-2 border-black bg-gradient-to-br ${c.bg}`}>
                <span className="text-6xl drop-shadow-[3px_3px_0_rgba(0,0,0,0.35)]" aria-hidden>{c.icon}</span>
              </div>
              <figcaption className="mt-2">
                <p className="text-base font-bold uppercase leading-tight">{c.title}</p>
                <p className="text-xs uppercase tracking-wider text-black/60">{c.kind} · {c.by}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-xs uppercase tracking-widest text-black/60">Sample work — all creators and titles are fictional.</p>
      </Band></Reveal>

      <Reveal><Band tone="cream" className="!py-12">
        <h2 className={`text-4xl text-black mb-6 ${display.className}`}>Perks &amp; rewards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CREATOR_PERKS.map((p, i) => (
            <div key={p.title} className="border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]">
              <span className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black text-lg font-bold ${["bg-[#ffc107]","bg-[#ff6a00]","bg-[#ff2d8a]","bg-[#3b82f6] text-white"][i]}`}>{i + 1}</span>
              <p className="text-xl font-bold uppercase tracking-wide text-black">{p.title}</p>
              <p className="mt-1 text-base leading-snug text-black/70">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs uppercase tracking-widest text-black/50">Sample perks — to be confirmed.</p>
      </Band></Reveal>

      <Reveal><Band tone="indigo" halftone className="!py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="inline-block -rotate-2 border-2 border-black bg-[#ff2d8a] px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-black shadow-[3px_3px_0_0_#000]">Join the crew</span>
            <h2 className={`mt-4 text-5xl sm:text-6xl leading-[0.95] text-[#f5edd8] ${display.className}`}>Community<br /><span className="text-[#ffc107]">connect</span></h2>
            <p className="mt-4 max-w-md text-lg leading-snug text-[#f5edd8]/80">
              Find your people. Follow the fest, swap ideas with other creators and be first to hear about calls, meetups and features.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {COMMUNITY.map((c, i) => (
              <a key={c.name} href={c.href} target="_blank" rel="noopener noreferrer"
                className={`group flex flex-col justify-between gap-6 rounded-xl border-2 border-black ${c.bg} p-5 text-black shadow-[5px_5px_0_0_#000] transition-transform duration-200 ${i % 2 ? "rotate-2" : "-rotate-2"} hover:rotate-0 hover:-translate-y-1 focus-visible:rotate-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffc107]`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-[#f5edd8] shadow-[2px_2px_0_0_#000]"><c.Icon size={22} aria-hidden /></span>
                <span>
                  <span className="block text-2xl font-bold uppercase leading-none">{c.name}</span>
                  <span className="mt-1 block text-sm leading-snug opacity-80">{c.text}</span>
                  <span className="mt-3 inline-block text-xs font-bold uppercase tracking-widest">{c.cta} <span className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </Band></Reveal>

      <TicketCta title="Got something to show?" text="Register and join the creator community at Techno-aiMBiAtion." href="/auth/signup" label="Register now" />
    </PageShell>
  );
}
