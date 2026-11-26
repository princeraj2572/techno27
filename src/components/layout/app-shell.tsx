import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { sans } from "@/components/home/fonts";
import { INK, PillLink, TicketTitle } from "@/components/indie/gold-poster";

export type Crumb = { label: string; href?: string };

// "Home › Dashboard › Payment" trail. Every item except the last is a link.
export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm font-bold uppercase tracking-widest">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${c.label}-${i}`} className="flex items-center gap-1">
            {c.href && !last ? (
              <Link href={c.href} className="text-[#f5c928] underline-offset-4 hover:underline">{c.label}</Link>
            ) : (
              <span aria-current={last ? "page" : undefined} className="text-[#f5edd8]">{c.label}</span>
            )}
            {!last && <ChevronRight className="h-4 w-4 text-[#f5edd8]/60" />}
          </span>
        );
      })}
    </nav>
  );
}

// Big, obvious "go back" button.
export function BackButton({ href, label, className = "" }: { href: string; label: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 border-2 border-black bg-[#f5c928] px-4 py-2 text-base font-bold uppercase tracking-wider text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-y-0.5 hover:bg-[#ff6a00] ${className}`}
    >
      <ArrowLeft className="h-5 w-5" /> {label}
    </Link>
  );
}

// Content frame for logged-in form pages. The area layout (RailFrame) supplies the page background, menu,
// breadcrumbs and back link; this adds the page title, then the page content directly on the page.
export default function AppShell({
  title, sub, icon, back, width = "max-w-3xl", children,
}: {
  title: string;
  sub?: string;
  icon?: ReactNode;
  /** @deprecated breadcrumbs now come from the area layout's rail */
  crumbs?: Crumb[];
  back: { href: string; label: string };
  width?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 ${sans.className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <TicketTitle className="text-[clamp(1.6rem,7.4vw,3.5rem)] leading-[1.05]">{title}</TicketTitle>
          {sub && <p className="mt-2 text-sm font-extrabold uppercase tracking-wide sm:text-base" style={{ color: INK }}>{sub}</p>}
        </div>
        {icon && (
          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border-[3px] text-[#1c1812] sm:flex" style={{ background: "#f5c928", borderColor: INK, boxShadow: `0 4px 0 ${INK}` }}>
            {icon}
          </div>
        )}
      </div>

      {/* content sits directly on the page: each section is its own card, never a card inside a card */}
      <div className={`mt-6 space-y-6 ${width}`}>{children}</div>

      <PillLink href={back.href} className="mt-6"><ArrowLeft className="h-4 w-4" /> {back.label}</PillLink>
    </div>
  );
}
