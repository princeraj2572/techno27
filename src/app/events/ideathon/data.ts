import type { EventData } from "@/features/events/data/event-types";

// Ideathon — everything shown at /events/ideathon lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const ideathon: EventData = {
  slug: "ideathon",
  name: "Ideathon",
  category: "Technical",
  iconKey: "bulb",

  // ---- details ----
  tagline: "Ideas for a better tomorrow.",
  about: "Ideathon is one of the flagship technical events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Jan 15, 2027",
  time: "10:00 AM",
  venue: "Design Studio",
  teamSize: "2–4 members",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹8,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Aditya Rane", phone: "+91 98765 50050" },
  subEvents: [
    "SDG Challenge",
    "Ideation & Presentation",
  ],

  // ---- look ----
  theme: {
    bg: "#f4a08a",
    bg2: "#fde3d4",
    ink: "#5e1f14",
    soft: "#9a3a28",
    accent: "#2a7aa8",
    accentInk: "#ffffff",
    accent2: "#c0392b",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "arches",
    patternColor: "#c0392b",
    motif: "Jaipur ✦ Rajasthan ✦ Hawa Mahal ✦ Ideas that breathe ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/ideathon.jpg" }
  media: {},
};
