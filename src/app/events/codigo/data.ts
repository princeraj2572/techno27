import type { EventData } from "@/features/events/data/event-types";

// Codigo — everything shown at /events/codigo lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const codigo: EventData = {
  slug: "codigo",
  name: "Codigo",
  category: "Technical",
  iconKey: "code",

  // ---- details ----
  tagline: "Code. Compete. Conquer.",
  about: "Codigo is one of the flagship technical events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Jan 18, 2027",
  time: "4:00 PM",
  venue: "Design Studio",
  teamSize: "2–4 members",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹20,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Lavanya Iyer", phone: "+91 98765 50130" },
  subEvents: [
    "Design Master (UI/UX)",
    "Coding Challenge",
  ],

  // ---- look ----
  theme: {
    bg: "#8fd4b0",
    bg2: "#f2f7d8",
    ink: "#124a2c",
    soft: "#2a7a4c",
    accent: "#ff9f1c",
    accentInk: "#1a0f08",
    accent2: "#2e8a56",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "leaves",
    patternColor: "#2e8a56",
    motif: "Assam ✦ Tea gardens ✦ One-horned rhino ✦ Code & conquer ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/codigo.jpg" }
  media: {},
};
