import { EventPage, eventMetadata } from "@/components/events/event-page";
import { voiceOfYouth } from "./data";

export const metadata = eventMetadata(voiceOfYouth);

export default function Page() {
  return <EventPage event={voiceOfYouth} />;
}
