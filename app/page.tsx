import { Hero } from "@/components/sections/hero";
import { Proof } from "@/components/sections/proof";
import { SiteCheck } from "@/components/sections/site-check";
import { PriceBeat } from "@/components/sections/price-beat";
import { ValueReframe } from "@/components/sections/value-reframe";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Estimate } from "@/components/sections/estimate";
import { Faq } from "@/components/sections/faq";
import { Closer } from "@/components/sections/closer";

export default function Home() {
  return (
    <>
      {/* the acquisition order (Jake, 2026-07-16): hook them with the one
          thing they can DO — the free audit sits directly under the hero;
          the proof reads as receipts once they're invested */}
      <Hero />
      <SiteCheck />
      <Proof />
      <PriceBeat />
      <ValueReframe />
      <Services />
      <Process />
      <Estimate />
      <Faq />
      <Closer />
    </>
  );
}
