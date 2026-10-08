import { SCHEDULE } from "./schedule";

// DUMMY DATA — every name, brand, number and date below is fictional sample content
// for previewing the design. Replace with real information before launch.

export interface JunoonNight {
  n: string;
  title: string;
  artist: string;
  genre: string;
  date: string;
  time: string;
  venue: string;
  desc: string;
}

export const JUNOON_NIGHTS: JunoonNight[] = [
  { n: "01", title: "Opening Night", artist: "The Midnight Ragas", genre: "Indie fusion band", date: "Fri, Jan 15, 2027", time: "7:30 PM", venue: "Main Ground", desc: "Live indie fusion to kick off the fest under the lights." },
  { n: "02", title: "Beats & Bass", artist: "DJ Nova", genre: "Electronic · live set", date: "Sun, Jan 17, 2027", time: "8:00 PM", venue: "Main Ground", desc: "A high-energy electronic set that turns the campus into a dance floor." },
  { n: "03", title: "Closing Night", artist: "Echo & The Monsoon", genre: "Rock · live band", date: "Tue, Jan 19, 2027", time: "7:00 PM", venue: "Main Ground", desc: "A grand rock finale to close the festival with a roar." },
];

export interface Sponsor {
  name: string;
  field: string;
  color: string; // monogram tile colour (hex)
}

export interface SponsorTier {
  name: string;
  role: string;
  size: "xl" | "lg" | "md" | "sm" | "xs";
  sponsors: Sponsor[];
}

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    name: "Title Sponsor", role: "Title partner", size: "xl",
    sponsors: [{ name: "Aurora Motors", field: "Automotive", color: "#c1121f" }],
  },
  {
    name: "Co-Powered By", role: "Co-powered by", size: "lg",
    sponsors: [
      { name: "NovaPay", field: "Fintech", color: "#2563eb" },
      { name: "Brightbyte", field: "Technology", color: "#7c3aed" },
    ],
  },
  {
    name: "Gold Partners", role: "Gold partner", size: "md",
    sponsors: [
      { name: "Kestrel Bank", field: "Banking", color: "#0f766e" },
      { name: "Lumen Energy", field: "Power", color: "#d97706" },
      { name: "PeakFit Gear", field: "Sportswear", color: "#dc2626" },
      { name: "Tandoor Trail", field: "Food", color: "#b45309" },
    ],
  },
  {
    name: "Silver Partners", role: "Silver partner", size: "sm",
    sponsors: [
      { name: "Cobalt Cloud", field: "Cloud", color: "#1d4ed8" },
      { name: "Mango Mobile", field: "Devices", color: "#ea580c" },
      { name: "Orbit Learn", field: "EdTech", color: "#9333ea" },
      { name: "Saffron Stays", field: "Travel", color: "#ca8a04" },
      { name: "Pixel Press", field: "Printing", color: "#0891b2" },
      { name: "Zest Beverages", field: "Drinks", color: "#16a34a" },
    ],
  },
  {
    name: "Associate Partners", role: "Associate", size: "xs",
    sponsors: [
      { name: "Banyan Books", field: "Publishing", color: "#15803d" },
      { name: "Cedar Cafe", field: "Cafe", color: "#92400e" },
      { name: "Delta Print", field: "Merch", color: "#be123c" },
      { name: "Echo Audio", field: "Sound", color: "#4338ca" },
      { name: "Fable Games", field: "Gaming", color: "#7e22ce" },
      { name: "Glow Cosmetics", field: "Beauty", color: "#db2777" },
      { name: "Harbor Travel", field: "Travel", color: "#0369a1" },
      { name: "Ivory Dental", field: "Health", color: "#0d9488" },
    ],
  },
];

export interface TeamMember {
  name: string;
  phone: string;
}

export interface Department {
  name: string;
  convener: TeamMember;
  coConvener: TeamMember;
}

