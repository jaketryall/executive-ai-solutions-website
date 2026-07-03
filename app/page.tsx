import { Hero } from "@/components/sections/hero";
import { Showreel } from "@/components/sections/showreel";
import { ManifestoWork } from "@/components/sections/manifesto-work";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Testimonial } from "@/components/sections/testimonial";
import { Estimate } from "@/components/sections/estimate";
import { Faq } from "@/components/sections/faq";
import { Closer } from "@/components/sections/closer";

export default function Home() {
  return (
    <>
      <Hero />
      <Showreel />
      <ManifestoWork />
      <Services />
      <Testimonial />
      <Process />
      <Estimate />
      <Faq />
      <Closer />
    </>
  );
}
