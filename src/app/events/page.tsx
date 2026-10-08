import { PUBLIC_EVENTS } from "@/data/public-events";
import { getEventMock } from "@/data/dummy";
import { EventsCards } from "@/components/events-cards";
import { Band, Marquee, PageHero, PageShell, TicketCta } from "@/components/indie";

export const metadata = { title: "Events | Techno-aiMBiAtion 2027" };

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const totalSub = PUBLIC_EVENTS.reduce((n, e) => n + e.subEvents.length, 0);

  const cards = PUBLIC_EVENTS.map((e, i) => {
    const m = getEventMock(e.slug, e.name, e.category, i);
    return {
      slug: e.slug,
      number: i + 1,
      name: e.name,
      category: e.category,
      iconKey: e.iconKey,
      subEvents: e.subEvents,
      tagline: m.tagline,
      date: m.date,
      time: m.time,
      venue: m.venue,
      prize: m.prize,
    };
  });

  return (
    <PageShell>
      <PageHero
        tone="crimson"
        outline
        title="Events"
        sub={`${PUBLIC_EVENTS.length} events · ${totalSub}+ competitions`}
        ghost="Something for every genre"
      />

      <Band tone="crimson" mandala className="!pt-6">
        <EventsCards events={cards} initial={cat} />
        <p className="mt-10 text-center text-xs uppercase tracking-widest text-white/60">Sample details — dates, venues and prizes are placeholders.</p>
      </Band>

      <Marquee
        className="bg-black text-white font-bold uppercase tracking-wider text-lg py-2"
        text={`${PUBLIC_EVENTS.map((e) => e.name).join(" • ")} • `}
        speed={60}
      />

      <TicketCta
        title="Found your event?"
        text="Register with your OPJU email for free entry. External participants get a unique TRX27 ID."
        href="/auth/signup"
        label="Register now"
      />
    </PageShell>
  );
}
