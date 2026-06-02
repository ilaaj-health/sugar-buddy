import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sugar Buddy — Smart Glucose Tracker",
  description: "Sugar Buddy — Diabetes management app for Pakistan. Apni Sugar readings log karein, Roman Urdu mein AI tashreeh haasil karein, aur apni sehat ke rujhaanaat dekhein.",
  keywords: ["diabetes", "sugar", "glucose", "Pakistan", "Urdu", "sugar buddy"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-white text-zinc-900 font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
