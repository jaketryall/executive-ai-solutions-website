import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { TransitionProvider } from "@/components/PageTransition";

// Dynamic imports for below-fold components - reduces initial bundle
const KineticTypography = dynamic(() => import("@/components/KineticTypography"), {
  loading: () => <div className="h-[50vh] bg-black" />,
});
const AboutSnippet = dynamic(() => import("@/components/AboutSnippet"), {
  loading: () => <div className="min-h-screen bg-black" />,
});
const Work = dynamic(() => import("@/components/Work"), {
  loading: () => <div className="min-h-screen bg-black" />,
});
const Services = dynamic(() => import("@/components/Services"), {
  loading: () => <div className="min-h-screen bg-black" />,
});
const Contact = dynamic(() => import("@/components/Contact"), {
  loading: () => <div className="min-h-screen bg-black" />,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-[300px] bg-black" />,
});

export default function Home() {
  return (
    <TransitionProvider>
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
