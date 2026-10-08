import { EventPage, eventMetadata } from "@/components/event-page";
import { roadies } from "./data";

export const metadata = eventMetadata(roadies);

export default function Page() {
  return <EventPage event={roadies} />;
}
