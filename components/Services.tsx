"use client";

import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TransitionLink } from "@/components/PageTransition";
import { SplitText, useSplitTextReveal } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const accentColor = "rgba(229, 225, 219, 1)";
const accentColorMuted = "rgba(229, 225, 219, 0.6)";
const textColor = "#f5f0e8";
const textMuted = "rgba(245, 240, 232, 0.5)";
const borderColor = "rgba(229, 225, 219, 0.15)";

const services = [
  {
    slug: "website-design",
    number: "01",
    title: "Design & Development",
    description:
      "High-converting websites that turn visitors into customers. We craft digital experiences that captivate and convert.",
    details: [
      "Custom design tailored to your brand",
      "Responsive, mobile-first development",
      "Performance optimized for conversions",
    ],
    image: "/Rubber iPhone Mockup.webp",
  },
  {
    slug: "seo",
    number: "02",
    title: "SEO & Strategy",
    description:
      "Data-driven strategies that drive organic traffic and rankings. Dominate search results and outperform your competition.",
    details: [
      "Comprehensive keyword research",
      "Technical SEO optimization",
      "Content strategy & link building",
    ],
    image: "/Celestial Laptop Mockup.webp",
  },
  {
    slug: "custom-solutions",
    number: "03",
    title: "Custom Solutions",
    description:
      "Tailored systems and software that scale with your business. From automation to AI, we build what you need.",
    details: [
      "Bespoke software development",
      "Seamless system integrations",
      "Scalable cloud architecture",
    ],
    image: "/custom-dashboard-mockup.webp",
  },
];

/* ─────────────── Cursor-following info box ─────────────── */

function CursorInfo({
  title,
  description,
  isVisible,
}: {
  title: string;
  description: string;
  isVisible: boolean;
}) {
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);

  const springConfig = { stiffness: 400, damping: 40, mass: 0.3 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX + 16);
      mouseY.set(e.clientY + 16);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            x,
            y,
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 260,
              padding: "1.25rem 1.5rem",
              borderRadius: 16,
              background: "rgba(20, 18, 16, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(229, 225, 219, 0.15)",
              boxShadow: "0 8px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: accentColor,
                marginBottom: "0.5rem",
              }}
            >
              {title}
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.8rem",
                lineHeight: 1.5,
                color: "rgba(255,255,255,0.5)",
                margin: 0,
              }}
            >
              {description}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────── Desktop Service Row ─────────────── */

