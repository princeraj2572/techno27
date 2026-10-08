import { PUBLIC_EVENTS } from "@/data/public-events";
import { EventsGrid } from "@/components/events-grid";
import { CtaBand, PageShell, SceneHeader, SectionHead } from "@/components/heritage";

export const metadata = { title: "Events | Techno-aiMBiAtion 2027" };

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;

  return (
    <PageShell>
      <SceneHeader>
        <SectionHead
          title="EVENTS"
          sub="Explore • Participate • Excel"
          text="A diverse range of technical, cultural, and management events designed to ignite your curiosity and showcase your talent."
        />
      </SceneHeader>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <EventsGrid
          initial={cat}
          events={PUBLIC_EVENTS.map((e) => ({
            slug: e.slug,
            name: e.name,
            category: e.category,
            iconKey: e.iconKey,
            subCount: e.subEvents.length,
          }))}
        />
      </section>

      <CtaBand
        title="Found your event?"
        text="Register with your OPJU email for free entry. External participants get a unique TRX27 ID."
        href="/auth/signup"
        label="Register now"
      />
    </PageShell>
  );
}
