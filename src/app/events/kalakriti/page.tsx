import { EventPage, eventMetadata } from "@/components/events/event-page";
import { kalakriti } from "./data";

export const metadata = eventMetadata(kalakriti);

export default function Page() {
  return <EventPage event={kalakriti} />;
}
