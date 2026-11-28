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
  // Copied exactly from the event's official document.
  about: "Unlock your coding potential at our university’s premier Coding Event!! Participate in challenges, network with peers, and enhance your skills. Whether you are a beginner or a pro, join us for an unforgettable experience of innovation and collaboration.",
  date: "Feb 16–17, 2027",
  time: "11:00 AM",
  venue: "TB-09",
  teamSize: "To be announced",
  fee: "Free for OPJU · ₹99 for external (individual)",
  prize: "₹20,000",
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
  // Wording copied exactly from the event's official document; " · " separates its bullet points.
  subEventInfo: {
    "Coding Challenge (Code & Conquer)": "Round 1: Coding Quiz (Qualifying Round) · Duration:40 minutes · 30 MCQ Questions · Output-Based Question · Error- Finding Question · Round 2: Real Coding Challenge (Final round) · Duration:60-90 minutes · Total 5 Coding Problems · 1 Easy Coding Problem · 2 Medium Coding Problems · 2 Slightly Hard Coding Problems",
  },

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
