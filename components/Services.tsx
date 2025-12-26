"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";

const services = [
  {
    number: "01",
    title: "BRAND",
    subtitle: "IDENTITY",
    description: "Crafting bold, memorable brand identities from logos to full brand guidelines that set you apart.",
    details: [
      "Logo design & variations",
      "Color palette & typography",
      "Brand guidelines document",
      "Social media assets",
    ],
    stat: "100%",
    statLabel: "brand recognition increase",
  },
  {
    number: "02",
    title: "WEB",
    subtitle: "DESIGN",
    description: "Stunning, high-performance websites with sleek, user-friendly interfaces and responsive, fast-loading pages.",
    details: [
      "Custom responsive design",
      "Interactive animations",
      "Performance optimization",
      "SEO-ready structure",
    ],
    stat: "3x",
    statLabel: "faster load times",
  },
  {
    number: "03",
    title: "UI/UX",
    subtitle: "DESIGN",
    description: "Seamless, intuitive digital experiences designed to enhance user engagement and drive conversions.",
    details: [
      "User research & personas",
      "Wireframing & prototyping",
      "Usability testing",
      "Design system creation",
    ],
    stat: "40%",
    statLabel: "conversion boost",
  },
];

function ServiceSlide({
  service,
  index,
  isActive,
  progress
}: {
  service: typeof services[0];
  index: number;
  isActive: boolean;
  progress: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background number */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ opacity: 0.03 }}
      >
        <span className="text-[40vw] font-black text-white leading-none">
          {service.number}
        </span>
      </motion.div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(37, 99, 235, 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[90vw] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Big typography */}
          <div className="relative">
            {/* Service number */}
            <motion.div
              className="absolute -left-4 md:-left-16 top-0 flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-sm md:text-base font-mono text-[#2563eb]">{service.number}</span>
              <div className="w-8 md:w-16 h-px bg-[#2563eb]" />
            </motion.div>

            {/* Main title */}
            <div className="overflow-hidden">
              <motion.h2
                className="text-[15vw] md:text-[12vw] lg:text-[10vw] font-black text-white leading-[0.85] tracking-tighter"
                initial={{ y: "100%" }}
                animate={{ y: isActive ? 0 : "100%" }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {service.title}
              </motion.h2>
            </div>
            <div className="overflow-hidden -mt-2 md:-mt-4">
              <motion.h2
                className="text-[15vw] md:text-[12vw] lg:text-[10vw] font-black leading-[0.85] tracking-tighter"
                style={{
                  WebkitTextStroke: '2px #2563eb',
                  WebkitTextFillColor: 'transparent'
                }}
                initial={{ y: "100%" }}
                animate={{ y: isActive ? 0 : "100%" }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {service.subtitle}
              </motion.h2>
            </div>

            {/* Decorative line */}
            <motion.div
              className="mt-8 h-px bg-gradient-to-r from-[#2563eb] to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isActive ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          {/* Right side - Details and stat */}
          <div className="lg:pl-8">
            {/* Description */}
            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-zinc-400 mb-8 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {service.description}
            </motion.p>

            {/* Details list */}
            <motion.div
              className="space-y-3 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {service.details.map((detail, i) => (
                <motion.div
                  key={detail}
                  className="flex items-center gap-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#2563eb] group-hover:scale-150 transition-transform" />
                  <span className="text-sm md:text-base text-zinc-300 group-hover:text-white transition-colors">
                    {detail}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Stat card */}
            <motion.div
              className="relative inline-block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div
                className="relative px-8 py-6 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer"
                animate={{
                  borderColor: isHovered ? "#2563eb" : "rgb(39, 39, 42)"
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-[#2563eb]/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-black text-[#2563eb]">
                    {service.stat}
                  </span>
                  <p className="text-sm text-zinc-400 mt-2 uppercase tracking-wider">
                    {service.statLabel}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive && index < services.length - 1 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-xs text-zinc-500 uppercase tracking-widest">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-[#2563eb] to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Calculate which service should be active based on scroll
  const handleScroll = () => {
    const progress = scrollYProgress.get();
    const newIndex = Math.min(
      Math.floor(progress * services.length),
      services.length - 1
    );
    if (newIndex !== activeIndex && newIndex >= 0) {
      setActiveIndex(newIndex);
    }
  };

  // Subscribe to scroll progress changes
  scrollYProgress.on("change", handleScroll);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-[#0a0a0a]"
      style={{ height: `${services.length * 100}vh` }}
    >
      {/* Section header - fixed while scrolling through services */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Header badge */}
        <motion.div
          className="absolute top-8 left-6 md:left-12 z-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs md:text-sm text-zinc-500 uppercase tracking-[0.2em]">
            What We Offer
          </span>
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-12 z-20 flex flex-col gap-3">
          {services.map((_, index) => (
            <motion.button
              key={index}
              className="relative w-3 h-3 rounded-full border border-zinc-700 transition-colors"
              animate={{
                borderColor: index === activeIndex ? "#2563eb" : "rgb(63, 63, 70)",
                backgroundColor: index === activeIndex ? "#2563eb" : "transparent"
              }}
              onClick={() => {
                const element = sectionRef.current;
                if (element) {
                  const sectionTop = element.offsetTop;
                  const sectionHeight = element.offsetHeight;
                  const targetScroll = sectionTop + (index / services.length) * sectionHeight;
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }
              }}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
            >
              {index === activeIndex && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#2563eb]"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Service slides */}
        <AnimatePresence mode="wait">
          {services.map((service, index) => (
            index === activeIndex && (
              <ServiceSlide
                key={service.title}
                service={service}
                index={index}
                isActive={index === activeIndex}
                progress={scrollYProgress.get()}
              />
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Pricing CTA - appears after services */}
      <motion.div
        className="sticky bottom-0 left-0 right-0 z-30 pointer-events-none"
        initial={{ opacity: 0, y: 100 }}
        animate={{
          opacity: activeIndex === services.length - 1 ? 1 : 0,
          y: activeIndex === services.length - 1 ? 0 : 100
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8">
          <motion.div
            className="p-6 md:p-8 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl pointer-events-auto"
            whileHover={{ borderColor: "rgba(37, 99, 235, 0.3)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                  Transparent Pricing
                </h3>
                <p className="text-zinc-400 text-sm md:text-base">
                  Landing pages from $500. Multi-page websites from $2,000.
                  Every project includes revisions and 30 days of support.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-[#2563eb] text-white font-medium rounded-full hover:bg-[#1d4ed8] transition-colors shrink-0 group"
                >
                  <span>Get a Quote</span>
                  <motion.span
                    className="inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
