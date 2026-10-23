import { ALL_EVENTS, getEvent } from "@/features/events/data/all-events";

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
  { n: "01", title: "Opening Night", artist: "The Midnight Ragas", genre: "Indie fusion band", date: "Thu, Feb 18, 2027", time: "7:30 PM", venue: "Main Ground", desc: "Live indie fusion to kick off the fest under the lights." },
  { n: "02", title: "Beats & Bass", artist: "DJ Nova", genre: "Electronic · live set", date: "Sat, Feb 20, 2027", time: "8:00 PM", venue: "Main Ground", desc: "A high-energy electronic set that turns the campus into a dance floor." },
  { n: "03", title: "Closing Night", artist: "Echo & The Monsoon", genre: "Rock · live band", date: "Fri, Feb 19, 2027", time: "7:00 PM", venue: "Main Ground", desc: "A grand rock finale to close the festival with a roar." },
];

export interface Sponsor {
  name: string;
  field: string;
  color: string; // stamp / monogram colour (hex)
  logo?: string; // real logo, e.g. "/images/sponsors/aurora-motors.png" (put files in public/images/sponsors/)
  url?: string; // optional website
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
  email: string;
  photo?: string; // real photo, e.g. "/images/team/aarav-mehta.jpg" (portrait 4:5, ~800 x 1000)
}

export interface Department {
  name: string;
  convener: TeamMember;
  coConvener: TeamMember;
  member: TeamMember; // core team member
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
  "Tanvi Joshi", "Rehan Qureshi", "Gauri Nambiar", "Vikram Sethi", "Ananya Bhatt", "Karan Dhillon",
  "Pallavi Kulkarni", "Rudra Tripathi", "Sneha Pandey", "Aryan Bajaj", "Divya Menon", "Manav Arora",
  "Esha Trivedi", "Jai Solanki", "Lavanya Iyer",
];

const emailFor = (name: string) => `${name.toLowerCase().replace(/[^a-z ]/g, "").trim().replace(/\s+/g, ".")}@technoaimbiation.example`;
const phoneFor = (n: number) => `+91 98765 4${String(1000 + n).slice(1)}0`;
const member = (name: string, n: number): TeamMember => ({ name, phone: phoneFor(n), email: emailFor(name) });

export const DEPARTMENTS: Department[] = DEPARTMENT_NAMES.map((name, i) => ({
  name,
  convener: member(PEOPLE[i * 2], i * 3),
  coConvener: member(PEOPLE[i * 2 + 1], i * 3 + 1),
  member: member(PEOPLE[30 + i], i * 3 + 2),
}));

export function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export const MILESTONES = [
  { year: "2011", title: "Technorollix begins", text: "OP Jindal University's annual techno-cultural fest takes its first steps." },
  { year: "2020", title: "Technorollix'20", text: "Four days in February (18–21) with students from colleges across India." },
  { year: "2023", title: "12th edition", text: "Three days (1–3 March) of events, a Techlab prototype showcase and a celebrity DJ night." },
  { year: "2024", title: "13th edition", text: "Technorollix returned in March for its 13th year." },
  { year: "2025", title: "14th edition", text: "Central India's biggest techno-cultural fest ran from 20 to 22 March." },
  { year: "2027", title: "16th edition", text: "The newest chapter of a fest that has been running since 2011." },
];

export const CREATOR_PERKS = [
  { title: "Festival wall", text: "Selected work is displayed across the fest venue." },
  { title: "Official merch", text: "Featured creators receive limited-edition merchandise." },
  { title: "Certificates", text: "Verified certificates for every accepted submission." },
  { title: "Creator meetup", text: "An evening to meet and swap ideas with other makers." },
];

// ---------------------------------------------------------------------------
// Per-event details (date, venue, prize, rules ...)
// The values live with each event in src/app/events/<slug>/data.ts — edit them there.
// ---------------------------------------------------------------------------
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

export function getEventMock(slug: string): EventMock {
  const e = getEvent(slug);
  if (!e) throw new Error(`Unknown event: ${slug}`);
  return { tagline: e.tagline, about: e.about, date: e.date, time: e.time, venue: e.venue, teamSize: e.teamSize, fee: e.fee, prize: e.prize, rules: e.rules, contact: e.contact };
}

// ---------------------------------------------------------------------------
// Gallery, testimonials, featured creators
// ---------------------------------------------------------------------------
export interface GalleryItem {
  caption: string;
  tag: string;
  year: string;
  scene: string; // event slug whose cultural illustration is shown until a real photo is added
  image?: string; // real photo, e.g. "/images/gallery/hackathon-night.jpg" (portrait 3:4, ~900 x 1200)
}

