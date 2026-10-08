import { EventPage, eventMetadata } from "@/components/event-page";

export const metadata = eventMetadata("beat-battle");

export default function Page() {
  return <EventPage slug="beat-battle" />;
}
