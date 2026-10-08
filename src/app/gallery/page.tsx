import { Band, Marquee, PageHero, PageShell, TicketCta, display } from "@/components/indie";
import { GALLERY } from "@/data/dummy";
import { Reveal } from "@/components/motion";

export const metadata = { title: "Gallery | Techno-aiMBiAtion 2027" };

const TILTS = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1", "rotate-1", "-rotate-2"];
const YEARS = ["2026", "2025"];

export default function GalleryPage() {
  return (
    <PageShell>
      <PageHero tone="amber" title="The gallery" sub="Stuck to the wall, a little crooked" ghost="Say cheese" />

      <Marquee
        className="bg-[#ff6a00] text-black font-bold uppercase tracking-wider text-xl py-1.5 -rotate-1"
        text="Say cheese ✦ Capture the riot ✦ "
      />

      {YEARS.map((year, yi) => (
        <Reveal key={year}><Band tone={yi === 0 ? "amber" : "parchment"} mandala>
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className={`text-5xl sm:text-6xl text-white leading-none ${display.className}`} style={{ textShadow: "3px 3px 0 #7a1c1c" }}>
              {year}
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-black/60">
              {GALLERY.filter((g) => g.year === year).length} snapshots
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
            {GALLERY.filter((g) => g.year === year).map((p, i) => (
              <figure
                key={p.caption}
                className={`relative bg-[#f5edd8] text-[#1a0505] border-2 border-black shadow-[5px_5px_0_0_#000] p-3 pb-4 ${TILTS[i % TILTS.length]} hover:rotate-0 hover:-translate-y-1 hover:scale-[1.03] transition-all`}
              >
                <span aria-hidden className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#f5c928]/90 border border-black/40 rotate-2" />
                <div className={`aspect-[4/3] bg-gradient-to-br ${p.bg} border-2 border-black flex items-center justify-center overflow-hidden`}>
                  <span className="text-5xl sm:text-6xl drop-shadow-[3px_3px_0_rgba(0,0,0,0.35)]" aria-hidden>{p.icon}</span>
                </div>
                <figcaption className="mt-3 flex items-center justify-between gap-2">
                  <span className={`text-base sm:text-lg leading-tight ${display.className}`}>{p.caption}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-[#f5c928] px-2 py-0.5 rounded-full shrink-0">{p.tag}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Band></Reveal>
      ))}
      <p className="bg-black py-3 text-center text-xs uppercase tracking-widest text-[#f5edd8]/60">Sample frames — real photos will replace these.</p>

      <TicketCta title="Want to be in the next one?" text="Register for Techno-aiMBiAtion 2027 and make some memories of your own." href="/auth/signup" label="Register now" />
    </PageShell>
  );
}
