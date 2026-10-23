"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { display, paper, serif } from "@/components/indie";
import { CULTURES, CultureScene } from "@/components/indie/culture-art";
import { EVENT_THEMES, patternStyle, type EventTheme } from "@/features/events/data/event-themes";
import type { GalleryItem } from "@/data/dummy";

// Each year gets its own palette + pattern, borrowed from the event themes.
const YEAR_THEMES: Record<string, EventTheme> = {
  "2026": EVENT_THEMES.kalakriti,
  "2025": EVENT_THEMES.masterchef,
};
const FALLBACK_THEME = EVENT_THEMES.codigo;

const TILTS = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1", "rotate-[1.5deg]", "-rotate-[1.5deg]"];

function PhotoStamp({ item, number, big = false }: { item: GalleryItem; number: number; big?: boolean }) {
  const culture = CULTURES[item.scene];
  return (
    <div className="stamp-shadow">
      <div className="stamp-cut bg-[#fde9bd] p-4">
        <div className="bg-white p-1">
          <div className="stamp-scene relative aspect-[3/4] overflow-hidden">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.caption} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <CultureScene slug={item.scene} className="absolute inset-0 h-full w-full" />
            )}
            <div className="absolute inset-x-2 top-3 text-center">
              <h3
                className={`${big ? "text-4xl" : "text-[1.75rem]"} font-extrabold uppercase leading-[0.92] tracking-tight [text-shadow:0_2px_0_rgba(255,255,255,0.55)]`}
                style={{ color: culture?.ink ?? "#1a0505" }}
              >
                {item.caption}
              </h3>
              <p className={`${big ? "mt-2 text-xl" : "mt-1.5 text-base"} font-bold uppercase tracking-[0.3em]`} style={{ color: culture?.sub ?? "#7a1c1c" }}>
                {item.year}
              </p>
            </div>
            <span className="absolute bottom-2 left-2 border-2 border-black bg-[#f5edd8] px-2 py-0.5 text-sm font-bold tracking-[0.2em] text-black shadow-[2px_2px_0_0_#000]">
              {String(number).padStart(2, "0")}
            </span>
            <span className="absolute bottom-2 right-2 border-2 border-black bg-[#f5c928] px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest text-black shadow-[2px_2px_0_0_#000]">
              {item.tag}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GalleryBoard({ items }: { items: GalleryItem[] }) {
  const years = useMemo(() => [...new Set(items.map((i) => i.year))].sort((a, b) => Number(b) - Number(a)), [items]);
  const tags = useMemo(() => [...new Set(items.map((i) => i.tag))], [items]);
  const [year, setYear] = useState("All");
  const [tag, setTag] = useState("All");
  const [open, setOpen] = useState<{ item: GalleryItem; n: number } | null>(null);

  const numbered = useMemo(() => items.map((item, i) => ({ item, n: i + 1 })), [items]);
  const shown = numbered.filter(({ item }) => (year === "All" || item.year === year) && (tag === "All" || item.tag === tag));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const pill = (active: boolean) =>
    `border-2 border-black px-4 py-1.5 text-base font-bold uppercase tracking-wider shadow-[3px_3px_0_0_#000] transition ${
      active ? "bg-[#f5c928] text-black -rotate-1" : "bg-[#f5edd8] text-black hover:-translate-y-0.5"
    }`;

  return (
    <>
      {/* Filters */}
      <section className="indie-mandala bg-[#a1001a] text-[#f5edd8]">
        <div className="mx-auto max-w-5xl space-y-4 px-6 py-8">
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Year">
            <span className="mr-2 text-sm font-bold uppercase tracking-[0.3em] text-[#f5c928]">Year</span>
            {["All", ...years].map((y) => (
              <button key={y} role="tab" aria-selected={year === y} onClick={() => setYear(y)} className={pill(year === y)}>{y}</button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Category">
            <span className="mr-2 text-sm font-bold uppercase tracking-[0.3em] text-[#f5c928]">Topic</span>
            {["All", ...tags].map((t) => (
              <button key={t} role="tab" aria-selected={tag === t} onClick={() => setTag(t)} className={pill(tag === t)}>{t}</button>
            ))}
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f5edd8]/80" aria-live="polite">
            Showing {shown.length} of {items.length} snapshots
          </p>
        </div>
      </section>

      {/* One themed section per year */}
      {years.map((y, yi) => {
        const group = shown.filter(({ item }) => item.year === y);
        if (group.length === 0) return null;
        const t = YEAR_THEMES[y] ?? FALLBACK_THEME;
        return (
          <section key={y} className="relative overflow-hidden" style={{ background: `linear-gradient(170deg, ${t.bg} 0%, ${t.bg2} 100%)`, color: t.ink }}>
            <div aria-hidden className="absolute inset-0 opacity-25" style={patternStyle(t.pattern, t.patternColor)} />
            <p aria-hidden className={`pointer-events-none absolute -top-6 right-2 select-none text-[9rem] leading-none opacity-[0.1] sm:text-[14rem] ${display.className}`}>{y}</p>

            <div className="relative mx-auto max-w-5xl px-6 py-14">
              <div className="mb-12 flex flex-wrap items-end justify-between gap-3">
                <h2 className={`text-6xl leading-none sm:text-7xl ${serif.className}`} style={{ textShadow: "3px 3px 0 rgba(255,255,255,0.6)" }}>{y}</h2>
                <p className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: t.soft }}>
                  {group.length} snapshot{group.length === 1 ? "" : "s"} · {yi === 0 ? "Latest edition" : "Throwback"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {group.map(({ item, n }, i) => (
                  <figure key={item.caption} className="indie-pop group" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
                    <button
                      onClick={() => setOpen({ item, n })}
                      className={`relative mx-auto block w-full max-w-[19rem] text-left transition-transform duration-200 group-hover:rotate-0 group-hover:-translate-y-2 ${TILTS[i % TILTS.length]}`}
                      aria-label={`Enlarge: ${item.caption}`}
                    >
                      <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rotate-2 border border-black/30" style={{ background: `${t.accent}cc` }} />
                      <PhotoStamp item={item} number={n} />
                      <span className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white text-black opacity-0 shadow-[2px_2px_0_0_#000] transition-opacity group-hover:opacity-100">
                        <ZoomIn className="h-4 w-4" />
                      </span>
                    </button>
                    <figcaption className="mx-auto mt-5 max-w-[19rem] text-center">
                      <p className={`text-lg italic leading-snug ${paper.className}`}>
                        {item.caption} — {CULTURES[item.scene]?.state ?? "India"}
                      </p>
                      <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.4em]" style={{ color: t.soft }}>{item.tag} · {item.year}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {shown.length === 0 && (
        <section className="bg-[#4a0e0e] px-6 py-20 text-center">
          <p className={`text-4xl text-[#f5c928] ${display.className}`}>No snapshots here yet</p>
          <p className="mt-2 text-xl text-[#f5edd8]/80">Try a different year or topic.</p>
        </section>
      )}

      {/* Enlarged view */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.item.caption}
          className="indie-pop fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/85 p-6"
          onClick={() => setOpen(null)}
        >
          <div className="relative w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="absolute -right-2 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-[#f5c928] text-black shadow-[3px_3px_0_0_#000] hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>
            <PhotoStamp item={open.item} number={open.n} big />
            <p className={`mt-5 text-center text-xl italic text-[#f5edd8] ${paper.className}`}>
              {open.item.caption} — {CULTURES[open.item.scene]?.state ?? "India"}
            </p>
            <p className="text-center text-xs font-bold uppercase tracking-[0.4em] text-[#f5c928]">{open.item.tag} · {open.item.year}</p>
          </div>
        </div>
      )}
    </>
  );
}
