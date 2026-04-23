import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TestimonialMarquee from "@/components/marketing/TestimonialMarquee";
import FeaturedWork from "@/components/marketing/FeaturedWork";
import Mission from "@/components/marketing/Mission";
import Services from "@/components/marketing/Services";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar lightHero />
      <main className="relative" style={{ zIndex: 10, backgroundColor: "var(--paper)" }}>
        <Hero />
        <TestimonialMarquee />
        <FeaturedWork />
        <Mission />
        <Services />
      </main>
      <Footer />
    </>
  );
}
