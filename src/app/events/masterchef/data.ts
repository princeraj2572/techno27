import type { EventData } from "@/features/events/data/event-types";

// Masterchef — everything shown at /events/masterchef lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const masterchef: EventData = {
  slug: "masterchef",
  name: "Master Chef",
  category: "Fun",
  iconKey: "chef",

  // ---- details ----
  tagline: "Cook up a storm.",
  about: "Battle of the Spatulas: OPJU's most exciting culinary showdown. Where talent meets taste and students turn ingredients into unforgettable stories. Open to UG and PG students (18–30 years) of all colleges and universities.",
  date: "To be announced",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "1–3 members",
  fee: "₹100 per team",
  prize: "To be announced",
  rules: [
    "Round 1, Healthy Culinary Challenge: cook a healthy regional or international dish at home and submit a video of at most 1 minute. Judged on taste, presentation and creativity.",
    "Round 2, Mystery Round: on-the-spot reveal and instant task. The university provides all ingredients.",
    "Round 3, Flameless Cooking Challenge: live on campus. Bring your own induction and induction-compatible utensils; ingredients are provided, and requirements must be submitted in advance.",
    "Judged on taste & nutrition, creativity, presentation, hygiene and technical execution.",
    "Registration is mandatory. Time limits are non-negotiable. Results are announced at the Valedictory ceremony.",
  ],
  contact: { name: "To be announced", phone: "" },
  subEvents: [
    "Healthy Culinary Challenge",
    "Mystery Round",
    "Flameless Cooking Challenge",
  ],

  // ---- look ----
  theme: {
    bg: "#7fd0da",
    bg2: "#e6f7f3",
    ink: "#073d46",
    soft: "#0f6b78",
    accent: "#c9892a",
    accentInk: "#1a0f08",
    accent2: "#1c7f8e",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "waves",
    patternColor: "#1c7f8e",
    motif: "Kerala ✦ Backwaters ✦ Spice & flame ✦ Cook up a storm ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/masterchef.jpg" }
  media: { image: "/images/events/masterchef.jpg" },
};
