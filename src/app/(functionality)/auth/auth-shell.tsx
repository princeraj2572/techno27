"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { PageShell, display } from "@/components/indie";
import { mono, sans } from "@/components/home/fonts";
import { EditionSticker, FestLogo, GoldBackdrop, INK, TicketHeader, TicketTitle } from "@/components/indie/gold-poster";

// Auth pages use the shared "gold poster" look (components/indie/gold-poster): sunburst rays and the
// fest's cream "admission ticket" card with ink outlines.
export { INK };

// Re-points the shadcn tokens at the ticket palette so every field inside the card picks it up.
const THEME_CSS = `
  .auth-paper {
    --card: #f3e8cf; --card-foreground: ${INK};
    --foreground: ${INK}; --muted-foreground: rgba(28,24,18,.65);
    --muted: rgba(28,24,18,.1); --border: ${INK}; --input: ${INK};
    --primary: #0e5b57; --primary-foreground: #f3e8cf; --ring: #ef5a1c;
    --secondary: #f5c928; --secondary-foreground: ${INK};
    --destructive: #a1001a; --accent: #f5c928; --accent-foreground: ${INK};
  }
  .auth-paper input, .auth-paper [role="combobox"] { background: #fff; border: 2px solid ${INK}; border-radius: 0; min-height: 2.5rem; }
  .auth-paper label { font-weight: 700; text-transform: uppercase; letter-spacing: .12em; font-size: .7rem; }
  .auth-paper button[type="submit"], .auth-paper button[type="button"]:not([aria-label]):not([role="combobox"]) {
    border: 3px solid ${INK}; font-weight: 800; text-transform: uppercase; letter-spacing: .04em;
  }
  .auth-paper button[type="submit"] {
    border-radius: 9999px; min-height: 2.9rem; color: #f3e8cf;
    background: linear-gradient(180deg, #178f8c, #0e5b57);
    box-shadow: inset 0 0 0 3px rgba(255,240,210,.45), 0 5px 0 ${INK};
    transition: transform .15s ease, filter .15s ease;
  }
  .auth-paper button[type="submit"]:hover:not(:disabled) { filter: brightness(1.12); transform: translateY(-1px); }
  .auth-paper button[type="submit"]:active:not(:disabled) { transform: translateY(2px); box-shadow: inset 0 0 0 3px rgba(255,240,210,.45), 0 2px 0 ${INK}; }
  [data-radix-popper-content-wrapper] { --popover: #f3e8cf; --popover-foreground: ${INK}; --accent: #f5c928; --accent-foreground: ${INK}; --border: ${INK}; }
  [data-radix-popper-content-wrapper] [role="listbox"] { border: 2px solid ${INK}; border-radius: 0; }

  /* Entrance, once per page load: ticket rises in, sticker stamps down, then the form rows follow. */
  @keyframes auth-card-in { from { opacity: 0; transform: translateY(18px) scale(.97); } to { opacity: 1; transform: none; } }
  @keyframes auth-stamp-in { from { opacity: 0; transform: rotate(12deg) scale(1.8); } to { opacity: 1; transform: rotate(12deg) scale(1); } }
  @keyframes auth-row-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .auth-ticket { animation: auth-card-in .45s cubic-bezier(0.23, 1, 0.32, 1) both; }
  .auth-sticker { animation: auth-stamp-in .35s cubic-bezier(0.23, 1, 0.32, 1) .25s both; }
  .auth-paper form > *, .auth-paper form ~ * { animation: auth-row-in .35s cubic-bezier(0.23, 1, 0.32, 1) both; }
  .auth-paper form > :nth-child(1) { animation-delay: .28s; }
  .auth-paper form > :nth-child(2) { animation-delay: .34s; }
  .auth-paper form > :nth-child(3) { animation-delay: .40s; }
  .auth-paper form > :nth-child(4) { animation-delay: .46s; }
  .auth-paper form > :nth-child(n+5), .auth-paper form ~ * { animation-delay: .52s; }
  @media (prefers-reduced-motion: reduce) {
    .auth-ticket, .auth-sticker, .auth-paper form > *, .auth-paper form ~ * { animation-name: auth-fade; }
    @keyframes auth-fade { from { opacity: 0; } }
  }
`;

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <PageShell footer={false}>
      <style>{THEME_CSS}</style>
      {/* Fills the screen below the 4rem navbar exactly; taller forms (signup details) grow and scroll as normal. */}
      <div className={`relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden px-4 py-6 ${sans.className}`}>
        <GoldBackdrop />
        <div className="relative flex w-full justify-center">{children}</div>
      </div>
    </PageShell>
  );
}

/** Who pays: OPJU free; externals free for some events, otherwise up to ₹499 (same rules as the dashboard payment page). */
export function Fare() {
  return (
    <div>
      <p className={`mb-1.5 text-[10px] tracking-[0.3em] text-black/60 lg:text-xs ${mono.className}`}>FARE</p>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
        <div className="rounded-lg border-2 px-3 py-2" style={{ borderColor: INK, background: "#e3f2ef" }}>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#0e5b57]">OPJU student</p>
          <p className={`text-lg leading-tight lg:text-2xl ${display.className}`} style={{ color: INK }}>FREE</p>
          <p className="text-[10px] leading-snug text-black/70">With your <b>@opju.ac.in</b> email</p>
        </div>
        <div className="rounded-lg border-2 px-3 py-2" style={{ borderColor: INK, background: "#fde8d7" }}>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#a33517]">External</p>
          <p className={`whitespace-nowrap text-lg leading-tight lg:text-2xl ${display.className}`} style={{ color: INK }}>Free–₹499</p>
          <p className="text-[10px] leading-snug text-black/70">Some events free · max <b>₹499</b></p>
        </div>
      </div>
    </div>
  );
}

