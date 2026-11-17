import Link from "next/link";
import { Marquee } from "@/components/indie";
import { FEST_START } from "@/data/dummy";
import { CREAM, INK, Sparkle, Star } from "./hero-art";
import { Lockup } from "./lockup";
import { HeroCountdown } from "./hero-countdown";
import { sans } from "./fonts";

const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")";

const delay = (i: number) => ({ ["--i" as string]: i });

const btn = `inline-block border-[.14em] px-[1.6em] py-[.8em] text-[1.25em] font-extrabold uppercase tracking-wide text-[#1c1812] transition hover:-translate-y-0.5 ${sans.className}`;

export function Hero() {
  return (
    <section className="panel relative overflow-hidden bg-[#efe2c4] p-[clamp(8px,1vw,20px)]" style={{ minHeight: "calc(100vh - 4rem)" }}>
      <div className={`relative h-full w-full overflow-hidden ${sans.className}`} style={{ minHeight: "calc(100vh - 4rem - 2 * clamp(8px, 1vw, 20px))", background: "radial-gradient(ellipse 45% 60% at 74% 42%, rgba(150,225,215,.38), transparent 70%), radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,.6) 100%), linear-gradient(100deg,#070b14 0%,#0e1a2b 42%,#3f8a92 100%)" }}>
        {/* paper grain, halftone edge, teal wash */}
        <div aria-hidden className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: NOISE }} />
        <div aria-hidden className="absolute inset-y-0 left-0 w-[30%]" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(200,90,50,.7) 1.3px, transparent 1.8px)", backgroundSize: "6px 6px", WebkitMask: "linear-gradient(90deg,#000,transparent)", mask: "linear-gradient(90deg,#000,transparent)" }} />
        <div aria-hidden className="absolute inset-y-0 right-0 w-[26%]" style={{ background: "linear-gradient(90deg,transparent,rgba(110,200,190,.45))" }} />

        <div aria-hidden className="hi-sweep pointer-events-none absolute inset-0 z-20" style={{ background: "linear-gradient(105deg, transparent 38%, rgba(255,214,140,.5) 50%, transparent 62%)", mixBlendMode: "screen" }} />

        <div className="panel-inner relative mx-auto grid w-full max-w-[2200px] items-center gap-4 px-[clamp(12px,3vw,40px)] pb-[clamp(70px,min(8.5vw,11vh),170px)] pt-[clamp(56px,min(5.5vw,7vh),120px)] md:grid-cols-[1.08fr_1fr]">
          <div className="text-center md:text-left">
            <Lockup />

            <p className="hero-in mx-auto mt-[1em] max-w-[34em] text-[clamp(14px,min(1.45vw,2.7vh),32px)] font-medium leading-snug text-[#efe2c4] md:mx-0" style={delay(2)}>
              The annual flagship festival of O.P. Jindal University. Compete, collaborate and create — across Tech, Robotics, Culture &amp; more.
            </p>

            <div className="hero-in mt-6 flex flex-wrap justify-center gap-5 md:justify-start" style={{ ...delay(3), fontSize: "clamp(11px, min(1.1vw, 2vh), 24px)" }}>
              <Link href="/auth/signup" className={`${btn} bg-[#e0b02e]`} style={{ borderColor: INK, boxShadow: `0 0 0 .2em ${CREAM}, 0 0 0 .3em ${INK}, .35em .45em 0 .3em rgba(0,0,0,.45)` }}>Register now!</Link>
              <Link href="/events" className={`${btn} bg-[#f3e8cf]`} style={{ borderColor: INK, boxShadow: `0 0 0 .2em ${CREAM}, 0 0 0 .3em ${INK}, .35em .45em 0 .3em rgba(0,0,0,.45)` }}>Browse events</Link>
            </div>
          </div>

          <div className="hero-in" style={delay(2)}><HeroCountdown to={FEST_START} /></div>
        </div>

        {/* corner doodles */}
        <Star hatch fill="#15120d" className="hi-pop pointer-events-none absolute bottom-[14%] left-[1.5%] hidden h-[clamp(34px,4.2vw,96px)] w-[clamp(34px,4.2vw,96px)] -rotate-12 md:block" />
        <Star className="hi-pop pointer-events-none absolute bottom-[8%] left-[4.2%] hidden h-[clamp(22px,2.6vw,60px)] w-[clamp(22px,2.6vw,60px)] rotate-6 md:block" />
        <Sparkle fill="#efe2c4" className="hi-twinkle pointer-events-none absolute left-[2%] top-[36%] hidden h-[1.6vw] w-[1.6vw] md:block" />
        <Sparkle className="hi-twinkle pointer-events-none absolute bottom-[26%] right-[44%] hidden h-[1.4vw] w-[1.4vw] md:block" />

        <Marquee
          className={`hi-rise absolute inset-x-[-2%] bottom-[2%] z-10 -rotate-[1.6deg] !border-y-[3px] !border-[#2a2118] bg-[#efe2c4] py-[.55em] text-[clamp(16px,min(2vw,3.6vh),46px)] font-extrabold uppercase tracking-wide text-[#1c1812] ${sans.className}`}
          text="Compete ★ Collaborate ★ Create ★ Join the riot ★ "
          speed={45}
          style={{ ["--d" as string]: 0.6 }}
        />
      </div>
    </section>
  );
}
