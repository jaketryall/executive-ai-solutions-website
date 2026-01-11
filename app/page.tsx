"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import KineticTypography from "@/components/KineticTypography";
import AboutSnippet from "@/components/AboutSnippet";
import Work from "@/components/Work";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { TransitionProvider, PageLoader } from "@/components/PageTransition";

export default function Home() {
  // Check if intro has already been shown this session
  const [showIntro, setShowIntro] = useState<boolean | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only show intro on first visit of the session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro) {
      setShowIntro(false);
      setIsLoaded(true);
    } else {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem("hasSeenIntro", "true");
    setIsLoaded(true);
  };

  // Don't render until we've checked sessionStorage (prevents flash)
  if (showIntro === null) {
    return (
      <div className="fixed inset-0 bg-[#0a0908]" />
    );
  }

  return (
    <TransitionProvider>
      {showIntro && !isLoaded && <PageLoader onComplete={handleIntroComplete} />}
      <CustomCursor />
      <Navbar />
      <main className="relative" style={{ zIndex: 10 }}>
        <Hero />
        <KineticTypography />
        <AboutSnippet />
        <Work />
        <Services />
        <Contact />
      </main>
      <Footer />
    </TransitionProvider>
  );
}
