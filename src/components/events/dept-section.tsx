import {
  Award, BedDouble, Bus, ClipboardList, Code2, Hammer, Handshake, HeartPulse, IndianRupee,
  Mail, Megaphone, Mic, Package, Palette, Phone, ShieldCheck, Utensils, type LucideIcon,
} from "lucide-react";
import {
  DEPT_FLAVOR, POSTER_PALETTES, initials, type Department, type PosterPalette, type TeamMember,
} from "@/data/dummy";
import { patternStyle, type PatternKind } from "@/features/events/data/event-themes";
import { NimbuMirch } from "@/components/indie/nimbu-mirch";
import { blockHindi, paper, serif } from "@/components/indie";

const ICONS: Record<string, LucideIcon> = {
  megaphone: Megaphone, palette: Palette, clipboard: ClipboardList, bed: BedDouble, mic: Mic,
  utensils: Utensils, hammer: Hammer, bus: Bus, handshake: Handshake, code: Code2,
  rupee: IndianRupee, award: Award, shield: ShieldCheck, package: Package, heart: HeartPulse,
};

// Light section backgrounds + a faint pattern, cycled so neighbouring sections differ.
const SECTION_BG = ["#ffe9b8", "#f6dfc6", "#ffd9a6"];
const SECTION_PATTERN: PatternKind[] = ["dots", "diamonds", "waves", "leaves", "arches"];

const Rosette = ({ color, className }: { color: string; className: string }) => (
  <svg viewBox="0 0 24 24" className={`absolute h-5 w-5 ${className}`} fill={color} aria-hidden>
    {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="12" cy="6.5" rx="3.4" ry="5.2" transform={`rotate(${a} 12 12)`} />)}
    <circle cx="12" cy="12" r="2.6" fill="#1a0f08" opacity="0.55" />
  </svg>
);

