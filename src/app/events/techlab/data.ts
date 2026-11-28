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
  // Copied exactly from the event's official document.
  about: "TECH LAB is one of the flagship events of TECHNOROLLIX, one of the biggest technical festivals in Central India. It provides an exciting platform for young innovators, aspiring engineers, and creative minds from universities and institutions to showcase their technical knowledge, innovative ideas, and problem-solving abilities. The event encourages students to transform their ideas into practical solutions through self-developed technical models, prototypes, posters, app and web development. Participants get an opportunity to demonstrate their creativity, technical expertise, and the real-world applicability of their innovations before an audience comprising experts, academicians, and industry professionals. Beyond recognition and rewards, TECH LAB also offers promising innovators an opportunity to explore potential funding support through the OPJU Innovation Centre, helping them take their ideas further towards development and commercialization.",
  date: "Feb 16, 2027",
  time: "10:00 AM",
  venue: "Babuji Chowk",
  teamSize: "Up to 4 members",
  fee: "Free for OPJU · ₹199 per team for external",
  prize: "₹60,000",
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
  // Wording copied exactly from the event's official document; " · " separates its bullet points.
  subEventInfo: {
    "Working Models": "Functional prototypes demonstrating innovative concepts, processes, or practical applications.",
    "Non-Working Models": "Conceptual or demonstrative models representing innovative designs, systems, or engineering solutions.",
    "Poster Presentation": "Visual presentations highlighting innovative ideas, research findings, technical developments, or engineering solutions.",
    "App & Web Development": "Innovative mobile, web-based, or software applications designed to address practical challenges.",
  },

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
