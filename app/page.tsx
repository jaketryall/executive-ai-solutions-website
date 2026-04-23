import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TestimonialMarquee from "@/components/marketing/TestimonialMarquee";
import FeaturedWork from "@/components/marketing/FeaturedWork";
import Mission from "@/components/marketing/Mission";
import Services from "@/components/marketing/Services";
import About from "@/components/marketing/About";
import Contact from "@/components/marketing/Contact";
import Footer from "@/components/Footer";
import SectionSeam from "@/components/ui/SectionSeam";

export default function Home() {
  return (
    <>
      <Navbar lightHero />
      <main className="relative" style={{ zIndex: 10, backgroundColor: "var(--paper)" }}>
        <Hero />
        <SectionSeam
          direction="paper-to-ink"
          toLabel={{ num: "02", name: "Testimonials", era: "2025 – Present" }}
        />
        <TestimonialMarquee />
        {/* No seam between Testimonials and FeaturedWork — continuous dark block */}
        <FeaturedWork />
        <SectionSeam
          direction="ink-to-paper"
          toLabel={{ num: "05", name: "Mission", era: "2025 – Present" }}
        />
        <Mission />
        <SectionSeam
          direction="paper-to-ink"
          toLabel={{ num: "06", name: "Services", era: "2025 – Present" }}
        />
        <Services />
        <SectionSeam
          direction="ink-to-paper"
          toLabel={{ num: "09", name: "About", era: "2025 – Present" }}
        />
        <About />
        {/* No seam between About and Contact — continuous light block */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
