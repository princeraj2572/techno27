"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { Cormorant_Garamond, Jost } from "next/font/google";
import {
  Check, ChevronLeft, ChevronRight, Copy, Download, ExternalLink, LayoutGrid, List, Maximize2,
  RotateCcw, X, ZoomIn, ZoomOut,
} from "lucide-react";
import styles from "./heritage.module.css";

// TEMPORARY asset-preview gallery. Delete src/app/heritage-preview/ + public/heritage-preview/ to remove.

const heading = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"] });
const sans = Jost({ subsets: ["latin"], weight: ["400", "500", "600"] });

export type HeritageImage = {
  number: number;
  file: string;
  src: string;
  title: string;
  note: string;
  bytes: number;
  width: number;
  height: number;
};
export type MissingImage = { number: number; file: string; title: string };

type SortKey = "number-asc" | "number-desc" | "name" | "size-desc" | "size-asc";
type ViewMode = "grid" | "list";

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}
const formatDims = (i: HeritageImage) => (i.width && i.height ? `${i.width} × ${i.height}` : "unknown");
const ratioOf = (i: HeritageImage) => (i.width && i.height ? `${i.width} / ${i.height}` : "16 / 9");
const pad = (n: number) => String(n).padStart(2, "0");

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

/* ────────────────────────────── Card ────────────────────────────── */

