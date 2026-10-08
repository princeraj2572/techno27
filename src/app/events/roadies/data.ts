import type { EventData } from "@/data/event-types";

// Roadies — everything shown at /events/roadies lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const roadies: EventData = {
  slug: "roadies",
  name: "Roadies",
  category: "Fun",
  iconKey: "compass",

  // ---- details ----
  tagline: "Survive the campus trail.",
  about: "Roadies is one of the flagship fun events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Jan 15, 2027",
  time: "10:00 AM",
  venue: "Seminar Hall",
  teamSize: "Teams of 3–5",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹10,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Karan Dhillon", phone: "+91 98765 50100" },
  subEvents: [],

  // ---- look ----
  theme: {
    bg: "#8fd1ee",
    bg2: "#e4f4fa",
    ink: "#0c2748",
    soft: "#1b5c90",
    accent: "#e8742a",
    accentInk: "#ffffff",
    accent2: "#2f7a4a",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "peaks",
    patternColor: "#1b6aa5",
    motif: "Himachal ✦ Pine & snow ✦ Hill temple ✦ Survive the trail ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/roadies.jpg" }
  media: {},
};
