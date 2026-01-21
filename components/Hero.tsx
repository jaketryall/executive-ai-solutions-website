"use client";

import { motion, useScroll, useTransform, useMotionTemplate, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);

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

  // Showreel UI fades in as video expands
  const showreelOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);

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
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/temp_video_335177785007935488.MP4" type="video/mp4" />
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
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/temp_video_335177785007935488.MP4" type="video/mp4" />
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

        {/* Showreel UI - appears when video fills screen */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ opacity: showreelOpacity }}
        >
          {/* Top left */}
          <div className="absolute top-8 left-8">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em]">
              Showreel 2024
            </p>
          </div>

          {/* Top right */}
          <div className="absolute top-8 right-8">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em]">
              01 / 04
            </p>
          </div>

          {/* Bottom left - big text */}
          <div className="absolute bottom-8 left-8">
            <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] mb-2">
              Now Playing
            </p>
            <h2 className="text-white text-2xl md:text-4xl font-black tracking-[-0.02em]">
              DESERT WINGS
            </h2>
            <p className="text-white/50 text-sm mt-1">
              Aviation · Brand Identity
            </p>
          </div>

          {/* Bottom right */}
          <div className="absolute bottom-8 right-8 text-right">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em]">
              Sound On
            </p>
          </div>

          {/* Center play indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center"
              whileHover={{ scale: 1.1, borderColor: "rgba(255,255,255,0.5)" }}
            >
              <div className="w-0 h-0 border-l-[12px] border-l-white/60 border-y-[8px] border-y-transparent ml-1" />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
