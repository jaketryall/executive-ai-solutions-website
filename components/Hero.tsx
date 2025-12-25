"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Work items for bottom row
export const workItems = [
  {
    title: "Desert Wings",
    category: "Aviation",
    description: "A modern, conversion-focused website for Arizona's premier flight training academy.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
    url: "https://desert-wings-nextjs.vercel.app/",
    results: "3x increase in student inquiries",
  },
  {
    title: "Meridian",
    category: "Consulting",
    description: "Professional consulting firm website emphasizing trust, expertise, and measurable outcomes.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    url: "#",
    results: "40% improvement in lead quality",
  },
  {
    title: "Apex Interiors",
    category: "Design",
    description: "Elegant portfolio showcasing luxury residential and commercial interior design projects.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80",
    url: "#",
    results: "Featured in Design Weekly",
  },
  {
    title: "Northside",
    category: "Healthcare",
    description: "Modern healthcare platform focused on patient experience and accessibility.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
    url: "#",
    results: "50% faster appointment booking",
  },
];

// Work thumbnail component
function WorkThumbnail({
  item,
  index,
  onHover,
  onLeave,
  isHovered,
}: {
  item: (typeof workItems)[0];
  index: number;
  onHover: () => void;
  onLeave: () => void;
  isHovered: boolean;
}) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      data-cursor="View Project"
    >
      <Link
        href={item.url}
        target={item.url.startsWith("http") ? "_blank" : undefined}
        rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block"
      >
        <div className="relative w-[160px] h-[100px] md:w-[200px] md:h-[125px] rounded-xl overflow-hidden bg-zinc-900 shadow-2xl shadow-black/60">
          {/* Image */}
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-[#2563eb]/90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white text-sm font-medium">View →</span>
          </motion.div>

          {/* Title at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-xs md:text-sm font-medium text-white">{item.title}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredWork, setHoveredWork] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms for different elements
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const subheadlineY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const ctaY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const thumbnailsY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const faviconY = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const faviconScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col bg-[#0a0a0a] overflow-hidden cursor-none"
    >
      {/* Fluid Gradient Background with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-[#0a0a0a]" />

        {/* Animated gradient blob 1 - Purple/Pink */}
        <motion.div
          className="absolute w-[120%] h-[120%] opacity-50"
          style={{
            background: `conic-gradient(from 180deg at ${50 + mousePosition.x * 5}% ${50 + mousePosition.y * 5}%,
              #0a0a0a 0deg,
              #1a0a2e 45deg,
              #2d1b4e 90deg,
              #4a1942 135deg,
              #1a0a2e 180deg,
              #0a0a0a 225deg,
              #0a0a0a 360deg
            )`,
            filter: "blur(80px)",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />

        {/* Animated gradient blob 2 - Blue/Cyan */}
        <motion.div
          className="absolute w-full h-full opacity-40"
          style={{
            background: `conic-gradient(from 90deg at ${60 - mousePosition.x * 3}% ${40 + mousePosition.y * 3}%,
              transparent 0deg,
              #0a1628 60deg,
              #0066ff 120deg,
              #00a8ff 180deg,
              #0066ff 240deg,
              #0a1628 300deg,
              transparent 360deg
            )`,
            filter: "blur(100px)",
          }}
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />

        {/* Animated gradient blob 3 - Orange accent */}
        <motion.div
          className="absolute w-[80%] h-[80%] left-[10%] top-[10%] opacity-30"
          style={{
            background: `conic-gradient(from 270deg at ${45 + mousePosition.x * 4}% ${55 - mousePosition.y * 4}%,
              transparent 0deg,
              transparent 120deg,
              #1a0a0a 150deg,
              #3d1f0f 180deg,
              #ff6b35 210deg,
              #ff8c42 240deg,
              #3d1f0f 270deg,
              #1a0a0a 300deg,
              transparent 330deg,
              transparent 360deg
            )`,
            filter: "blur(90px)",
          }}
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />

        {/* Oversized Favicon with Parallax */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]"
          style={{ y: faviconY, scale: faviconScale }}
        >
          <div className="relative w-[70vw] h-[70vw] max-w-[700px] max-h-[700px]">
            <Image src="/favicon.png" alt="" fill className="object-contain" priority />
          </div>
        </motion.div>
      </motion.div>

      {/* Hovered Work Background Image */}
      <AnimatePresence>
        {hoveredWork !== null && (
          <motion.div
            key={hoveredWork}
            className="absolute inset-0 z-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={workItems[hoveredWork].image.replace('w=600', 'w=1920')}
              alt=""
              fill
              className="object-cover"
            />
            {/* Vignette overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10, 10, 10, 0.6) 100%)'
              }}
            />
            {/* Project info */}
            <motion.div
              className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-white text-2xl font-medium">{workItems[hoveredWork].title}</p>
              <p className="text-white/60 text-sm mt-1">{workItems[hoveredWork].category}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Parallax */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pt-24"
        style={{ opacity: contentOpacity }}
      >
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-500 text-xs uppercase tracking-[0.3em] mb-6"
        >
          Web Design Studio
        </motion.p>

        {/* Main Headline with Parallax */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ y: headlineY }}
          className="text-5xl md:text-7xl lg:text-8xl font-medium text-white leading-[0.95] tracking-tight mb-8 max-w-5xl"
        >
          We design websites
          <br />
          <span className="text-zinc-500">that convert</span>
        </motion.h1>

        {/* Subheadline with Parallax */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ y: subheadlineY }}
          className="text-zinc-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
        >
          Premium digital experiences for ambitious brands.
          From strategy to launch, we build sites that drive results.
        </motion.p>

        {/* CTAs with Parallax */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ y: ctaY }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="#contact"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0a0a0a] font-medium rounded-full hover:bg-zinc-100 transition-all"
          >
            <span>Start a Project</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="#work"
            className="inline-flex items-center gap-3 px-8 py-4 border border-zinc-700 text-white font-medium rounded-full hover:bg-white/5 transition-all"
          >
            <span>View Work</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Work Thumbnails at Bottom with Parallax */}
      <motion.div
        className="relative z-10 pb-8 md:pb-12"
        style={{ y: thumbnailsY, opacity: contentOpacity }}
      >
        <div className="flex justify-center items-end gap-3 md:gap-4 px-4 overflow-x-auto">
          {workItems.map((item, index) => (
            <WorkThumbnail
              key={item.title}
              item={item}
              index={index}
              onHover={() => setHoveredWork(index)}
              onLeave={() => setHoveredWork(null)}
              isHovered={hoveredWork === index}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
