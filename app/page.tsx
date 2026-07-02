import { Hero } from "@/components/sections/hero";
import { Showreel } from "@/components/sections/showreel";
import { ManifestoWork } from "@/components/sections/manifesto-work";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Estimate } from "@/components/sections/estimate";

export default function Home() {
  return (
    <>
      <Hero />
      <Showreel />
      <ManifestoWork />
      <Services />
      <Process />
      <Estimate />
    </>
  );
}
