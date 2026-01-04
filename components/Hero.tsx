"use client";

import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Logo mask scale: starts small, grows to reveal full video
  const maskSize = useTransform(scrollYProgress, [0, 0.4], [25, 250]);
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
      {/* Fixed container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

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

        {/* Moving work images behind logo */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ opacity: initialContentOpacity }}
        >
          {/* Top row - moves left */}
          <motion.div
            className="absolute top-[5%] flex gap-8 whitespace-nowrap"
            animate={{ x: [0, -1200] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-[350px] h-[220px] rounded-lg overflow-hidden opacity-20 flex-shrink-0"
              >
                <img
                  src={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1436491865332-7a61a109cc05' : '1497366216548-37526070297c'}?w=600&q=60`}
                  alt=""
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            ))}
          </motion.div>

          {/* Middle row - moves right */}
          <motion.div
            className="absolute top-[35%] flex gap-8 whitespace-nowrap"
            animate={{ x: [-800, 400] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-[350px] h-[220px] rounded-lg overflow-hidden opacity-20 flex-shrink-0"
              >
                <img
                  src={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1618221195710-dd6b41faaea6' : '1460925895917-afdab827c52f'}?w=600&q=60`}
                  alt=""
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            ))}
          </motion.div>

          {/* Bottom row - moves left slower */}
          <motion.div
            className="absolute top-[65%] flex gap-8 whitespace-nowrap"
            animate={{ x: [0, -1500] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-[350px] h-[220px] rounded-lg overflow-hidden opacity-20 flex-shrink-0"
              >
                <img
                  src={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1497366216548-37526070297c' : '1436491865332-7a61a109cc05'}?w=600&q=60`}
                  alt=""
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            ))}
          </motion.div>
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
