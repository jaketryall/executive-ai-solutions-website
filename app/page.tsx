import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import WorkSection from "@/components/WorkSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import FinalCTA from "@/components/FinalCTA";
import ContactSection from "@/components/ContactSection";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <main>
      {/* Fixed chrome lives outside the smoothed content */}
      <Navbar />
      <SmoothScroll>
        <Hero />
        <ProofStrip />
        <WorkSection />
        <ServicesSection />
        <AboutSection />
        <FinalCTA />
        <ContactSection contactEmail={process.env.CONTACT_EMAIL} />
      </SmoothScroll>
    </main>
  );
}
