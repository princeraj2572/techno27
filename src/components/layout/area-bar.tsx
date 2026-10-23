"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { body } from "@/components/indie";

// Sticky indie navigation strip for the staff areas (admin / dev / event-manager):
// "Home › Admin › Events › Details" breadcrumbs plus a big Back button to the parent page.

const SEGMENT_LABEL: Record<string, string> = {
  team: "Fest Team",
  checkin: "Check-in",
  qr: "QR",
  "event-manager": "Event Manager",
  dev: "Developer",
};

const looksLikeId = (s: string) => /^[0-9a-f]{24}$/i.test(s) || /^\d{3,}$/.test(s);

function labelFor(segment: string, prev?: string) {
  if (looksLikeId(segment)) return prev === "events" || prev === "event-manager" ? "Event" : "Details";
  if (SEGMENT_LABEL[segment]) return SEGMENT_LABEL[segment];
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AreaBar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [
    { label: "Home", href: "/" },
    ...segments.map((seg, i) => ({
      label: labelFor(seg, segments[i - 1]),
      href: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  const parent = crumbs.length > 1 ? crumbs[crumbs.length - 2] : null;

  return (
    <div className={`sticky top-16 z-40 border-b-2 border-black bg-[#4a0e0e] ${body.className}`}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6 lg:px-8">
        {parent && (
          <Link
            href={parent.href}
            className="inline-flex items-center gap-2 border-2 border-black bg-[#f5c928] px-3 py-1 text-base font-bold uppercase tracking-wider text-black shadow-[3px_3px_0_0_#000] transition hover:-translate-y-0.5 hover:bg-[#ff6a00]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to {parent.label}
          </Link>
        )}
        <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-1 text-sm font-bold uppercase tracking-widest">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <span key={c.href} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="text-[#f5edd8]">{c.label}</span>
                ) : (
                  <Link href={c.href} className="text-[#f5c928] underline-offset-4 hover:underline">{c.label}</Link>
                )}
                {!last && <ChevronRight className="h-4 w-4 text-[#f5edd8]/60" />}
              </span>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
