import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import KineticTypography from "@/components/KineticTypography";
import AboutSnippet from "@/components/AboutSnippet";
import Work from "@/components/Work";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { TransitionProvider } from "@/components/PageTransition";

export default function Home() {
  return (
    <TransitionProvider>
      {/* Reveal overlay - slides up to introduce the page */}
      <div className="page-reveal-overlay" />

      <CustomCursor />
      <Navbar />
      <main className="relative" style={{ zIndex: 10 }}>
        <Hero />
        <KineticTypography />
        <AboutSnippet />
        <Work />
        <Services />
        <Contact />
      </main>
      <Footer />
    </TransitionProvider>
  );
}
