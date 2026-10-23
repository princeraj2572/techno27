import type { EventData } from "@/features/events/data/event-types";

// Antaragni — everything shown at /events/antaragni lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const antaragni: EventData = {
  slug: "antaragni",
  name: "Antaragni",
  category: "Cultural",
  iconKey: "flame",

  // ---- details ----
  tagline: "Express what lies within.",
  about: "Antaragni is one of the flagship cultural events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Feb 20, 2027",
  time: "5:30 PM",
  venue: "Innovation Lab",
  teamSize: "Solo or group",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹10,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Naina Gupta", phone: "+91 98765 50040" },
  subEvents: [
    "Mime",
    "Group Dance",
    "Short Film",
    "Solo Dance",
    "Rap / Beatboxing",
    "Singing",
  ],

  // ---- look ----
  theme: {
    bg: "#2a1055",
    bg2: "#5b2272",
    ink: "#ffe9a8",
    soft: "#ffc977",
    accent: "#ffd23a",
    accentInk: "#2a1055",
    accent2: "#ff4d6d",
    card: "#3b1a66",
    cardInk: "#ffe9a8",
    pattern: "stars",
    patternColor: "#ffd23a",
    motif: "Garba ✦ Gujarat ✦ Dance of fire ✦ Night of lights ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/antaragni.jpg" }
  media: {},
};
