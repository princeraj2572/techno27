// Official programme schedule (Techno-aiMBiAtion 2027 programme schedule, Nov 2026).

export type ScheduleKind = "Special" | "Technical" | "Cultural" | "General" | "Management" | "Fun";

export interface ScheduleItem {
  time: string; // "09:00"
  title: string;
  kind: ScheduleKind;
  venue: string;
  iconKey: string;
}

export interface ScheduleDay {
  label: string;
  date: string;
  items: ScheduleItem[];
}

export const SCHEDULE: ScheduleDay[] = [
  {
    label: "Day 1", date: "Feb 16, 2027",
    items: [
      { time: "10:00", title: "Opening Ceremony & Tech-Lab: Model Presentation", kind: "Special", venue: "Babuji Chowk", iconKey: "flask" },
      { time: "11:00", title: "Drobotics: AeroDrift", kind: "Technical", venue: "Beside Volleyball Ground", iconKey: "bot" },
      { time: "11:00", title: "Kalakriti: Pradarshini & Floral Fusion", kind: "Cultural", venue: "Central Library & OPJU Campus", iconKey: "palette" },
      { time: "11:00", title: "Codigo", kind: "Technical", venue: "TB-09", iconKey: "code" },
      { time: "11:30", title: "Retail Sale & Visual Merchandising", kind: "Management", venue: "Lawn opposite ATM", iconKey: "trend" },
      { time: "11:30", title: "Ideathon", kind: "Technical", venue: "EE Seminar Hall (FB-14)", iconKey: "bulb" },
      { time: "11:30", title: "Roadies (Round 1)", kind: "Fun", venue: "Car & Bus Parking Area, Open Gym", iconKey: "compass" },
      { time: "11:30", title: "Master Chef", kind: "Fun", venue: "Cafeteria", iconKey: "chef" },
      { time: "12:00", title: "Yuva Sabha (Round 1)", kind: "Management", venue: "MP Hall", iconKey: "mic" },
      { time: "14:30", title: "Drobotics: Robo Soccer", kind: "Technical", venue: "Babuji Chowk", iconKey: "bot" },
      { time: "14:30", title: "Kalakriti: Mehendi (Rang-e-Heena)", kind: "Cultural", venue: "Opposite Chemistry Lab", iconKey: "palette" },
      { time: "18:30", title: "Inaugural Function", kind: "Special", venue: "University Playground", iconKey: "flame" },
      { time: "19:00", title: "Riwayat (Fashion Show)", kind: "Cultural", venue: "University Playground", iconKey: "shirt" },
    ],
  },
  {
    label: "Day 2", date: "Feb 17, 2027",
    items: [
      { time: "10:00", title: "Master Chef (Finale)", kind: "Fun", venue: "Cafeteria", iconKey: "chef" },
      { time: "10:00", title: "Drobotics: Robo Race", kind: "Technical", venue: "Beside Volleyball Ground", iconKey: "bot" },
      { time: "10:30", title: "Yuva Sabha (Finale)", kind: "Management", venue: "MP Hall", iconKey: "mic" },
      { time: "11:00", title: "Kalakriti: Bhoomi Kala (Rangoli & Alpana)", kind: "Cultural", venue: "Opposite Chemistry Lab", iconKey: "palette" },
      { time: "11:00", title: "Codigo (Finale)", kind: "Technical", venue: "TB-09", iconKey: "code" },
      { time: "11:00", title: "Designathon", kind: "Technical", venue: "TB-07", iconKey: "pen" },
      { time: "14:00", title: "Drobotics: Fast Line Follower", kind: "Technical", venue: "Babuji Chowk", iconKey: "bot" },
      { time: "14:00", title: "Roadies (Rounds 2 & 3)", kind: "Fun", venue: "Car & Bus Parking Area, Open Gym", iconKey: "compass" },
      { time: "14:30", title: "Start-up Business Plan", kind: "Management", venue: "Live Class Room", iconKey: "trend" },
      { time: "14:30", title: "Beat Battle", kind: "Cultural", venue: "Babuji Chowk", iconKey: "music" },
      { time: "18:30", title: "Antaragni (Cultural Event)", kind: "Cultural", venue: "University Playground", iconKey: "flame" },
    ],
  },
  {
    label: "Day 3", date: "Feb 18, 2027",
    items: [
      { time: "09:30", title: "Drobotics: Pick & Place", kind: "Technical", venue: "Babuji Chowk", iconKey: "bot" },
      { time: "10:00", title: "Business Quiz", kind: "Management", venue: "MP Hall", iconKey: "brain" },
      { time: "10:00", title: "Start-up Business Plan", kind: "Management", venue: "Idea Lab", iconKey: "trend" },
      { time: "11:00", title: "Kalakriti: Painting Challenge & Faces That Speak", kind: "Cultural", venue: "Library", iconKey: "palette" },
      { time: "11:00", title: "Roadies (Finale)", kind: "Fun", venue: "Car & Bus Parking Area, Open Gym", iconKey: "compass" },
      { time: "14:30", title: "Drobotics: Robo War", kind: "Technical", venue: "Babuji Chowk", iconKey: "bot" },
      { time: "18:30", title: "Valedictory Function & Prize Distribution", kind: "Special", venue: "OAT / MP Hall", iconKey: "star" },
      { time: "20:00", title: "Junoon: Celebrity Night (artist revealing soon)", kind: "Special", venue: "University Playground", iconKey: "music" },
    ],
  },
];