function Card({
  image, index, selected, reduced, onToggle, onOpen, onCopy,
}: {
  image: HeritageImage;
  index: number;
  selected: boolean;
  reduced: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onCopy: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  // Reveal when scrolled into view. Falls back to visible if IntersectionObserver is missing.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <article
      ref={ref}
      className={`${styles.card} ${shown ? styles.in : ""} ${selected ? styles.cardSelected : ""}`}
      style={{ ["--i" as string]: index % 3 } as CSSProperties}
    >
      <div className={styles.frame} style={{ aspectRatio: ratioOf(image) }}>
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open ${image.file} full screen`}
          style={{ position: "absolute", inset: 0, border: 0, padding: 0, background: "none", cursor: "zoom-in" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={`${image.title} — ${image.note}`}
            width={image.width || undefined}
            height={image.height || undefined}
            loading={index < 2 ? "eager" : "lazy"}
            decoding="async"
          />
        </button>
        <span className={styles.badge} aria-label={`Image ${image.number}`}>{pad(image.number)}</span>
        <button
          type="button"
          className={styles.pick}
          aria-pressed={selected}
          aria-label={selected ? `Deselect ${image.file}` : `Select ${image.file}`}
          onClick={onToggle}
        >
          <Check size={18} />
        </button>
      </div>

      <div className={styles.meta}>
        <h3 className={`${styles.metaTitle} ${heading.className}`}>{image.title}</h3>
        <p className={styles.fileName}>{image.file}</p>
        <p className={styles.facts}>
          <span>Image <b>{pad(image.number)}</b></span>
          <span><b>{formatDims(image)}</b> px</span>
          <span><b>{formatBytes(image.bytes)}</b></span>
        </p>
        <p className={styles.note}>{image.note}</p>
        <div className={styles.actions}>
          <button type="button" className={`${styles.btn} ${styles.btnGold}`} onClick={onOpen}>
            <Maximize2 size={15} /> View
          </button>
          <button type="button" className={styles.btn} onClick={onCopy}>
            <Copy size={15} /> Copy filename
          </button>
          <a className={styles.btn} href={image.src} download={image.file}>
            <Download size={15} /> Download
          </a>
          <a className={styles.btn} href={image.src} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={15} /> Full size
          </a>
        </div>
      </div>
    </article>
  );
}

/* ────────────────────────────── Viewer ────────────────────────────── */

function Viewer({
  images, index, onIndex, onClose, onCopy,
}: {
  images: HeritageImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  onCopy: (file: string) => void;
}) {
  const image = images[index];
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = useCallback((delta: number) => onIndex((index + delta + images.length) % images.length), [index, images.length, onIndex]);

  const applyZoom = useCallback((next: number) => {
    const z = clamp(next, MIN_ZOOM, MAX_ZOOM);
    setZoom(z);
    if (z === 1) setPan({ x: 0, y: 0 });
  }, []);

  // Reset zoom whenever the image changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [index]);

  // Lock scrolling, move focus into the dialog and restore it afterwards
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "+" || e.key === "=") applyZoom(zoom * 1.25);
      else if (e.key === "-") applyZoom(zoom / 1.25);
      else if (e.key === "0") applyZoom(1);
      else if (e.key === "Tab" && rootRef.current) {
        const f = Array.from(rootRef.current.querySelectorAll<HTMLElement>("button, a[href]")).filter((n) => !n.hasAttribute("disabled"));
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose, applyZoom, zoom]);

  const limit = () => {
    const w = imgRef.current?.offsetWidth ?? 0;
    const h = imgRef.current?.offsetHeight ?? 0;
    return { x: ((zoom - 1) * w) / 2, y: ((zoom - 1) * h) / 2 };
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLImageElement>) => {
    if (zoom <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    setDragging(true);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLImageElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const l = limit();
    setPan({ x: clamp(d.px + e.clientX - d.x, -l.x, l.x), y: clamp(d.py + e.clientY - d.y, -l.y, l.y) });
  };
  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const onKeyDownStage = (e: ReactKeyboardEvent) => {
    if (e.key === "Enter" && e.target === e.currentTarget) applyZoom(zoom > 1 ? 1 : 2.5);
  };

  if (!image) return null;

  return (
    <div ref={rootRef} className={`${styles.viewer} ${sans.className}`} role="dialog" aria-modal="true" aria-label={`${image.title}, image ${image.number} of ${images.length}`}>
      <div className={styles.viewerTop}>
        <div>
          <div className={heading.className} style={{ fontSize: "1.5rem", fontWeight: 600 }}>
            {pad(image.number)} · {image.title}
          </div>
          <div className={styles.fileName}>{image.file}</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" className={styles.btn} onClick={() => applyZoom(zoom / 1.25)} aria-label="Zoom out" disabled={zoom <= MIN_ZOOM}><ZoomOut size={16} /></button>
          <span style={{ minWidth: 48, textAlign: "center", fontVariantNumeric: "tabular-nums" }} aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button type="button" className={styles.btn} onClick={() => applyZoom(zoom * 1.25)} aria-label="Zoom in" disabled={zoom >= MAX_ZOOM}><ZoomIn size={16} /></button>
          <button type="button" className={styles.btn} onClick={() => applyZoom(1)} aria-label="Reset zoom"><RotateCcw size={16} /></button>
          <button type="button" className={styles.btn} onClick={() => onCopy(image.file)}><Copy size={15} /> Copy filename</button>
          <a className={styles.btn} href={image.src} download={image.file}><Download size={15} /> Download</a>
          <a className={styles.btn} href={image.src} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> Full size</a>
          <button ref={closeRef} type="button" className={`${styles.btn} ${styles.btnGold}`} onClick={onClose} aria-label="Close viewer (Escape)"><X size={16} /> Close</button>
        </div>
      </div>

      <div
        className={styles.viewerStage}
        tabIndex={0}
        onKeyDown={onKeyDownStage}
        onWheel={(e) => applyZoom(zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12))}
        onClick={(e) => { if (e.target === e.currentTarget && zoom === 1) onClose(); }}
      >
        {images.length > 1 && (
          <>
            <button type="button" className={`${styles.navBtn} ${styles.navPrev}`} onClick={() => go(-1)} aria-label="Previous image"><ChevronLeft /></button>
            <button type="button" className={`${styles.navBtn} ${styles.navNext}`} onClick={() => go(1)} aria-label="Next image"><ChevronRight /></button>
          </>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={image.file}
          ref={imgRef}
          className={`${styles.viewerImg} ${dragging ? styles.viewerImgDrag : ""}`}
          src={image.src}
          alt={`${image.title} — ${image.note}`}
          draggable={false}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in" }}
          onDoubleClick={() => applyZoom(zoom > 1 ? 1 : 2.5)}
          onClick={() => { if (zoom === 1) applyZoom(2); }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
      </div>

      <div className={styles.viewerBottom}>
        <span>{formatDims(image)} px · {formatBytes(image.bytes)} · {index + 1} / {images.length}</span>
        <span style={{ opacity: 0.7 }}>{image.note}</span>
        <span style={{ opacity: 0.55, fontSize: 13 }}>← → navigate · + / − zoom · Esc close</span>
      </div>
    </div>
  );
}

/* ────────────────────────────── Depth preview ────────────────────────────── */

const DEPTH_ORDER = [
  "01-sky-sun-clouds.png",
  "02-main-heritage-city.png",
  "03-middle-palace-city.png",
  "04-bridges-waterfalls-valley.png",
  "05-foreground-temple-terrace.png",
  "06-carved-temple-foreground.png",
];

function DepthPreview({ images, reduced }: { images: HeritageImage[]; reduced: boolean }) {
  const layers = useMemo(
    () => DEPTH_ORDER.map((f) => images.find((i) => i.file === f)).filter((i): i is HeritageImage => Boolean(i)),
    [images],
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mistA = useRef<HTMLDivElement>(null);
  const mistB = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);

  useEffect(() => {
    if (reduced || layers.length < 2) return;
    let raf = 0;
    const n = layers.length;

    const update = () => {
      raf = 0;
      const track = trackRef.current;
      const sticky = stickyRef.current;
      if (!track || !sticky) return;
      const rect = track.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
      const range = rect.height - sticky.offsetHeight;
      const p = range > 0 ? clamp((stickyTop - rect.top) / range, 0, 1) : 0;
      const t = p * (n - 1);

      sticky.style.setProperty("--p", String(p));
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = t - i;
        const opacity = clamp(1 + d, 0, 1);
        const travelled = clamp(d + 1, 0, 2); // 0 → 2 as this layer moves from far to passed
        const rate = 0.07 + i * 0.03; // nearer scenes move faster than distant ones
        const scale = 1 + travelled * rate * 1.6;
        const y = -travelled * (0.8 + i * 0.5);
        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(0, ${y}%, 0) scale(${scale})`;
      });
      if (mistA.current) mistA.current.style.transform = `translate3d(${-20 + p * 40}%, ${-p * 30}px, 0)`;
      if (mistB.current) mistB.current.style.transform = `translate3d(${20 - p * 70}%, ${p * 40}px, 0)`;

      const s = Math.round(t);
      if (s !== stageRef.current) {
        stageRef.current = s;
        setStage(s);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [layers, reduced]);

  if (layers.length === 0) return null;

  return (
    <section className={styles.depthSection} aria-labelledby="depth-heading">
      <div className={styles.depthIntro}>
        <p className={styles.eyebrow}>Scroll preview</p>
        <h2 id="depth-heading" className={heading.className} style={{ marginTop: 14 }}>Depth, from sky to the temple terrace</h2>
        <p>
          A quick look at the intended motion. These are complete landscape paintings, not isolated 3D layers, so the
          preview uses a cinematic push-in with different speeds per scene — not real depth. Scroll down, then back up: it reverses.
        </p>
      </div>

      {reduced || layers.length < 2 ? (
        <div className={styles.depthStatic}>
          {layers.map((l) => (
            <figure key={l.file} style={{ margin: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.src} alt={`${l.title} — ${l.note}`} loading="lazy" decoding="async" width={l.width || undefined} height={l.height || undefined} />
              <figcaption style={{ marginTop: 8, opacity: 0.75 }}>{pad(l.number)} · {l.title}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div ref={trackRef} className={styles.depthTrack}>
          <div ref={stickyRef} className={styles.depthSticky}>
            <div className={styles.depthBar} />
            {layers.map((l, i) => (
              <div
                key={l.file}
                ref={(el) => { layerRefs.current[i] = el; }}
                className={styles.depthLayer}
                role="img"
                aria-label={`${l.title} — ${l.note}`}
                style={{ backgroundImage: `url(${l.src})`, opacity: i === 0 ? 1 : 0 }}
              />
            ))}
            <div ref={mistA} className={styles.depthMist} style={{ bottom: "8%" }} />
            <div ref={mistB} className={styles.depthMist} style={{ bottom: "26%", opacity: 0.7 }} />
            <div className={styles.depthGlow} />
            <div className={styles.depthLabel}>
              <div className={`${styles.depthStage} ${heading.className}`} aria-live="polite">
                {pad(layers[stage]?.number ?? 1)} · {layers[stage]?.title}
              </div>
              <span>Scroll to explore depth</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ────────────────────────────── Page ────────────────────────────── */

export default function HeritageGallery({
  images, missing, total,
}: {
  images: HeritageImage[];
  missing: MissingImage[];
  total: number;
}) {
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("number-asc");
  const [view, setView] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [viewer, setViewer] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  const hero = images.find((i) => i.file === "02-main-heritage-city.png") ?? images[0];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = images.filter(
      (i) => !q || i.file.toLowerCase().includes(q) || i.title.toLowerCase().includes(q) || i.note.toLowerCase().includes(q) || String(i.number) === q || pad(i.number) === q,
    );
    const sorters: Record<SortKey, (a: HeritageImage, b: HeritageImage) => number> = {
      "number-asc": (a, b) => a.number - b.number,
      "number-desc": (a, b) => b.number - a.number,
      name: (a, b) => a.file.localeCompare(b.file),
      "size-desc": (a, b) => b.bytes - a.bytes,
      "size-asc": (a, b) => a.bytes - b.bytes,
    };
    return [...list].sort(sorters[sort]);
  }, [images, query, sort]);

  const flash = useCallback((text: string) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const copyName = useCallback(async (file: string) => {
    flash((await copyText(file)) ? `Copied ${file}` : "Copy failed — select the filename manually");
  }, [flash]);

  const toggle = (n: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  const selectedImages = images.filter((i) => selected.has(i.number));

  const downloadSelected = () => {
    selectedImages.forEach((img, k) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = img.src;
        a.download = img.file;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, k * 350);
    });
  };

  // Pointer parallax on the hero (CSS variables, no re-render)
  useEffect(() => {
    const el = heroRef.current;
    if (!el || reduced) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          el.style.setProperty("--px", x.toFixed(3));
          el.style.setProperty("--py", y.toFixed(3));
        });
      }
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const openViewer = (n: number) => {
    const idx = visible.findIndex((i) => i.number === n);
    if (idx >= 0) setViewer(idx);
  };

  return (
    <div className={`${styles.page} ${sans.className}`}>
      {/* Hero */}
      <header ref={heroRef} className={styles.hero}>
        <div className={styles.heroBg} aria-hidden>
          {hero && <div className={styles.heroBgInner} style={{ backgroundImage: `url(${hero.src})` }} />}
        </div>
        <div className={styles.heroShade} aria-hidden />
        <div className={styles.heroSweep} aria-hidden />
        <div className={styles.heroInner}>
          <p className={`${styles.eyebrow} ${styles.rise}`} style={{ animationDelay: "0.35s" }}>Temporary asset preview</p>
          <h1 className={`${styles.title} ${styles.rise} ${heading.className}`} style={{ animationDelay: "0.5s" }}>
            India Heritage — <em>Visual Assets</em>
          </h1>
          <p className={`${styles.subtitle} ${styles.rise}`} style={{ animationDelay: "0.7s" }}>
            These images are being prepared for a 3D scroll experience. Review each asset here — dimensions, file size and
            filename — before it goes into the final build.
          </p>
          <div className={`${styles.statRow} ${styles.rise}`} style={{ animationDelay: "0.9s" }} role="status">
            <span className={styles.stat}><b>{images.length}</b> of {total} images found</span>
            {missing.length > 0 && <span className={`${styles.stat} ${styles.statWarn}`}><b>{missing.length}</b> missing</span>}
          </div>
        </div>
      </header>

      <div className={styles.wrap}>
        {missing.length > 0 && (
          <div className={styles.notice} role="alert">
            {missing.length} expected image{missing.length > 1 ? "s were" : " was"} not found in <code>public/heritage-preview/</code>:
            <ul>
              {missing.map((m) => (
                <li key={m.file}>{pad(m.number)} · <code>{m.file}</code> ({m.title})</li>
              ))}
            </ul>
          </div>
        )}

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarInner}>
            <input
              type="search"
              className={styles.search}
              placeholder="Search by name, number or description…"
              aria-label="Search images"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className={styles.select} aria-label="Sort images" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="number-asc">Number ↑</option>
              <option value="number-desc">Number ↓</option>
              <option value="name">Filename A–Z</option>
              <option value="size-desc">Largest file first</option>
              <option value="size-asc">Smallest file first</option>
            </select>
            <div className={styles.seg} role="group" aria-label="Layout">
              <button type="button" className={styles.segBtn} aria-pressed={view === "grid"} onClick={() => setView("grid")}>
                <LayoutGrid size={16} style={{ verticalAlign: "-3px" }} /> Grid
              </button>
              <button type="button" className={styles.segBtn} aria-pressed={view === "list"} onClick={() => setView("list")}>
                <List size={16} style={{ verticalAlign: "-3px" }} /> List
              </button>
            </div>
            <span style={{ fontSize: 14, opacity: 0.7 }} aria-live="polite">
              {visible.length === images.length ? `${images.length} images` : `${visible.length} of ${images.length} shown`}
            </span>
          </div>

          {selected.size > 0 && (
            <div className={styles.selectionBar}>
              <b>{selected.size} selected</b>
              <button type="button" className={styles.btn} onClick={async () => flash((await copyText(selectedImages.map((i) => i.file).join("\n"))) ? `Copied ${selectedImages.length} filenames` : "Copy failed")}>
                <Copy size={15} /> Copy filenames
              </button>
              <button type="button" className={styles.btn} onClick={downloadSelected}><Download size={15} /> Download selected</button>
              <button type="button" className={styles.btn} onClick={() => setSelected(new Set())}>Clear</button>
            </div>
          )}
        </div>

        {/* Grid / list */}
        {images.length === 0 ? (
          <p className={styles.empty}>No heritage images were found. Put them in <code>public/heritage-preview/</code>.</p>
        ) : visible.length === 0 ? (
          <p className={styles.empty}>No images match “{query}”.</p>
        ) : (
          <div className={`${styles.grid} ${view === "list" ? styles.list : ""}`}>
            {visible.map((img, i) => (
              <Card
                key={img.file}
                image={img}
                index={i}
                reduced={reduced}
                selected={selected.has(img.number)}
                onToggle={() => toggle(img.number)}
                onOpen={() => openViewer(img.number)}
                onCopy={() => copyName(img.file)}
              />
            ))}
          </div>
        )}
      </div>

      <DepthPreview images={images} reduced={reduced} />

      <footer className={styles.footer}>Temporary preview page · remove <code>src/app/heritage-preview</code> and <code>public/heritage-preview</code> when finished.</footer>

      {viewer !== null && visible.length > 0 && (
        <Viewer
          images={visible}
          index={Math.min(viewer, visible.length - 1)}
          onIndex={setViewer}
          onClose={() => setViewer(null)}
          onCopy={copyName}
        />
      )}

      <div
        role="status"
        aria-live="polite"
        style={{
          position: "fixed", left: "50%", bottom: 24, translate: "-50% 0", zIndex: 200,
          padding: "10px 18px", borderRadius: 999, background: "#e8b04b", color: "#2a1b08", fontWeight: 600,
          opacity: toast ? 1 : 0, pointerEvents: "none", transition: "opacity .25s",
        }}
      >
        {toast}
      </div>
    </div>
  );
}
