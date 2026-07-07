import { Hero } from "@/components/sections/hero";
import { Proof } from "@/components/sections/proof";
import { ValueReframe } from "@/components/sections/value-reframe";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Builder } from "@/components/sections/builder";
import { Estimate } from "@/components/sections/estimate";
import { Faq } from "@/components/sections/faq";
import { Closer } from "@/components/sections/closer";

export default function Home() {
  return (
    <>
      <Hero />
      <Proof />
      <ValueReframe />
      <Services />
      <Process />
      <Builder />
      <Estimate />
      <Faq />
      <Closer />
    </>
  );
}
