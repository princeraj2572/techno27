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
  // Copied exactly from the event's official document.
  about: "Because great food isn’t just cooked — it’s created.\n\nGet ready for OPJU’s most exciting culinary showdown! MASTERCHEF is where talent meets taste, presentation meets passion, and students turn ingredients into unforgettable stories.\n\nIf you think your dish can speak for itself — this is your stage.",
  date: "Feb 16–17, 2027",
  time: "Day 1 11:30 AM · Finale 10:00 AM",
  venue: "Cafeteria",
  teamSize: "1–3 members",
  fee: "Free for OPJU · ₹199 per team for external",
  prize: "₹15,000",
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
  // Wording copied exactly from the event's official document; " · " separates its bullet points.
  subEventInfo: {
    "Healthy Culinary Challenge": "Bring your signature style straight from your kitchen! · Prepare a healthy, nutritious, and balanced dish at home. · The dish must represent a specific regional or international cuisine. · Focus on healthy cooking practices, using fresh ingredients, minimal oil, mild spices, and balanced flavours. · The dish should demonstrate creativity, presentation, nutritional value, and culinary skills. · Record a short cooking video (maximum 1 minute), showcasing the preparation process and final presentation. · Present your dish and video for evaluation. · Judged on: Taste | Presentation | Creativity · This round is all about plating perfection and first impressions.",
    "Mystery Round": "Expect the Unexpected. · No Need to bring anything University will provide all ingredients. · On the Spot Reveal. · Instant Task. · Same Time Judgement. · No Hints. No Clues. Everything Will Be Revealed On The Spot!",
    "Flameless Cooking Challenge": "Think smart. Cook smarter. · Live cooking on campus · Flameless cooking only · Teams may bring: · Their own induction · Induction-compatible utensils · University will not provide induction or utensils · Ingredients will be provided by the University · Teams must submit ingredient requirements in advance · Judged on: Innovation | Technique | Taste | Execution · This is where real chefs separate from the amateurs.",
  },

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
