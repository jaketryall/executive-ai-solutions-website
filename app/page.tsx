import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      {/* Work — stub. The morph chain (hero card → first work card) lands here. */}
      <section
        id="work"
        className="relative z-20 -mt-8 rounded-t-[40px] bg-ink-deep text-paper px-5 md:px-10 py-36 min-h-[80vh] shadow-[0_-32px_80px_rgba(14,13,12,0.4)]"
      >
        <p className="micro text-paper/40">Work — landing here next</p>
        <h2 className="mt-6 max-w-3xl font-extrabold tracking-[-0.035em] leading-[1.02] text-[clamp(2rem,5vw,4rem)]">
          The work section docks in here, and the hero card morphs into it.
        </h2>
      </section>
    </main>
  );
}
