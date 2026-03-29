import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import { TransitionProvider } from "@/components/PageTransition";
import ScrollBackground from "@/components/homepage/ScrollBackground";

// Dynamic imports for below-fold components - reduces initial bundle
const KineticTypography = dynamic(() => import("@/components/KineticTypography"), {
  loading: () => <div className="h-[50vh]" />,
});
const Work = dynamic(() => import("@/components/Work"), {
  loading: () => <div className="min-h-screen" />,
});
const Services = dynamic(() => import("@/components/Services"), {
  loading: () => <div className="min-h-screen" />,
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
        <KineticTypography />
        <Work />
        <Services />
        <Contact />
      </main>
      <Footer />
    </TransitionProvider>
  );
}