// One person: photo slot (real photo via member.photo), name, role, tap-to-call phone, tap-to-email address.
function PersonCard({ person, role, p }: { person: TeamMember; role: string; p: PosterPalette }) {
  return (
    <li className="group/person mx-auto w-full max-w-[15rem] min-[480px]:max-w-none">
      <div className="border-2 border-black bg-[#fdebc0] p-1.5 shadow-[4px_4px_0_0_#000] transition-transform duration-200 group-hover/person:-translate-y-1 group-hover/person:rotate-[0.8deg]">
        <div className="relative aspect-[4/5] overflow-hidden border-2 border-black" style={{ background: `linear-gradient(160deg, ${p.accent}, ${p.main})` }}>
          {person.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={person.photo} alt={person.name} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <>
              <div aria-hidden className="absolute inset-0 opacity-25" style={patternStyle("diamonds", "#ffffff")} />
              <div className="absolute inset-3 flex flex-col items-center justify-center border-2 border-dashed border-white/60">
                <span className={`text-5xl leading-none text-white [text-shadow:2px_2px_0_rgba(0,0,0,0.3)] ${serif.className}`}>{initials(person.name)}</span>
                <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.3em] text-white/85">Photo</span>
              </div>
            </>
          )}
          <span className="absolute left-1.5 top-1.5 border border-black bg-[#f5c928] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-black">{role}</span>
        </div>
      </div>

      <div className="mt-3 space-y-1 leading-tight">
        <p className="text-lg font-bold">{person.name}</p>
        <a href={`tel:${person.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 text-sm font-semibold tabular-nums opacity-95 hover:underline">
          <Phone className="h-3.5 w-3.5 shrink-0" style={{ color: p.line }} />{person.phone}
        </a>
        {person.email && (
          <a href={`mailto:${person.email}`} className="flex items-center gap-1.5 text-xs font-semibold opacity-90 hover:underline">
            <Mail className="h-3.5 w-3.5 shrink-0" style={{ color: p.line }} /><span className="truncate">{person.email}</span>
          </a>
        )}
      </div>
    </li>
  );
}

// A department as a full-width section holding a horizontal poster card:
// title panel on the left, the crew (2-3 people with photos + contact details) on the right.
export function DeptSection({ dept, index, total, id }: { dept: Department; index: number; total: number; id: string }) {
  const f = DEPT_FLAVOR[dept.name];
  const p = POSTER_PALETTES[index % POSTER_PALETTES.length];
  const Icon = ICONS[f.icon] ?? Megaphone;
  const titleSize = f.title.length <= 18 ? "text-4xl" : f.title.length <= 24 ? "text-3xl" : "text-[1.7rem]";
  const people = dept.people.slice(0, 3); // conveners are listed first

  return (
    <section
      id={id}
      className="relative scroll-mt-28 overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${SECTION_BG[index % SECTION_BG.length]}, #fff3d6)` }}
    >
      <div aria-hidden className="absolute inset-0 opacity-[0.16]" style={patternStyle(SECTION_PATTERN[index % SECTION_PATTERN.length], p.main)} />

      <div className="relative mx-auto max-w-6xl px-6 py-12">
        {/* section header */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-[#1a0f08]">
          <span className="border-2 border-black bg-[#f5c928] px-2.5 py-0.5 text-sm font-bold tracking-[0.2em] shadow-[2px_2px_0_0_#000]">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <h2 className={`text-2xl sm:text-3xl ${serif.className}`}>{dept.name}</h2>
          <span className="ml-auto text-xs font-bold uppercase tracking-[0.3em] opacity-60">{people.length} people</span>
        </div>

        {/* horizontal card */}
        <article className="group relative border-2 border-black p-2.5 shadow-[8px_8px_0_0_#000]" style={{ background: p.main, color: p.ink }}>
          <div className="relative overflow-hidden md:grid md:grid-cols-[21rem_1fr]" style={{ border: `2px solid ${p.line}` }}>
            {[["left-1.5 top-1.5"], ["right-1.5 top-1.5"], ["left-1.5 bottom-1.5"], ["right-1.5 bottom-1.5"]].map(([pos]) => (
              <Rosette key={pos} color={p.line} className={`z-10 ${pos}`} />
            ))}

            {/* left: title panel */}
            <div className="relative flex flex-col">
              <div className="px-6 pb-9 pt-7 text-center" style={{ background: p.accent, borderRadius: "18px 18px 0 0" }}>
                <h3 className={`${titleSize} uppercase leading-[0.95] tracking-tight ${serif.className}`} style={{ color: p.bannerInk, textShadow: `3px 3px 0 ${p.bannerShadow}` }}>
                  {f.title}
                </h3>
              </div>
              <div aria-hidden className="relative z-[1] -mt-7 h-8 shrink-0" style={{ background: p.main, borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />

              <div className="-mt-1 flex items-start justify-between gap-2 px-4">
                <span className={`text-xl leading-tight ${blockHindi.className}`}>{f.hindi[0]}</span>
                <span className={`text-right text-xl leading-tight ${blockHindi.className}`}>{f.hindi[1]}</span>
              </div>

              <div className="relative mx-auto mt-3 w-[46%]">
                <div aria-hidden className="absolute -inset-2 rounded-[50%]" style={{ border: `2.5px dotted ${p.line}` }} />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[50%] border-2" style={{ background: p.sky, borderColor: p.line }}>
                  <span aria-hidden className="absolute -left-6 top-[34%] h-[26%] w-[150%] -rotate-[28deg]" style={{ background: p.shape }} />
                  <span aria-hidden className="absolute -right-8 top-[8%] h-[16%] w-[130%] rotate-[24deg] opacity-80" style={{ background: p.accent }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-black bg-white shadow-[3px_3px_0_0_#000] transition-transform group-hover:rotate-6 group-hover:scale-110">
                      <Icon className="h-7 w-7" style={{ color: p.main }} />
                    </span>
                  </div>
                </div>
              </div>
              <NimbuMirch className="pointer-events-none absolute left-3 top-[50%] h-12 w-auto" delay="0.2s" />
              <NimbuMirch className="pointer-events-none absolute right-3 top-[50%] h-12 w-auto" delay="1s" />

              <div className="relative mx-5 mb-5 mt-5 min-h-[3.4rem] text-center">
                <p className={`text-base italic leading-snug transition-opacity duration-200 group-hover:opacity-0 ${paper.className}`}>“{f.caption}”</p>
                <p aria-hidden className={`absolute inset-0 text-base font-semibold italic leading-snug opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${paper.className}`} style={{ color: p.line }}>“{f.alt}”</p>
              </div>
            </div>

            {/* right: the crew */}
            <div className="relative flex flex-col justify-center border-t-2 border-dashed p-5 sm:p-7 md:border-l-2 md:border-t-0" style={{ borderColor: `${p.line}99` }}>
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.35em]" style={{ color: p.line }}>Meet the crew</p>
                  <p className={`text-2xl ${serif.className}`}>{f.title}</p>
                </div>
              </div>
              {!people.length && <p className="text-lg font-semibold">Student convenors of Junoon and Techno-aiMBiAtion.</p>}
              <ul className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-3">
                {people.map(([person, role]) => (
                  <PersonCard key={person.name + role} person={person} role={role} p={p} />
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
