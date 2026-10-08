import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Pirata_One, Playfair_Display } from "next/font/google";

// Shared "heritage sunset" theme: cream paper, crimson brush strokes, ghat-at-sunset art.
export const serif = Playfair_Display({ weight: ["500", "600", "700", "800"], subsets: ["latin"] });
export const blackletter = Pirata_One({ weight: "400", subsets: ["latin"] });

export const INK = "#1c0b09";
export const CREAM = "#fbf3e6";
export const MAROON_GRADIENT = "bg-gradient-to-b from-[#3d0509] to-[#a1121c] bg-clip-text text-transparent";
export const BTN_RED =
  "inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-[#c1121f] to-[#7a0c14] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider shadow-[0_6px_16px_-6px_rgba(122,12,20,0.7)] hover:brightness-110 transition";
export const BTN_INK =
  "inline-flex items-center gap-2 rounded-lg bg-[#1c0b09] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-[#7a0c14] transition";
export const BTN_OUTLINE =
  "inline-flex items-center gap-2 rounded-lg border border-[#1c0b09]/40 text-[#1c0b09] px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-[#1c0b09] hover:text-white transition";

export function HeritageStyles() {
  return (
    <style>{`
      .her-paper {
        background-color: #fbf3e6;
        background-image:
          radial-gradient(circle at 12% 18%, rgba(193,18,31,0.05), transparent 38%),
          radial-gradient(circle at 88% 70%, rgba(240,138,36,0.07), transparent 40%);
      }
      .her-brush { background-color: #9b111e; background-image: linear-gradient(115deg, #4a070c 0%, #9b111e 45%, #d62828 100%); }
      .her-mandala {
        background-image:
          radial-gradient(circle at 50% 50%, transparent 0 9px, rgba(255,226,200,.13) 9px 10.5px, transparent 10.5px 21px, rgba(255,226,200,.1) 21px 22.5px, transparent 22.5px 33px, rgba(255,226,200,.08) 33px 34.5px, transparent 34.5px);
        background-size: 76px 76px;
      }
      .her-brush.her-mandala {
        background-image:
          radial-gradient(circle at 50% 50%, transparent 0 9px, rgba(255,226,200,.13) 9px 10.5px, transparent 10.5px 21px, rgba(255,226,200,.1) 21px 22.5px, transparent 22.5px 33px, rgba(255,226,200,.08) 33px 34.5px, transparent 34.5px),
          linear-gradient(115deg, #4a070c 0%, #9b111e 45%, #d62828 100%);
        background-size: 76px 76px, 100% 100%;
      }
      .her-fade-b { -webkit-mask-image: linear-gradient(to bottom, #000 60%, transparent); mask-image: linear-gradient(to bottom, #000 60%, transparent); }
    `}</style>
  );
}

export function PageShell({ children, footer = true }: { children: ReactNode; footer?: boolean }) {
  return (
    <div className="her-paper min-h-screen text-[#1c0b09] overflow-x-hidden">
      <HeritageStyles />
      {children}
      {footer && <SiteFooter />}
    </div>
  );
}

// Slanted crimson brush shape for corners.
export function Brush({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <div
      aria-hidden
      className={`her-brush her-mandala pointer-events-none absolute ${className}`}
      style={{
        clipPath: flip
          ? "polygon(0 0, 100% 18%, 100% 100%, 12% 100%)"
          : "polygon(0 18%, 100% 0, 88% 100%, 0 100%)",
      }}
    />
  );
}

export function Lotus({ className = "h-9 w-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden>
      <g fill="none" stroke="#9b111e" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M32 6 C26 14 26 24 32 32 C38 24 38 14 32 6Z" />
        <path d="M32 32 C22 30 14 22 12 14 C20 14 28 20 32 32Z" />
        <path d="M32 32 C42 30 50 22 52 14 C44 14 36 20 32 32Z" />
        <path d="M32 32 C20 34 10 30 4 24 C14 22 24 26 32 32Z" />
        <path d="M32 32 C44 34 54 30 60 24 C50 22 40 26 32 32Z" />
      </g>
      <circle cx="32" cy="36" r="1.8" fill="#9b111e" />
    </svg>
  );
}

export function SectionHead({ title, sub, text, className = "" }: { title: string; sub?: string; text?: string; className?: string }) {
  return (
    <div className={`text-center space-y-3 ${className}`}>
      <div className="flex items-center justify-center gap-3">
        <span className="h-px w-16 sm:w-28 bg-[#9b111e]/50" />
        <Lotus />
        <span className="h-px w-16 sm:w-28 bg-[#9b111e]/50" />
      </div>
      <h2 className={`text-5xl sm:text-7xl font-extrabold leading-none ${MAROON_GRADIENT} ${serif.className}`}>{title}</h2>
      {sub && <p className="text-[11px] sm:text-xs uppercase tracking-[0.5em] text-[#1c0b09]/80">{sub}</p>}
      {text && <p className="max-w-xl mx-auto text-base sm:text-lg leading-relaxed text-[#1c0b09]/80">{text}</p>}
    </div>
  );
}

// Page header: sunset scenery that fades into the paper, with brush strokes at the corners.
export function SceneHeader({ children }: { children: ReactNode }) {
  return (
    <header className="relative">
      <div
        aria-hidden
        className="her-fade-b h-56 sm:h-72 bg-cover bg-center"
        style={{ backgroundImage: "url(/art/scene.jpg)" }}
      />
      <Brush className="left-0 top-0 h-24 w-40 sm:h-32 sm:w-64 opacity-95" />
      <Brush flip className="right-0 top-0 h-24 w-32 sm:h-32 sm:w-52 opacity-95" />
      <div className="relative -mt-20 sm:-mt-28 px-6 pb-4">{children}</div>
    </header>
  );
}

export function CtaBand({ title, text, href, label }: { title: string; text: string; href: string; label: string }) {
  return (
    <section className="relative overflow-hidden her-brush her-mandala text-white">
      <div className="relative max-w-3xl mx-auto px-6 py-16 text-center space-y-4">
        <h2 className={`text-4xl sm:text-5xl font-bold ${serif.className}`}>{title}</h2>
        <p className="text-lg text-white/85 leading-relaxed">{text}</p>
        <div className="pt-2">
          <Link href={href} className="inline-flex items-center gap-2 rounded-lg bg-[#1c0b09] text-white px-7 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-white hover:text-[#7a0c14] transition">
            {label} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#240608] text-[#fbf3e6]/85">
      <div className="max-w-5xl mx-auto px-6 py-12 grid sm:grid-cols-3 gap-8">
        <div className="space-y-2">
          <p className={`text-2xl text-[#fbf3e6] ${blackletter.className}`}>Techno-aiMBiAtion &apos;27</p>
          <p className="text-sm leading-relaxed text-[#fbf3e6]/65">The annual flagship festival of O.P. Jindal University — where innovation meets culture.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#f08a24] mb-3">Explore</p>
          <ul className="space-y-1.5 text-sm">
            {[["Home", "/"], ["About", "/about"], ["Events", "/events"], ["Schedule", "/schedule"], ["Gallery", "/gallery"]].map(([l, h]) => (
              <li key={h}><Link href={h} className="hover:text-white">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#f08a24] mb-3">Join in</p>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/auth/signup" className="hover:text-white">Register</Link></li>
            <li><Link href="/auth/login" className="hover:text-white">Sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs tracking-widest text-[#fbf3e6]/45 uppercase">
        © 2027 Techno-aiMBiAtion · O.P. Jindal University
      </div>
    </footer>
  );
}
