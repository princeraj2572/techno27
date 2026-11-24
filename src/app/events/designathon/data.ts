import type { EventData } from "@/features/events/data/event-types";

// Designathon — everything shown at /events/designathon lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const designathon: EventData = {
  slug: "designathon",
  name: "Designathon",
  category: "Technical",
  iconKey: "pen",

  // ---- details ----
  tagline: "Design that moves people.",
  about: "Designathon is an industry-inspired design challenge based on the IndiaSkills domains Graphic Design Technology and Digital Interactive Media. Participants answer a simulated client brief and deliver a full campaign: a print poster, a social media set and an interactive mobile screen.",
  date: "To be announced",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "1–2 members",
  fee: "Free for OPJU · ₹199 for external",
  prize: "To be announced",
  rules: [
    "Round 1 (online): submit an A3 poster on 'New Age India' plus a ~100-word rationale. The top 20 qualify.",
    "Round 2 (on campus, 2.5 hours): A3 print poster (CMYK, 300 DPI, 3 mm bleed, PDF), a 1080×1080 post and a 1080×1920 story (PNG), and a 360×800 mobile prototype with at least two linked screens.",
    "Each team gives a 3-minute presentation to the judges.",
    "Only free lab software or licensed software on your own laptop. No stock photos. AI tools are prohibited in Round 2; declare any AI use in Round 1.",
    "Name files TeamID_Module (e.g. D07_A.pdf). The judges' decision is final.",
  ],
  contact: { name: "Abhijeet Rout", phone: "+91 80185 23505" },
  moreContacts: [
    { name: "Sunil Kumar Paital", phone: "+91 79910 53505" },
    { name: "Nischal Singh", phone: "+91 78791 90901" },
  ],
  subEvents: [
    "Print Poster",
    "Social Media Set",
    "Interactive Mobile Screen",
  ],

  // ---- look ----
  theme: {
    bg: "#ffb360",
    bg2: "#ffe7b8",
    ink: "#4a2f04",
    soft: "#8a5208",
    accent: "#2f6b3a",
    accentInk: "#ffffff",
    accent2: "#a8650a",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "rings",
    patternColor: "#a8650a",
    motif: "Chhattisgarh ✦ Dhokra ✦ Sal forests ✦ Design with heart ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/designathon.jpg" }
  media: { image: "/images/events/designathon.jpg" },
};
