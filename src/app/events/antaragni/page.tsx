import { EventPage, eventMetadata } from "@/components/event-page";

export const metadata = eventMetadata("antaragni");

export default function Page() {
  return <EventPage slug="antaragni" />;
}
