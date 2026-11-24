import type { EventData } from "@/features/events/data/event-types";

// Techlab — everything shown at /events/techlab lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const techlab: EventData = {
  slug: "techlab",
  name: "Tech-Lab",
  category: "Technical",
  iconKey: "flask",

  // ---- details ----
  tagline: "Hands-on tech, live.",
  about: "Tech Lab is an innovation and technology showcase at Techno-aiMBiAtion 2027 and one of the flagship events of Technorollix. Students present self-developed models, prototypes, posters and apps to a panel of internal and external experts. Promising projects may be considered for funding support through the OPJU Innovation Centre, and eligible outside participants get one-way Sleeper Class train fare reimbursed.",
  date: "Feb 16, 2027",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "Up to 4 members",
  fee: "Free for OPJU · ₹199 for external",
  prize: "To be announced",
  rules: [
    "Exhibits must reach the venue at least one hour before the event to install and test.",
    "Maximum four participants per team.",
    "Exhibits must be original work showing an innovative idea or practical solution.",
    "Robo-cars and drones must demonstrate a specific task to qualify as technical models.",
    "OPJU participants claiming model reimbursement bring the completed form, item-wise list and GST bills.",
    "Do not dismantle exhibits before the official conclusion. Highly flammable or toxic substances are prohibited without approval.",
    "Single round: judged on innovation, technical implementation, feasibility, presentation and social/industrial relevance. The judges' decision is final.",
  ],
  contact: { name: "To be announced", phone: "" },
  subEvents: [
    "Working Models",
    "Non-Working Models",
    "Poster Presentation",
    "App & Web Development",
  ],

  // ---- look ----
  theme: {
    bg: "#3dbcc9",
    bg2: "#ffe9b0",
    ink: "#06444c",
    soft: "#0f7480",
    accent: "#d9534f",
    accentInk: "#ffffff",
    accent2: "#f0a830",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "zigzag",
    patternColor: "#d9534f",
    motif: "Tamil Nadu ✦ Gopuram ✦ Crafted to last ✦ Hands-on tech ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/techlab.jpg" }
  media: { image: "/images/events/techlab.jpg" },
};
