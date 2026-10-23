import type { EventData } from "@/features/events/data/event-types";

// Voice Of Youth — everything shown at /events/voice-of-youth lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const voiceOfYouth: EventData = {
  slug: "voice-of-youth",
  name: "Voice Of Youth",
  category: "Management",
  iconKey: "mic",

  // ---- details ----
  tagline: "Speak up, be heard.",
  about: "Voice Of Youth is one of the flagship management events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Feb 19, 2027",
  time: "11:30 AM",
  venue: "Open Air Stage",
  teamSize: "1–3 members",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹8,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Sneha Pandey", phone: "+91 98765 50110" },
  subEvents: [],

  // ---- look ----
  theme: {
    bg: "#e8856a",
    bg2: "#fff0cf",
    ink: "#4a1410",
    soft: "#8a2a1c",
    accent: "#138808",
    accentInk: "#ffffff",
    accent2: "#ff9933",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "arches",
    patternColor: "#b5402a",
    motif: "Delhi ✦ Red Fort ✦ A nation's voice ✦ Speak up ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/voice-of-youth.jpg" }
  media: {},
};
