import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter", weight: ["400","500","600","700"] });

export const metadata: Metadata = {
  title: "Nebula — Career Simulation Platform",
  description: "AI-powered career simulation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="text-white antialiased">{children}</body>
    </html>
  );
}
