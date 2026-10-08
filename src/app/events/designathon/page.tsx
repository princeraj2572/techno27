import { EventPage, eventMetadata } from "@/components/event-page";

export const metadata = eventMetadata("designathon");

export default function Page() {
  return <EventPage slug="designathon" />;
}
