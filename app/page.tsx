import { Hero } from "@/components/sections/hero";
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
      {/* THE ROUTER ORDER (hybrid-rebuild-plan §3): the home page's job is
          to move each visitor to the page that answers THEM — services
          self-select right under the hero, the audit catches everyone the
          router didn't route, proof reads as receipts, the price beat
          routes to /pricing. Depth lives on the interior pages. */}
      <Hero />
      <Services />
      <SiteCheck />
      <Proof />
      <PriceBeat />
      <Steps />
      <Faq />
      <Closer />
    </>
  );
}
