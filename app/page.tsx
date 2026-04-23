import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TestimonialMarquee from "@/components/marketing/TestimonialMarquee";
import FeaturedWork from "@/components/marketing/FeaturedWork";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar lightHero />
      <main className="relative" style={{ zIndex: 10, backgroundColor: "var(--paper)" }}>
        <Hero />
        <TestimonialMarquee />
        <FeaturedWork />
      </main>
      <Footer />
    </>
  );
}
