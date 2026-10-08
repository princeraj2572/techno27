import { Calendar, Clock, MapPin } from "lucide-react";
import { EventIcon } from "@/components/event-icons";
import { CtaBand, PageShell, SceneHeader, SectionHead, serif } from "@/components/heritage";
import { PRONITES } from "@/data/dummy";

export const metadata = { title: "Pronites | Techno-aiMBiAtion 2027" };

const ICONS = ["music", "mic", "flame"];

export default function PronitesPage() {
  return (
    <PageShell>
      <SceneHeader>
        <SectionHead
          title="PRONITES"
          sub="Music • Lights • Energy"
          text="When the competitions end, the stage lights up. Evenings of live music, performances and unforgettable moments."
        />
      </SceneHeader>

      <section className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRONITES.map((n, i) => (
          <div key={n.n} className="rounded-xl border border-[#c9a27a]/60 bg-[#fffaf0]/90 p-6 text-center shadow-[0_8px_20px_-12px_rgba(110,11,18,0.5)]">
            <span className="inline-block rounded-full bg-[#7a0c14] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white">Night {n.n}</span>
            <div className="mx-auto my-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-[#fde3c6] to-[#fbf3e6] border border-[#c9a27a]/50">
              <EventIcon name={ICONS[i]} className="h-9 w-9 text-[#7a0c14]" />
            </div>
            <h3 className={`text-2xl font-bold ${serif.className}`}>{n.artist}</h3>
            <p className="text-xs uppercase tracking-[0.25em] text-[#9b111e] mt-1">{n.title} · {n.genre}</p>
            <p className="mt-3 text-[#1c0b09]/75 leading-snug">{n.desc}</p>
            <ul className="mt-4 space-y-1 text-sm text-[#1c0b09]/80">
              <li className="flex items-center justify-center gap-2"><Calendar className="h-4 w-4 text-[#9b111e]" /> {n.date}</li>
              <li className="flex items-center justify-center gap-2"><Clock className="h-4 w-4 text-[#9b111e]" /> {n.time}</li>
              <li className="flex items-center justify-center gap-2"><MapPin className="h-4 w-4 text-[#9b111e]" /> {n.venue}</li>
            </ul>
          </div>
        ))}
      </section>
      <p className="-mt-6 pb-12 text-center text-xs text-[#1c0b09]/50">Sample lineup — artists and dates are placeholders.</p>

      <CtaBand title="Don't miss the nights" text="Register to get your pass and be first to know the lineup." href="/auth/signup" label="Register now" />
    </PageShell>
  );
}
