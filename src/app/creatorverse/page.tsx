import { EventIcon } from "@/components/event-icons";
import { CtaBand, PageShell, SceneHeader, SectionHead, serif } from "@/components/heritage";
import { CREATOR_PERKS } from "@/data/dummy";

export const metadata = { title: "Creatorverse | Techno-aiMBiAtion 2027" };

// PLACEHOLDER content — replace with the real Creatorverse programme.
const TRACKS = [
  { title: "Photography", iconKey: "camera", desc: "Capture the fest through your lens and show your best frames." },
  { title: "Design & Art", iconKey: "palette", desc: "Posters, illustrations and live art for the festival wall." },
  { title: "Film & Reels", iconKey: "star", desc: "Short films and reels that tell the story of the fest." },
  { title: "Writing", iconKey: "pen", desc: "Words that inspire — stories, poems and reportage." },
];

export default function CreatorversePage() {
  return (
    <PageShell>
      <SceneHeader>
        <SectionHead
          title="CREATORVERSE"
          sub="Create • Share • Inspire"
          text="A space for makers, storytellers and artists to showcase their craft and connect with other creators."
        />
      </SceneHeader>

      <section className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {TRACKS.map((t) => (
          <div key={t.title} className="flex gap-4 rounded-xl border border-[#c9a27a]/60 bg-[#fffaf0]/90 p-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#fde3c6] to-[#fbf3e6] border border-[#c9a27a]/50">
              <EventIcon name={t.iconKey} className="h-7 w-7 text-[#7a0c14]" />
            </span>
            <div>
              <h3 className={`text-xl font-bold ${serif.className}`}>{t.title}</h3>
              <p className="mt-1 text-[#1c0b09]/75 leading-snug">{t.desc}</p>
            </div>
          </div>
        ))}
      </section>
      <p className="-mt-6 pb-12 text-center text-xs text-[#1c0b09]/50">Sample programme — details are placeholders.</p>

      <section className="max-w-5xl mx-auto px-6 pb-14">
        <h2 className={`text-3xl font-bold mb-6 text-center ${serif.className}`}>Perks &amp; rewards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CREATOR_PERKS.map((p, i) => (
            <div key={p.title} className="rounded-xl border border-[#c9a27a]/60 bg-[#fffaf0]/90 p-5 text-center">
              <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-[#c1121f] to-[#6e0b12] text-white text-sm font-bold">{i + 1}</span>
              <p className={`font-bold ${serif.className}`}>{p.title}</p>
              <p className="mt-1 text-sm text-[#1c0b09]/70 leading-snug">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBand title="Got something to show?" text="Register and join the creator community at Techno-aiMBiAtion." href="/auth/signup" label="Register now" />
    </PageShell>
  );
}
