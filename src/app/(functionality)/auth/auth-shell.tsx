"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell, display, serif } from "@/components/indie";

// Re-points the shadcn tokens at the fest palette so every field inside the card picks it up.
const THEME_CSS = `
  .auth-paper {
    --card: #f5edd8; --card-foreground: #12061f;
    --foreground: #12061f; --muted-foreground: rgba(26,5,5,.62);
    --muted: rgba(26,5,5,.1); --border: #12061f; --input: #12061f;
    --primary: #6d28b8; --primary-foreground: #f5edd8; --ring: #9d4edd;
    --secondary: #ff7518; --secondary-foreground: #12061f;
    --destructive: #6d28b8; --accent: #ff7518; --accent-foreground: #12061f;
  }
  .auth-paper input, .auth-paper [role="combobox"] { background: #fff; border: 2px solid #12061f; border-radius: 0; min-height: 2.5rem; }
  .auth-paper label { font-weight: 700; text-transform: uppercase; letter-spacing: .06em; font-size: .72rem; }
  .auth-paper button[type="submit"], .auth-paper button[type="button"]:not([aria-label]):not([role="combobox"]) {
    border: 2px solid #12061f; border-radius: 0; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
  }
  .auth-paper button[type="submit"] { background: #ff7518; color: #12061f; box-shadow: 4px 4px 0 #9d4edd; min-height: 2.75rem; }
  .auth-paper button[type="submit"]:hover:not(:disabled) { background: #9d4edd; }
  [data-radix-popper-content-wrapper] { --popover: #f5edd8; --popover-foreground: #12061f; --accent: #ff7518; --accent-foreground: #12061f; --border: #12061f; }
  [data-radix-popper-content-wrapper] [role="listbox"] { border: 2px solid #12061f; border-radius: 0; }
`;

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <PageShell footer={false}>
      <style>{THEME_CSS}</style>
      <div className="flex min-h-screen items-center justify-center px-4 pb-16 pt-28">{children}</div>
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
                ? "bg-[#ff7518] text-black shadow-[2px_2px_0_0_#9d4edd]"
                : i < current
                  ? "bg-[#6d28b8] text-[#f5edd8]"
                  : "bg-transparent text-black/50"
            }`}
          >
            {i < current ? <Check className="h-4 w-4" /> : i + 1}
          </div>
          <span className={`hidden text-xs font-bold uppercase tracking-wider sm:block ${i === current ? "text-black" : "text-black/50"}`}>{label}</span>
          {i < labels.length - 1 && <div className={`h-0.5 w-8 ${i < current ? "bg-[#6d28b8]" : "bg-black/30"}`} />}
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
    <Card className={`auth-paper w-full ${maxWidth} rounded-none border-4 border-black shadow-[10px_10px_0_0_#ff7518]`}>
      <CardHeader className="text-center">
        <span className="mx-auto -rotate-2 border-2 border-black bg-[#9d4edd] px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-black">{tag}</span>
        <CardTitle className={`mt-3 text-4xl text-[#6d28b8] ${serif.className}`}>{title}</CardTitle>
        <CardDescription className="font-bold uppercase tracking-widest">{description}</CardDescription>
        {steps && <Steps labels={steps} current={current} />}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
