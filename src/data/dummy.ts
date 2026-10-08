// DUMMY DATA — every name, brand, number and date below is fictional sample content
// for previewing the design. Replace with real information before launch.

export interface Pronite {
  n: string;
  title: string;
  artist: string;
  genre: string;
  date: string;
  time: string;
  venue: string;
  desc: string;
}

export const PRONITES: Pronite[] = [
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
  { year: "2025", title: "Pronites arrive", text: "Live music nights drew the biggest crowds yet." },
  { year: "2026", title: "Prize pool grows", text: "Over ₹3 lakh in prizes and 1,500 participants." },
  { year: "2027", title: "The biggest one yet", text: "15 flagship events, 5 days, and a new home for creators." },
];

export const CREATOR_PERKS = [
  { title: "Festival wall", text: "Selected work is displayed across the fest venue." },
  { title: "Official merch", text: "Featured creators receive limited-edition merchandise." },
  { title: "Certificates", text: "Verified certificates for every accepted submission." },
  { title: "Creator meetup", text: "An evening to meet and swap ideas with other makers." },
];