function DesktopServiceRow({
  service,
  index,
  isOpen,
  isHovered,
  onToggle,
  onHoverStart,
  onHoverEnd,
}: {
  service: (typeof services)[0];
  index: number;
  isOpen: boolean;
  isHovered: boolean;
  onToggle: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const row = rowRef.current;
    const divider = dividerRef.current;
    const number = numberRef.current;
    const title = titleRef.current;
    if (!row || !divider || !number || !title) return;

    const ctx = gsap.context(() => {
      // 1. Gold divider line draws on scrub
      gsap.fromTo(
        divider,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
            end: "top 60%",
            scrub: 1,
          },
        }
      );

      // 2. Number fades up on scrub
      gsap.fromTo(
        number,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            end: "top 55%",
            scrub: 1,
          },
        }
      );

      // 3. Title fades up on scrub
      gsap.fromTo(
        title,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );

      // 4. Row content parallax — each row moves at slightly different speed
      const parallaxAmount = 20 + index * 15;
      gsap.fromTo(
        row,
        { y: parallaxAmount },
        {
          y: -parallaxAmount * 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, row);

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={rowRef} className="service-row relative">
      {/* Gold divider line */}
      <div
        ref={dividerRef}
        style={{
          height: 1,
          backgroundColor: "rgba(229, 225, 219, 0.3)",
          transformOrigin: "left",
          transform: "scaleX(0)",
        }}
      />


      {/* Clickable header */}
      <button
        onClick={onToggle}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        className="relative w-full"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2.5rem 0",
          paddingTop: "3.5rem",
          paddingBottom: "3.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          gap: "2rem",
        }}
      >
        {/* Number */}
        <motion.span
          ref={numberRef}
          animate={{ x: isHovered ? 8 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
            fontWeight: 500,
            color: accentColor,
            minWidth: "3rem",
            textAlign: "left",
          }}
        >
          {service.number}
        </motion.span>

        {/* Title + hover image preview */}
        <div style={{ flex: 1, textAlign: "left", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <motion.span
              ref={titleRef}
              animate={{
                color: isHovered || isOpen ? accentColor : textColor,
                x: isHovered ? 12 : 0,
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(2rem, 5vw, 5rem)",
                fontWeight: 900,
                lineHeight: 1,
                display: "inline-block",
                letterSpacing: "-0.025em",
              }}
            >
              {service.title}
            </motion.span>

            {/* Thumbnail preview — slides out on hover */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: isHovered ? "clamp(80px, 10vw, 140px)" : 0,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: "clamp(55px, 7vw, 95px)",
                borderRadius: 12,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={service.image}
                alt=""
                style={{
                  width: "140px",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </motion.div>
          </div>

          {/* Gold underline sweep on hover/open */}
          <motion.div
            animate={{ scaleX: isHovered || isOpen ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: 2,
              backgroundColor: accentColor,
              transformOrigin: "left",
              marginTop: 8,
              maxWidth: 300,
            }}
          />
        </div>

        {/* Plus / X toggle icon */}
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0, scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            color: accentColor,
            lineHeight: 1,
            fontWeight: 300,
            flexShrink: 0,
          }}
        >
          +
        </motion.span>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.3, delay: 0.1 },
            }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                paddingBottom: "2.5rem",
                paddingLeft: "4rem",
                maxWidth: "640px",
              }}
            >
              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "clamp(0.95rem, 1.2vw, 1.125rem)",
                  lineHeight: 1.7,
                  color: textMuted,
                  marginBottom: "1.5rem",
                }}
              >
                {service.description}
              </motion.p>

              {/* Detail bullets — stagger in from left */}
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {service.details.map((detail, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 + i * 0.1 }}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
                      color: textColor,
                      padding: "0.4rem 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: accentColor,
                        flexShrink: 0,
                      }}
                    />
                    {detail}
                  </motion.li>
                ))}
              </ul>

              {/* Learn More CTA */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.45 }}
                style={{ marginTop: "1.75rem" }}
              >
                <TransitionLink href={`/services/${service.slug}`}>
                  <motion.span
                    whileHover={{ letterSpacing: "0.12em" }}
                    transition={{ duration: 0.3 }}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: accentColor,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                  >
                    Learn More &rarr;
                  </motion.span>
                </TransitionLink>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────── Desktop Services ─────────────── */

function DesktopServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerBoxRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useSplitTextReveal(headerRef);

  // Y-drift + expand effect
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const innerBox = innerBoxRef.current;
    if (!section || !innerBox) return;

    const cs = getComputedStyle(section);
    const startPadLR = cs.paddingLeft;
    const startPadB = cs.paddingBottom;

    const ctx = gsap.context(() => {
      // Gentle continuous upward drift
      gsap.fromTo(innerBox, { y: 60 }, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Expand: padding collapses + bottom corners flatten
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "60% bottom",
          end: "80% bottom",
          scrub: 0.4,
        },
      });

      tl.fromTo(section, {
        paddingLeft: startPadLR,
        paddingRight: startPadLR,
        paddingBottom: startPadB,
      }, {
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        ease: "power2.inOut",
      }, 0);

      tl.to(innerBox, {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        ease: "power2.inOut",
      }, 0);
    });

    return () => ctx.revert();
  }, []);

  // Stacking cards — scale down + dim as next card covers
  useIsomorphicLayoutEffect(() => {
    const container = cardsContainerRef.current;
    if (!container) return;

    const cards = gsap.utils.toArray<HTMLElement>(container.querySelectorAll(".service-stack-card"));

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          // Scale down + dim as the next card scrolls over this one
          gsap.to(card.querySelector(".service-card-inner"), {
            scale: 0.93,
            opacity: 0.3,
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top bottom",
              end: "top 20%",
              scrub: 0.3,
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-bg="dark"
      className="hidden md:block"
      style={{
        position: "relative",
        padding: "0 clamp(1rem, 3vw, 3rem)",
        paddingBottom: "clamp(1rem, 3vw, 3rem)",
        backgroundColor: "#000000",
      }}
    >
      <div
        ref={innerBoxRef}
        style={{
          backgroundColor: "#141210",
          borderRadius: "clamp(1.5rem, 3vw, 3rem)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            padding: "clamp(4rem, 8vw, 8rem) clamp(2rem, 5vw, 5rem) clamp(2rem, 4vw, 4rem)",
          }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.8rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: accentColorMuted,
              marginBottom: "1rem",
            }}
          >
            What I Do
          </p>
          <SplitText
            text="SERVICES"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(4rem, 8vw, 9rem)",
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-0.05em",
              color: textColor,
            }}
          />
        </div>

        {/* Stacking cards container */}
        <div ref={cardsContainerRef} style={{ position: "relative" }}>
          {services.map((service, i) => (
            <ServiceStackCard key={service.slug} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Service Stack Card ─────────────── */

function ServiceStackCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const cardColors = ["#1c1917", "#1a1714", "#181512"];

  return (
    <div
      className="service-stack-card"
      style={{
        position: "sticky",
        top: `${8 + index * 2}%`,
        zIndex: 10 + index,
        marginBottom: "2rem",
      }}
    >
      <div
        className="service-card-inner"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: cardColors[index],
          borderRadius: "clamp(1rem, 2vw, 1.5rem)",
          margin: "0 clamp(1rem, 3vw, 2.5rem)",
          padding: "clamp(2.5rem, 4vw, 4rem) clamp(2rem, 4vw, 4rem)",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid rgba(229, 225, 219, 0.06)",
          transition: "border-color 0.4s ease, transform 0.3s ease, opacity 0.3s ease",
          borderColor: hovered ? "rgba(229, 225, 219, 0.15)" : "rgba(229, 225, 219, 0.06)",
        }}
      >
        {/* Top: Number + Title */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(0.8rem, 1vw, 0.9rem)",
                fontWeight: 500,
                color: accentColor,
                letterSpacing: "0.05em",
              }}
            >
              {service.number}
            </span>
            <motion.span
              animate={{ color: hovered ? accentColor : textColor }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(3rem, 6vw, 6rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
              }}
            >
              {service.title}
            </motion.span>
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
              lineHeight: 1.7,
              color: textMuted,
              maxWidth: "600px",
              marginLeft: "clamp(2rem, 3vw, 3.5rem)",
            }}
          >
            {service.description}
          </p>
        </div>

        {/* Bottom: Details + Image */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "3rem",
            marginTop: "3rem",
          }}
        >
          {/* Detail bullets */}
          <div style={{ marginLeft: "clamp(2rem, 3vw, 3.5rem)" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {service.details.map((detail, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
                    color: textColor,
                    padding: "0.5rem 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      backgroundColor: accentColor,
                      flexShrink: 0,
                      opacity: 0.6,
                    }}
                  />
                  {detail}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <TransitionLink href={`/services/${service.slug}`}>
              <motion.span
                whileHover={{ letterSpacing: "0.12em" }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "inline-block",
                  marginTop: "1.5rem",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: accentColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                }}
              >
                Learn More &rarr;
              </motion.span>
            </TransitionLink>
          </div>

          {/* Image */}
          <motion.div
            animate={{
              y: hovered ? -8 : 0,
              scale: hovered ? 1.02 : 1,
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "clamp(200px, 30%, 380px)",
              aspectRatio: "4/3",
              borderRadius: "clamp(0.75rem, 1.5vw, 1.25rem)",
              overflow: "hidden",
              flexShrink: 0,
              position: "relative",
            }}
          >
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
              sizes="380px"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Mobile Services ─────────────── */

function MobileServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const rowsContainerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useSplitTextReveal(headerRef);

  // GSAP: Simple stagger reveal for mobile rows
  useIsomorphicLayoutEffect(() => {
    const container = rowsContainerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(
        container.querySelectorAll(".mobile-service-row")
      );

      rows.forEach((row) => {
        // Row slides up
        gsap.fromTo(
          row,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 95%",
              end: "top 70%",
              scrub: 0.4,
            },
          }
        );

        // Divider line draws in
        const divider = row.previousElementSibling?.classList?.contains("mobile-service-row")
          ? null
          : row.closest("[ref]")?.querySelector(".mobile-divider");
        const rowBorder = row.querySelector(".mobile-row-line");
        if (rowBorder) {
          gsap.fromTo(
            rowBorder,
            { scaleX: 0, transformOrigin: "left" },
            {
              scaleX: 1,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: row,
                start: "top 90%",
                end: "top 70%",
                scrub: 0.3,
              },
            }
          );
        }
      });
    }, container);

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timeout);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-bg="cream"
      className="md:hidden relative"
      style={{ padding: "0 clamp(0.75rem, 3vw, 1.5rem)", paddingBottom: "clamp(0.75rem, 3vw, 1.5rem)" }}
    >
      <div

        style={{
          backgroundColor: "#141210",
          borderRadius: "clamp(1.25rem, 3vw, 2rem)",
          position: "relative",
          overflow: "hidden",
          padding: "3.5rem 1.5rem 4rem",
          minHeight: "90vh",
        }}
      >
      {/* Header */}
      <div ref={headerRef} className="mb-16">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] mb-4" style={{ color: accentColorMuted }}>
          What I Do
        </p>

        <SplitText
          text="SERVICES"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(3.5rem, 16vw, 5.5rem)",
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
            color: textColor,
          }}
        />
      </div>

      {/* Accordion */}
      <div ref={rowsContainerRef}>
        {services.map((service, i) => {
          const isOpen = openIndex === i;
          return (
          <div
            key={service.slug}
            className="mobile-service-row relative"
          >
            {/* Animated bottom border */}
            <div className="mobile-row-line absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: borderColor }} />
            {/* Header */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-start gap-5 py-10"
              style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
            >
              {/* Big number */}
              <motion.span
                animate={{ color: isOpen ? accentColor : "rgba(255,255,255,0.12)" }}
                transition={{ duration: 0.3 }}
                className="font-black shrink-0"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "clamp(2.5rem, 10vw, 4rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  marginTop: "-0.1em",
                }}
              >
                {service.number}
              </motion.span>

              <div className="flex-1 pt-1">
                <motion.span
                  animate={{ color: isOpen ? accentColor : textColor }}
                  transition={{ duration: 0.3 }}
                  className="block font-black"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "clamp(1.2rem, 5vw, 1.6rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {service.title}
                </motion.span>

                {/* Subtle hint text when closed */}
                <motion.span
                  animate={{ opacity: isOpen ? 0 : 0.3, height: isOpen ? 0 : "auto" }}
                  className="block text-xs mt-1.5 overflow-hidden"
                  style={{ color: textMuted }}
                >
                  {service.description.slice(0, 60)}...
                </motion.span>
              </div>

              {/* Arrow indicator */}
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="shrink-0 mt-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </motion.div>
            </button>

              {/* Expandable content */}
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: {
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      opacity: { duration: 0.25, delay: 0.1 },
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      style={{
                        paddingBottom: "1.75rem",
                        paddingLeft: "2.75rem",
                      }}
                    >
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.9rem",
                          lineHeight: 1.7,
                          color: textMuted,
                          marginBottom: "1.25rem",
                        }}
                      >
                        {service.description}
                      </motion.p>

                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        {service.details.map((detail, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.15 + j * 0.07,
                            }}
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "0.825rem",
                              color: textColor,
                              padding: "0.35rem 0",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.6rem",
                            }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                backgroundColor: accentColor,
                                flexShrink: 0,
                              }}
                            />
                            {detail}
                          </motion.li>
                        ))}
                      </ul>

                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        style={{ marginTop: "1.25rem" }}
                      >
                        <TransitionLink href={`/services/${service.slug}`}>
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: accentColor,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            Learn More &rarr;
                          </span>
                        </TransitionLink>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Export ─────────────── */

export default function Services() {
  return (
    <>
      <DesktopServices />
      <MobileServices />
    </>
  );
}
