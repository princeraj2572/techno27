import { EventPage, eventMetadata } from "@/components/event-page";

export const metadata = eventMetadata("ideathon");

export default function Page() {
  return <EventPage slug="ideathon" />;
}
