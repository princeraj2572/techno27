import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PUBLIC_EVENTS, getPublicEvent } from "@/data/public-events";
import { getEventMock } from "@/data/dummy";
import { ACCENTS, Band, CARD, Marquee, PageShell, TicketCta, display, serif } from "@/components/indie";

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
  const mock = getEventMock(event.slug, event.name, event.category, index);

  const facts = [
    { label: "Date", value: mock.date },
    { label: "Time", value: mock.time },
    { label: "Venue", value: mock.venue },
    { label: "Team size", value: mock.teamSize },
    { label: "Prize pool", value: mock.prize },
    { label: "Entry fee", value: mock.fee },
  ];

  return (
    <PageShell>
      <Band tone="crimson" mandala className="!py-12">
        <Link href="/events" className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-[#f5c928] hover:text-white">
          <ArrowLeft className="h-4 w-4" /> All events
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="bg-[#ff6a00] text-black text-sm font-bold uppercase tracking-[0.25em] px-3 py-1 border-2 border-black -rotate-1">
            Track {String(index + 1).padStart(2, "0")}
          </span>
          <span className="border-2 border-[#f5edd8]/70 px-3 py-0.5 text-sm font-bold uppercase tracking-widest">{event.category}</span>
        </div>
        <h1 className={`mt-4 text-5xl sm:text-7xl leading-[0.95] text-[#f5c928] break-words ${serif.className}`} style={{ textShadow: "4px 4px 0 #5a0010" }}>
          {event.name}
        </h1>
        <p className="mt-3 text-2xl sm:text-3xl font-bold uppercase text-[#f5edd8]">{mock.tagline}</p>
      </Band>

      <Marquee className="bg-[#ff6a00] text-black font-bold uppercase tracking-wider text-lg py-1.5 -rotate-1" text={`${event.name} ✦ ${mock.tagline} ✦ `} />

      <div className="max-w-5xl mx-auto px-6 py-14 space-y-14">
        <section className="grid gap-4 grid-cols-2 sm:grid-cols-3">
          {facts.map((f, i) => (
            <div key={f.label} className={`${ACCENTS[i % ACCENTS.length]} text-black border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl p-4`}>
              <p className="text-xs font-bold uppercase tracking-wider opacity-75">{f.label}</p>
              <p className={`mt-2 text-lg leading-tight ${display.className}`}>{f.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className={`text-3xl text-[#f5c928] mb-4 ${display.className}`}>About</h2>
            <p className="text-xl leading-snug text-[#f5edd8]/85">{mock.about}</p>
          </div>
          <div>
            <h2 className={`text-3xl text-[#f5c928] mb-4 ${display.className}`}>Rules</h2>
            <ol className={`${CARD} rounded-xl divide-y-2 divide-dashed divide-black/25`}>
              {mock.rules.map((r, i) => (
                <li key={r} className="flex gap-3 px-4 py-3">
                  <span className={`text-xl text-[#ff6a00] ${display.className}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-lg leading-snug">{r}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {event.subEvents.length > 0 && (
          <section>
            <h2 className={`text-3xl text-[#f5c928] mb-4 ${display.className}`}>The lineup</h2>
            <ol className={`${CARD} rounded-xl overflow-hidden divide-y-2 divide-dashed divide-black/30`}>
              {event.subEvents.map((s, i) => (
                <li key={s} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#f5c928]/30 transition-colors">
                  <span className={`text-2xl w-10 shrink-0 text-[#ff6a00] ${display.className}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xl font-bold uppercase tracking-wide flex-1">{s}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className={`${CARD} rounded-xl p-6 flex flex-wrap items-center justify-between gap-4`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-black/50">Event coordinator</p>
            <p className={`text-2xl ${display.className}`}>{mock.contact.name}</p>
            <p className="text-lg font-semibold tabular-nums">{mock.contact.phone}</p>
          </div>
          <p className="text-xs uppercase tracking-widest text-black/50">Sample details — all data is fictional.</p>
        </section>

        <Link href={`/events/${next.slug}`} className="inline-flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-[#f5c928] hover:text-[#ff6a00]">
          Next track: {next.name} <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <TicketCta title={`Join ${event.name}`} text="Sign up with your OPJU email for free entry, then pick this event from your dashboard." href="/auth/signup" label="Register now" />
    </PageShell>
  );
}
