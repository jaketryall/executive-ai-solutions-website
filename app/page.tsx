import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import UseCases from "@/components/UseCases";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Move Hero outside of main to avoid overflow conflicts */}
      <Hero />
      {/* HowItWorks needs to be outside any parent with overflow hidden */}
      <main className="relative">
        <section id="services" className="relative">
          <Services />
        </section>
      </main>
      {/* HowItWorks component placed at root level without any parent overflow constraints */}
      <HowItWorks />
      <main className="relative">
        <section id="use-cases" className="relative">
          <UseCases />
        </section>
        <section id="about" className="relative">
          <About />
        </section>
        <section id="contact" className="relative">
          <Contact />
        </section>
      </main>
      <Footer />
    </>
  );
}
