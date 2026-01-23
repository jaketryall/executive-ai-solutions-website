"use client";

import { motion, useScroll, useTransform, useMotionTemplate, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Handle video loop manually
  const handleVideoEnded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.currentTime = 0;
    video.play();
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Hide fixed container when section is out of view
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      setIsVisible(value < 1);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Logo mask scale: starts small, grows to reveal full video
  // Use spring for smooth, fluid animation
  const maskSizeRaw = useTransform(scrollYProgress, [0, 0.5], [20, 5000]);
  const maskSize = useSpring(maskSizeRaw, { stiffness: 100, damping: 30, mass: 0.5 });
  const maskSizePercent = useMotionTemplate`${maskSize}%`;

  // Initial content fades out quickly
  const initialContentOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Background opacity - becomes semi-transparent when video is fully zoomed
  const bgOpacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0.3]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[200vh]"
    >
      {/* Fixed container - hidden when scrolled past */}
      <div
        className="fixed top-0 left-0 right-0 h-screen w-full overflow-hidden bg-black"
        style={{
          zIndex: 5,
          visibility: isVisible ? "visible" : "hidden",
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >

        {/* Video layer - sits behind everything */}
        <div className="absolute inset-0">
          <video
            ref={videoRef1}
            autoPlay
            muted
            loop
            playsInline
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          >
            <source src="/final-comp.mp4?v=2" type="video/mp4" />
          </video>
        </div>

        {/* Black overlay that becomes semi-transparent when fully zoomed */}
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: bgOpacity }}
        />

        {/* Moving work images behind logo - infinite marquee */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ opacity: initialContentOpacity }}
        >
          {/* Project images array - alternating laptop/phone pattern */}
          {(() => {
            const projectImages = [
              "/Celestial Laptop Mockup.png",    // Laptop
              "/Celestial iPhone Mockup.png",   // Phone
              "/Elegant Black Laptop Mockup.png", // Laptop
              "/Rubber iPhone Mockup.png",      // Phone
            ];

            // Card dimensions
            const cardWidth = 350;
            const gapWidth = 32; // gap-8 = 2rem = 32px
            const cardCount = 8;
            // Total width of one set of cards (including gaps between cards, but not after last)
            const setWidth = cardCount * cardWidth + (cardCount - 1) * gapWidth;
            // Add one more gap for the space between sets
            const translateDistance = setWidth + gapWidth;

            // Helper to render a set of cards
            const renderCards = (offset: number, keyPrefix: string) =>
              [...Array(cardCount)].map((_, i) => (
                <div
                  key={`${keyPrefix}-${i}`}
                  className="w-[350px] h-[220px] rounded-lg overflow-hidden opacity-20 shrink-0"
                  style={{
                    boxShadow: "0 0 40px rgba(255,250,240,0.1)",
                  }}
                >
                  <img
                    src={projectImages[(i + offset) % projectImages.length]}
                    alt=""
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ));

            return (
              <>
                {/* Inline keyframes for precise pixel-based animation */}
                <style>{`
                  @keyframes marquee-scroll-left {
                    from { transform: translateX(0); }
                    to { transform: translateX(-${translateDistance}px); }
                  }
                  @keyframes marquee-scroll-right {
                    from { transform: translateX(-${translateDistance}px); }
                    to { transform: translateX(0); }
                  }
                `}</style>

                {/* Top row - moves left continuously */}
                <div className="absolute top-[5%] flex overflow-hidden w-full">
                  <div
                    className="flex gap-8 whitespace-nowrap will-change-transform"
                    style={{
                      animation: "marquee-scroll-left 40s linear infinite",
                    }}
                  >
                    {renderCards(0, "top-a")}
                    {renderCards(0, "top-b")}
                  </div>
                </div>

                {/* Middle row - moves right continuously */}
                <div className="absolute top-[35%] flex overflow-hidden w-full">
                  <div
                    className="flex gap-8 whitespace-nowrap will-change-transform"
                    style={{
                      animation: "marquee-scroll-right 45s linear infinite",
                    }}
                  >
                    {renderCards(2, "mid-a")}
                    {renderCards(2, "mid-b")}
                  </div>
                </div>

                {/* Bottom row - moves left slower */}
                <div className="absolute top-[65%] flex overflow-hidden w-full">
                  <div
                    className="flex gap-8 whitespace-nowrap will-change-transform"
                    style={{
                      animation: "marquee-scroll-left 50s linear infinite",
                    }}
                  >
                    {renderCards(1, "bot-a")}
                    {renderCards(1, "bot-b")}
                  </div>
                </div>
              </>
            );
          })()}
        </motion.div>

        {/* Video with logo-shaped mask that grows */}
        <motion.div
          className="absolute inset-0"
          style={{
            maskImage: "url('/Executive Ai Solutions Logo.svg')",
            maskPosition: "center",
            maskRepeat: "no-repeat",
            maskSize: maskSizePercent,
            WebkitMaskImage: "url('/Executive Ai Solutions Logo.svg')",
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: maskSizePercent,
          }}
        >
          <video
            ref={videoRef2}
            autoPlay
            muted
            loop
            playsInline
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          >
            <source src="/final-comp.mp4?v=2" type="video/mp4" />
          </video>
        </motion.div>


        {/* Initial state - just scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
          style={{ opacity: initialContentOpacity }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-white/50 text-[10px] uppercase tracking-[0.3em]">
              Scroll
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </motion.div>


      </div>
    </section>
  );
}
