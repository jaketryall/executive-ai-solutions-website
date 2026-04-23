import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedWork from "@/components/marketing/FeaturedWork";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar lightHero />
      <main className="relative" style={{ zIndex: 10, backgroundColor: "var(--paper)" }}>
        <Hero />
        <FeaturedWork />
      </main>
      <Footer />
    </>
  );
}
