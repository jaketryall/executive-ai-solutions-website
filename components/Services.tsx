"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    number: "01",
    title: "Strategy",
    description: "Brand positioning, market research, and digital roadmaps that set the foundation for success.",
  },
  {
    number: "02",
    title: "Design",
    description: "Bold visual systems and interfaces that demand attention and drive engagement.",
  },
  {
    number: "03",
    title: "Development",
    description: "Blazing-fast, custom-coded experiences built with modern technologies.",
  },
  {
    number: "04",
    title: "Motion",
    description: "Cinematic animations and micro-interactions that bring brands to life.",
  },
];

function ServiceItem({
  service,
  index,
  isRevealed,
}: {
  service: typeof services[0];
  index: number;
  isRevealed: boolean;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [counter, setCounter] = useState("00");

  // Animate counter when revealed
  useEffect(() => {
    if (isRevealed) {
      let current = 0;
      const target = parseInt(service.number);
      const duration = 800;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        current = Math.floor(progress * target);
        setCounter(String(current).padStart(2, "0"));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      const timeout = setTimeout(animate, index * 150);
      return () => clearTimeout(timeout);
    }
  }, [isRevealed, service.number, index]);

  return (
    <div
      ref={itemRef}
      className="service-item group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="service-line h-px bg-white/10 origin-left"
        style={{
          transform: isRevealed ? "scaleX(1)" : "scaleX(0)",
          transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
        }}
      />
      <div
        className="py-10 md:py-14 flex flex-col md:flex-row md:items-center gap-6 md:gap-12 cursor-pointer transition-all duration-500"
        style={{
          paddingLeft: isHovered ? "1rem" : "0",
          paddingRight: isHovered ? "0" : "1rem",
          background: isHovered
            ? "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, transparent 100%)"
            : "transparent",
        }}
      >
        {/* Number with counter animation */}
        <span
          className="text-[#00f0ff]/40 text-sm font-mono shrink-0 w-12 transition-colors duration-300"
          style={{ color: isHovered ? "rgba(0,240,255,0.8)" : undefined }}
        >
          {counter}
        </span>

        {/* Title */}
        <h3 className="flex-1 text-3xl md:text-4xl lg:text-5xl font-bold text-white group-hover:text-white/80 transition-colors duration-300">
          {service.title}
        </h3>

        {/* Description */}
        <p
          className="text-white/40 text-base md:text-lg max-w-md leading-relaxed group-hover:text-white/60 transition-all duration-500"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(10px)",
            transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1 + 0.3}s`,
          }}
        >
          {service.description}
        </p>

        {/* Arrow with spring animation */}
        <span
          className="text-white/20 text-2xl group-hover:text-[#00f0ff] hidden md:block transition-all duration-300"
          style={{
            transform: isHovered ? "translateX(8px)" : "translateX(-20px)",
            opacity: isHovered ? 1 : 0,
          }}
        >
          →
        </span>
      </div>
      {index === services.length - 1 && (
        <div
          className="service-line h-px bg-white/10 origin-left"
          style={{
            transform: isRevealed ? "scaleX(1)" : "scaleX(0)",
            transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${(index + 1) * 0.1}s`,
          }}
        />
      )}
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const contentMaskRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const linesContainerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ===== DRAMATIC ENTRANCE - Burst from darkness =====
      if (burstRef.current) {
        // Light burst radiates outward - visible in center of viewport
        gsap.fromTo(
          burstRef.current,
          { scale: 0, opacity: 1 },
          {
            scale: 2.5,
            opacity: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 20%",
              scrub: 0.3,
            },
          }
        );
      }

      // ===== SPEED LINES - Shoot down the screen =====
      if (linesContainerRef.current) {
        const lines = linesContainerRef.current.querySelectorAll(".speed-line");
        lines.forEach((line, index) => {
          // Stagger the lines slightly
          gsap.fromTo(
            line,
            { scaleY: 0, opacity: 0.8 },
            {
              scaleY: 1,
              opacity: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%",
                end: "top 25%",
                scrub: 0.2,
              },
            }
          );
        });
      }

      // ===== SCAN LINE REVEAL =====
      if (scanLineRef.current && contentMaskRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 10%",
            scrub: 0.3,
            onEnter: () => setIsRevealed(true),
            onLeaveBack: () => setIsRevealed(false),
          },
        });

        // Scan line sweeps down with intensity
        tl.fromTo(
          scanLineRef.current,
          { top: "-5%", opacity: 1, scaleX: 0.5 },
          { top: "105%", opacity: 0, scaleX: 1, ease: "power1.in" }
        );

        // Content reveals behind scan line
        tl.fromTo(
          contentMaskRef.current,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", ease: "none" },
          0
        );
      }

      // ===== HEADER - Explodes toward camera =====
      if (headerRef.current) {
        const label = headerRef.current.querySelector(".section-label");
        const title = headerRef.current.querySelector(".section-title");

        // Title BURSTS toward camera from far away
        gsap.fromTo(
          title,
          { scale: 0.3, opacity: 0, y: 150, rotateX: 15 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            rotateX: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "top 30%",
              scrub: 0.6,
            },
          }
        );

        // Label snaps in with delay
        gsap.fromTo(
          label,
          { opacity: 0, y: 40, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "top 40%",
              scrub: 0.3,
            },
          }
        );
      }

      // ===== SERVICE ITEMS - Cascade in from the void =====
      if (listRef.current) {
        const items = listRef.current.querySelectorAll(".service-item");
        items.forEach((item, index) => {
          gsap.fromTo(
            item,
            { y: 100 + index * 20, opacity: 0, scale: 0.9 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "top 60%",
                scrub: 0.4,
              },
            }
          );
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-32 bg-neutral-950 overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Burst effect - fixed to viewport center */}
      <div
        ref={burstRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vh] aspect-square pointer-events-none z-50"
        style={{
          background: "radial-gradient(circle, rgba(0,240,255,0.6) 0%, rgba(0,240,255,0.2) 25%, transparent 50%)",
        }}
      />

      {/* Speed lines container - fixed to viewport */}
      <div
        ref={linesContainerRef}
        className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
      >
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="speed-line absolute w-[2px]"
            style={{
              left: `${5 + i * 6}%`,
              top: "0",
              height: "100vh",
              background: "linear-gradient(to bottom, transparent 0%, #00f0ff 40%, #00f0ff 60%, transparent 100%)",
              transformOrigin: "top center",
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      {/* Scan line effect - enhanced */}
      <div
        ref={scanLineRef}
        className="absolute left-0 right-0 h-[2px] z-25 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 5%, #00f0ff 50%, transparent 95%)",
          boxShadow: "0 0 30px #00f0ff, 0 0 60px #00f0ff, 0 0 90px rgba(0,240,255,0.5)",
        }}
      />

      {/* Content wrapper with clip mask */}
      <div ref={contentMaskRef} className="relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          {/* Header */}
          <div ref={headerRef} className="mb-20">
            <p className="section-label text-white/40 text-sm uppercase tracking-[0.3em] mb-4">
              What We Do
            </p>
            <h2 className="section-title text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Services built for
              <br />
              <span className="text-white/40">ambitious brands</span>
            </h2>
          </div>

          {/* Services List */}
          <div ref={listRef} className="space-y-0">
            {services.map((service, index) => (
              <ServiceItem
                key={service.number}
                service={service}
                index={index}
                isRevealed={isRevealed}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Background grid pattern that fades in with reveal */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: isRevealed ? 0.05 : 0,
          backgroundImage:
            "linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </section>
  );
}
