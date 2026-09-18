import type { Metadata } from "next";
import type { ReactElement } from "react";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/nav";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Technorollix 2027",
  description: "A festival management platform for Technorollix 2027 — participants, organizers, and administration.",
  metadataBase: new URL("http://localhost:3000")
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-background text-foreground ${inter.variable} ${inter.className}`}>
        <Navbar />
        <main className="pt-16">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
