"use client";

import { motion, useScroll, useTransform, useMotionTemplate, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  // Responsive initial mask size - larger on mobile
  const [initialMaskSize, setInitialMaskSize] = useState(20);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateResponsive = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Use larger initial size on mobile for better visibility
      setInitialMaskSize(mobile ? 40 : 20);
    };

    updateResponsive();
    window.addEventListener("resize", updateResponsive);
    return () => window.removeEventListener("resize", updateResponsive);
  }, []);

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

  // Logo mask scale: starts small, grows to reveal full video
  const maskSizeRaw = useTransform(scrollYProgress, [0, 0.5], [initialMaskSize, 5000]);
  const maskSize = useSpring(maskSizeRaw, { stiffness: 100, damping: 30, mass: 0.5 });
  const maskSizePercent = useMotionTemplate`${maskSize}%`;

  // Initial content fades out quickly
  const initialContentOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Background opacity - becomes transparent when video is fully zoomed, then fades back to black
  const bgOpacity = useTransform(scrollYProgress, [0.3, 0.45, 0.75, 0.95], [1, 0, 0, 1]);

  // Video fades out towards the end - start later for cleaner transition
  const videoOpacity = useTransform(scrollYProgress, [0.75, 0.95], [1, 0]);

  // Marquee setup - use thumbnails for faster loading (700px for 350px display)
  const projectImages = [
    "/thumbnails/Celestial Laptop Mockup.webp",
    "/thumbnails/Celestial iPhone Mockup.webp",
    "/thumbnails/Elegant Black Laptop Mockup.webp",
    "/thumbnails/Rubber iPhone Mockup.webp",
  ];

  // Responsive marquee: fewer cards on mobile (4 vs 8)
  const cardWidth = isMobile ? 280 : 350;
  const gapWidth = isMobile ? 16 : 32;
  const cardCount = isMobile ? 4 : 8;
  const setWidth = cardCount * cardWidth + (cardCount - 1) * gapWidth;
  const translateDistance = setWidth + gapWidth;

  const renderCards = (offset: number, keyPrefix: string) =>
    [...Array(cardCount)].map((_, i) => (
      <div
        key={`${keyPrefix}-${i}`}
        className={`${isMobile ? "w-[280px] h-[175px]" : "w-[350px] h-[220px]"} rounded-lg overflow-hidden shrink-0`}
        style={{
          boxShadow: "0 0 40px rgba(255,250,240,0.1)",
        }}
      >
        <img
          src={projectImages[(i + offset) % projectImages.length]}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-top"
        />
      </div>
    ));

  return (
    <section
      ref={sectionRef}
      className="relative h-[200vh] bg-black"
    >
      {/* Sticky container that stays while scrolling through the section */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Video layer - sits behind everything */}
        <motion.div className="absolute inset-0" style={{ opacity: videoOpacity }}>
          <video
            ref={videoRef1}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/video-poster.webp"
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          >
            <source src="/final-comp.mp4?v=6" type="video/mp4" />
          </video>
        </motion.div>

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

          {/* Top row - hidden on mobile */}
          {!isMobile && (
            <div className="absolute top-[5%] flex overflow-hidden w-full">
              <div
                className="flex gap-8 whitespace-nowrap will-change-transform opacity-20"
                style={{
                  animationName: "marquee-scroll-left",
                  animationDuration: "40s",
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                }}
              >
                {renderCards(0, "top-a")}
                {renderCards(0, "top-b")}
              </div>
            </div>
          )}

          {/* Middle row - centered on mobile */}
          <div className={`absolute ${isMobile ? "top-[40%]" : "top-[35%]"} flex overflow-hidden w-full`}>
            <div
              className={`flex ${isMobile ? "gap-4" : "gap-8"} whitespace-nowrap will-change-transform opacity-20`}
              style={{
                animationName: "marquee-scroll-right",
                animationDuration: isMobile ? "25s" : "45s",
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
              }}
            >
              {renderCards(2, "mid-a")}
              {renderCards(2, "mid-b")}
            </div>
          </div>

          {/* Bottom row - hidden on mobile */}
          {!isMobile && (
            <div className="absolute top-[65%] flex overflow-hidden w-full">
              <div
                className="flex gap-8 whitespace-nowrap will-change-transform opacity-20"
                style={{
                  animationName: "marquee-scroll-left",
                  animationDuration: "50s",
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                }}
              >
                {renderCards(1, "bot-a")}
                {renderCards(1, "bot-b")}
              </div>
            </div>
          )}
        </motion.div>

        {/* Video with logo-shaped mask that grows */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: videoOpacity,
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
            preload="auto"
            poster="/video-poster.webp"
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          >
            <source src="/final-comp.mp4?v=6" type="video/mp4" />
          </video>
        </motion.div>

        {/* Scroll indicator */}
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
