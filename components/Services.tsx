"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Animated button - dark variant for light backgrounds
function AnimatedButton({
  text,
  href,
  showArrow = false,
}: {
  text: string;
  href: string;
  showArrow?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = text.split("");

  const getDelay = (index: number) => {
    const baseDelay = 0.035;
    const acceleration = 0.82;
    let delay = 0;
    for (let i = 0; i < index; i++) {
      delay += baseDelay * Math.pow(acceleration, i);
    }
    return delay;
  };

  return (
    <motion.a
      href={href}
      className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0a0a0a] text-white font-medium rounded-full hover:bg-zinc-800 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
    >
      <span className="inline-flex items-center relative">
        {characters.map((char, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden relative"
            style={{ height: "1.2em", lineHeight: "1.2em" }}
          >
            <motion.span
              className="inline-block"
              animate={{ y: isHovered ? "-110%" : "0%" }}
              transition={{
                duration: 0.3,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
            <motion.span
              className="inline-block absolute left-0 top-0"
              animate={{ y: isHovered ? "0%" : "110%" }}
              transition={{
                duration: 0.3,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </span>
      {showArrow && (
        <motion.span
          className="inline-block"
          animate={isHovered ? { x: 4 } : { x: 0 }}
          transition={{ duration: 0.25, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          →
        </motion.span>
      )}
    </motion.a>
  );
}

const services = [
  {
    number: "01",
    title: "BRAND",
    subtitle: "IDENTITY",
    description: "Crafting bold, memorable brand identities from logos to full brand guidelines that set you apart.",
    details: ["Logo design & variations", "Color palette & typography", "Brand guidelines document", "Social media assets"],
    stat: "100%",
    statLabel: "brand recognition increase",
  },
  {
    number: "02",
    title: "WEB",
    subtitle: "DESIGN",
    description: "Stunning, high-performance websites with sleek, user-friendly interfaces and responsive, fast-loading pages.",
    details: ["Custom responsive design", "Interactive animations", "Performance optimization", "SEO-ready structure"],
    stat: "3x",
    statLabel: "faster load times",
  },
  {
    number: "03",
    title: "UI/UX",
    subtitle: "DESIGN",
    description: "Seamless, intuitive digital experiences designed to enhance user engagement and drive conversions.",
    details: ["User research & personas", "Wireframing & prototyping", "Usability testing", "Design system creation"],
    stat: "40%",
    statLabel: "conversion boost",
  },
];

function ServiceSlide({
  service,
  index,
  isActive,
}: {
  service: typeof services[0];
  index: number;
  isActive: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background number watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="text-[35vw] font-black leading-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(0, 0, 0, 0.06)',
          }}
        >
          {service.number}
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - Big typography */}
          <div className="relative">
            {/* Service number with line */}
            <motion.div
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-sm font-mono text-[#2563eb]">{service.number}</span>
              <div className="w-12 h-px bg-[#2563eb]" />
            </motion.div>

            {/* Main title */}
            <div className="overflow-hidden">
              <motion.h2
                className="text-[18vw] md:text-[14vw] lg:text-[10vw] font-black text-[#0a0a0a] leading-[0.85] tracking-tighter"
                initial={{ y: "100%" }}
                animate={{ y: isActive ? 0 : "100%" }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {service.title}
              </motion.h2>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                className="text-[18vw] md:text-[14vw] lg:text-[10vw] font-black leading-[0.85] tracking-tighter"
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
              className="mt-8 h-px w-32 bg-gradient-to-r from-[#2563eb] to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isActive ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          {/* Right side - Details */}
          <div className="lg:pl-8">
            {/* Description */}
            <motion.p
              className="text-xl md:text-2xl text-zinc-600 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {service.description}
            </motion.p>

            {/* Details list */}
            <motion.div
              className="space-y-4 mb-12"
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
                  <span className="text-base md:text-lg text-zinc-700 group-hover:text-[#0a0a0a] transition-colors">
                    {detail}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Stat card */}
            <motion.div
              className="inline-block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div
                className="relative px-8 py-6 rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-sm cursor-pointer overflow-hidden"
                animate={{
                  borderColor: isHovered ? "#2563eb" : "rgb(228, 228, 231)",
                  boxShadow: isHovered ? "0 20px 40px -20px rgba(37, 99, 235, 0.3)" : "0 0 0 0 transparent"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#2563eb]/5 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative">
                  <span className="text-5xl md:text-6xl font-black text-[#2563eb]">
                    {service.stat}
                  </span>
                  <p className="text-sm text-zinc-500 mt-2 uppercase tracking-wider">
                    {service.statLabel}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Calculate which service should be active based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const newIndex = Math.min(
        Math.floor(progress * services.length),
        services.length - 1
      );
      if (newIndex >= 0 && newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, activeIndex]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-[#fafafa] rounded-t-[2rem] -mt-8"
      style={{ height: `${services.length * 100}vh` }}
    >
      {/* Sticky container for full-screen slides */}
      <div className="sticky top-0 h-screen">
        {/* Background with rounded corners */}
        <div className="absolute inset-0 bg-[#fafafa] rounded-t-[2rem] overflow-hidden">
          {/* Subtle background pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #0a0a0a 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        {/* Header badge */}
        <motion.div
          className="absolute top-8 left-6 md:left-12 z-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-zinc-300" />
            <span className="text-xs text-zinc-400 uppercase tracking-[0.2em]">
              What We Offer
            </span>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-12 z-20 flex flex-col gap-4">
          {services.map((service, index) => (
            <motion.button
              key={index}
              className="group relative flex items-center gap-3"
              onClick={() => {
                const element = sectionRef.current;
                if (element) {
                  const sectionTop = element.offsetTop;
                  const sectionHeight = element.offsetHeight;
                  const targetScroll = sectionTop + (index / services.length) * sectionHeight + 100;
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }
              }}
            >
              {/* Label on hover */}
              <motion.span
                className="absolute right-full mr-4 text-sm text-zinc-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {service.title} {service.subtitle}
              </motion.span>

              {/* Dot */}
              <motion.div
                className="w-3 h-3 rounded-full border-2 transition-colors"
                animate={{
                  borderColor: index === activeIndex ? "#2563eb" : "rgb(212, 212, 216)",
                  backgroundColor: index === activeIndex ? "#2563eb" : "transparent",
                  scale: index === activeIndex ? 1.2 : 1
                }}
                whileHover={{ scale: 1.3 }}
                transition={{ duration: 0.2 }}
              />
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
              />
            )
          ))}
        </AnimatePresence>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: activeIndex < services.length - 1 ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-xs text-zinc-400 uppercase tracking-widest">Scroll</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-[#2563eb] to-transparent"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Pricing CTA - appears on last slide */}
        <motion.div
          className="absolute bottom-8 left-6 right-6 md:left-12 md:right-12 z-30"
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: activeIndex === services.length - 1 ? 1 : 0,
            y: activeIndex === services.length - 1 ? 0 : 40
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="p-6 md:p-8 bg-white rounded-2xl border border-zinc-200 shadow-xl shadow-zinc-200/50"
              whileHover={{ borderColor: "rgba(37, 99, 235, 0.3)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-[#0a0a0a] mb-2">
                    Transparent Pricing
                  </h3>
                  <p className="text-zinc-500 text-sm md:text-base">
                    Landing pages from $500. Multi-page websites from $2,000.
                    Every project includes revisions and 30 days of support.
                  </p>
                </div>
                <AnimatedButton href="#contact" text="Get a Quote" showArrow />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
