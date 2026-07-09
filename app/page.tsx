import SmoothScroll from './components/SmoothScroll';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Studio from './components/Studio';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen overflow-x-hidden">
        <Header />
        <main>
          <Hero />
          <Marquee />
          <Services />
          <Studio />
          <Contact />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
