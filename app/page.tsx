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
import { getVisitorContext, resolveHeroContent } from "@/lib/personalize";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ ind?: string }>;
}) {
  // Adaptive hero: resolve copy from the visitor's ad campaign + geo, server-
  // side, so the matched headline renders with no flicker. Falls back to the
  // default copy for bots/direct visitors.
  const ctx = await getVisitorContext(await searchParams);
  const hero = resolveHeroContent(ctx);

  return (
    <main>
      {/* Fixed chrome lives outside the smoothed content */}
      <Navbar />
      <SmoothScroll>
        <Hero tagline={hero.tagline} />
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