const DEPARTMENT_NAMES = [
  "Information, Publicity & Invitation",
  "Design, Print & Media",
  "Registration & Reception",
  "Accommodation",
  "Stage, Light, Sound & Stall",
  "Catering",
  "Venue Preparation",
  "Transportation",
  "Hospitality",
  "Website Maintenance",
  "Sponsorship",
  "Certificate & Prize",
  "Discipline",
  "Stationery & Logistics",
  "Health & First Aid",
];

const PEOPLE = [
  "Aarav Mehta", "Ishita Rao", "Kabir Nair", "Meera Joshi", "Rohan Iyer", "Sanya Kapoor",
  "Vihaan Shah", "Tara Menon", "Arjun Verma", "Diya Patel", "Neel Banerjee", "Anaya Das",
  "Yash Chauhan", "Riya Sen", "Dev Malhotra", "Pooja Reddy", "Kunal Bhatt", "Naina Gupta",
  "Samar Khanna", "Zoya Ali", "Aditya Rane", "Kiara Bose", "Ishaan Pillai", "Mira Sharma",
  "Ritvik Sood", "Alisha Kohli", "Pranav Desai", "Nisha Rawat", "Harsh Vora", "Simran Gill",
];

export const DEPARTMENTS: Department[] = DEPARTMENT_NAMES.map((name, i) => ({
  name,
  convener: { name: PEOPLE[i * 2], phone: `+91 98765 4${String(1000 + i * 2).slice(1)}0` },
  coConvener: { name: PEOPLE[i * 2 + 1], phone: `+91 98765 4${String(1000 + i * 2 + 1).slice(1)}0` },
}));

export function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export const MILESTONES = [
  { year: "2023", title: "The first edition", text: "800 participants, 8 events, and one very loud stage." },
  { year: "2024", title: "Going inter-college", text: "20 colleges joined, with 12 events across tech and culture." },
  { year: "2025", title: "Junoon begins", text: "Live music nights drew the biggest crowds yet." },
  { year: "2026", title: "Prize pool grows", text: "Over ₹3 lakh in prizes and 1,500 participants." },
  { year: "2027", title: "The biggest one yet", text: "15 flagship events, 5 days, and a new home for creators." },
];

export const CREATOR_PERKS = [
  { title: "Festival wall", text: "Selected work is displayed across the fest venue." },
  { title: "Official merch", text: "Featured creators receive limited-edition merchandise." },
  { title: "Certificates", text: "Verified certificates for every accepted submission." },
  { title: "Creator meetup", text: "An evening to meet and swap ideas with other makers." },
];

// ---------------------------------------------------------------------------
// Per-event mock details (date, venue, prize, rules ...) — derived from the slug.
// ---------------------------------------------------------------------------

const TAGLINES: Record<string, string> = {
  backtrace: "Trace the clues, crack the code.",
  kalakriti: "Where art meets culture.",
  robovation: "Machines, meet your match.",
  masterchef: "Cook up a storm.",
  antaragni: "Express what lies within.",
  ideathon: "Ideas for a better tomorrow.",
  "beat-battle": "Let the beats decide.",
  techlab: "Hands-on tech, live.",
  "startup-business-plan": "Pitch it. Fund it. Build it.",
  "riwayat-fashion-show": "Tradition on the runway.",
  roadies: "Survive the campus trail.",
  "voice-of-youth": "Speak up, be heard.",
  aima: "Think like a manager.",
  codigo: "Code. Compete. Conquer.",
  designathon: "Design that moves people.",
};

const VENUES = ["CSE Block", "Main Auditorium", "Seminar Hall", "Open Air Stage", "Innovation Lab", "Design Studio", "Sports Arena", "Food Court"];
const TIMES = ["10:00 AM", "11:30 AM", "2:30 PM", "4:00 PM", "5:30 PM"];
const PRIZES = ["₹25,000", "₹20,000", "₹15,000", "₹12,000", "₹10,000", "₹8,000"];
const TEAM_BY_CATEGORY: Record<string, string> = {
  Technical: "2–4 members",
  Cultural: "Solo or group",
  Management: "1–3 members",
  Fun: "Teams of 3–5",
};

