import { EventPage, eventMetadata } from "@/components/event-page";

export const metadata = eventMetadata("startup-business-plan");

export default function Page() {
  return <EventPage slug="startup-business-plan" />;
}
