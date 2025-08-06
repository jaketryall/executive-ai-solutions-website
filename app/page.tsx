import Navbar from "@/components/Navbar";
import EteryHero from "@/components/EteryHero";
import EteryLogos from "@/components/EteryLogos";
import EteryAbout from "@/components/EteryAbout";
import EteryServices from "@/components/EteryServices";
import EteryProcess from "@/components/EteryProcess";
import EteryWhyUs from "@/components/EteryWhyUs";
import EteryResults from "@/components/EteryResults";
import EteryPricing from "@/components/EteryPricing";
import EteryTeam from "@/components/EteryTeam";
import EteryFAQ from "@/components/EteryFAQ";
import EteryNews from "@/components/EteryNews";
import EteryFooter from "@/components/EteryFooter";
import SkipLink from "@/components/SkipLink";

export default function Home() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <div className="overflow-x-clip">
        {/* Hero Section */}
        <EteryHero />
        
        {/* About Section */}
        <EteryAbout />
        
        {/* Logo Showcase */}
        <EteryLogos />
        
        {/* Main content sections */}
        <main id="main-content" className="relative" role="main">
          {/* Services */}
          <section id="services" className="relative" aria-label="Our Services">
            <EteryServices />
          </section>
          
          {/* Process */}
          <section id="process" className="relative" aria-label="Our Process">
            <EteryProcess />
          </section>
          
          {/* Why Choose Us */}
          <section id="why-us" className="relative" aria-label="Why Choose Us">
            <EteryWhyUs />
          </section>
          
          {/* Results */}
          <section id="results" className="relative" aria-label="Our Results">
            <EteryResults />
          </section>
          
          {/* Pricing */}
          <section id="pricing" className="relative" aria-label="Pricing Plans">
            <EteryPricing />
          </section>
          
          {/* Team */}
          <section id="team" className="relative" aria-label="Our Team">
            <EteryTeam />
          </section>
          
          {/* FAQ */}
          <section id="faq" className="relative" aria-label="Frequently Asked Questions">
            <EteryFAQ />
          </section>
          
          {/* News */}
          <section id="news" className="relative" aria-label="Latest News">
            <EteryNews />
          </section>
        </main>
        
        {/* Footer */}
        <EteryFooter />
      </div>
    </>
  );
}