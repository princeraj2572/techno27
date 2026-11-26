"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { display, paper, serif } from "@/components/indie";
import { CULTURES, CultureScene } from "@/components/indie/culture-art";
import { Postmark } from "@/components/indie/stamp";
import { EVENT_THEMES, patternStyle, type EventTheme } from "@/features/events/data/event-themes";
import type { GalleryItem } from "@/data/dummy";

// Each year gets its own palette + pattern, borrowed from the event themes.
const YEAR_THEMES: Record<string, EventTheme> = {
  "2026": EVENT_THEMES.kalakriti,
  "2025": EVENT_THEMES.masterchef,
  "2024": EVENT_THEMES.antaragni,
};
const FALLBACK_THEME = EVENT_THEMES.codigo;

const TILTS = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1", "rotate-[1.5deg]", "-rotate-[1.5deg]"];

// Motion for this board only. Everything sits behind no-preference so reduced-motion users get a static board.
const MOTION_CSS = `
@keyframes g-drop { 0% { opacity: 0; transform: translateY(-70px) rotate(-9deg) scale(1.12); } 60% { opacity: 1; transform: translateY(6px) rotate(1.5deg) scale(.98); } 100% { opacity: 1; transform: none; } }
@keyframes g-tape { 0% { opacity: 0; scale: 1.8; } 100% { opacity: 1; scale: 1; } }
@keyframes g-swipe-l { from { opacity: 0; transform: translateX(80px) rotate(4deg); } to { opacity: 1; transform: none; } }
@keyframes g-swipe-r { from { opacity: 0; transform: translateX(-80px) rotate(-4deg); } to { opacity: 1; transform: none; } }
@keyframes g-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes g-slam { 0% { opacity: 0; transform: scale(2.4) rotate(-8deg); filter: blur(6px); } 55% { opacity: 1; transform: scale(.92) rotate(2deg); filter: none; } 100% { opacity: 1; transform: none; } }
@keyframes g-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes g-pill { 0% { opacity: 0; transform: translateY(-16px) rotate(-6deg); } 70% { opacity: 1; transform: translateY(3px) rotate(1deg); } 100% { opacity: 1; transform: none; } }
@keyframes g-postmark { 0% { opacity: 0; transform: scale(2.4) rotate(-40deg); } 100% { opacity: .75; transform: scale(1) rotate(-14deg); } }
@keyframes g-ghost { from { transform: translateX(18%); } to { transform: translateX(-28%); } }
@keyframes g-deal { 0% { opacity: 1; transform: translate(var(--sx), var(--sy)) rotate(var(--sr)) scale(.86); } 100% { opacity: 1; transform: none; } }
@keyframes g-thumb { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
@keyframes gx-letter { 0% { opacity: 0; transform: translateY(-1.1em) rotate(-25deg) scale(1.4); } 60% { opacity: 1; transform: translateY(.08em) rotate(4deg) scale(.95); } 100% { opacity: 1; transform: none; } }
@keyframes gx-flash { from { opacity: .9; } to { opacity: 0; } }
@keyframes gx-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes gx-cycle { 0% { opacity: 0; transform: scale(1.12); } 4%, 20% { opacity: 1; } 24%, 100% { opacity: 0; transform: scale(1); } }
.gx-flash, .gx-progress { display: none; }
@media (prefers-reduced-motion: no-preference) {
  .g-drop { opacity: 0; }
  .g-drop.in { animation: g-drop .75s cubic-bezier(.2,.9,.3,1.2) both; animation-delay: var(--d, 0ms); }
  .g-drop.in.g-dealt { animation: g-deal .85s cubic-bezier(.2,.85,.25,1.05) both; animation-delay: var(--dd, 0ms); z-index: 5; }
  .g-year { box-shadow: 0 -24px 48px rgba(0,0,0,.35); }
  .g-drop.in .g-tape { animation: g-tape .35s cubic-bezier(.3,1.4,.5,1) both; animation-delay: calc(var(--d, 0ms) + 450ms); }
  .g-swipe-l { animation: g-swipe-l .4s cubic-bezier(.16,1,.3,1) both; }
  .g-swipe-r { animation: g-swipe-r .4s cubic-bezier(.16,1,.3,1) both; }
  .g-fade { animation: g-fade .25s ease both; }
  .g-slam, .g-rise, .g-in .g-pill { opacity: 0; }
  .g-slam.in { animation: g-slam .7s cubic-bezier(.2,.9,.3,1.1) both; }
  .g-rise.in { animation: g-rise .6s ease both; animation-delay: .35s; }
  .g-in.in .g-pill { animation: g-pill .5s cubic-bezier(.3,1.4,.5,1) both; animation-delay: calc(var(--i) * 45ms); }
  .g-pill:active { scale: .92; }
  .group:hover .g-postmark { animation: g-postmark .3s cubic-bezier(.3,1.5,.5,1) both; }
  .g-tilt { transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); }
  .g-thumbs > * { animation: g-thumb .4s ease both; animation-delay: calc(var(--i) * 25ms + 150ms); }
  .gx-letter { animation: gx-letter .7s cubic-bezier(.3,1.4,.5,1) both; animation-delay: calc(var(--i) * 70ms + .35s); }
  .gx-rise { animation: g-rise .7s ease both; animation-delay: .2s; }
  .gx-flash { display: block; position: fixed; inset: 0; z-index: 100; background: #fff; pointer-events: none; animation: gx-flash .8s ease-out .1s both; }
  .gx-cycle { opacity: 0; animation: gx-cycle calc(var(--n) * 4s) ease-in-out infinite; animation-delay: calc(var(--i) * 4s - 1s); }
  @supports (animation-timeline: view()) {
    .g-ghost { animation: g-ghost linear both; animation-timeline: view(); }
  }
  @supports (animation-timeline: scroll()) {
    .gx-progress {
      display: block; position: fixed; left: 0; right: 0; bottom: 0; z-index: 80; height: 6px; transform-origin: left; pointer-events: none;
      background: repeating-linear-gradient(90deg, #f5c928 0 14px, #1a0505 14px 20px);
      animation: gx-grow linear both; animation-timeline: scroll(root);
    }
  }
}
`;

