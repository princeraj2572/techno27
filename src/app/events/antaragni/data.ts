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
  // Copied exactly from the event's official document.
  about: "ANTARAGNI 2K27 is a vibrant cultural platform that celebrates the creativity, passion, and artistic talents of students. The event brings together diverse performing arts, including dance, vocal and instrumental music, rap, mime, and visual storytelling.From soulful solo performances and melodious duets to energetic group performances and captivating instrumental presentations, ANTARAGNI provides an opportunity for every student to express their individuality, explore their creativity, and showcase their talent.The event aims to promote cultural diversity, teamwork, confidence, and artistic excellence while creating a memorable celebration of music, movement, and expression.",
  date: "Feb 17, 2027",
  time: "6:30 PM",
  venue: "University Playground",
  teamSize: "Solo, duet or group",
  fee: "Free for OPJU · External: ₹99 individual / ₹199 team",
  prize: "₹23,000",
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
  // Wording copied exactly from the event's official document; " · " separates its bullet points.
  subEventInfo: {
    "Solo Dance": "Any dance form (Classical / Folk / Western / Contemporary / Hip-Hop / Fusion).",
    "Group Dance": "Group performances with synchronized choreography and theme-based presentation.",
    "Solo Singing": "Classical / Semi-classical / Folk / Bollywood / Western / Indian.",
    "Duet / Group Singing & Instrumental": "Duet or group singin or group instrumental performances, showcasing musical harmony, rhythm, coordination, and creativity.",
    "Rap / Beat-boxing": "Original or adapted rap performances with clean and appropriate lyrics.",
    "Mime / Silent Act": "Expression-based performance conveying a message without dialogue.",
    "Short Film / Video Performance": "Short films, reels, or visual storytelling (social, cultural, or creative themes).",
  },

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
