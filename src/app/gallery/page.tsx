import { EventIcon } from "@/components/event-icons";
import { CtaBand, PageShell, SceneHeader, SectionHead, serif } from "@/components/heritage";

export const metadata = { title: "Gallery | Techno-aiMBiAtion 2027" };

// Placeholder frames — set `src` (files in /public/gallery) to show real photos.
const PHOTOS: { caption: string; tag: string; iconKey: string; src?: string }[] = [
  { caption: "Hackathon night", tag: "Technical", iconKey: "code" },
  { caption: "Robo race finals", tag: "Technical", iconKey: "bot" },
  { caption: "On stage", tag: "Cultural", iconKey: "mic" },
  { caption: "Fashion walk", tag: "Cultural", iconKey: "shirt" },
  { caption: "Rangoli & art", tag: "Cultural", iconKey: "palette" },
  { caption: "Beat battle", tag: "Cultural", iconKey: "music" },
  { caption: "Masterchef kitchen", tag: "Fun", iconKey: "chef" },
  { caption: "Pitch day", tag: "Management", iconKey: "trend" },
  { caption: "The crowd", tag: "Vibes", iconKey: "star" },
];

const TILTS = ["-rotate-1", "rotate-1", "rotate-[1.5deg]", "-rotate-[1.5deg]"];

export default function GalleryPage() {
  return (
    <PageShell>
      <SceneHeader>
        <SectionHead
          title="GALLERY"
          sub="Moments • Memories • Magic"
          text="Snapshots from the fest, pinned to the wall — a little crooked, exactly how they should be."
        />
      </SceneHeader>

      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
          {PHOTOS.map((p, i) => (
            <figure
              key={p.caption}
              className={`relative bg-[#fffaf0] border border-[#c9a27a]/60 shadow-[0_10px_24px_-12px_rgba(110,11,18,0.55)] p-3 pb-4 ${TILTS[i % TILTS.length]} hover:rotate-0 hover:-translate-y-1 transition`}
            >
              <span aria-hidden className="absolute -top-3 left-1/2 -translate-x-1/2 h-5 w-16 bg-[#c1121f]/80 rotate-2" />
              <div className="aspect-[4/3] bg-gradient-to-b from-[#fde3c6] via-[#f7b878] to-[#c1121f]/80 flex items-center justify-center overflow-hidden">
                {p.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.src} alt={p.caption} className="h-full w-full object-cover" />
                ) : (
                  <EventIcon name={p.iconKey} className="h-12 w-12 text-[#4a070c]/80" />
                )}
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-2">
                <span className={`font-bold leading-tight ${serif.className}`}>{p.caption}</span>
                <span className="shrink-0 rounded-full bg-[#7a0c14] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">{p.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-[#1c0b09]/60">Real photos from the fest will be added here.</p>
      </section>

      <CtaBand
        title="Want to be in the next one?"
        text="Register for Techno-aiMBiAtion 2027 and make some memories of your own."
        href="/auth/signup"
        label="Register now"
      />
    </PageShell>
  );
}
