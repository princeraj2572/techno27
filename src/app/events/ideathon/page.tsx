import { EventPage, eventMetadata } from "@/components/event-page";
import { ideathon } from "./data";

export const metadata = eventMetadata(ideathon);

export default function Page() {
  return <EventPage event={ideathon} />;
}
