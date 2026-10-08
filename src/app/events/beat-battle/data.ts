import type { EventData } from "@/data/event-types";

// Beat Battle — everything shown at /events/beat-battle lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const beatBattle: EventData = {
  slug: "beat-battle",
  name: "Beat Battle",
  category: "Cultural",
  iconKey: "music",

  // ---- details ----
  tagline: "Let the beats decide.",
  about: "Beat Battle is one of the flagship cultural events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Jan 16, 2027",
  time: "11:30 AM",
  venue: "Sports Arena",
  teamSize: "Solo or group",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹25,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Mira Sharma", phone: "+91 98765 50060" },
  subEvents: [],

  // ---- look ----
  theme: {
    bg: "#f0c040",
    bg2: "#fff3c4",
    ink: "#4a3000",
    soft: "#8a5a05",
    accent: "#2f8f4e",
    accentInk: "#ffffff",
    accent2: "#a65a22",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "stripes",
    patternColor: "#b8860b",
    motif: "Punjab ✦ Dhol ✦ Golden fields ✦ Let the beats decide ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/beat-battle.jpg" }
  media: {},
};
