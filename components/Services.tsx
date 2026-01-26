"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { TransitionLink } from "@/components/PageTransition";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Cinematic warm color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

const services = [
  {
    slug: "website-design",
    number: "01",
    title: "Design",
    subtitle: "& Development",
    description:
      "High-converting websites that turn visitors into customers. We craft digital experiences that captivate and convert.",
    image: "/Rubber iPhone Mockup.webp",
    details: [
      "Custom design tailored to your brand",
      "Responsive, mobile-first development",
      "Performance optimized for conversions",
    ],
  },
  {
    slug: "seo",
    number: "02",
    title: "SEO",
    subtitle: "& Strategy",
    description:
      "Data-driven strategies that drive organic traffic and rankings. Dominate search results and outperform your competition.",
    image: "/Celestial Laptop Mockup.webp",
    details: [
      "Comprehensive keyword research",
      "Technical SEO optimization",
      "Content strategy & link building",
    ],
  },
  {
    slug: "custom-solutions",
    number: "03",
    title: "Custom",
    subtitle: "Solutions",
    description:
      "Tailored systems and software that scale with your business. From automation to AI, we build what you need.",
    image: "/custom-dashboard-mockup.webp",
    details: [
      "Bespoke software development",
      "Seamless system integrations",
      "Scalable cloud architecture",
    ],
  },
];

interface ServiceCardProps {
  service: (typeof services)[0];
  index: number;
  isReversed: boolean;
  isLast: boolean;
}

