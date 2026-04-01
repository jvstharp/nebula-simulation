import { LandingNav } from "@/components/landing/landing-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CharacterRow } from "@/components/landing/character-row";
import { SkillBars } from "@/components/landing/skill-bars";
import { PortfolioMockup } from "@/components/landing/portfolio-mockup";
import { FinalCTA } from "@/components/landing/final-cta";

export default function LandingPage() {
  return (
    <main style={{ background: '#0c0c0e', minHeight: '100vh', fontFamily: 'var(--font-sans, Inter, sans-serif)' }}>
      <LandingNav />
      <HeroSection />
      <HowItWorks />
      <CharacterRow />
      <SkillBars />
      <PortfolioMockup />
      <FinalCTA />
    </main>
  );
}
