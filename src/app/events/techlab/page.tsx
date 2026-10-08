import { EventPage, eventMetadata } from "@/components/event-page";
import { techlab } from "./data";

export const metadata = eventMetadata(techlab);

export default function Page() {
  return <EventPage event={techlab} />;
}
