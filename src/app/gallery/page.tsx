import { GALLERY } from "@/data/dummy";
import { GalleryBoard } from "@/components/events/gallery-board";
import { CountUp, Reveal } from "@/components/indie/motion";
import { Band, BlockButton, Marquee, PageShell, TicketCta, display, serif } from "@/components/indie";

export const metadata = { title: "Gallery | Techno-aiMBiAtion 2027" };

const PHOTOS = GALLERY.filter((g) => g.image);
// Six columns for the moving header wall, each photo used once across them.
const WALL = [0, 1, 2, 3, 4, 5].map((c) => PHOTOS.filter((_, i) => i % 6 === c));
// A few live shots that cross-fade inside the "your photo" polaroid.
const CYCLE = PHOTOS.filter((g) => ["Junoon", "Cultural"].includes(g.tag)).slice(0, 5);

export default function GalleryPage() {
  const years = new Set(GALLERY.map((g) => g.year)).size;
  const topics = new Set(GALLERY.map((g) => g.tag)).size;

  return (
    <PageShell>
      {/* camera flash on arrival + a scroll-progress strip along the bottom edge (styles live in GalleryBoard) */}
      <div aria-hidden className="gx-flash" />
      <div aria-hidden className="gx-progress" />

      {/* Header: a full-bleed, tilted wall of photos drifting up and down behind the title */}
      <Band
        tone="crimson"
        className="!pb-24 !pt-24 sm:!pb-32 sm:!pt-32"
        overlay={
          <div aria-hidden className="absolute inset-0 overflow-hidden">
            <div className="absolute -inset-x-16 -inset-y-40 grid -rotate-6 grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {WALL.map((col, c) => (
                <div key={c} className={c >= 4 ? "hidden lg:block" : c === 3 ? "hidden sm:block" : ""}>
                  <div className={c % 2 ? "indie-vdown" : "indie-vup"} style={{ animationDuration: `${40 + (c % 3) * 8}s` }}>
                    {[0, 1].map((rep) => (
                      <div key={rep} className="space-y-3 pb-3">
                        {col.map((g) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={g.image} src={g.image} alt="" className="aspect-[3/4] w-full border-4 border-[#f5edd8] object-cover" />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* crimson wash so the title reads over the photos */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#7a0014]/95 via-[#a1001a]/75 to-[#a1001a]/35" />
          </div>
        }
      >
        <div>
          <div className="relative z-10">
            <p className="gx-rise text-sm font-bold uppercase tracking-[0.35em] text-[#f5c928]">Moments · Memories · Magic</p>
            <h1 aria-label="Gallery" className={`mt-3 text-7xl leading-[0.9] sm:text-9xl indie-outline ${serif.className}`}>
              {"Gallery".split("").map((ch, i) => (
                <span key={i} aria-hidden className="gx-letter inline-block" style={{ ["--i" as string]: i }}>{ch}</span>
              ))}
            </h1>
            <p className="gx-rise mt-4 text-xl font-bold uppercase text-[#f5edd8] sm:text-2xl" style={{ animationDelay: ".9s" }}>
              <CountUp to={GALLERY.length} /> snapshots · <CountUp to={years} /> editions · <CountUp to={topics} /> topics
            </p>
            <div className="gx-rise mt-6 flex flex-wrap gap-3" style={{ animationDelay: "1.1s" }}>
              <span className="indie-float border-2 border-black bg-[#f5c928] px-3 py-1 text-xs font-bold uppercase tracking-widest text-black" style={{ ["--r" as string]: "-4deg" }}>
                ★ {GALLERY.length} stamps
              </span>
              <span className="indie-float border-2 border-black bg-[#f5edd8] px-3 py-1 text-xs font-bold uppercase tracking-widest text-black" style={{ ["--r" as string]: "3deg", animationDelay: "1.2s" }}>
                #TechnoAimbiation27
              </span>
            </div>
          </div>
        </div>
      </Band>

      <Marquee
        className="-rotate-1 bg-[#ff6a00] py-1.5 text-xl font-bold uppercase tracking-wider text-black"
        text="Say cheese ✦ Capture the riot ✦ Collect them all ✦ "
      />

      <GalleryBoard items={GALLERY} />

      {/* Share your moments */}
      <Reveal>
        <Band tone="parchment" mandala className="!py-14">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div className="space-y-4 text-[#1a0505]">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#c8421f]">Your turn</p>
              <h2 className={`text-4xl leading-none sm:text-6xl ${display.className}`}>Share your moments</h2>
              <p className="max-w-xl text-xl leading-snug text-black/75">
                Got a great shot from the fest? Tag it <strong>#TechnoAimbiation27</strong> or send it to the media team and we may feature it as the next stamp in the collection.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <BlockButton href="/contact">Send us your photos</BlockButton>
                <BlockButton href="/events" tone="mustard">Browse events</BlockButton>
              </div>
            </div>
            {/* a polaroid hanging from a pin, swaying, with fest shots cross-fading inside */}
            <div className="mx-auto">
              <span aria-hidden className="mx-auto block h-4 w-4 rounded-full border-2 border-black bg-[#d62828] shadow-[2px_2px_0_0_#000]" />
              <div className="indie-sway w-52 border-2 border-black bg-[#f5edd8] p-2.5 shadow-[6px_6px_0_0_#000]">
                <div className="relative aspect-[3/4] overflow-hidden border-2 border-black bg-black">
                  {CYCLE.map((g, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={g.image}
                      src={g.image}
                      alt=""
                      className="gx-cycle absolute inset-0 h-full w-full object-cover"
                      style={{ ["--i" as string]: i, ["--n" as string]: CYCLE.length }}
                    />
                  ))}
                </div>
                <p className="mt-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-black/60">Next stamp? Yours.</p>
              </div>
            </div>
          </div>
        </Band>
      </Reveal>

      <TicketCta
        title="Want to be in the next one?"
        text="Register for Techno-aiMBiAtion 2027 and make some memories of your own."
        href="/auth/signup"
        label="Register now"
      />
    </PageShell>
  );
}
