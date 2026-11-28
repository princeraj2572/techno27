import type { EventData } from "@/features/events/data/event-types";

// Startup Business Plan — everything shown at /events/startup-business-plan lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const startupBusinessPlan: EventData = {
  slug: "startup-business-plan",
  name: "Start-up Business Plan",
  category: "Management",
  iconKey: "trend",

  // ---- details ----
  tagline: "Pitch it. Fund it. Build it.",
  // Copied exactly from the event's official document.
  about: "The Startup Pitching Event offers budding innovators and entrepreneurs a stage to present their ideas before a jury of experts, investors and industry leaders. Participants will put forward creative solutions to real-world challenges, prove the commercial viability of their ventures, and gain constructive feedback to sharpen their concepts. The event seeks to foster innovation, entrepreneurship and teamwork, while spotting high-potential startups that can be taken forward through mentoring, incubation and further support.",
  date: "Feb 17–18, 2027",
  time: "Day 2 2:30 PM · Day 3 10:00 AM",
  venue: "Live Class Room & Idea Lab",
  teamSize: "Up to 5 members",
  fee: "Free for OPJU · ₹199 per team for external",
  prize: "₹25,000",
  rules: [
    "PowerPoint-based pitch for working (functional) or non-working (concept-stage) models.",
    "Finish within the allotted time. Overrunning may cost marks or lead to disqualification.",
    "Only registered team members may pitch and answer questions. Teams: individual, duo, or 3–5 members.",
    "The idea must be original. Plagiarism means immediate disqualification.",
    "Follow the organisers' format (PPT/PDF, slide count, font size). Remaining rules are shared after registration.",
    "Judged on innovation & relevance, feasibility & commercial potential, and presentation & team strength.",
  ],
  contact: { name: "Rounak Jaisawal", phone: "+91 97554 43411" },
  moreContacts: [
    { name: "Prince Kumar Singh", phone: "+91 91100 64120" },
  ],
  subEvents: [],

  // ---- look ----
  theme: {
    bg: "#ff9a6c",
    bg2: "#ffe3a8",
    ink: "#4a2410",
    soft: "#8a4018",
    accent: "#1b6aa5",
    accentInk: "#ffffff",
    accent2: "#c9a074",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "waves",
    patternColor: "#1b6aa5",
    motif: "Mumbai ✦ Maharashtra ✦ Gateway of India ✦ Pitch it, fund it ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/startup-business-plan.jpg" }
  media: { image: "/images/events/startup-business-plan.jpg" },
};
