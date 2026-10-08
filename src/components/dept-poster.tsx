import {
  Award, BedDouble, Bus, ClipboardList, Code2, Hammer, Handshake, HeartPulse, IndianRupee,
  Megaphone, Mic, Package, Palette, ShieldCheck, Utensils, type LucideIcon,
} from "lucide-react";
import { DEPT_FLAVOR, POSTER_PALETTES, initials, type Department } from "@/data/dummy";
import { NimbuMirch } from "@/components/nimbu-mirch";
import { blockHindi, paper, serif } from "@/components/indie";

const ICONS: Record<string, LucideIcon> = {
  megaphone: Megaphone, palette: Palette, clipboard: ClipboardList, bed: BedDouble, mic: Mic,
  utensils: Utensils, hammer: Hammer, bus: Bus, handshake: Handshake, code: Code2,
  rupee: IndianRupee, award: Award, shield: ShieldCheck, package: Package, heart: HeartPulse,
};

const Rosette = ({ color, className }: { color: string; className: string }) => (
  <svg viewBox="0 0 24 24" className={`absolute h-5 w-5 ${className}`} fill={color} aria-hidden>
    {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="12" cy="6.5" rx="3.4" ry="5.2" transform={`rotate(${a} 12 12)`} />)}
    <circle cx="12" cy="12" r="2.6" fill="#1a0f08" opacity="0.55" />
  </svg>
);

// A department as a framed poster: arched title banner, Hindi side labels, an oval picture
// with a dotted ring, a Hinglish caption (the cheekier one appears on hover) and the two conveners.
export function DeptPoster({ dept, index, id }: { dept: Department; index: number; id: string }) {
  const f = DEPT_FLAVOR[dept.name];
  const p = POSTER_PALETTES[index % POSTER_PALETTES.length];
  const Icon = ICONS[f.icon] ?? Megaphone;
  const titleSize = f.title.length <= 18 ? "text-4xl" : f.title.length <= 24 ? "text-3xl" : "text-[1.7rem]";

  return (
    <article id={id} className="group h-full scroll-mt-24 transition-transform duration-200 hover:-translate-y-1.5 hover:-rotate-[0.6deg]">
      <div className="relative h-full border-2 border-black p-2.5 shadow-[6px_6px_0_0_#000]" style={{ background: p.main, color: p.ink }}>
        <div className="relative flex h-full flex-col overflow-hidden" style={{ border: `2px solid ${p.line}` }}>
          {[["left-1.5 top-1.5"], ["right-1.5 top-1.5"], ["left-1.5 bottom-1.5"], ["right-1.5 bottom-1.5"]].map(([pos]) => (
            <Rosette key={pos} color={p.line} className={`z-10 ${pos}`} />
          ))}

          {/* arched banner with the title */}
          <div className="relative px-6 pb-9 pt-7 text-center" style={{ background: p.accent, borderRadius: "20px 20px 0 0" }}>
            <h3
              className={`${titleSize} uppercase leading-[0.95] tracking-tight ${serif.className}`}
              style={{ color: p.bannerInk, textShadow: `3px 3px 0 ${p.bannerShadow}` }}
            >
              {f.title}
            </h3>
          </div>
          <div aria-hidden className="relative z-[1] -mt-7 h-8 shrink-0" style={{ background: p.main, borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />

          {/* Hindi labels either side */}
          <div className="-mt-1 flex items-start justify-between gap-2 px-3">
            <span className={`text-xl leading-tight ${blockHindi.className}`} style={{ color: p.ink }}>{f.hindi[0]}</span>
            <span className={`text-right text-xl leading-tight ${blockHindi.className}`} style={{ color: p.ink }}>{f.hindi[1]}</span>
          </div>

          {/* oval picture */}
          <div className="relative mx-auto mt-2 w-[66%]">
            <div aria-hidden className="absolute -inset-2 rounded-[50%]" style={{ border: `2.5px dotted ${p.line}` }} />
            <div className="relative aspect-[3/4] overflow-hidden rounded-[50%] border-2" style={{ background: p.sky, borderColor: p.line }}>
              <span aria-hidden className="absolute -left-6 top-[34%] h-[26%] w-[150%] -rotate-[28deg]" style={{ background: p.shape }} />
              <span aria-hidden className="absolute -right-8 top-[8%] h-[16%] w-[130%] rotate-[24deg] opacity-80" style={{ background: p.accent }} />
              <span aria-hidden className="absolute -left-4 bottom-[14%] h-[10%] w-[140%] rotate-[10deg]" style={{ background: p.main, opacity: 0.55 }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-black bg-white shadow-[3px_3px_0_0_#000] transition-transform group-hover:rotate-6 group-hover:scale-110">
                  <Icon className="h-10 w-10" style={{ color: p.main }} />
                </span>
              </div>
            </div>
          </div>

          {/* hanging charms, like the reference */}
          <NimbuMirch className="pointer-events-none absolute left-2 top-[47%] h-14 w-auto" delay="0.2s" />
          <NimbuMirch className="pointer-events-none absolute right-2 top-[47%] h-14 w-auto" delay="1s" />

          {/* caption (swaps to the cheekier line on hover) */}
          <div className="relative mx-4 mb-4 mt-5 min-h-[3.4rem] text-center">
            <p className={`text-base italic leading-snug transition-opacity duration-200 group-hover:opacity-0 ${paper.className}`}>“{f.caption}”</p>
            <p aria-hidden className={`absolute inset-0 text-base italic font-semibold leading-snug opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${paper.className}`} style={{ color: p.line }}>“{f.alt}”</p>
          </div>

          {/* the people */}
          <ul className="mx-4 mb-4 mt-auto space-y-2.5 border-t-2 border-dashed pt-3" style={{ borderColor: `${p.line}99` }}>
            {[
              [dept.convener, "Convener"],
              [dept.coConvener, "Co-Convener"],
            ].map(([person, role]) => {
              const m = person as typeof dept.convener;
              return (
                <li key={role as string} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black text-sm font-bold" style={{ background: p.accent, color: p.bannerInk === p.line ? p.main : "#1a0f08" }}>
                    {initials(m.name)}
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-base font-bold">{m.name}</span>
                    <span className="block text-[11px] font-bold uppercase tracking-widest" style={{ color: p.line }}>{role as string}</span>
                    <span className="block text-sm font-semibold tabular-nums opacity-90">{m.phone}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </article>
  );
}
