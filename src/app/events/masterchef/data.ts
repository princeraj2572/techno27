import type { EventData } from "@/features/events/data/event-types";

// Masterchef — everything shown at /events/masterchef lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const masterchef: EventData = {
  slug: "masterchef",
  name: "Masterchef",
  category: "Fun",
  iconKey: "chef",

  // ---- details ----
  tagline: "Cook up a storm.",
  about: "Masterchef is one of the flagship fun events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Feb 19, 2027",
  time: "4:00 PM",
  venue: "Open Air Stage",
  teamSize: "Teams of 3–5",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹12,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Dev Malhotra", phone: "+91 98765 50030" },
  subEvents: [],

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
  media: {},
};
