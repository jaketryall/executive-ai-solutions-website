import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WorkSection from "@/components/WorkSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import AboutSection from "@/components/AboutSection";
import FinalCTA from "@/components/FinalCTA";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <main>
      {/* Fixed chrome lives outside the smoothed content */}
      <Navbar />
      <SmoothScroll>
        <Hero />
        <WorkSection />
        <ServicesSection />
        <ProcessSection />
        <AboutSection />
        <FinalCTA />
        <ContactSection contactEmail={process.env.CONTACT_EMAIL} />
        <Footer contactEmail={process.env.CONTACT_EMAIL} />
      </SmoothScroll>
    </main>
  );
}
