import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PUBLIC_EVENTS, getPublicEvent } from "@/data/public-events";
import { EventIcon } from "@/components/event-icons";
import { CtaBand, MAROON_GRADIENT, PageShell, SceneHeader, serif } from "@/components/heritage";

export function generateStaticParams() {
  return PUBLIC_EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getPublicEvent(slug);
  return { title: event ? `${event.name} | Techno-aiMBiAtion 2027` : "Event | Techno-aiMBiAtion 2027" };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getPublicEvent(slug);
  if (!event) notFound();

  const index = PUBLIC_EVENTS.findIndex((e) => e.slug === slug);
  const next = PUBLIC_EVENTS[(index + 1) % PUBLIC_EVENTS.length];

  return (
    <PageShell>
      <SceneHeader>
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fffaf0] border border-[#c9a27a]/60 shadow-md">
            <EventIcon name={event.iconKey} className="h-9 w-9 text-[#7a0c14]" />
          </div>
          <p className="text-xs uppercase tracking-[0.45em] text-[#1c0b09]/70">
            {event.category} · Event {String(index + 1).padStart(2, "0")}
          </p>
          <h1 className={`text-5xl sm:text-7xl font-extrabold leading-none ${MAROON_GRADIENT} ${serif.className}`}>{event.name}</h1>
          <p className="text-lg text-[#1c0b09]/80 leading-relaxed">
            Part of Techno-aiMBiAtion 2027 at O.P. Jindal University.
            {event.subEvents.length > 0
              ? ` ${event.subEvents.length} competitions under this banner.`
              : " A standalone marquee event."}
          </p>
        </div>
      </SceneHeader>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-14">
        <Link href="/events" className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-[#9b111e] hover:text-[#6e0b12]">
          <ArrowLeft className="h-4 w-4" /> All events
        </Link>

        {event.subEvents.length > 0 && (
          <section>
            <h2 className={`text-3xl font-bold mb-5 ${serif.className}`}>The lineup</h2>
            <ol className="rounded-xl border border-[#c9a27a]/60 bg-[#fffaf0]/90 divide-y divide-[#c9a27a]/40 overflow-hidden">
              {event.subEvents.map((s, i) => (
                <li key={s} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-b from-[#c1121f] to-[#6e0b12] text-white text-xs font-bold flex items-center justify-center">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`text-lg font-semibold ${serif.className}`}>{s}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section>
          <h2 className={`text-3xl font-bold mb-5 ${serif.className}`}>The details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["Date", "Venue", "Team size", "Prize pool"].map((label) => (
              <div key={label} className="rounded-xl border border-[#c9a27a]/60 bg-[#fffaf0]/90 p-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#1c0b09]/60">{label}</p>
                <p className={`mt-2 text-2xl font-bold text-[#7a0c14] ${serif.className}`}>TBA</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#1c0b09]/60">Full rules, schedule and fees are shared after you register.</p>
        </section>

        <Link href={`/events/${next.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#9b111e] hover:text-[#6e0b12]">
          Next: {next.name} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <CtaBand
        title={`Join ${event.name}`}
        text="Sign up with your OPJU email for free entry, then pick this event from your dashboard."
        href="/auth/signup"
        label="Register now"
      />
    </PageShell>
  );
}
