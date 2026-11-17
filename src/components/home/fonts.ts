import { Archivo, Press_Start_2P, Space_Mono } from "next/font/google";

// Poster-hero typefaces: clean grotesque for copy/buttons, pixel face for the "92", slab mono for the plate.
export const sans = Archivo({ subsets: ["latin"], weight: ["500", "600", "700", "800"] });
export const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400" });
export const mono = Space_Mono({ subsets: ["latin"], weight: ["700"] });
