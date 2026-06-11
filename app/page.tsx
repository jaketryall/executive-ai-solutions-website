import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import WorkSection from "@/components/WorkSection";
import ServicesSection from "@/components/ServicesSection";
import FinalCTA from "@/components/FinalCTA";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <main>
      {/* Fixed chrome lives outside the smoothed content */}
      <Navbar />
      <SmoothScroll>
        <Hero />
        <ProofStrip />
        <WorkSection />
        <ServicesSection />
        <FinalCTA />

        {/* Contact — stub so every CTA resolves; the real section (form +
            booking) lands here next. */}
        <section
          id="contact"
          className="zone-dark relative z-40 -mt-8 rounded-t-[40px] bg-ink-deep px-5 md:px-10 pt-28 pb-24 min-h-[50vh] text-(--fg)"
        >
          <p className="micro text-(--fg-faint)">Contact — landing here next</p>
          <h2 className="mt-6 max-w-3xl font-extrabold tracking-[-0.035em] leading-[1.02] text-[clamp(2rem,5vw,4rem)]">
            Start the conversation<span className="text-oxblood">.</span>
          </h2>
        </section>
      </SmoothScroll>
    </main>
  );
}
