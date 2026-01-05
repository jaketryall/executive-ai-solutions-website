"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useRef, useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "./SplitText";
import { useSound } from "./SoundManager";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const workItems = [
  {
    title: "DESERT WINGS",
    category: "Aviation",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
    url: "#",
    year: "2024",
  },
  {
    title: "MERIDIAN",
    category: "Consulting",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    url: "#",
    year: "2024",
  },
  {
    title: "APEX",
    category: "Design",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    url: "#",
    year: "2023",
  },
  {
    title: "VERTEX",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    url: "#",
    year: "2023",
  },
];

function ProjectCard({ project, index }: { project: typeof workItems[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { play } = useSound();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className="project-card relative shrink-0 w-[80vw] md:w-[60vw] lg:w-[50vw] h-[70vh] group"
      onMouseEnter={() => {
        setIsHovered(true);
        play("hover", { volume: 0.06 });
      }}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        transformStyle: "preserve-3d",
        transform: isHovered
          ? `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${-mousePos.y * 5}deg)`
          : "perspective(1000px) rotateY(0deg) rotateX(0deg)",
        transition: "transform 0.3s ease-out",
      }}
    >
      {/* Warm ambient glow behind card - large outer glow */}
      <div
        className="absolute rounded-[40px] pointer-events-none"
        style={{
          inset: "-80px",
          background: "radial-gradient(ellipse at center, rgba(255,140,50,0.5) 0%, rgba(255,100,30,0.3) 40%, rgba(255,80,20,0.15) 60%, transparent 80%)",
          filter: "blur(60px)",
          opacity: isHovered ? 1 : 0.7,
          transform: isHovered ? "scale(1.1)" : "scale(1)",
          transition: "all 0.5s ease-out",
        }}
      />
      {/* Secondary warm glow - tighter, more intense */}
      <div
        className="absolute rounded-3xl pointer-events-none"
        style={{
          inset: "-40px",
          background: "radial-gradient(ellipse at center, rgba(255,180,80,0.4) 0%, rgba(255,140,60,0.2) 50%, transparent 70%)",
          filter: "blur(35px)",
          opacity: isHovered ? 0.95 : 0.6,
          transition: "all 0.4s ease-out",
        }}
      />
      {/* Inner warm accent glow */}
      <div
        className="absolute -inset-4 rounded-2xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,200,120,0.3) 0%, transparent 60%)",
          filter: "blur(20px)",
          opacity: isHovered ? 0.9 : 0.4,
          transition: "opacity 0.3s ease-out",
        }}
      />

      <Link href={project.url} className="block w-full h-full relative">
        <div className="card-image absolute inset-0 overflow-hidden rounded-2xl">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-colors duration-500" />
        </div>

        <div className="card-index absolute top-6 left-6 text-white/30 text-sm font-mono">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="card-year absolute top-6 right-6 text-white/30 text-sm font-mono">
          {project.year}
        </div>

        <div className="card-content absolute bottom-0 left-0 right-0 p-8">
          <h3
            className="project-title text-[15vw] md:text-[10vw] lg:text-[8vw] font-black text-white leading-[0.85] tracking-[-0.02em]"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.2)",
            }}
          >
            {project.title}
          </h3>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-white/60 text-sm uppercase tracking-[0.2em]">
              {project.category}
            </span>
            <motion.span
              className="text-white/60 group-hover:text-[#00f0ff]"
              animate={{ x: isHovered ? 8 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              →
            </motion.span>
          </div>
        </div>

        {/* Scanline effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.03) 2px, rgba(0,240,255,0.03) 4px)",
            }}
          />
        </motion.div>

        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: "inset 0 0 60px rgba(0,240,255,0.1), 0 0 30px rgba(0,240,255,0.05)",
          }}
        />
      </Link>
    </motion.div>
  );
}

export default function Work() {
  const kineticRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressGlowRef = useRef<HTMLDivElement>(null);
  const textRow1Ref = useRef<HTMLDivElement>(null);
  const textRow2Ref = useRef<HTMLDivElement>(null);
  const kineticToWorkRef = useRef<HTMLDivElement>(null);
  const gradientOverlayRef = useRef<HTMLDivElement>(null);

  // Track scroll velocity for kinetic text
  const row1AnimRef = useRef<HTMLDivElement>(null);
  const row2AnimRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const row1Pos = useRef(0);
  const row2Pos = useRef(0);
  const scrollDirection = useRef<"down" | "up">("down");
  const rafId = useRef<number>(0);

  // Track scroll direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - lastScrollY.current;
    if (delta > 0) {
      scrollDirection.current = "down";
    } else if (delta < 0) {
      scrollDirection.current = "up";
    }
    lastScrollY.current = latest;
  });

  // Continuous animation loop
  useEffect(() => {
    // Initialize positions
    if (row1AnimRef.current) {
      const width = row1AnimRef.current.scrollWidth / 2;
      row1Pos.current = -width / 2; // Start in middle
    }
    if (row2AnimRef.current) {
      const width = row2AnimRef.current.scrollWidth / 2;
      row2Pos.current = -width / 2; // Start in middle
    }

    const animate = () => {
      // Base velocity changes direction based on scroll
      const direction = scrollDirection.current === "down" ? 1 : -1;
      const row1Vel = -0.5 * direction;
      const row2Vel = 0.4 * direction;

      // Apply velocity
      row1Pos.current += row1Vel;
      row2Pos.current += row2Vel;

      // Seamless loop using modulo for row 1
      if (row1AnimRef.current) {
        const width = row1AnimRef.current.scrollWidth / 2;
        // Wrap position to stay within -width to 0 range
        if (row1Pos.current <= -width) {
          row1Pos.current += width;
        } else if (row1Pos.current >= 0) {
          row1Pos.current -= width;
        }
        row1AnimRef.current.style.transform = `translateX(${row1Pos.current}px)`;
      }

      // Seamless loop using modulo for row 2
      if (row2AnimRef.current) {
        const width = row2AnimRef.current.scrollWidth / 2;
        // Wrap position to stay within -width to 0 range
        if (row2Pos.current <= -width) {
          row2Pos.current += width;
        } else if (row2Pos.current >= 0) {
          row2Pos.current -= width;
        }
        row2AnimRef.current.style.transform = `translateX(${row2Pos.current}px)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ===== KINETIC SECTION - Simple parallax =====
      if (textRow1Ref.current && textRow2Ref.current) {
        gsap.to(textRow1Ref.current, {
          x: "-15%",
          ease: "none",
          scrollTrigger: {
            trigger: kineticRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(textRow2Ref.current, {
          x: "10%",
          ease: "none",
          scrollTrigger: {
            trigger: kineticRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // ===== KINETIC TO WORK TRANSITION - Gradient fade in =====
      if (kineticToWorkRef.current && gradientOverlayRef.current) {
        gsap.fromTo(
          gradientOverlayRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: kineticRef.current,
              start: "center center",
              end: "bottom 40%",
              scrub: 0.5,
            },
          }
        );
      }

      // ===== HEADER - Comes toward you =====
      if (headerRef.current) {
        const headerLabel = headerRef.current.querySelector(".header-label");
        const headerTitle = headerRef.current.querySelector(".header-title");

        // Title rushes toward camera
        gsap.fromTo(
          headerTitle,
          { scale: 0.6, opacity: 0, y: 100 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top bottom",
              end: "top 40%",
              scrub: 0.8,
            },
          }
        );

        // Label fades in
        gsap.fromTo(
          headerLabel,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 90%",
              end: "top 60%",
              scrub: 0.5,
            },
          }
        );
      }

      // ===== GALLERY - Horizontal scroll =====
      if (galleryRef.current && horizontalRef.current) {
        const totalWidth = horizontalRef.current.scrollWidth - window.innerWidth;

        // Horizontal scroll
        gsap.to(horizontalRef.current, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 0.3,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              // Progress bar from center
              if (progressBarRef.current && progressGlowRef.current) {
                const progress = self.progress * 100;
                progressBarRef.current.style.width = `${progress}%`;
                progressBarRef.current.style.left = `${50 - progress / 2}%`;
                progressGlowRef.current.style.opacity = `${0.5 + self.progress * 0.5}`;
              }
            },
          },
        });
      }

    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Kinetic Typography Intermission */}
      <section ref={kineticRef} className="relative py-40 overflow-hidden bg-neutral-950" style={{ zIndex: 10 }}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900/50 to-neutral-950" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative flex flex-col gap-8">
          <div
            ref={textRow1Ref}
            className="flex whitespace-nowrap overflow-hidden"
          >
            <div
              ref={row1AnimRef}
              className="flex"
            >
              {[...Array(8)].map((_, i) => (
                <span
                  key={i}
                  className="text-[12vw] font-black text-white tracking-[-0.03em] mx-6 shrink-0"
                >
                  NO TEMPLATES • NO LIMITS • JUST RESULTS •
                </span>
              ))}
            </div>
          </div>
          <div
            ref={textRow2Ref}
            className="flex whitespace-nowrap overflow-hidden"
          >
            <div
              ref={row2AnimRef}
              className="flex"
            >
              {[...Array(8)].map((_, i) => (
                <span
                  key={i}
                  className="text-[12vw] font-black text-transparent tracking-[-0.03em] mx-6 shrink-0"
                  style={{
                    WebkitTextStroke: "2px rgba(255,255,255,0.4)",
                  }}
                >
                  CUSTOM BUILT • PIXEL PERFECT • PERFORMANCE FIRST •
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Animated gradient overlay - sweeps down over kinetic section */}
        <div
          ref={kineticToWorkRef}
          className="absolute inset-0 pointer-events-none z-10"
        >
          <div
            ref={gradientOverlayRef}
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.7) 50%, #000000 80%, #000000 100%)",
            }}
          />
          {/* Subtle cyan glow line at the very bottom */}
          <div
            className="absolute left-0 right-0 h-[2px] bottom-0"
            style={{
              background: "linear-gradient(90deg, transparent 10%, rgba(0,240,255,0.4) 50%, transparent 90%)",
              boxShadow: "0 0 20px rgba(0,240,255,0.3), 0 0 40px rgba(0,240,255,0.15)",
            }}
          />
        </div>
      </section>

      {/* Work Section Container */}
      <div className="relative bg-black" style={{ zIndex: 10 }}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orbs */}
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full opacity-[0.03]"
            style={{
              background: "radial-gradient(circle, #00f0ff 0%, transparent 70%)",
              left: "-200px",
              top: "20%",
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full opacity-[0.02]"
            style={{
              background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
              right: "-100px",
              top: "50%",
            }}
            animate={{
              x: [0, -30, 0],
              y: [0, -40, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="work-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#work-grid)" />
          </svg>

          {/* Diagonal accent lines */}
          <motion.div
            className="absolute h-px bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent"
            style={{
              width: "150%",
              left: "-25%",
              top: "30%",
              transform: "rotate(-5deg)",
            }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{
              width: "120%",
              left: "-10%",
              top: "70%",
              transform: "rotate(3deg)",
            }}
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          />

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/20"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut",
              }}
            />
          ))}

        </div>

        {/* Section Header */}
        <section ref={headerRef} className="pt-24 pb-12 px-6 md:px-12 lg:px-20 overflow-hidden relative z-10">
          <div className="max-w-7xl mx-auto">
            <p className="header-label text-white/40 text-sm uppercase tracking-[0.3em] mb-4">
              <SplitText animation="chars" stagger={0.03} delay={0.1}>
                Selected Work
              </SplitText>
            </p>
            <h2 className="header-title text-[12vw] md:text-[8vw] font-black text-white leading-[0.9] tracking-[-0.02em]">
              <SplitText animation="chars" stagger={0.04} delay={0.3}>
                THE PROOF
              </SplitText>
            </h2>
          </div>
        </section>

        {/* Horizontal Scroll Gallery */}
        <section
          ref={galleryRef}
          className="relative h-screen"
          style={{ perspective: "1000px" }}
        >
          <div className="h-full flex items-center overflow-hidden">
            <div
              ref={horizontalRef}
              className="flex gap-8 pl-[10vw] pr-[20vw]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {workItems.map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index} />
              ))}

              {/* End card */}
              <div className="project-card shrink-0 w-[40vw] h-[70vh] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white/40 text-sm uppercase tracking-[0.3em] mb-4">
                    Want to be next?
                  </p>
                  <Link href="#contact">
                    <motion.span
                      className="text-4xl md:text-6xl font-black text-white hover:text-[#00f0ff] transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      LET'S TALK →
                    </motion.span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Progress indicator - draws from center */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <span className="text-white/40 text-xs font-mono">SCROLL</span>
            <div className="w-32 h-px bg-white/10 relative overflow-hidden">
              <div
                ref={progressBarRef}
                className="absolute inset-y-0 bg-gradient-to-r from-[#00f0ff] via-white to-[#00f0ff] w-0"
                style={{ left: "50%" }}
              />
              <div
                ref={progressGlowRef}
                className="absolute inset-0 blur-sm bg-[#00f0ff]/30 opacity-0"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
