import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HeroWorkTransition from "@/components/HeroWorkTransition";
import Work, { WorkStats } from "@/components/Work";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Process from "@/components/Process";
import FAQ from "@/components/FAQ";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";

export default function Home() {
  return (
    <>
      <PageLoader />
      <Navbar />
      <main>
        <Hero />
        <HeroWorkTransition />
        <Work />
        <WorkStats />
        <Services />
        <Pricing />
        <Testimonials />
        <Process />
        <FAQ />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
