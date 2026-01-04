"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { TransitionProvider, PageLoader } from "@/components/PageTransition";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <TransitionProvider>
      {!isLoaded && <PageLoader onComplete={() => setIsLoaded(true)} />}
      <CustomCursor />
      <Navbar />
      <main className="relative" style={{ zIndex: 1 }}>
        <Hero />
        <Work />
        <Services />
        <Contact />
      </main>
      <Footer />
    </TransitionProvider>
  );
}
