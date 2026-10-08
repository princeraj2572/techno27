import { EventPage, eventMetadata } from "@/components/event-page";

export const metadata = eventMetadata("aima");

export default function Page() {
  return <EventPage slug="aima" />;
}
