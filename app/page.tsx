import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import UseCases from "@/components/UseCases";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";

export default function Home() {
  return (
    <>
      <SkipLink />
      <Navbar />
      {/* Move Hero outside of main to avoid overflow conflicts */}
      <Hero />
      {/* HowItWorks needs to be outside any parent with overflow hidden */}
      <main id="main-content" className="relative" role="main">
        <section id="services" className="relative" aria-label="Our Services">
          <Services />
        </section>
      </main>
      {/* HowItWorks component placed at root level without any parent overflow constraints */}
      <HowItWorks />
      <main className="relative" role="main">
        <section id="use-cases" className="relative" aria-label="Use Cases">
          <UseCases />
        </section>
        <section id="about" className="relative" aria-label="About Executive AI">
          <About />
        </section>
        <section id="contact" className="relative" aria-label="Contact Us">
          <Contact />
        </section>
      </main>
      <Footer />
    </>
  );
}
