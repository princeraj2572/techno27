import type { EventData } from "@/features/events/data/event-types";

// Business Quiz — everything shown at /events/business-quiz lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const businessQuiz: EventData = {
  slug: "business-quiz",
  name: "Business Quiz",
  category: "Management",
  iconKey: "brain",

  // ---- details ----
  tagline: "Think like a manager.",
  about: "Mind_Matrix is the Business Quiz of Techno-aiMBiAtion 2027, organised by the School of Management. It tests general knowledge across mathematics aptitude, economics & business and current affairs. Think beyond. Respond smart. Rise above!",
  date: "To be announced",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "2–4 members",
  fee: "Free for OPJU · ₹199 for external",
  prize: "To be announced",
  rules: [
    "Two rounds: an objective-type elimination round, then a final with Rapid Fire, Buzzer Round and Audio-Visual.",
    "Open from Class 10 and above. Round 1 questions cover Class 10–12 level.",
    "Only the team leader registers (via Unstop) and plays Round 1 for the team.",
    "Answer within the time limit. There is no negative marking.",
    "Unfair means or misconduct disqualifies the team. The Core Team's decision is final.",
  ],
  contact: { name: "Kunal Yadav", phone: "+91 62666 81974" },
  moreContacts: [
    { name: "Bhoomi Chandra", phone: "+91 81035 01661" },
  ],
  subEvents: [
    "Elimination Round",
    "Final: Rapid Fire, Buzzer & Audio-Visual",
  ],

  // ---- look ----
  theme: {
    bg: "#6fc3e8",
    bg2: "#ffe6b8",
    ink: "#4a2c10",
    soft: "#85501a",
    accent: "#2a7aa8",
    accentInk: "#ffffff",
    accent2: "#a8601e",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "diamonds",
    patternColor: "#a8601e",
    motif: "Hyderabad ✦ Telangana ✦ Charminar ✦ Think like a manager ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/business-quiz.jpg" }
  media: { image: "/images/events/business-quiz.jpg" },
};
