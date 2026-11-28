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
  // Copied exactly from the event's official document.
  about: "Designathon 2026 is an exciting, hands-on design competition that challenges students to transform creative ideas into professional visual communication and interactive digital experiences. Inspired by the skill standards of IndiaSkills Competition, the event focuses on two emerging skill domains:\n27 – Graphic Design Technology\n22 – Digital Interactive Media\n\nThe competition simulates a real-world client assignment in which participants must understand a design brief, develop a creative concept, and deliver a complete campaign across multiple digital and print platforms.\n\nParticipants will work on a common campaign concept and produce three interconnected design deliverables: a print poster, a social media creative set, and an interactive mobile interface.\n\nThe event aims to enhance creativity, visual communication, digital design proficiency, problem-solving abilities, time management, and professional presentation skills.",
  date: "Feb 17, 2027",
  time: "11:00 AM",
  venue: "TB-07",
  teamSize: "1–2 members",
  fee: "Free for OPJU · ₹199 per team for external",
  prize: "₹15,000",
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
  // Wording copied exactly from the event's official document; " · " separates its bullet points.
  subEventInfo: {
    "Print Poster": "Size: A3 · Colour Mode: CMYK · Resolution: 300 DPI · Bleed: 3 mm · Submission Format: PDF",
    "Social Media Set": "Participants must adapt the same campaign concept for social media platforms. · One square social media post: 1080 × 1080 pixels. · One vertical social media story: 1080 × 1920 pixels. · Submission Format: PNG.",
    "Interactive Mobile Screen": "Participants must design an interactive mobile campaign interface. · Screen dimensions: 360 × 800 pixels. · Minimum two linked screens. · At least one clickable button connecting the first screen to the second screen. · Suggested tools: Figma (Free Plan), Penpot, or similar free design software.",
  },

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
