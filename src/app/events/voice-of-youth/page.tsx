import { EventPage, eventMetadata } from "@/components/event-page";

export const metadata = eventMetadata("voice-of-youth");

export default function Page() {
  return <EventPage slug="voice-of-youth" />;
}
