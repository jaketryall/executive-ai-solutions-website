"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { TransitionLink } from "@/components/PageTransition";
import { useSound } from "./SoundManager";

// Cinematic warm color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

const services = [
  {
    slug: "website-design",
    number: "01",
    title: "DESIGN",
    subtitle: "& Development",
    description: "High-converting websites that turn visitors into customers.",
    image: "/Rubber iPhone Mockup.png",
    size: "large", // Takes up 2 rows
  },
  {
    slug: "seo",
    number: "02",
    title: "SEO",
    subtitle: "& Strategy",
    description: "Data-driven strategies that drive organic traffic and rankings.",
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=1200&q=80",
    size: "medium",
  },
  {
    slug: "custom-solutions",
    number: "03",
    title: "CUSTOM",
    subtitle: "Solutions",
    description: "Tailored CRM systems that scale with your business.",
    image: "/custom-dashboard-mockup.png",
    size: "medium",
  },
];

// Bento card with parallax
function BentoCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { play } = useSound();

  // Parallax based on scroll position
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Different parallax speeds for depth effect - each card moves at different rate
  const cardY = useTransform(scrollYProgress, [0, 1], [40 + index * 15, -40 - index * 15]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-25, 25]);

  // Grid placement classes
  const gridClasses =
    service.size === "large"
      ? "md:col-span-1 md:row-span-2"
      : "md:col-span-1 md:row-span-1";

  const heightClass = service.size === "large" ? "h-[500px] md:h-full" : "h-[300px] md:h-full";

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${gridClasses}`}
      style={{ y: cardY }}
    >
      <motion.div
        className={`relative ${heightClass} rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer`}
        onMouseEnter={() => {
          setIsHovered(true);
          play("hover", { volume: 0.05 });
        }}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <TransitionLink href={`/services/${service.slug}`} className="block h-full">
          {/* Image with parallax */}
          <motion.div
            className={
              service.image.includes("Mockup")
                ? "absolute -inset-[50%]"
                : service.image.includes("dashboard")
                  ? "absolute inset-0"
                  : "absolute -inset-[15%]"
            }
            style={{ y: imageY }}
          >
            <div
              className="absolute inset-0 transition-transform duration-700"
              style={{
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className={
                  service.image.includes("Mockup")
                    ? "object-contain object-center"
                    : service.image.includes("dashboard")
                      ? "object-cover object-top"
                      : "object-cover"
                }
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          </motion.div>

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)`,
              opacity: isHovered ? 0.6 : 1,
            }}
          />

          {/* Warm accent overlay on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.12 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ backgroundColor: accentColor }}
          />

          {/* Border glow on hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              boxShadow: `inset 0 0 0 1px ${accentColorMuted}`,
            }}
          />

          {/* Number - positioned based on size */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8">
            <span
              className={`font-black leading-none ${
                service.size === "large" ? "text-7xl md:text-9xl" : "text-5xl md:text-7xl"
              }`}
              style={{
                WebkitTextStroke: `1px ${accentColorMuted}`,
                WebkitTextFillColor: "transparent",
              }}
            >
              {service.number}
            </span>
          </div>

          {/* Content - bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            {/* Title */}
            <motion.h3
              className={`font-black text-white tracking-[-0.04em] leading-[0.9] mb-1 ${
                service.size === "large"
                  ? "text-4xl md:text-6xl lg:text-7xl"
                  : "text-3xl md:text-4xl lg:text-5xl"
              }`}
              animate={{ y: isHovered ? -6 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {service.title}
            </motion.h3>
            <motion.p
              className="text-lg md:text-xl text-white/60 font-light tracking-wide mb-3"
              animate={{ y: isHovered ? -4 : 0, opacity: isHovered ? 1 : 0.6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {service.subtitle}
            </motion.p>

            {/* Description - appears on hover */}
            <motion.p
              className="text-white/50 text-sm md:text-base max-w-xs"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {service.description}
            </motion.p>

            {/* View indicator */}
            <motion.div
              className="flex items-center gap-2 mt-4"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -16 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-xs uppercase tracking-widest" style={{ color: accentColor }}>
                Explore
              </span>
              <motion.span
                className="text-base"
                style={{ color: accentColor }}
                animate={{ x: isHovered ? 4 : 0 }}
              >
                →
              </motion.span>
            </motion.div>
          </div>

          {/* Corner accent - top right */}
          <div className="absolute top-6 right-6 md:top-8 md:right-8">
            <motion.div
              className="w-8 md:w-10 h-px origin-right"
              style={{ backgroundColor: accentColor }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              className="w-px h-8 md:h-10 origin-top ml-auto"
              style={{ backgroundColor: accentColor }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isHovered ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
          </div>
        </TransitionLink>
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  // Section title animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.3"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-black py-24 md:py-32 lg:py-40 rounded-t-3xl md:rounded-t-[3rem] md:-mt-[100vh]"
      style={{
        zIndex: 20,
        background: "linear-gradient(180deg, #0a0908 0%, #0d0b09 50%, #0a0908 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 20% 30%, rgba(255, 200, 150, 0.03) 0%, transparent 60%)`,
        }}
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative">
        {/* Section header */}
        <motion.div
          className="mb-16 md:mb-24"
          style={{ y: titleY, opacity: titleOpacity }}
        >
          <p
            className="text-xs uppercase tracking-[0.4em] mb-4"
            style={{ color: accentColorMuted }}
          >
            What We Offer
          </p>
          <h2 className="text-[12vw] md:text-[8vw] lg:text-[6vw] font-black text-white leading-[0.9] tracking-[-0.04em]">
            SERVICES
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 md:grid-rows-2 md:h-[700px] lg:h-[800px]">
          {services.map((service, index) => (
            <BentoCard key={service.slug} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 md:mt-24 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p
            className="text-sm uppercase tracking-[0.3em] mb-6"
            style={{ color: accentColorMuted }}
          >
            Ready to start?
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-4 text-2xl md:text-3xl font-bold text-white group"
            whileHover={{ x: 8 }}
          >
            <span>Let's Talk</span>
            <span
              className="relative w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:bg-white/10"
              style={{ borderColor: accentColorMuted }}
            >
              <motion.span
                style={{ color: accentColor }}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </motion.span>
            </span>
          </motion.a>
        </motion.div>
      </div>

    </section>
  );
}