// To use a real photo: put the file in public/images/gallery/ and set `image` on that item.
export const GALLERY: GalleryItem[] = [
  { caption: "Hackathon night", tag: "Technical", year: "2026", scene: "codigo" },
  { caption: "Robo Race finals", tag: "Technical", year: "2026", scene: "robovation" },
  { caption: "Opening night crowd", tag: "Junoon", year: "2026", scene: "antaragni" },
  { caption: "Fashion walk", tag: "Cultural", year: "2026", scene: "riwayat-fashion-show" },
  { caption: "Rangoli corner", tag: "Cultural", year: "2026", scene: "kalakriti" },
  { caption: "Prize ceremony", tag: "Awards", year: "2026", scene: "aima" },
  { caption: "Beat battle", tag: "Cultural", year: "2025", scene: "beat-battle" },
  { caption: "Masterchef kitchen", tag: "Fun", year: "2025", scene: "masterchef" },
  { caption: "Ideathon pitches", tag: "Management", year: "2025", scene: "ideathon" },
  { caption: "Campus trail", tag: "Fun", year: "2025", scene: "roadies" },
  { caption: "Volunteers", tag: "Team", year: "2025", scene: "designathon" },
  { caption: "Closing ceremony", tag: "Awards", year: "2025", scene: "techlab" },
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
//   2. In src/app/events/<slug>/data.ts set  media: { image: "/images/events/robovation.jpg", logo: "..." }
//   The picture then replaces the cultural illustration on that event's stamp card (and in the
//   Spotlight, if it is the featured event). Clear it to bring the illustration back.
//   Image tips: portrait 3:4 (about 900 x 1200) fits the stamp best; logos should be square (256 x 256).
// ---------------------------------------------------------------------------
export interface EventMedia {
  image?: string; // stamp picture, portrait 3:4 (~900 x 1200)
  logo?: string; // round event logo, square, ~256 x 256
}
export const EVENT_MEDIA: Record<string, EventMedia> = Object.fromEntries(ALL_EVENTS.map((e) => [e.slug, e.media ?? {}]));

export const EVENTS_BANNER: string | undefined = undefined; // e.g. "/images/events-banner.jpg", ~1600 x 600
export const REVEAL_DATE = "2026-11-20T00:00:00+05:30";
export const FEST_START = "2027-02-18T09:00:00+05:30";

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

// ---------------------------------------------------------------------------
// Sponsors page extras (all sample content)
// ---------------------------------------------------------------------------
export const PARTNER_BENEFITS = [
  { title: "Stage presence", text: "Your brand on the main stage, Junoon nights and every event backdrop.", icon: "mic" },
  { title: "Campus reach", text: "Direct access to 2,000+ students from OPJU and 20+ colleges.", icon: "users" },
  { title: "Digital spotlight", text: "Featured on the website, social media and the official event app.", icon: "globe" },
  { title: "On-ground stalls", text: "Dedicated stall space for demos, sampling and recruitment drives.", icon: "store" },
];

export const PARTNER_PACKAGES = [
  { name: "Title Partner", price: "₹5,00,000", perks: ["Name in the fest title", "Main-stage branding", "Premium stall", "Social media takeover"], accent: "#c1121f" },
  { name: "Gold Partner", price: "₹2,00,000", perks: ["Logo on all banners", "Stall space", "Event naming rights", "Website feature"], accent: "#f5c928" },
  { name: "Silver Partner", price: "₹75,000", perks: ["Logo on website", "Shared stall", "Social media mention", "Certificate"], accent: "#2a7aa8" },
];

// ---------------------------------------------------------------------------
// Team page — each department's title, captions and look (all sample copy)
// ---------------------------------------------------------------------------
export interface DeptFlavor {
  title: string; // poster headline
  caption: string; // default Hinglish caption
  alt: string; // cheekier caption shown on hover
  hindi: [string, string]; // the headline in Devanagari, split for the two sides of the poster
  icon: string; // key into the icon map in dept-poster.tsx
  emoji: string;
}

export const DEPT_FLAVOR: Record<string, DeptFlavor> = {
  "Information, Publicity & Invitation": { title: "Publicity ka Theka", caption: "Bulana humara kaam hai, aana tumhari zimmedari.", alt: "Fest mein nahi aaye? Humne bulaya toh tha.", hindi: ["पब्लिसिटी", "का ठेका"], icon: "megaphone", emoji: "📢" },
  "Design, Print & Media": { title: "Creative Dimaag", caption: "Poster se publicity tak, sab hum sambhalenge.", alt: "Tum idea do, aesthetic hum kar denge.", hindi: ["क्रिएटिव", "दिमाग"], icon: "palette", emoji: "🎨" },
  "Registration & Reception": { title: "Entry Gate ke Sultaan", caption: "Naam likhwao, entry pao, andar jao.", alt: "Naam batao, entry le jao.", hindi: ["एंट्री गेट", "के सुल्तान"], icon: "clipboard", emoji: "📝" },
  "Accommodation": { title: "Room Ka Jugaad", caption: "Sone ki tension mat lo, room hum de denge.", alt: "Ghar nahi hai? Hostel hai na.", hindi: ["रूम का", "जुगाड़"], icon: "bed", emoji: "🛏️" },
  "Stage, Light, Sound & Stall": { title: "Stage Tera Bhai Banayega", caption: "Light, mic, stage… sab chamkega.", alt: "Stage tera bhai banayega, spotlight bhi.", hindi: ["स्टेज तेरा भाई", "बनाएगा"], icon: "mic", emoji: "🎤" },
  "Catering": { title: "Khaana Department", caption: "Khaana kha ke jaana, bhookha mat jaana.", alt: "Event baad mein, pehle khaana.", hindi: ["खाना", "डिपार्टमेंट"], icon: "utensils", emoji: "🍕" },
  "Venue Preparation": { title: "Jagaah Hum Bana Denge", caption: "Khaali ground ko fest bana denge.", alt: "Ground mila tha, fest hum banayenge.", hindi: ["जगह हम", "बना देंगे"], icon: "hammer", emoji: "🏗️" },
  "Transportation": { title: "Lana Leja Hum Kar Lenge", caption: "Tum bas aao, baaki hum dekh lenge.", alt: "Gaadi ka jugaad hum kar lenge.", hindi: ["लाना ले जाना", "हम कर लेंगे"], icon: "bus", emoji: "🚗" },
  "Hospitality": { title: "Mehmaan Nawazi Squad", caption: "Mehmaan ho tum, tension humari.", alt: "Guest tumhare, tension humari.", hindi: ["मेहमान नवाज़ी", "स्क्वॉड"], icon: "handshake", emoji: "🤝" },
  "Website Maintenance": { title: "Website Tera Bhai Chalayega", caption: "Code phatega tab bhi website chalegi.", alt: "Code patega tab bhi website chalega.", hindi: ["वेबसाइट तेरा भाई", "चलाएगा"], icon: "code", emoji: "💻" },
  "Sponsorship": { title: "Paise Wale Dost", caption: "Paise toh hum hi dalenge.", alt: "Paise toh hum hi dalenge. (Sponsors ke.)", hindi: ["पैसे वाले", "दोस्त"], icon: "rupee", emoji: "💰" },
  "Certificate & Prize": { title: "Jeet Ki Rasid", caption: "Jeeto tum, certificate hum denge.", alt: "Jeet ka proof hum denge.", hindi: ["जीत की", "रसीद"], icon: "award", emoji: "🏆" },
  "Discipline": { title: "Shanti Rakho Bhai", caption: "Masti karo, panga mat lena.", alt: "Rules hum banayenge, todna mat.", hindi: ["शांति रखो", "भाई"], icon: "shield", emoji: "🚨" },
  "Stationery & Logistics": { title: "Samaan Ka Sultaan", caption: "Jo chahiye, woh milega.", alt: "Samaan chahiye? Naam batao.", hindi: ["सामान का", "सुल्तान"], icon: "package", emoji: "📦" },
  "Health & First Aid": { title: "Doctor Nahi, Par Kaam Chala Denge", caption: "Chot lage toh seedha humare paas aana.", alt: "Chot lage toh hero mat banna.", hindi: ["डॉक्टर नहीं", "पर काम चला देंगे"], icon: "heart", emoji: "🩹" },
};

// Poster colour families, cycled across the departments.
export interface PosterPalette {
  main: string; // frame / background
  accent: string; // arched banner
  line: string; // thin inner line, dots
  ink: string; // body text on main
  bannerInk: string;
  bannerShadow: string;
  sky: string; // oval backdrop
  shape: string; // oval geometric shape
}
export const POSTER_PALETTES: PosterPalette[] = [
  { main: "#5b2a8c", accent: "#e8479a", line: "#ffd9ee", ink: "#fff0f7", bannerInk: "#ffd9ee", bannerShadow: "#5b2a8c", sky: "#33c4ea", shape: "#ffd23a" },
  { main: "#0e5b57", accent: "#ffb800", line: "#ffe9a8", ink: "#fff6d8", bannerInk: "#0a3f3c", bannerShadow: "#fff1b8", sky: "#ff7a59", shape: "#f7e6b0" },
  { main: "#8a1020", accent: "#ff7a1a", line: "#ffd9a8", ink: "#fff0dc", bannerInk: "#fff0dc", bannerShadow: "#8a1020", sky: "#ffd23a", shape: "#2aa6a0" },
  { main: "#1d3a8a", accent: "#ff2d8a", line: "#ffd0e6", ink: "#fff0f7", bannerInk: "#fff0f7", bannerShadow: "#1d3a8a", sky: "#7fe0d0", shape: "#ffd23a" },
  { main: "#1f6b3a", accent: "#ffd23a", line: "#fff0a8", ink: "#fffbe0", bannerInk: "#14502b", bannerShadow: "#fff7b0", sky: "#ff8fb5", shape: "#ff6a00" },
];
