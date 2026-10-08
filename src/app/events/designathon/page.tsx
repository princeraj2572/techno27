import { EventPage, eventMetadata } from "@/components/event-page";
import { designathon } from "./data";

export const metadata = eventMetadata(designathon);

export default function Page() {
  return <EventPage event={designathon} />;
}
