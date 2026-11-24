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
  about: "Ideathon 2027, “Hurdle to Hustle”, is where fresh perspectives become real-world solutions. Pick one of five campus and industry problem statements and pitch a practical, feasible idea, with an artefact if it helps, to the judges.",
  date: "Feb 16, 2027",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "Individual or up to 4 members",
  fee: "Free for OPJU · ₹199 for external",
  prize: "To be announced",
  rules: [
    "Be at the venue 15 minutes before the event begins.",
    "Register before the deadline; only registered participants can present.",
    "Choose one of the five problem statements and submit a PowerPoint of at most 10 slides before the event.",
    "Pitch: 7 minutes (bell at 6) plus 3 minutes Q&A. A list of materials with unit and total cost is compulsory.",
    "Demo models must be safe: no open flame, mains-powered rigs or chemicals at the table.",
    "Judged out of 100 on timing, problem clarity, technical depth, innovation, scalability, materials list and Q&A.",
  ],
  contact: { name: "Simran Singh", phone: "+91 83277 79623" },
  moreContacts: [
    { name: "Puja Jayapuria", phone: "+91 76059 74293" },
    { name: "Amisha Raja", phone: "+91 72058 60167" },
  ],
  subEvents: [
    "Waste Management & Circular Economy",
    "Smart Campus Security & Drones",
    "Business Process Automation",
    "Climate-Resilient Campus & Public Health",
    "Industrial Decarbonisation & Wastewater Reuse",
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
  media: { image: "/images/events/ideathon.jpg" },
};
