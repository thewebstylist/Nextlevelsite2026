import SmoothScroll from './components/SmoothScroll';
import Atmosphere from './components/Atmosphere';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MarqueeStrip from './components/MarqueeStrip';
import StudioSection from './components/StudioSection';
import GamesShowcase from './components/GamesShowcase';
import CraftSection from './components/CraftSection';
import MetricsSection from './components/MetricsSection';
import ProcessSection from './components/ProcessSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <SmoothScroll>
      <Atmosphere />
      <div className="min-h-screen bg-[var(--bg)] text-[var(--bone)] overflow-x-hidden">
        <Navbar />
        <HeroSection />
        <MarqueeStrip />
        <StudioSection />
        <GamesShowcase />
        <CraftSection />
        <MetricsSection />
        <ProcessSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </SmoothScroll>
  );
}
