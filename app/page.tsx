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
      <Hero />
      <Proof />
      <SiteCheck />
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
