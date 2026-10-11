import { EventPage, eventMetadata } from "@/components/events/event-page";
import { riwayatFashionShow } from "./data";

export const metadata = eventMetadata(riwayatFashionShow);

export default function Page() {
  return <EventPage event={riwayatFashionShow} />;
}
