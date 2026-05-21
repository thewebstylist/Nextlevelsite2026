import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PlatformSection from './components/PlatformSection';
import TechGrid from './components/TechGrid';
import MetricsSection from './components/MetricsSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#020408] text-white overflow-x-hidden">
        <Navbar />
        <HeroSection />
        <PlatformSection />
        <TechGrid />
        <MetricsSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </SmoothScroll>
  );
}
