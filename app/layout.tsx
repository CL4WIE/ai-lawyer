import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Lawyer — Sri Lankan labour law in plain language",
  description:
    "A conversational AI assistant that explains your rights under Sri Lankan labour law and helps you draft letters and complaints for the Department of Labour.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased text-ink bg-canvas">
        {children}
      </body>
    </html>
  );
}
