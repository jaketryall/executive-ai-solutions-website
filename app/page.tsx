import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import WorkSection from "@/components/WorkSection";
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

        {/* Services — stub, docks over the dark work section. */}
        <section
          id="services"
          className="relative z-30 -mt-8 rounded-t-[40px] bg-paper px-5 md:px-10 py-36 min-h-[60vh]"
        >
          <p className="micro text-(--fg-faint)">Services — landing here next</p>
          <h2 className="mt-6 max-w-3xl font-extrabold tracking-[-0.035em] leading-[1.02] text-[clamp(2rem,5vw,4rem)]">
            Websites, motion, AI — the service stack docks in here.
          </h2>
        </section>
      </SmoothScroll>
    </main>
  );
}
