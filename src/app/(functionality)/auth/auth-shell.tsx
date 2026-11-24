"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell, display, serif } from "@/components/indie";
import { AuthBackground } from "./auth-bg";

// Re-points the shadcn tokens at the fest palette so every field inside the card picks it up.
const THEME_CSS = `
  .auth-paper {
    --card: #f5edd8; --card-foreground: #1a0505;
    --foreground: #1a0505; --muted-foreground: rgba(26,5,5,.62);
    --muted: rgba(26,5,5,.1); --border: #1a0505; --input: #1a0505;
    --primary: #a1001a; --primary-foreground: #f5edd8; --ring: #ff6a00;
    --secondary: #f5c928; --secondary-foreground: #1a0505;
    --destructive: #a1001a; --accent: #f5c928; --accent-foreground: #1a0505;
  }
  .auth-paper input, .auth-paper [role="combobox"] { background: #fff; border: 2px solid #1a0505; border-radius: 0; min-height: 2.5rem; }
  .auth-paper label { font-weight: 700; text-transform: uppercase; letter-spacing: .06em; font-size: .72rem; }
  .auth-paper button[type="submit"], .auth-paper button[type="button"]:not([aria-label]):not([role="combobox"]) {
    border: 2px solid #1a0505; border-radius: 0; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
  }
  .auth-paper button[type="submit"] { background: #f5c928; color: #1a0505; box-shadow: 4px 4px 0 #ff6a00; min-height: 2.75rem; }
  .auth-paper button[type="submit"]:hover:not(:disabled) { background: #ff6a00; }
  [data-radix-popper-content-wrapper] { --popover: #f5edd8; --popover-foreground: #1a0505; --accent: #f5c928; --accent-foreground: #1a0505; --border: #1a0505; }
  [data-radix-popper-content-wrapper] [role="listbox"] { border: 2px solid #1a0505; border-radius: 0; }

  /* Entrance, once per page load: card rises in, tag stamps down, then the form rows follow. */
  @keyframes auth-card-in { from { opacity: 0; transform: translateY(18px) scale(.97); } to { opacity: 1; transform: none; } }
  @keyframes auth-stamp-in { from { opacity: 0; transform: rotate(-2deg) scale(1.6); } to { opacity: 1; transform: rotate(-2deg) scale(1); } }
  @keyframes auth-row-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .auth-paper { animation: auth-card-in .45s cubic-bezier(0.23, 1, 0.32, 1) both; }
  .auth-paper .auth-tag { animation: auth-stamp-in .35s cubic-bezier(0.23, 1, 0.32, 1) .2s both; }
  .auth-paper form > *, .auth-paper form ~ * { animation: auth-row-in .35s cubic-bezier(0.23, 1, 0.32, 1) both; }
  .auth-paper form > :nth-child(1) { animation-delay: .28s; }
  .auth-paper form > :nth-child(2) { animation-delay: .34s; }
  .auth-paper form > :nth-child(3) { animation-delay: .40s; }
  .auth-paper form > :nth-child(4) { animation-delay: .46s; }
  .auth-paper form > :nth-child(n+5), .auth-paper form ~ * { animation-delay: .52s; }
  @media (prefers-reduced-motion: reduce) {
    .auth-paper, .auth-paper .auth-tag, .auth-paper form > *, .auth-paper form ~ * { animation-name: auth-fade; }
    @keyframes auth-fade { from { opacity: 0; } }
  }
`;

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <PageShell footer={false}>
      <style>{THEME_CSS}</style>
      <AuthBackground />
      <div className="relative flex min-h-screen items-center justify-center px-4 pb-16 pt-28">{children}</div>
    </PageShell>
  );
}

// Numbered progress tiles: done = crimson, current = mustard, upcoming = outlined.
function Steps({ labels, current }: { labels: string[]; current: number }) {
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center border-2 border-black text-sm transition-colors ${display.className} ${
              i === current
                ? "bg-[#f5c928] text-black shadow-[2px_2px_0_0_#ff6a00]"
                : i < current
                  ? "bg-[#a1001a] text-[#f5edd8]"
                  : "bg-transparent text-black/50"
            }`}
          >
            {i < current ? <Check className="h-4 w-4" /> : i + 1}
          </div>
          <span className={`hidden text-xs font-bold uppercase tracking-wider sm:block ${i === current ? "text-black" : "text-black/50"}`}>{label}</span>
          {i < labels.length - 1 && <div className={`h-0.5 w-8 ${i < current ? "bg-[#a1001a]" : "bg-black/30"}`} />}
        </div>
      ))}
    </div>
  );
}

export function AuthCard({
  tag, title, description, steps, current = 0, maxWidth = "max-w-2xl", children,
}: {
  tag: string;
  title: string;
  description: string;
  steps?: string[];
  current?: number;
  maxWidth?: string;
  children: ReactNode;
}) {
  return (
    <Card className={`auth-paper w-full ${maxWidth} rounded-none border-4 border-black shadow-[10px_10px_0_0_#f5c928]`}>
      <CardHeader className="text-center">
        <span className="auth-tag mx-auto -rotate-2 border-2 border-black bg-[#ff6a00] px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-black">{tag}</span>
        <CardTitle className={`mt-3 text-4xl text-[#a1001a] ${serif.className}`}>{title}</CardTitle>
        <CardDescription className="font-bold uppercase tracking-widest">{description}</CardDescription>
        {steps && <Steps labels={steps} current={current} />}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