function PhotoStamp({ item, number, big = false }: { item: GalleryItem; number: number; big?: boolean }) {
  const culture = CULTURES[item.scene];
  return (
    <div className="stamp-shadow">
      <div className="stamp-cut bg-[#fde9bd] p-4">
        <div className="bg-white p-1">
          <div className="stamp-scene relative aspect-[3/4] overflow-hidden">
            {item.image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.caption} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
                {/* darken the top so the title stays readable on busy photos */}
                <div aria-hidden className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/75 to-transparent" />
              </>
            ) : (
              <CultureScene slug={item.scene} className="absolute inset-0 h-full w-full" />
            )}
            <div className="absolute inset-x-2 top-3 text-center">
              <h3
                className={`${big ? "text-4xl" : "text-[1.75rem]"} font-extrabold uppercase leading-[0.92] tracking-tight ${item.image ? "[text-shadow:0_2px_6px_rgba(0,0,0,0.6)]" : "[text-shadow:0_2px_0_rgba(255,255,255,0.55)]"}`}
                style={{ color: item.image ? "#f5edd8" : culture?.ink ?? "#1a0505" }}
              >
                {item.caption}
              </h3>
              <p className={`${big ? "mt-2 text-xl" : "mt-1.5 text-base"} font-bold uppercase tracking-[0.3em]`} style={{ color: item.image ? "#f5c928" : culture?.sub ?? "#7a1c1c" }}>
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
  const [open, setOpen] = useState<{ item: GalleryItem; n: number; dir?: "l" | "r" } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const numbered = useMemo(() => items.map((item, i) => ({ item, n: i + 1 })), [items]);
  const shown = numbered.filter(({ item }) => (year === "All" || item.year === year) && (tag === "All" || item.tag === tag));

  // Step through the currently filtered photos in the lightbox, wrapping at either end.
  const step = (d: 1 | -1) =>
    setOpen((cur) => {
      if (!cur || shown.length === 0) return cur;
      const i = shown.findIndex((s) => s.n === cur.n);
      const next = shown[(i + d + shown.length) % shown.length];
      return { ...next, dir: d === 1 ? "l" : "r" };
    });

  // Scroll reveals; re-run after a filter change remounts the stamps.
  //  - headings, pills: add .in when visible
  //  - each year: when it scrolls in, the stamps already on screen start as one pile and are dealt out to their spots;
  //    stamps further down drop in individually as they arrive.
  useEffect(() => {
    const root = boardRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), reveal.unobserve(e.target))),
      { threshold: 0.15 },
    );
    root.querySelectorAll(".g-slam:not(.in), .g-rise:not(.in), .g-in:not(.in)").forEach((el) => reveal.observe(el));

    const deal = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          deal.unobserve(e.target);
          const stamps = [...e.target.querySelectorAll<HTMLElement>(".g-drop:not(.in)")];
          const pileX = window.innerWidth / 2;
          const pileY = window.innerHeight * 0.55;
          let k = 0;
          stamps.forEach((el) => {
            const r = el.getBoundingClientRect();
            if (reduced || k >= 8 || r.top > window.innerHeight * 2) return reveal.observe(el); // far below: drop in later
            el.style.setProperty("--sx", `${pileX - (r.left + r.width / 2)}px`);
            el.style.setProperty("--sy", `${pileY - (r.top + r.height / 2)}px`);
            el.style.setProperty("--sr", `${((k * 37) % 30) - 15}deg`);
            el.style.setProperty("--dd", `${250 + k * 120}ms`);
            el.classList.add("in", "g-dealt");
            k++;
          });
        }),
      { threshold: 0, rootMargin: "0px 0px -70% 0px" },
    );
    root.querySelectorAll(".g-year").forEach((sec) => deal.observe(sec));

    // The page header's photo wall loops forever; pause it once it has scrolled away (.pin-off comes from PanelPins).
    const wall = document.querySelector(".gx-wall");
    const pause = new IntersectionObserver(([e]) => e.target.classList.toggle("pin-off", !e.isIntersecting));
    if (wall) pause.observe(wall);

    // Year sections stack like cards (.panel); keep each one's height current so tall ones pin by their bottom edge.
    const ro = new ResizeObserver((rs) => rs.forEach((r) => (r.target as HTMLElement).style.setProperty("--panel-h", `${(r.target as HTMLElement).offsetHeight}px`)));
    root.querySelectorAll(".g-year").forEach((sec) => ro.observe(sec));

    return () => {
      reveal.disconnect();
      deal.disconnect();
      pause.disconnect();
      ro.disconnect();
    };
  }, [year, tag]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // `step` only reads the filtered list, which can't change while the lightbox is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // 3D tilt toward the pointer, plus a glare that follows it (mouse only; touch keeps the flat tilt).
  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(x - 0.5) * 16}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 16}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const untilt = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };
  const swipeX = useRef<number | null>(null);

  const pill = (active: boolean) =>
    `border-2 border-black px-4 py-1.5 text-base font-bold uppercase tracking-wider shadow-[3px_3px_0_0_#000] transition g-pill ${
      active ? "bg-[#f5c928] text-black -rotate-1" : "bg-[#f5edd8] text-black hover:-translate-y-0.5"
    }`;

  return (
    <div ref={boardRef}>
      <style>{MOTION_CSS}</style>

      {/* Filters */}
      <section className="indie-mandala bg-[#a1001a] text-[#f5edd8]">
        <div className="g-in mx-auto max-w-5xl space-y-4 px-6 py-8">
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Year">
            <span className="mr-2 text-sm font-bold uppercase tracking-[0.3em] text-[#f5c928]">Year</span>
            {["All", ...years].map((y, i) => (
              <button key={y} role="tab" aria-selected={year === y} onClick={() => setYear(y)} className={pill(year === y)} style={{ ["--i" as string]: i }}>{y}</button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Category">
            <span className="mr-2 text-sm font-bold uppercase tracking-[0.3em] text-[#f5c928]">Topic</span>
            {["All", ...tags].map((t, i) => (
              <button key={t} role="tab" aria-selected={tag === t} onClick={() => setTag(t)} className={pill(tag === t)} style={{ ["--i" as string]: i + years.length + 1 }}>{t}</button>
            ))}
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f5edd8]/80" aria-live="polite">
            Showing {shown.length} of {items.length} snapshots
          </p>
        </div>
      </section>

      {/* One themed section per year */}
      {years.map((y, yi) => {
        // A flagged photo leads its year; the stable sort keeps everything else in order.
        const group = shown.filter(({ item }) => item.year === y).sort((a, b) => Number(!!b.item.featured) - Number(!!a.item.featured));
        if (group.length === 0) return null;
        const t = YEAR_THEMES[y] ?? FALLBACK_THEME;
        return (
          <section key={y} className={`g-year panel relative overflow-hidden ${yi > 0 ? "rounded-t-[2.5rem]" : ""}`} style={{ background: `linear-gradient(170deg, ${t.bg} 0%, ${t.bg2} 100%)`, color: t.ink }}>
            <div aria-hidden className="absolute inset-0 opacity-25" style={patternStyle(t.pattern, t.patternColor)} />
            <p aria-hidden className={`g-ghost pointer-events-none absolute -top-6 right-2 select-none text-[9rem] leading-none opacity-[0.1] sm:text-[18rem] ${display.className}`}>{y}</p>

            <div className="relative mx-auto w-full max-w-5xl px-6 py-14">
              <div className="mb-12 flex flex-wrap items-end justify-between gap-3">
                <h2 className={`g-slam origin-left text-6xl leading-none sm:text-7xl ${serif.className}`} style={{ textShadow: "3px 3px 0 rgba(255,255,255,0.6)" }}>{y}</h2>
                <p className="g-rise text-sm font-bold uppercase tracking-[0.3em]" style={{ color: t.soft }}>
                  {group.length} snapshot{group.length === 1 ? "" : "s"} · {yi === 0 ? "Latest edition" : "Throwback"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {group.map(({ item, n }, i) => {
                  // The year's lead photo (flagged, or else the first) is twice the size on large screens.
                  const featured = i === 0 && group.length >= 4;
                  return (
                  <figure key={`${year}-${tag}-${item.caption}`} className={`g-drop group ${featured ? "lg:col-span-2 lg:row-span-2" : ""}`} style={{ ["--d" as string]: `${(i % 3) * 110}ms` }}>
                    <button
                      onClick={() => setOpen({ item, n })}
                      onPointerMove={tilt}
                      onPointerLeave={untilt}
                      className={`g-tilt relative mx-auto block w-full text-left transition-[transform,translate,rotate] duration-200 ease-out group-hover:rotate-0 group-hover:-translate-y-2 ${featured ? "max-w-[19rem] lg:max-w-[33rem]" : "max-w-[19rem]"} ${TILTS[i % TILTS.length]}`}
                      aria-label={`Enlarge: ${item.caption}`}
                    >
                      {featured && (
                        <span className="absolute -left-3 top-8 z-20 -rotate-6 border-2 border-black bg-[#d62828] px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-[#f5edd8] shadow-[3px_3px_0_0_#000]">★ Featured</span>
                      )}
                      <span aria-hidden className="g-tape absolute -top-3 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rotate-2 border border-black/30" style={{ background: `${t.accent}cc` }} />
                      <PhotoStamp item={item} number={n} big={featured} />
                      {/* glare that follows the pointer */}
                      <span aria-hidden className="pointer-events-none absolute inset-4 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.35), transparent 50%)" }} />
                      <Postmark lines={false} className="g-postmark pointer-events-none absolute bottom-10 right-3 z-20 h-20 w-20 opacity-0 mix-blend-multiply" />
                      <span className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white text-black opacity-0 shadow-[2px_2px_0_0_#000] transition-opacity group-hover:opacity-100">
                        <ZoomIn className="h-4 w-4" />
                      </span>
                    </button>
                    <figcaption className="mx-auto mt-5 max-w-[19rem] text-center">
                      <p className={`text-lg italic leading-snug ${paper.className}`}>
                        {item.caption} — {item.image ? "OPJU, Raigarh" : CULTURES[item.scene]?.state ?? "India"}
                      </p>
                      <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.4em]" style={{ color: t.soft }}>{item.tag} · {item.year}</p>
                    </figcaption>
                  </figure>
                  );
                })}
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
          className="g-fade fixed inset-0 z-[90] flex flex-col items-center justify-center gap-5 overflow-y-auto bg-black/90 p-6 backdrop-blur-sm"
          onClick={() => setOpen(null)}
          onPointerDown={(e) => (swipeX.current = e.clientX)}
          onPointerUp={(e) => {
            const dx = swipeX.current === null ? 0 : e.clientX - swipeX.current;
            swipeX.current = null;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#f5c928]">
            {shown.findIndex((s) => s.n === open.n) + 1} / {shown.length}
          </p>
          {shown.length > 1 &&
            ([[-1, "left-2 sm:left-6", ChevronLeft, "Previous photo"], [1, "right-2 sm:right-6", ChevronRight, "Next photo"]] as const).map(([d, pos, Icon, label]) => (
              <button
                key={d}
                onClick={(e) => { e.stopPropagation(); step(d); }}
                aria-label={label}
                className={`absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-[#f5edd8] text-black shadow-[3px_3px_0_0_#000] transition hover:scale-110 hover:bg-[#f5c928] ${pos}`}
              >
                <Icon className="h-6 w-6" />
              </button>
            ))}
          <div
            key={open.n}
            className={`relative w-full max-w-sm ${open.dir === "l" ? "g-swipe-l" : open.dir === "r" ? "g-swipe-r" : "indie-pop"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="absolute -right-2 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-[#f5c928] text-black shadow-[3px_3px_0_0_#000] hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>
            <PhotoStamp item={open.item} number={open.n} big />
            <p className={`mt-5 text-center text-xl italic text-[#f5edd8] ${paper.className}`}>
              {open.item.caption} — {open.item.image ? "OPJU, Raigarh" : CULTURES[open.item.scene]?.state ?? "India"}
            </p>
            <p className="text-center text-xs font-bold uppercase tracking-[0.4em] text-[#f5c928]">{open.item.tag} · {open.item.year}</p>
          </div>
          {shown.length > 1 && (
            <div className="g-thumbs flex max-w-full gap-2 overflow-x-auto px-2 pb-2" onClick={(e) => e.stopPropagation()}>
              {shown.map((s, i) =>
                s.item.image ? (
                  <button
                    key={s.n}
                    onClick={() => setOpen({ ...s, dir: s.n > open.n ? "l" : "r" })}
                    aria-label={`Show ${s.item.caption}`}
                    aria-current={s.n === open.n}
                    style={{ ["--i" as string]: i }}
                    ref={s.n === open.n ? (el) => el?.scrollIntoView({ block: "nearest", inline: "center" }) : undefined}
                    className={`h-16 w-12 shrink-0 overflow-hidden border-2 transition ${s.n === open.n ? "scale-110 border-[#f5c928]" : "border-transparent opacity-50 hover:opacity-100"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.item.image} alt="" className="h-full w-full object-cover" />
                  </button>
                ) : null,
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
