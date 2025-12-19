import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import LogoCloud from "@/components/LogoCloud";
import Work from "@/components/Work";
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
        <Marquee />
        <LogoCloud />
        <Work />
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
