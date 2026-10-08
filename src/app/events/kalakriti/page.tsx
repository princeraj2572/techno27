import { EventPage, eventMetadata } from "@/components/event-page";
import { kalakriti } from "./data";

export const metadata = eventMetadata(kalakriti);

export default function Page() {
  return <EventPage event={kalakriti} />;
}
