import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { Disclaimer } from "@/components/landing/Disclaimer";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Disclaimer />
      <Footer />
    </main>
  );
}
