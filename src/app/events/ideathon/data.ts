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
  // Copied exactly from the event's official document.
  about: "Welcome to a world of innovation with IDEATHON, where fresh perspectives spark meaningful ideas and imagination takes the shape of real-world solutions. It is a platform for passionate minds to tackle challenges and turn creative thinking into impactful innovations. Bring your vision, embrace the challenge, and take the first step towards making a difference.",
  date: "Feb 16, 2027",
  time: "11:30 AM",
  venue: "EE Seminar Hall (FB-14)",
  teamSize: "Individual or up to 4 members",
  fee: "Free for OPJU · ₹199 per team for external",
  prize: "₹20,000",
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
  // Wording copied exactly from the event's official document; " · " separates its bullet points.
  subEventInfo: {
    "Waste Management & Circular Economy": "“Universities generate different types of waste, including food waste, plastic, paper, e-waste, and laboratory waste, creating opportunities for innovative waste management solutions. How can students develop sustainable and financially viable business models for waste segregation, collection, recycling, and resource recovery within the university campus? Participants may explore innovative approaches to converting waste into useful products, developing recycling enterprises, and promoting circular economy practices through student-led initiatives.”",
    "Smart Campus Security & Drones": "“Universities require effective and technology-enabled systems to enhance campus security, monitor critical infrastructure, and improve emergency response mechanisms. How can students propose innovative and responsible technology based solutions, including secure drone applications, counter-drone mechanisms, and intelligent surveillance systems, to strengthen campus safety? Participants may explore solutions for monitoring large campus areas, protecting sensitive infrastructure, identifying potential security risks, and supporting emergency management while ensuring privacy and regulatory compliance.”",
    "Business Process Automation": "“Universities manage several administrative and academic processes, including student admissions, attendance, examination management, fee payments, document verification, grievance redressal, and internal communication. How can students develop technology-driven solutions to automate these processes, reduce manual effort, improve operational efficiency, and enhance the overall experience of students, faculty, and administrative staff? Participants are encouraged to propose affordable, scalable, and user-friendly solutions using artificial intelligence, automation tools, data analytics, and digital platforms.”",
    "Climate-Resilient Campus & Public Health": "“Changing climatic conditions, including rising temperatures, heatwaves, air pollution, water scarcity, and seasonal variations, can influence the health, safety, and well-being of students, faculty, and university staff. How can students develop innovative solutions to create a climate-resilient and health-conscious university campus? Participants may explore technology-enabled early warning systems, climate-responsive infrastructure, health awareness initiatives, air quality monitoring, and preventive measures to improve campus preparedness and promote a healthier learning environment.”",
    "Industrial Decarbonisation & Wastewater Reuse": "“Industries and institutional campuses have significant opportunities to improve resource efficiency, reduce environmental impacts, and adopt sustainable operational practices. How can students develop practical and economically viable solutions for reducing energy consumption, controlling pollution, managing wastewater, and promoting water reuse within university facilities and nearby industrial ecosystems? Participants may explore renewable energy integration, energy-efficient technologies, wastewater treatment, water recycling, and innovative approaches to measuring and reducing carbon emissions.”",
  },

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
