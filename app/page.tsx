import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Promise from "@/components/marketing/Promise";
import FeaturedWork from "@/components/marketing/FeaturedWork";
import Capabilities from "@/components/marketing/Capabilities";
import ProofStrip from "@/components/marketing/ProofStrip";
import Availability from "@/components/marketing/Availability";
import PaperToInkSeam from "@/components/marketing/seams/PaperToInkSeam";
import InkMarqueeSeam from "@/components/marketing/seams/InkMarqueeSeam";

export default function Home() {
  return (
    <>
      <Navbar lightHero />
      <main className="relative" style={{ zIndex: 10, backgroundColor: "var(--paper)" }}>
        <Hero />

        <Promise />

        {/* Featured work — a portfolio without work is not a portfolio. */}
        <FeaturedWork />

        {/* Big transition — paper section peels up into ink. */}
        <PaperToInkSeam phrase="The editor is production." kicker="03 · Capabilities" />
        <Capabilities />

        {/* Kinetic divider between two ink sections — opinion, not tag cloud. */}
        <InkMarqueeSeam
          topWords={[
            "Designed in the editor",
            "Lived in the browser",
            "Shipped on Fridays",
          ]}
          bottomWords={[
            "No paint, wet metal",
            "If it doesn't move, it doesn't ship",
            "Ship or fold",
          ]}
        />

        {/* Proof — compact metric strip, conversion spine for the dark stretch. */}
        <ProofStrip />

        <Availability />
      </main>
      <Footer />
    </>
  );
}
