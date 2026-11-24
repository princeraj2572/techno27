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
  about: "Unlock your coding potential at OPJU's premier coding event. Take on challenges, meet peers and sharpen your skills, whether you are a beginner or a pro. Theme: Dream your fantasy, code it into reality!",
  date: "To be announced",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "To be announced",
  fee: "Free for OPJU · ₹199 for external",
  prize: "To be announced",
  rules: [
    "Event: Coding Challenge (Code & Conquer).",
    "Round 1, Coding Quiz (qualifying, 40 min): 30 MCQs including output-based and error-finding questions.",
    "Round 2, Real Coding Challenge (final, 60–90 min): 5 problems, 1 easy, 2 medium and 2 slightly hard.",
    "Judged on correct output, test cases passed, time & efficiency, and logic & approach.",
  ],
  contact: { name: "Paras Kumar Jain", phone: "+91 92015 01799" },
  moreContacts: [
    { name: "Soumya Thakre", phone: "+91 72498 14810" },
    { name: "Prof. Asim Kiran Dandapat", phone: "+91 95891 03149" },
  ],
  subEvents: [
    "Coding Challenge (Code & Conquer)",
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
  media: { image: "/images/events/codigo.jpg" },
};
