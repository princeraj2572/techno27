import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PUBLIC_EVENTS, getPublicEvent } from "@/data/public-events";
import { ACCENTS, CARD, PageShell, SectionTitle, TicketCta, display } from "@/components/indie";

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
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-10 space-y-6">
        <Link href="/events" className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-[#f5c928] hover:text-[#ff6a00]">
          <ArrowLeft className="h-4 w-4" /> All events
        </Link>
        <p className="inline-block bg-[#ff6a00] text-black text-sm font-bold uppercase tracking-[0.25em] px-3 py-1 border-2 border-black -rotate-1 ml-3">
          Track {String(index + 1).padStart(2, "0")}
        </p>
        <h1
          className={`text-4xl sm:text-6xl text-[#f5c928] leading-[1.05] break-words ${display.className}`}
          style={{ textShadow: "4px 4px 0 #7a1c1c" }}
        >
          {event.name}
        </h1>
        <p className="text-xl text-[#f5edd8]/80 leading-snug max-w-2xl">
          Part of Techno-aiMBiAtion 2027 at O.P. Jindal University.
          {event.subEvents.length > 0
            ? ` ${event.subEvents.length} competitions under this banner.`
            : " A standalone marquee event."}
        </p>
      </section>

      {event.subEvents.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 pb-14">
          <SectionTitle className="mb-6">The lineup</SectionTitle>
          <ol className={`${CARD} rounded-xl overflow-hidden divide-y-2 divide-dashed divide-black/30`}>
            {event.subEvents.map((s, i) => (
              <li key={s} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#f5c928]/30 transition-colors">
                <span className={`text-2xl w-10 shrink-0 text-[#ff6a00] ${display.className}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xl font-bold uppercase tracking-wide flex-1">{s}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="max-w-4xl mx-auto px-6 pb-14">
        <SectionTitle className="mb-6">The details</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["Date", "Venue", "Team size", "Prize pool"].map((label, i) => (
            <div key={label} className={`${ACCENTS[i]} text-black border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl p-4`}>
              <p className="text-xs font-bold uppercase tracking-wider opacity-75">{label}</p>
              <p className={`text-xl mt-2 ${display.className}`}>TBA</p>
            </div>
          ))}
        </div>
        <p className="text-base text-[#f5edd8]/60 mt-4">Full rules, schedule and fees are shared after you register.</p>
      </section>

      <TicketCta
        title={`Join ${event.name}`}
        text="Sign up with your OPJU email for free entry, then pick this event from your dashboard."
        href="/auth/signup"
        label="Register now"
      />

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <Link href={`/events/${next.slug}`} className="inline-flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-[#f5c928] hover:text-[#ff6a00]">
          Next track: {next.name} <ArrowRight className="h-5 w-5" />
        </Link>
      </section>
    </PageShell>
  );
}
