import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nebula — Career Simulation Platform",
  description: "AI-powered career simulation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="text-white antialiased" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>{children}</body>
    </html>
  );
}
