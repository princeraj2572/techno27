import { Band, Marquee, PageHero, PageShell, TicketCta, display } from "@/components/indie";

export const metadata = { title: "Gallery | Techno-aiMBiAtion 2027" };

// Placeholder frames — swap `src` in for real photos (put files in /public/gallery).
const PHOTOS: { caption: string; tag: string; bg: string; icon: string; src?: string }[] = [
  { caption: "Hackathon night",       tag: "Tech",     bg: "bg-[#f5c928]", icon: "💻" },
  { caption: "Robo Race finals",      tag: "Robotics", bg: "bg-[#ff6a00]", icon: "🤖" },
  { caption: "On stage",              tag: "Culture",  bg: "bg-[#c8421f]", icon: "🎤" },
  { caption: "Fashion walk",          tag: "Culture",  bg: "bg-[#ffb10f]", icon: "👗" },
  { caption: "Rangoli & art",         tag: "Art",      bg: "bg-[#f5c928]", icon: "🎨" },
  { caption: "Beat battle",           tag: "Music",    bg: "bg-[#ff6a00]", icon: "🥁" },
  { caption: "Masterchef kitchen",    tag: "Food",     bg: "bg-[#ffb10f]", icon: "🍳" },
  { caption: "Prize ceremony",        tag: "Awards",   bg: "bg-[#c8421f]", icon: "🏆" },
  { caption: "The crowd",             tag: "Vibes",    bg: "bg-[#f5c928]", icon: "🎉" },
];

const TILTS = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1", "rotate-1", "-rotate-2"];

export default function GalleryPage() {
  return (
    <PageShell>
      <PageHero tone="amber" title="The gallery" sub="Stuck to the wall, a little crooked" ghost="Say cheese" />

      <Marquee
        className="bg-[#ff6a00] text-black font-bold uppercase tracking-wider text-xl py-1.5 -rotate-1"
        text="Say cheese ✦ Capture the riot ✦ "
      />

      <Band tone="amber" mandala>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
          {PHOTOS.map((p, i) => (
            <figure
              key={p.caption}
              className={`relative bg-[#f5edd8] text-[#1a0505] border-2 border-black shadow-[5px_5px_0_0_#000] p-3 pb-4 ${TILTS[i % TILTS.length]} hover:rotate-0 hover:-translate-y-1 hover:scale-[1.03] transition-all`}
            >
              <span aria-hidden className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#f5c928]/90 border border-black/40 rotate-2" />
              <div className={`aspect-[4/3] ${p.bg} border-2 border-black flex items-center justify-center overflow-hidden`}>
                {p.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.src} alt={p.caption} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl sm:text-6xl" aria-hidden>{p.icon}</span>
                )}
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-2">
                <span className={`text-base sm:text-lg leading-tight ${display.className}`}>{p.caption}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-[#f5c928] px-2 py-0.5 rounded-full shrink-0">{p.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="text-center text-base text-black/60 mt-12">Real photos from the fest will be added here.</p>
      </Band>

      <TicketCta
        title="Want to be in the next one?"
        text="Register for Techno-aiMBiAtion 2027 and make some memories of your own."
        href="/auth/signup"
        label="Register now"
      />
    </PageShell>
  );
}
