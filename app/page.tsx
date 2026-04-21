import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import { TransitionProvider } from "@/components/PageTransition";
import ScrollBackground from "@/components/homepage/ScrollBackground";

// Dynamic imports for below-fold components - reduces initial bundle
const Manifesto = dynamic(() => import("@/components/homepage/Manifesto"), {
  loading: () => <div className="min-h-screen" />,
});
const Work = dynamic(() => import("@/components/Work"), {
  loading: () => <div className="min-h-screen" />,
});
const ScrollMarquee = dynamic(() => import("@/components/homepage/ScrollMarquee"), {
  loading: () => <div className="h-[30vh]" />,
});
const Testimonials = dynamic(() => import("@/components/homepage/Testimonials"), {
  loading: () => <div className="min-h-[60vh]" />,
});
const Contact = dynamic(() => import("@/components/Contact"), {
  loading: () => <div className="min-h-screen" />,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-[300px]" />,
});

export default function Home() {
  return (
    <TransitionProvider>
      <ScrollBackground />
      <main className="relative" style={{ zIndex: 10 }}>
        <Hero />
        <Work />
        <Testimonials />
        <ScrollMarquee />
        <Manifesto />
        <Contact />
      </main>
      <Footer />
    </TransitionProvider>
  );
}
