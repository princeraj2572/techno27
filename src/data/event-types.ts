import type { EventTheme } from "@/data/event-themes";

export type EventCategory = "Technical" | "Cultural" | "Management" | "Fun";

// Everything the website knows about ONE event. Each event keeps its own copy in
//   src/app/events/<slug>/data.ts
// and src/data/all-events.ts lists them in the order they appear on the site.
// A person to contact for an event. `image` is a square photo in /public,
// e.g. "/images/coordinators/sanya-kapoor.jpg" (~400 x 400). Without it, an initial is shown.
export interface Coordinator {
  name: string;
  phone: string;
  image?: string;
}

export interface EventData {
  slug: string; // the URL: /events/<slug>  (must match the folder name)
  name: string; // display name
  category: EventCategory;
  iconKey: string; // small icon used in lists, e.g. "terminal", "palette" (see the icon map in the UI)

  // ---- details shown on the event page and the events list ----
  tagline: string; // one short line under the title
  about: string; // the "About" paragraph
  date: string;
  time: string;
  venue: string;
  teamSize: string;
  fee: string;
  prize: string;
  rules: string[];
  contact: Coordinator; // main event coordinator
  moreContacts?: Coordinator[]; // optional extra coordinators, shown beside the main one
  subEvents: string[]; // competitions inside the event (can be empty)

  // ---- look ----
  theme: EventTheme; // colours, pattern and scrolling tape text for this event's page
  media?: {
    image?: string; // stamp picture, portrait 3:4 (~900 x 1200), e.g. "/images/events/robovation.jpg"
    logo?: string; // round logo, square (~256 x 256)
  };
}
