import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import WorkSection from "@/components/WorkSection";
import ServicesSection from "@/components/ServicesSection";
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

        {/* Contact — stub so every CTA resolves; the real section (form +
            booking) lands here next. */}
        <section
          id="contact"
          className="zone-dark relative z-40 -mt-8 rounded-t-[40px] bg-ink-deep px-5 md:px-10 pt-28 pb-24 min-h-[50vh] text-(--fg)"
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="micro text-(--fg-faint)">Contact — landing here next</p>
            <span className="inline-flex items-center gap-2.5 h-9 pl-1.5 pr-4 rounded-full border border-(--line) bg-(--surface)">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-oxblood/10">
                <span className="w-1.5 h-1.5 rounded-full bg-oxblood text-oxblood pulse-dot" />
              </span>
              <span className="micro">2 spots left for July</span>
            </span>
          </div>
          <h2 className="mt-6 max-w-3xl font-extrabold tracking-[-0.035em] leading-[1.02] text-[clamp(2rem,5vw,4rem)]">
            Let&rsquo;s build yours<span className="text-oxblood">.</span>
          </h2>
        </section>
      </SmoothScroll>
    </main>
  );
}
