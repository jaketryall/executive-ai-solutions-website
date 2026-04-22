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
const Capabilities = dynamic(() => import("@/components/homepage/Capabilities"), {
  loading: () => <div className="min-h-screen" />,
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
// Logic-only seams (no loading placeholder needed)
const Seam1FanToKicker = dynamic(
  () => import("@/components/homepage/transitions/Seam1_FanToKicker"),
);
const Seam2CapabilitiesToManifesto = dynamic(
  () => import("@/components/homepage/transitions/Seam2_CapabilitiesToManifesto"),
);
const Seam3ManifestoToTestimonials = dynamic(
  () => import("@/components/homepage/transitions/Seam3_ManifestoToTestimonials"),
);
const Seam4InkFlood = dynamic(
  () => import("@/components/homepage/transitions/Seam4_InkFlood"),
);

export default function Home() {
  return (
    <TransitionProvider>
      <ScrollBackground />
      <main className="relative" style={{ zIndex: 10 }}>
        <Hero />
        <Seam1FanToKicker />
        <Work />
        <Capabilities />
        <Seam2CapabilitiesToManifesto />
        <Manifesto />
        <Seam3ManifestoToTestimonials />
        <Testimonials />
        <Seam4InkFlood />
        <Contact />
      </main>
      <Footer />
    </TransitionProvider>
  );
}
