"use client";

import { motion, useScroll, useTransform, useMotionTemplate, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import AnimatedLogo from "./AnimatedLogo";
import { TransitionLink } from "./PageTransition";

// Work items for mobile hero showcase
const mobileWorkItems = [
  { title: "DESERT WINGS", category: "Flight School", image: "/thumbnails/Celestial Laptop Mockup.webp", slug: "desert-wings" },
  { title: "RILED UP", category: "Coaching", image: "/thumbnails/Celestial iPhone Mockup.webp", slug: "riled-up" },
  { title: "WINGS N WHEELS", category: "Detailing", image: "/thumbnails/Rubber iPhone Mockup.webp", slug: "wings-n-wheels" },
  { title: "ADVENTURE AIR", category: "Tours", image: "/thumbnails/Elegant Black Laptop Mockup.webp", slug: "adventure-air" },
];

// Mobile Hero - Video-forward with work showcase
function MobileHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  // Ensure intro animations complete before allowing fade-out
  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroComplete(true);
    }, 3500); // Wait for logo draw + text animations
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => {
      // Only mark ready if video is actually playing (has current time > 0)
      // This prevents black frame flash
      if (video.currentTime > 0 || video.readyState >= 4) {
        setVideoReady(true);
      }
    };

    // Check if video is already playing (cached)
    if (video.currentTime > 0 && video.readyState >= 3) {
      setVideoReady(true);
      return;
    }

    // Listen for playing event - most reliable for "video has a frame"
    video.addEventListener("playing", handleReady);
    video.addEventListener("timeupdate", handleReady, { once: true });

    return () => {
      video.removeEventListener("playing", handleReady);
      video.removeEventListener("timeupdate", handleReady);
    };
  }, []);

  // Only fade out content when BOTH video is playing AND intro is complete
  const shouldFadeOut = videoReady && introComplete;

  return (
    <section className="relative h-screen bg-[#141312] md:hidden overflow-hidden">
      {/* Poster image - shows immediately */}
      <div className="absolute inset-0">
        <img
          src="/video-poster.webp"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#141312]/60" />
      </div>

      {/* Video - fades in when loaded AND intro complete */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: shouldFadeOut ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/final-comp.mp4?v=6" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#141312]/50" />
      </motion.div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col">
        {/* Main content - centered, fades out when intro complete AND video loaded */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center px-6 pt-20"
          initial={{ opacity: 1 }}
          animate={{ opacity: shouldFadeOut ? 0 : 1 }}
          transition={{ duration: 0.8, delay: shouldFadeOut ? 0.5 : 0 }}
        >
          {/* Logo with draw animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatedLogo
              width={200}
              height={120}
              drawDuration={2}
              delay={0.5}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="mt-6 text-[#f5f0e8]/80 text-center text-sm font-light tracking-[0.2em] uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.8 }}
          >
            Premium AI Solutions
          </motion.p>

          {/* Subtext */}
          <motion.p
            className="mt-4 text-[#f5f0e8]/50 text-center text-xs max-w-[280px] leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 3.0 }}
          >
            Transforming businesses with cutting-edge artificial intelligence
          </motion.p>
        </motion.div>

        {/* Bottom work showcase - auto-scrolling marquee, stays visible */}
        <motion.div
          className="pb-8 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 3.2 }}
        >
          <style>{`
            @keyframes work-marquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
          `}</style>

          {/* Label */}
          <div className="px-6 mb-3">
            <span className="text-[#f5f0e8]/40 text-[10px] uppercase tracking-[0.2em]">
              Our Work
            </span>
          </div>

          {/* Marquee container */}
          <div
            className="flex gap-6"
            style={{
              animation: "work-marquee 25s linear infinite",
              width: "fit-content",
            }}
          >
            {/* First set */}
            {mobileWorkItems.map((item) => (
              <TransitionLink
                key={`a-${item.slug}`}
                href={`/work/${item.slug}`}
                className="shrink-0 flex items-center gap-4 active:scale-[0.98] transition-transform"
              >
                <div className="w-28 h-20 rounded-lg overflow-hidden bg-[#f5f0e8]/10">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#f5f0e8] text-sm font-medium tracking-wide">
                    {item.title}
                  </span>
                  <span className="text-[#f5f0e8]/50 text-xs uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </TransitionLink>
            ))}
            {/* Duplicate set for seamless loop */}
            {mobileWorkItems.map((item) => (
              <TransitionLink
                key={`b-${item.slug}`}
                href={`/work/${item.slug}`}
                className="shrink-0 flex items-center gap-4 active:scale-[0.98] transition-transform"
              >
                <div className="w-28 h-20 rounded-lg overflow-hidden bg-[#f5f0e8]/10">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#f5f0e8] text-sm font-medium tracking-wide">
                    {item.title}
                  </span>
                  <span className="text-[#f5f0e8]/50 text-xs uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </TransitionLink>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Desktop Hero
function DesktopHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  const initialMaskSize = 20;

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

  // Fixed desktop values for animation (CSS handles responsive sizing)
  const desktopCardWidth = 350;
  const desktopGapWidth = 32;
  const cardCount = 8; // Always render 8 for seamless loop
  const setWidth = cardCount * desktopCardWidth + (cardCount - 1) * desktopGapWidth;
  const translateDistance = setWidth + desktopGapWidth;

  const renderCards = (offset: number, keyPrefix: string) =>
    [...Array(cardCount)].map((_, i) => (
      <div
        key={`${keyPrefix}-${i}`}
        className="w-[280px] h-[175px] md:w-[350px] md:h-[220px] rounded-lg overflow-hidden shrink-0"
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
      className="relative h-[200vh] bg-black hidden md:block"
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

          {/* Top row - hidden on mobile via CSS */}
          <div className="absolute top-[5%] hidden md:flex overflow-hidden w-full">
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

          {/* Middle row - centered on mobile */}
          <div className="absolute top-[40%] md:top-[35%] flex overflow-hidden w-full">
            <div
              className="flex gap-4 md:gap-8 whitespace-nowrap will-change-transform opacity-20"
              style={{
                animationName: "marquee-scroll-right",
                animationDuration: "45s",
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
              }}
            >
              {renderCards(2, "mid-a")}
              {renderCards(2, "mid-b")}
            </div>
          </div>

          {/* Bottom row - hidden on mobile via CSS */}
          <div className="absolute top-[65%] hidden md:flex overflow-hidden w-full">
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

// Main Hero export - renders mobile or desktop version
export default function Hero() {
  return (
    <>
      <MobileHero />
      <DesktopHero />
    </>
  );
}
