import { GALLERY } from "@/data/dummy";
import { CULTURES } from "@/components/culture-art";
import { GalleryBoard } from "@/components/gallery-board";
import { ImageSlot } from "@/components/media";
import { Reveal } from "@/components/motion";
import { Band, BlockButton, Marquee, PageShell, TicketCta, display, serif } from "@/components/indie";

export const metadata = { title: "Gallery | Techno-aiMBiAtion 2027" };

// Optional wide picture for the header, e.g. "/images/gallery-banner.jpg" (~1600 x 600)
const GALLERY_BANNER: string | undefined = undefined;

export default function GalleryPage() {
  const years = new Set(GALLERY.map((g) => g.year)).size;
  const states = new Set(GALLERY.map((g) => CULTURES[g.scene]?.state).filter(Boolean)).size;

  return (
    <PageShell>
      {/* Header */}
      <Band tone="crimson" mandala ghost="Say cheese" className="!pb-10 !pt-12">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#f5c928]">Moments · Memories · Magic</p>
        <h1 className={`mt-3 text-6xl leading-[0.9] sm:text-8xl indie-outline ${serif.className}`}>Gallery</h1>
        <p className="mt-3 text-xl font-bold uppercase text-[#f5edd8] sm:text-2xl">
          {GALLERY.length} snapshots · {years} editions · {states} states of India
        </p>
        <div className="relative mt-8">
          <ImageSlot
            src={GALLERY_BANNER}
            alt="Techno-aiMBiAtion gallery banner"
            label="Banner image"
            hint="1600 × 600"
            ratio="aspect-[21/8]"
            tone="from-[#ff6a00] to-[#7a1c1c]"
            className="border-2 border-black shadow-[6px_6px_0_0_#000]"
          />
          <span aria-hidden className="indie-float absolute -top-3 right-6 border-2 border-black bg-[#f5c928] px-3 py-1 text-xs font-bold uppercase tracking-widest text-black" style={{ ["--r" as string]: "5deg" }}>
            ★ {GALLERY.length} stamps
          </span>
          <span aria-hidden className="indie-float absolute -bottom-3 left-8 border-2 border-black bg-[#f5edd8] px-3 py-1 text-xs font-bold uppercase tracking-widest text-black" style={{ ["--r" as string]: "-4deg", animationDelay: "1.2s" }}>
            #TechnoAimbiation27
          </span>
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
            <div className="mx-auto w-52 -rotate-3 border-2 border-black bg-[#f5edd8] p-2.5 shadow-[6px_6px_0_0_#000]">
              <ImageSlot label="Your photo" hint="900 × 1200" ratio="aspect-[3/4]" tone="from-[#f5c928] to-[#c8421f]" className="border-2 border-black" />
              <p className="mt-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-black/60">Next stamp?</p>
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
