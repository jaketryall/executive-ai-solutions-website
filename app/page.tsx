import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import WorkSection from "@/components/WorkSection";
import ChromaticZone from "@/components/ChromaticZone";

export default function Home() {
  return (
    <ChromaticZone>
      <Navbar />
      <Hero />
      <ProofStrip />
      <WorkSection />

      {/* Services — stub. The chromatic zone lightens back as it arrives. */}
      <section
        id="services"
        className="relative px-5 md:px-10 py-36 min-h-[60vh]"
      >
        <p className="micro text-(--fg-faint)">Services — landing here next</p>
        <h2 className="mt-6 max-w-3xl font-extrabold tracking-[-0.035em] leading-[1.02] text-[clamp(2rem,5vw,4rem)]">
          Websites, motion, AI — the service stack lands here.
        </h2>
      </section>
    </ChromaticZone>
  );
}