/** Stub note for the password-reset flow (same rules as otp-actions: 10-minute codes, 1 resend per minute). */
export function ResetHowTo() {
  return (
    <div>
      <p className={`mb-1.5 text-[10px] tracking-[0.3em] text-black/60 lg:text-xs ${mono.className}`}>HOW IT WORKS</p>
      <ol className="space-y-1.5 rounded-lg border-2 bg-[#e3f2ef] px-3 py-2.5 text-xs leading-snug text-black/80 lg:text-sm" style={{ borderColor: INK }}>
        <li><b>1.</b> Enter the email you signed up with.</li>
        <li><b>2.</b> Type the 6-digit code we email you. It works for <b>10 minutes</b>; check spam if it&apos;s late.</li>
        <li><b>3.</b> Choose a new password and sign in.</li>
      </ol>
    </div>
  );
}

// Numbered progress tiles: done = teal, current = mustard, upcoming = outlined.
function Steps({ labels, current }: { labels: string[]; current: number }) {
  return (
    <div className="mt-3 flex items-center justify-center gap-2 md:justify-start">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm transition-colors ${display.className} ${
              i === current ? "bg-[#f5c928] text-black" : i < current ? "bg-[#0e5b57] text-[#f3e8cf]" : "bg-transparent text-black/45"
            }`}
            style={{ borderColor: INK, boxShadow: i === current ? `0 3px 0 ${INK}` : undefined }}
          >
            {i < current ? <Check className="h-4 w-4" /> : i + 1}
          </div>
          <span className={`hidden text-xs font-bold uppercase tracking-wider sm:block ${i === current ? "text-black" : "text-black/50"}`}>{label}</span>
          {i < labels.length - 1 && <div className={`h-0.5 w-6 ${i < current ? "bg-[#0e5b57]" : "bg-black/30"}`} />}
        </div>
      ))}
    </div>
  );
}

/**
 * The one ticket every auth page uses, so moving between sign-in, sign-up and reset only swaps the content:
 * same width and (on desktop) same height everywhere.
 *   desktop: landscape — stub on the left (ADMIT ONE + tag, logo, optional `aside` such as the fare), form on the right
 *   phone:   one column — stub on top, `aside` after the form
 */
export function AuthCard({
  tag, title, description, steps, current = 0, aside, children,
}: {
  tag: string;
  title: string;
  description?: string;
  steps?: string[];
  current?: number;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="auth-ticket relative w-full max-w-md md:max-w-3xl lg:max-w-4xl">
      <EditionSticker className="-right-8 -top-8" />
      <div
        className="auth-paper grid min-h-[34rem] grid-rows-[auto_1fr] border-[3px] bg-[#f3e8cf] text-[#1c1812] md:min-h-[27rem] md:grid-cols-[17rem_1fr] md:grid-rows-1 lg:min-h-[31rem] lg:grid-cols-[20rem_1fr]"
        style={{ borderColor: INK, boxShadow: `0 6px 0 ${INK}` }}
      >
        {/* stub */}
        <div className="relative flex flex-col gap-2 border-b-2 border-dashed px-5 pb-3 pt-3 md:border-b-0 md:border-r-2 md:px-6 md:py-6 lg:gap-4 lg:px-8 lg:py-8" style={{ borderColor: `${INK}55` }}>
          <TicketHeader right={tag} />
          <FestLogo className="w-24 sm:w-28 md:w-52 lg:w-60" />
          {aside && <div className="mt-auto hidden md:block">{aside}</div>}
          {/* notches on the perforation: bottom corners on phones, top/bottom of the divider on desktop */}
          <span aria-hidden className="absolute -bottom-[11px] -left-[11px] h-5 w-5 rounded-full bg-[#f2b31c] md:-right-[11px] md:-top-[11px] md:bottom-auto md:left-auto" style={{ border: `3px solid ${INK}` }} />
          <span aria-hidden className="absolute -bottom-[11px] -right-[11px] h-5 w-5 rounded-full bg-[#f2b31c]" style={{ border: `3px solid ${INK}` }} />
        </div>

        {/* content */}
        <div className="flex flex-col justify-center gap-3 px-5 pb-4 pt-3 md:px-8 md:py-7 lg:gap-4 lg:px-12 lg:py-10">
          <div>
            <TicketTitle className="text-center text-3xl md:text-left md:text-4xl lg:text-5xl">{title}</TicketTitle>
            {description && <p className="mt-2.5 text-center text-xs font-bold uppercase tracking-[0.18em] text-black/60 md:text-left">{description}</p>}
            {steps && <Steps labels={steps} current={current} />}
          </div>
          <div>{children}</div>
          {aside && <div className="md:hidden">{aside}</div>}
        </div>
      </div>
    </div>
  );
}