export interface EventMock {
  tagline: string;
  about: string;
  date: string;
  time: string;
  venue: string;
  teamSize: string;
  fee: string;
  prize: string;
  rules: string[];
  contact: { name: string; phone: string };
}

export function getEventMock(slug: string, name: string, category: string, index: number): EventMock {
  const day = SCHEDULE[index % SCHEDULE.length];
  const person = PEOPLE[(index * 3 + 5) % PEOPLE.length];
  return {
    tagline: TAGLINES[slug] ?? "Be part of the fest.",
    about: `${name} is one of the flagship ${category.toLowerCase()} events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.`,
    date: day.date,
    time: TIMES[index % TIMES.length],
    venue: VENUES[index % VENUES.length],
    teamSize: TEAM_BY_CATEGORY[category] ?? "Open",
    fee: "Free for OPJU · ₹199 for external",
    prize: PRIZES[index % PRIZES.length],
    rules: [
      "Carry your TRX27 QR pass and a valid college ID.",
      "Report to the venue 20 minutes before the start time.",
      "Judges' decisions are final; any misconduct leads to disqualification.",
      "Use of unfair means or outside help is not permitted.",
    ],
    contact: { name: person, phone: `+91 98765 5${String(1000 + index).slice(1)}0` },
  };
}

// ---------------------------------------------------------------------------
// Gallery, testimonials, featured creators
// ---------------------------------------------------------------------------
export interface GalleryItem {
  caption: string;
  tag: string;
  year: string;
  bg: string; // tailwind gradient classes
  icon: string;
}

export const GALLERY: GalleryItem[] = [
  { caption: "Hackathon night", tag: "Technical", year: "2026", bg: "from-[#f5c928] to-[#c8421f]", icon: "💻" },
  { caption: "Robo Race finals", tag: "Technical", year: "2026", bg: "from-[#ff6a00] to-[#7a1c1c]", icon: "🤖" },
  { caption: "Opening night crowd", tag: "Junoon", year: "2026", bg: "from-[#6d28d9] to-[#0f0029]", icon: "🎤" },
  { caption: "Fashion walk", tag: "Cultural", year: "2026", bg: "from-[#ff2d8a] to-[#7a1c1c]", icon: "👗" },
  { caption: "Rangoli corner", tag: "Cultural", year: "2026", bg: "from-[#ffb10f] to-[#c8421f]", icon: "🎨" },
  { caption: "Prize ceremony", tag: "Awards", year: "2026", bg: "from-[#f5c928] to-[#7a1c1c]", icon: "🏆" },
  { caption: "Beat battle", tag: "Cultural", year: "2025", bg: "from-[#3b82f6] to-[#0b2a6b]", icon: "🥁" },
  { caption: "Masterchef kitchen", tag: "Fun", year: "2025", bg: "from-[#ff6a00] to-[#a1001a]", icon: "🍳" },
  { caption: "Ideathon pitches", tag: "Management", year: "2025", bg: "from-[#22c55e] to-[#14532d]", icon: "💡" },
  { caption: "Campus trail", tag: "Fun", year: "2025", bg: "from-[#f5c928] to-[#15803d]", icon: "🧭" },
  { caption: "Volunteers", tag: "Team", year: "2025", bg: "from-[#ff6a00] to-[#4a0e0e]", icon: "🙌" },
  { caption: "Closing ceremony", tag: "Awards", year: "2025", bg: "from-[#6d28d9] to-[#a1001a]", icon: "🎆" },
];

export const TESTIMONIALS = [
  { quote: "Five days that felt like a whole semester of learning — and the Junoon nights were unreal.", name: PEOPLE[3], role: "Participant, CSE" },
  { quote: "Our robot lost in the finals, but we left with new friends and a hundred ideas to improve.", name: PEOPLE[8], role: "Team Robovation" },
  { quote: "The organisation was spotless. Registration to check-in took under two minutes.", name: PEOPLE[13], role: "Visitor, external college" },
  { quote: "Creatorverse gave my photography a real audience. I'm already planning next year's series.", name: PEOPLE[18], role: "Creator" },
];

