import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/indie";
import { FEST_START } from "@/data/dummy";
import { Sparkle, Star } from "./hero-art";
import { HeroCountdown } from "./hero-countdown";
import { sans } from "./fonts";

const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")";

const delay = (i: number) => ({ ["--i" as string]: i });

const pill = `inline-block rounded-full border-[3px] border-[#1c1812] px-[1.8em] py-[.75em] text-[1.2em] font-extrabold uppercase tracking-wide transition hover:-translate-y-0.5 ${sans.className}`;
const pillShadow = "inset 0 0 0 3px rgba(255,240,210,.55), 0 5px 0 #1c1812";

export function Hero() {
  return (
    <section className="panel relative overflow-hidden bg-[#f2b31c] [--ray-y:33%] md:[--ray-y:42%]" style={{ minHeight: "calc(100vh - 4rem)" }}>
      {/* sunburst rays from the centre (behind the logo), halftone + paper grain */}
      {/* Static rays at hero size (a spinning 300vmax layer was the page's biggest scroll cost). */}
      <div aria-hidden className="absolute inset-0" style={{ background: "repeating-conic-gradient(from 0deg at 50% var(--ray-y), #f5c928 0deg 7deg, #e9a11a 7deg 14deg)" }} />
      {/* the same rays shifted half a stripe, fading in and out: the stripes swap and shimmer, and only opacity animates */}
      <div aria-hidden className="hi-shimmer absolute inset-0" style={{ background: "repeating-conic-gradient(from 7deg at 50% var(--ray-y), #f5c928 0deg 7deg, #e9a11a 7deg 14deg)" }} />
      {/* rings of light pulsing out from behind the logo (scale + opacity only, no mask) */}
      {[0].map((d) => (
        <div key={d} aria-hidden className="hi-warp absolute h-[110vmax] w-[110vmax] rounded-full"
          style={{ ["--d" as string]: d, left: "calc(50% - 55vmax)", top: "calc(var(--ray-y) - 55vmax)", background: "radial-gradient(circle closest-side, transparent 60%, rgba(255,248,220,.55) 78%, transparent 95%)" }} />
      ))}
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% var(--ray-y), rgba(255,236,170,.75), transparent 38%)" }} />
      <div aria-hidden className="absolute inset-0 indie-halftone opacity-[0.12]" />
      <div aria-hidden className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: NOISE }} />
      <div aria-hidden className="hi-sweep pointer-events-none absolute inset-0 z-20" style={{ background: "linear-gradient(105deg, transparent 38%, rgba(255,240,200,.55) 50%, transparent 62%)", mixBlendMode: "screen" }} />

      <div className="panel-inner relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1400px] flex-col items-center justify-center px-[clamp(16px,4vw,64px)] pb-[clamp(90px,12vh,160px)] pt-[clamp(24px,4vh,64px)] text-center">
        {/* the intro flies its copy of this logo onto [data-hero-lockup] */}
        <div data-hero-lockup="" className="w-full max-w-[640px] md:w-[min(52vw,88vh)] md:max-w-none">
          <Image
            src="/images/brand/logo.webp"
            alt="Techno-aiMBiAtion '27 — 16th edition, Vol. 1, OP Jindal University"
            width={1600} height={957} priority sizes="(min-width: 768px) 52vw, 100vw"
            className="h-auto w-full"
            style={{ filter: "drop-shadow(0 0 10px rgba(255,244,200,.9)) drop-shadow(0 0 28px rgba(255,200,90,.6))" }}
          />
        </div>

        <p className={`hero-in mx-auto mt-[.8em] max-w-[34em] text-[clamp(15px,min(1.35vw,2.4vh),28px)] font-semibold leading-snug text-[#1c1812] ${sans.className}`} style={delay(2)}>
          The annual flagship festival of O.P. Jindal University. Compete, collaborate and create — across Tech, Robotics, Culture &amp; more.
        </p>

        <div className="hero-in mt-6 flex flex-wrap justify-center gap-4" style={{ ...delay(3), fontSize: "clamp(11px, min(1.05vw, 1.9vh), 22px)" }}>
          <Link href="/auth/signup" className={`${pill} text-[#1c1812]`} style={{ background: "linear-gradient(180deg,#ffa63d,#ef5a1c)", boxShadow: pillShadow }}>Register now!</Link>
          <Link href="/events" className={`${pill} text-[#f3e8cf]`} style={{ background: "linear-gradient(180deg,#178f8c,#0e5b57)", boxShadow: pillShadow }}>Browse events</Link>
        </div>

        {/* countdown to the fest, with the dates under it */}
        <div className="hero-in mt-7" style={{ ...delay(4), fontSize: "clamp(12px, min(1.05vw, 2vh), 19px)" }}>
          <HeroCountdown to={FEST_START} />
        </div>
      </div>

      {/* corner doodles */}
      <Star fill="#ff2d8a" className="hi-pop pointer-events-none absolute right-[4%] top-[10%] hidden h-[clamp(28px,3vw,64px)] w-[clamp(28px,3vw,64px)] rotate-12 md:block" />
      <Star fill="#0e7c7b" className="hi-pop pointer-events-none absolute bottom-[20%] left-[4%] hidden h-[clamp(24px,2.4vw,52px)] w-[clamp(24px,2.4vw,52px)] -rotate-6 md:block" />
      <Sparkle fill="#ff2d8a" className="hi-twinkle pointer-events-none absolute left-[12%] top-[14%] hidden h-[1.6vw] w-[1.6vw] md:block" />
      <Sparkle fill="#0e7c7b" className="hi-twinkle pointer-events-none absolute bottom-[26%] right-[10%] hidden h-[1.4vw] w-[1.4vw] md:block" />

      <Marquee
        className={`hi-rise absolute inset-x-[-2%] bottom-[2%] z-10 -rotate-[1.4deg] !border-y-[3px] !border-[#1c1812] bg-[#f3e8cf] py-[.5em] text-[clamp(16px,min(2vw,3.6vh),44px)] font-extrabold uppercase tracking-wide text-[#1c1812] ${sans.className}`}
        text="Compete ★ Collaborate ★ Create ★ Join the riot ★ "
        speed={45}
        style={{ ["--d" as string]: 0.6 }}
      />
    </section>
  );
}