function ServiceCard({ service, index, isReversed, isLast }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isMockup = service.image.includes("Mockup");
  const isDashboard = service.image.includes("dashboard");
  const isSEO = service.image.includes("SEO");
  const isWideImage = isDashboard || isSEO;

  // Parallax effects - more noticeable on mobile
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const numberY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  // Container parallax - subtle movement
  const imageContainerY = useTransform(scrollYProgress, [0, 1], isMobile ? [-60, 60] : [-40, 40]);
  // Inner image parallax - creates layered depth effect
  const imageInnerY = useTransform(scrollYProgress, [0, 1], isMobile ? ["8%", "-8%"] : ["5%", "-5%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  // GSAP reveal animations with responsive handling
  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const card = cardRef.current;
      const image = imageRef.current;
      const content = contentRef.current;
      const features = featuresRef.current;

      if (!card || !image || !content || !features) return;

      // Desktop: horizontal slide animations
      mm.add("(min-width: 768px)", () => {
        gsap.set(image, { opacity: 0, x: isReversed ? 60 : -60 });
        gsap.set(content, { opacity: 0, x: isReversed ? -40 : 40 });

        gsap.to(image, {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        gsap.to(content, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      });

      // Mobile: simple fade-up animations (no horizontal movement)
      mm.add("(max-width: 767px)", () => {
        // Use fromTo with immediateRender: false to avoid flash
        gsap.fromTo(
          image,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.fromTo(
          content,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Features stagger in (same for both)
      const featureItems = features.querySelectorAll(".feature-item");
      gsap.fromTo(
        featureItems,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: features,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, cardRef);

    // Refresh ScrollTrigger after a short delay to ensure proper positioning
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimeout);
      mm.revert();
      ctx.revert();
    };
  }, [isReversed]);

  return (
    <div
      ref={cardRef}
      className={`relative pt-20 md:pt-32 lg:pt-40 ${isLast ? "pb-8 md:pb-12" : "pb-20 md:pb-32 lg:pb-40"}`}
    >
      {/* Giant background number */}
      <motion.span
        className="absolute font-black text-white/[0.02] pointer-events-none select-none leading-none"
        style={{
          y: numberY,
          fontSize: "clamp(14rem, 30vw, 35rem)",
          top: "-10%",
          ...(isReversed ? { left: "-5%" } : { right: "-5%" }),
        }}
      >
        {service.number}
      </motion.span>

      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="relative">
          {/* Image - with parallax wrapper */}
          <motion.div
            className={`relative md:absolute md:top-1/2 md:-translate-y-1/2 w-full md:w-[55%] lg:w-[52%] z-10 ${
              isReversed ? "md:right-0" : "md:left-0"
            }`}
            style={{ y: imageContainerY }}
          >
            <div
              ref={imageRef}
              className={`relative overflow-hidden rounded-3xl will-change-transform ${
                isWideImage ? "aspect-[16/10]" : "aspect-[4/3] md:aspect-[5/4]"
              }`}
              style={{
                boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.6)",
              }}
            >
              {/* Background */}
              <div
                className="absolute inset-0"
                style={{
                  background: isMockup
                    ? "radial-gradient(ellipse at center, rgba(255,200,150,0.1) 0%, rgba(20,18,16,1) 60%)"
                    : "rgba(10,9,8,1)",
                }}
              />
              {/* Inner image with parallax */}
              <motion.div
                className="absolute inset-0"
                style={{ y: imageInnerY, scale: imageScale }}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className={
                    isMockup
                      ? "object-contain object-center scale-125 translate-y-[5%]"
                      : "object-cover object-center"
                  }
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </motion.div>
              {/* Subtle edge gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: isReversed
                    ? "linear-gradient(to left, transparent 0%, transparent 70%, rgba(10,9,8,0.3) 100%)"
                    : "linear-gradient(to right, transparent 0%, transparent 70%, rgba(10,9,8,0.3) 100%)",
                }}
              />
            </div>
          </motion.div>

          {/* Content - positioned on opposite side */}
          <div
            ref={contentRef}
            className={`relative z-20 md:w-[50%] lg:w-[45%] ${
              isReversed ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
            } mt-8 md:mt-0 md:py-16 lg:py-24`}
          >
            {/* Number tag */}
            <div className="flex items-center gap-4 mb-8">
              <span
                className="text-sm font-medium tracking-[0.3em]"
                style={{ color: accentColor }}
              >
                {service.number}
              </span>
              <span
                className="w-16 h-px"
                style={{ backgroundColor: accentColorMuted }}
              />
            </div>

            {/* Title */}
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.85] mb-3">
              {service.title}
            </h3>
            <p
              className="text-2xl md:text-3xl font-light mb-8"
              style={{ color: accentColorMuted }}
            >
              {service.subtitle}
            </p>

            {/* Description */}
            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-md">
              {service.description}
            </p>

            {/* Features */}
            <div ref={featuresRef} className="space-y-4 mb-12">
              {service.details.map((detail, i) => (
                <div key={i} className="feature-item flex items-center gap-4">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span className="text-white/60 text-base md:text-lg">
                    {detail}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <TransitionLink
              href={`/services/${service.slug}`}
              className="inline-flex items-center gap-4 group"
            >
              <span
                className="px-8 py-4 rounded-full border-2 transition-all duration-300 group-hover:bg-[rgba(255,200,150,0.15)] group-hover:border-[rgba(255,200,150,1)]"
                style={{ borderColor: accentColor }}
              >
                <span className="text-sm uppercase tracking-[0.2em] font-semibold text-white">
                  Explore Service
                </span>
              </span>
              <span
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:bg-[rgba(255,200,150,0.15)] group-hover:translate-x-2"
                style={{ borderColor: accentColor }}
              >
                <span style={{ color: accentColor }} className="text-xl">
                  →
                </span>
              </span>
            </TransitionLink>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile service card - clean and simple
function MobileServiceCard({ service }: { service: (typeof services)[0] }) {
  return (
    <TransitionLink href={`/services/${service.slug}`}>
      <motion.div
        className="relative rounded-2xl overflow-hidden bg-neutral-900 active:scale-[0.98] transition-transform duration-200"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className={
              service.image.includes("Mockup")
                ? "object-contain object-center scale-110"
                : "object-cover object-center"
            }
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
            }}
          />

          {/* Number badge */}
          <div className="absolute top-3 left-3">
            <span
              className="text-sm font-bold px-2.5 py-1 rounded-md"
              style={{
                color: accentColor,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
              }}
            >
              {service.number}
            </span>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-2xl font-bold text-white mb-1">
              {service.title}
              <span className="text-white/50 font-light ml-2">{service.subtitle}</span>
            </h3>
            <p className="text-white/60 text-sm line-clamp-2">
              {service.description}
            </p>
          </div>
        </div>
      </motion.div>
    </TransitionLink>
  );
}

// Mobile services section
function MobileServices() {
  return (
    <section className="md:hidden relative py-16 bg-[#080706] rounded-t-[2rem]" style={{ zIndex: 20 }}>
      {/* Header */}
      <div className="px-6 mb-8">
        <p
          className="text-xs uppercase tracking-[0.3em] mb-4"
          style={{ color: accentColorMuted }}
        >
          What We Offer
        </p>
        <h2 className="text-4xl font-black text-white tracking-tight">
          SERVICES
        </h2>
      </div>

      {/* Service cards - vertical stack */}
      <div className="px-6 space-y-4">
        {services.map((service) => (
          <MobileServiceCard key={service.slug} service={service} />
        ))}
      </div>

      {/* CTA */}
      <div className="px-6 mt-12 text-center">
        <a
          href="#contact"
          className="inline-flex items-center gap-3 text-xl font-bold text-white"
        >
          <span>Let&apos;s Talk</span>
          <span
            className="w-10 h-10 rounded-full border flex items-center justify-center"
            style={{ borderColor: accentColorMuted }}
          >
            <span style={{ color: accentColor }}>→</span>
          </span>
        </a>
      </div>
    </section>
  );
}

// Desktop Services section
function DesktopServices() {
  const sectionRef = useRef<HTMLElement>(null);

  // Section header parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-[#080706] overflow-hidden rounded-t-[3rem] hidden md:block"
      style={{ zIndex: 20, boxShadow: "0 -50px 0 0 #080706" }}
    >
      {/* Section header */}
      <div className="relative pt-32 pb-16">
        <div className="container mx-auto px-12 lg:px-16">
          <motion.div style={{ y: headerY, opacity: headerOpacity }}>
            <p
              className="text-xs uppercase tracking-[0.4em] mb-4"
              style={{ color: accentColorMuted }}
            >
              What We Offer
            </p>
            <h2 className="text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9]">
              SERVICES
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Service cards - vertical flow with alternating layouts */}
      <div className="relative">
        {services.map((service, index) => (
          <ServiceCard
            key={service.slug}
            service={service}
            index={index}
            isReversed={index % 2 === 1}
            isLast={index === services.length - 1}
          />
        ))}
      </div>

      {/* Bottom CTA section */}
      <div className="relative pt-16 pb-32">
        <div className="container mx-auto px-12 lg:px-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p
              className="text-sm uppercase tracking-[0.3em] mb-6"
              style={{ color: accentColorMuted }}
            >
              Ready to start?
            </p>
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-4 text-4xl font-bold text-white group"
              whileHover={{ x: 8 }}
            >
              <span>Let&apos;s Talk</span>
              <span
                className="w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:bg-white/10"
                style={{ borderColor: accentColorMuted }}
              >
                <span
                  style={{ color: accentColor }}
                  className="text-2xl transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <>
      <MobileServices />
      <DesktopServices />
    </>
  );
}