export const FEATURED_CREATIONS = [
  { title: "Golden Hour at the Ghat", by: PEOPLE[4], kind: "Photography", bg: "from-[#ff6a00] to-[#7a1c1c]", icon: "📷" },
  { title: "Rhythm of the Campus", by: PEOPLE[9], kind: "Short film", bg: "from-[#6d28d9] to-[#0f0029]", icon: "🎬" },
  { title: "Poster: Techno Junction", by: PEOPLE[14], kind: "Design", bg: "from-[#f5c928] to-[#c8421f]", icon: "🖼️" },
  { title: "Notes from the Night Stage", by: PEOPLE[21], kind: "Writing", bg: "from-[#3b82f6] to-[#0b2a6b]", icon: "✍️" },
];

// ---------------------------------------------------------------------------
// Junoon '27 — extra acts for the scrolling artist columns + the guessing game
// ---------------------------------------------------------------------------
export const JUNOON_ACTS = [
  { name: "The Midnight Ragas", genre: "Indie fusion" },
  { name: "DJ Nova", genre: "Electronic" },
  { name: "Echo & The Monsoon", genre: "Rock" },
  { name: "Raag Rewind", genre: "Classical fusion" },
  { name: "Neon Tandav", genre: "Synthwave" },
  { name: "Saanjh Sound", genre: "Folk" },
  { name: "The Chai Collective", genre: "Acoustic" },
  { name: "Monsoon Beats", genre: "Percussion" },
];

export const MYSTERY_HINTS = [
  "Sold out three campus tours in a row.",
  "Their debut single went viral last monsoon.",
  "Two words, and the crowd knows every lyric.",
];

// ---------------------------------------------------------------------------
// Artwork slots
//
// HOW TO CHANGE AN EVENT'S PICTURE LATER
//   1. Put the file in  public/images/events/   (e.g. robovation.jpg)
//   2. Add one line to EVENT_MEDIA below, using the event's slug:
//        robovation: { image: "/images/events/robovation.jpg", logo: "/images/events/robovation-logo.png" },
//   The picture then replaces the cultural illustration on that event's stamp card (and in the
//   Spotlight, if it is the featured event). Remove the line to bring the illustration back.
//   Slugs: backtrace, kalakriti, robovation, masterchef, antaragni, ideathon, beat-battle, techlab,
//          startup-business-plan, riwayat-fashion-show, roadies, voice-of-youth, aima, codigo, designathon
//   Image tips: portrait 3:4 (about 900 x 1200) fits the stamp best; logos should be square (256 x 256).
// ---------------------------------------------------------------------------
export interface EventMedia {
  image?: string; // stamp picture, portrait 3:4 (~900 x 1200)
  logo?: string; // round event logo, square, ~256 x 256
}
export const EVENT_MEDIA: Record<string, EventMedia> = {
  // robovation: { image: "/images/events/robovation.jpg", logo: "/images/events/robovation-logo.png" },
};

export const EVENTS_BANNER: string | undefined = undefined; // e.g. "/images/events-banner.jpg", ~1600 x 600
export const FEST_START = "2027-01-15T09:00:00+05:30";

export const EVENT_STEPS = [
  { n: "01", title: "Browse", text: "Filter by category or search to find the events that fit you." },
  { n: "02", title: "Register", text: "Sign up with your OPJU email, or as an external participant." },
  { n: "03", title: "Compete", text: "Show up with your QR pass, play fair and take home the prizes." },
];

export const EVENT_FAQ = [
  { q: "Can I join more than one event?", a: "Yes. Just make sure the timings don't overlap — check the schedule before you register." },
  { q: "Are team events open to mixed colleges?", a: "Yes. Teams can include members from different colleges, as long as everyone registers." },
  { q: "What do I bring on the day?", a: "Your QR pass, a valid college ID and anything your event's rules ask for." },
  { q: "Is there an entry fee?", a: "Free for OPJU students. External participants pay a small per-event fee." },
];
