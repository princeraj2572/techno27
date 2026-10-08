import { ALL_EVENTS } from "./all-events";
import type { EventCategory } from "./event-types";

export type { EventCategory };
export const EVENT_CATEGORIES: EventCategory[] = ["Technical", "Cultural", "Management", "Fun"];

// The slim view of an event used by lists, filters and navigation.
// The full details of each event live in src/app/events/<slug>/data.ts.
export interface PublicEvent {
  slug: string;
  name: string;
  category: EventCategory;
  iconKey: string; // resolved to a lucide icon in the UI
  subEvents: string[];
}

export function slugify(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const PUBLIC_EVENTS: PublicEvent[] = ALL_EVENTS.map(({ slug, name, category, iconKey, subEvents }) => ({
  slug, name, category, iconKey, subEvents,
}));

export function getPublicEvent(slug: string): PublicEvent | undefined {
  return PUBLIC_EVENTS.find((e) => e.slug === slug);
}
