import { Hero } from "@/components/sections/hero";
import { SurfaceMarquee } from "@/components/sections/surface-marquee";
import { Services } from "@/components/sections/services";
import { SiteCheck } from "@/components/sections/site-check";
import { Proof } from "@/components/sections/proof";
import { PriceBeat } from "@/components/sections/price-beat";
import { Steps } from "@/components/sections/steps";
import { Faq } from "@/components/sections/faq";
import { Closer } from "@/components/sections/closer";

export default function Home() {
  return (
    <>
      {/* THE ROUTER ORDER (hybrid-rebuild-plan §3, amended 2026-07-17):
          hook → GIVE → route → prove → price. The audit moved directly
          under the hero (Jake: "it can help build trust and shows them
          what they need") — the give IS the trust artifact for a
          badge-less agency, it personalizes the proof to THEIR site, and
          the hero's "run the free audit" link now lands one scroll later.
          Services shelve the fixes right below the diagnosis. */}
      <Hero />
      {/* the names band (Jake, 2026-07-22): logos in the hero chips,
          NAMES drifting here — the frame that later holds client logos */}
      <SurfaceMarquee />
      <SiteCheck />
      <Services />
      <Proof />
      <PriceBeat />
      <Steps />
      <Faq />
      <Closer />
    </>
  );
}
