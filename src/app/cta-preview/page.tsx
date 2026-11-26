// TEMPORARY: side-by-side options for the home "Ready to compete?" section. Delete once one is picked.
import Link from "next/link";
import { ArrowRight, Ticket } from "lucide-react";
import { PageShell, display, serif } from "@/components/indie";
import { sans } from "@/components/home/fonts";

const COPY = "OPJU students get in free with their college email. Everyone else gets a unique TRX27 ID.";
const label = (t: string) => <p className="bg-black py-2 text-center text-lg font-bold uppercase tracking-[0.3em] text-[#f5c928]">{t}</p>;

export default function CtaPreview() {
  return (
    <PageShell footer={false}>
      {label("Option A — big type + spinning badge (currently on home)")}
      <p className="py-6 text-center text-lg text-[#f5edd8]/80">Scroll the home page to the bottom to see A.</p>

      {label("Option B — gold poster, like the hero")}
      <section className="relative overflow-hidden bg-[#f2b31c] px-6 py-20 text-center text-[#1c1812]">
        <div aria-hidden className="absolute inset-0" style={{ background: "repeating-conic-gradient(from 0deg at 50% 120%, #f5c928 0deg 6deg, #e9a11a 6deg 12deg)" }} />
        <div className={`relative ${sans.className}`}>
          <h2 className={`text-[clamp(44px,6.5vw,92px)] leading-[0.9] text-[#f3e8cf] ${display.className}`} style={{ WebkitTextStroke: "3px #1c1812", paintOrder: "stroke fill", textShadow: "0 6px 0 #1c1812" }}>Ready to compete?</h2>
          <p className="mx-auto mt-8 max-w-xl text-xl font-semibold">{COPY}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/auth/signup" className="rounded-full border-[3px] border-[#1c1812] px-8 py-3 text-lg font-extrabold uppercase shadow-[0_5px_0_#1c1812]" style={{ background: "linear-gradient(180deg,#ffa63d,#ef5a1c)" }}>Register now!</Link>
            <Link href="/events" className="rounded-full border-[3px] border-[#1c1812] px-8 py-3 text-lg font-extrabold uppercase text-[#f3e8cf] shadow-[0_5px_0_#1c1812]" style={{ background: "linear-gradient(180deg,#178f8c,#0e5b57)" }}>Browse events</Link>
          </div>
        </div>
      </section>

      {label("Option C — dark stage, spotlights + bulb frame")}
      <section className="relative overflow-hidden bg-[#120d0a] px-4 py-20">
        <div aria-hidden className="absolute inset-0" style={{ background: "conic-gradient(from 160deg at 15% -10%, transparent 0deg, rgba(245,201,40,.22) 12deg, transparent 28deg), conic-gradient(from 172deg at 85% -10%, transparent 0deg, rgba(255,106,0,.2) 14deg, transparent 30deg), radial-gradient(ellipse at 50% 100%, rgba(161,0,26,.45), transparent 60%)" }} />
        <div className="relative mx-auto max-w-4xl rounded-[28px] bg-[#1c1812] p-[14px]" style={{ boxShadow: "0 0 0 3px #f5c928, 0 0 40px rgba(245,201,40,.25)" }}>
          <div aria-hidden className="absolute inset-[5px] rounded-[23px]" style={{ border: "4px dotted #ffe58a", filter: "drop-shadow(0 0 4px #f5c928)" }} />
          <div className="rounded-[18px] border-2 border-[#f5c928]/40 px-6 py-14 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-[#ff6a00]">Now showing · 18 – 20 Feb 2027</p>
            <h2 className={`mt-3 text-5xl text-[#f5c928] sm:text-7xl ${serif.className}`} style={{ textShadow: "0 0 24px rgba(245,201,40,.45), 3px 3px 0 #a1001a" }}>Ready to compete?</h2>
            <p className="mx-auto mt-5 max-w-lg text-xl text-[#f5edd8]/85">{COPY}</p>
            <Link href="/auth/signup" className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#f5c928] px-9 py-3.5 text-xl font-bold uppercase text-[#1c1812] shadow-[0_0_30px_rgba(245,201,40,.6)]"><Ticket className="h-5 w-5" /> Take the stage</Link>
          </div>
        </div>
      </section>

      {label("Option D — teal split with photo slot")}
      <section className="grid bg-[#0e5b57] md:grid-cols-2">
        <div className="flex flex-col justify-center px-8 py-16 sm:px-14">
          <h2 className={`text-5xl leading-[0.95] text-[#f5edd8] sm:text-7xl ${serif.className}`}>Ready to<br /><span className="text-[#f5c928]">compete?</span></h2>
          <p className="mt-5 max-w-md text-xl text-[#f5edd8]/85">{COPY}</p>
          <Link href="/auth/signup" className="mt-8 inline-flex w-fit items-center gap-3 border-2 border-black bg-[#ff6a00] px-7 py-3 text-lg font-bold uppercase text-black shadow-[5px_5px_0_#000]">Create your account <ArrowRight className="h-5 w-5" /></Link>
        </div>
        <div className="relative min-h-[320px] bg-[#0a4441]" style={{ backgroundImage: "radial-gradient(rgba(245,237,216,.12) 1.5px, transparent 1.5px)", backgroundSize: "14px 14px" }}>
          <div className="absolute inset-8 flex rotate-2 items-center justify-center border-[10px] border-[#f5edd8] bg-[#173f3d] shadow-[8px_8px_0_rgba(0,0,0,.4)]">
            <span className="text-center text-sm font-bold uppercase tracking-[0.3em] text-[#f5edd8]/60">Photo from last year&apos;s fest</span>
          </div>
        </div>
      </section>

      {label("Option E — crimson strip, one line")}
      <section className="bg-[#a1001a] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className={`text-4xl text-[#f5c928] sm:text-5xl ${serif.className}`}>Ready to compete?</h2>
            <p className="mt-2 text-lg text-[#f5edd8]/85">{COPY}</p>
          </div>
          <Link href="/auth/signup" className="shrink-0 border-2 border-black bg-[#f5c928] px-8 py-3 text-lg font-bold uppercase text-black shadow-[4px_4px_0_#000]">Register now</Link>
        </div>
      </section>
    </PageShell>
  );
}
