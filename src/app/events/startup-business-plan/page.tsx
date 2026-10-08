import { EventPage, eventMetadata } from "@/components/event-page";
import { startupBusinessPlan } from "./data";

export const metadata = eventMetadata(startupBusinessPlan);

export default function Page() {
  return <EventPage event={startupBusinessPlan} />;
}
