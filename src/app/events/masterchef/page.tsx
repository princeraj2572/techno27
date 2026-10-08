import { EventPage, eventMetadata } from "@/components/event-page";
import { masterchef } from "./data";

export const metadata = eventMetadata(masterchef);

export default function Page() {
  return <EventPage event={masterchef} />;
}
