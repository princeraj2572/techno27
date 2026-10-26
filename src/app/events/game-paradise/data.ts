import type { EventData } from "@/features/events/data/event-types";

// Game Paradise — everything shown at /events/game-paradise lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const gameParadise: EventData = {
  slug: "game-paradise",
  name: "Game Paradise",
  category: "Fun",
  iconKey: "bot",

  // ---- details ----
  tagline: "Play online. Play to win.",
  about: "Game Paradise (Online Gaming) is one of the flagship fun events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Feb 18, 2027",
  time: "10:00 AM",
  venue: "CSE Block",
  teamSize: "2–4 members",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹25,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Sanya Kapoor", phone: "+91 98765 50000" },
  subEvents: [],

  // ---- look ----
  theme: {
    bg: "#f6a65a",
    bg2: "#ffe2b0",
    ink: "#4a2410",
    soft: "#7a4020",
    accent: "#b5521f",
    accentInk: "#fff3e0",
    accent2: "#5a3418",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "diamonds",
    patternColor: "#b5521f",
    motif: "Hampi ✦ Karnataka ✦ Stone chariot ✦ Online gaming ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/game-paradise.jpg" }
  media: {},
};
