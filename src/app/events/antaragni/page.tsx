import { EventPage, eventMetadata } from "@/components/events/event-page";
import { antaragni } from "./data";

export const metadata = eventMetadata(antaragni);

export default function Page() {
  return <EventPage event={antaragni} />;
}
