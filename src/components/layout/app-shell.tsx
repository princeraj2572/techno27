import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Band, PageShell, serif } from "@/components/indie";

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

// Shared indie frame for logged-in pages: breadcrumbs + back button on top,
// content on maroon, and the same back button again at the bottom.
export default function AppShell({
  title, sub, icon, crumbs, back, width = "max-w-2xl", children,
}: {
  title: string;
  sub?: string;
  icon?: ReactNode;
  crumbs: Crumb[];
  back: { href: string; label: string };
  width?: string;
  children: ReactNode;
}) {
  return (
    <PageShell>
      <Band tone="crimson" mandala ghost={title} className="!py-8 sm:!py-10">
        <Crumbs items={crumbs} />
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className={`text-5xl leading-[0.95] sm:text-7xl indie-outline ${serif.className}`}>{title}</h1>
            {sub && <p className="mt-3 text-lg font-bold uppercase text-[#f5edd8]">{sub}</p>}
            <BackButton href={back.href} label={back.label} className="mt-5" />
          </div>
          {icon && (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-black bg-[#f5c928] text-black shadow-[4px_4px_0_0_#000]">
              {icon}
            </div>
          )}
        </div>
      </Band>
      <Band tone="maroon" className="!py-10">
        <div className={`mx-auto space-y-7 ${width}`}>
          {children}
          <div className="border-t-2 border-dashed border-[#f5edd8]/30 pt-6">
            <BackButton href={back.href} label={back.label} />
          </div>
        </div>
      </Band>
    </PageShell>
  );
}
