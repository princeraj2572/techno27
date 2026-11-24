import type { EventData } from "@/features/events/data/event-types";

// Antaragni — everything shown at /events/antaragni lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const antaragni: EventData = {
  slug: "antaragni",
  name: "Antaragni",
  category: "Cultural",
  iconKey: "flame",

  // ---- details ----
  tagline: "Express what lies within.",
  about: "Antaragni 2K27 is a vibrant cultural platform for dance, vocal and instrumental music, rap, mime and visual storytelling. From soulful solos to energetic group acts, every student gets a stage to express their individuality and showcase their talent.",
  date: "Feb 16–17, 2027",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "Solo, duet or group",
  fee: "Free for OPJU · ₹199 for external",
  prize: "To be announced",
  rules: [
    "Report at least 30 minutes before your slot. Late arrivals cannot perform.",
    "Rounds: Audition 1, Audition 2, Screening, Final. No one enters the final without qualifying.",
    "Submit your song and background video to the coordinator one day before your audition or performance.",
    "Inappropriate, offensive or vulgar costumes, songs or acts are strictly prohibited.",
    "Judged on talent, expression, act selection, costume, discipline and audience engagement.",
    "Misconduct leads to immediate disqualification. The judges' decision is final.",
  ],
  contact: { name: "Dr. Mahasakti Mahamaya", phone: "" },
  subEvents: [
    "Solo Dance",
    "Group Dance",
    "Solo Singing",
    "Duet / Group Singing & Instrumental",
    "Rap / Beat-boxing",
    "Mime / Silent Act",
    "Short Film / Video Performance",
  ],

  // ---- look ----
  theme: {
    bg: "#2a1055",
    bg2: "#5b2272",
    ink: "#ffe9a8",
    soft: "#ffc977",
    accent: "#ffd23a",
    accentInk: "#2a1055",
    accent2: "#ff4d6d",
    card: "#3b1a66",
    cardInk: "#ffe9a8",
    pattern: "stars",
    patternColor: "#ffd23a",
    motif: "Garba ✦ Gujarat ✦ Dance of fire ✦ Night of lights ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/antaragni.jpg" }
  media: { image: "/images/events/antaragni.jpg" },
};
