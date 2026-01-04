"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const workItems = [
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

  return (
    <div
      ref={cardRef}
      className="project-card relative shrink-0 w-[80vw] md:w-[60vw] lg:w-[50vw] h-[70vh] group"
    >
      <Link href={project.url} className="block w-full h-full relative">
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="60vw"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
        </div>

        <div className="absolute top-6 left-6 text-white/30 text-sm font-mono">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="absolute top-6 right-6 text-white/30 text-sm font-mono">
          {project.year}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
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
            <span className="text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
              →
            </span>
          </div>
        </div>

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.03) 2px, rgba(0,240,255,0.03) 4px)",
          }}
        />
      </Link>
    </div>
  );
}

export default function Work() {
  const containerRef = useRef<HTMLElement>(null);
  const kineticRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Kinetic section - reveal with clip path
      if (kineticRef.current) {
        gsap.fromTo(
          kineticRef.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power3.out",
            scrollTrigger: {
              trigger: kineticRef.current,
              start: "top bottom",
              end: "top 30%",
              scrub: 1,
            },
          }
        );
      }

      // Header section - text reveal with stagger
      if (headerRef.current) {
        const headerLabel = headerRef.current.querySelector(".header-label");
        const headerTitle = headerRef.current.querySelector(".header-title");

        if (headerLabel) {
          gsap.fromTo(
            headerLabel,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (headerTitle) {
          gsap.fromTo(
            headerTitle,
            { y: 100, opacity: 0, skewY: 5 },
            {
              y: 0,
              opacity: 1,
              skewY: 0,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headerRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }

      // Gallery - horizontal scroll with GSAP
      if (galleryRef.current && horizontalRef.current) {
        const cards = horizontalRef.current.querySelectorAll(".project-card");

        // Initial state for cards
        gsap.set(cards, { opacity: 0, x: 100, rotateY: 15 });

        // Animate cards in as they come into view
        cards.forEach((card, i) => {
          gsap.to(card, {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: galleryRef.current,
              start: `top+=${i * 15}% center`,
              toggleActions: "play none none reverse",
            },
          });
        });

        // Horizontal scroll
        const totalWidth = horizontalRef.current.scrollWidth - window.innerWidth;

        gsap.to(horizontalRef.current, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Kinetic Typography Intermission */}
      <section ref={kineticRef} className="relative py-40 overflow-hidden bg-zinc-900">
        <div className="flex flex-col gap-8">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: [0, -1500] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="text-[12vw] font-black text-white tracking-[-0.03em] mx-6"
              >
                NO TEMPLATES • NO LIMITS • JUST RESULTS •
              </span>
            ))}
          </motion.div>
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: [-800, 700] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="text-[12vw] font-black text-transparent tracking-[-0.03em] mx-6"
                style={{
                  WebkitTextStroke: "2px rgba(255,255,255,0.4)",
                }}
              >
                CUSTOM BUILT • PIXEL PERFECT • PERFORMANCE FIRST •
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Header */}
      <section ref={headerRef} className="pt-16 pb-8 px-6 md:px-12 lg:px-20 bg-neutral-950 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <p className="header-label text-white/40 text-sm uppercase tracking-[0.3em] mb-4">
            Selected Work
          </p>
          <h2 className="header-title text-[12vw] md:text-[8vw] font-black text-white leading-[0.9] tracking-[-0.02em]">
            THE PROOF
          </h2>
        </div>
      </section>

      {/* Horizontal Scroll Gallery */}
      <section
        ref={galleryRef}
        className="relative bg-neutral-950 h-screen"
      >
        <div className="h-full flex items-center overflow-hidden">
          <div
            ref={horizontalRef}
            className="flex gap-8 pl-[10vw] pr-[20vw]"
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

        {/* Progress indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <span className="text-white/40 text-xs font-mono">SCROLL</span>
          <div className="w-32 h-px bg-white/20 relative overflow-hidden">
            <div className="progress-bar absolute inset-y-0 left-0 bg-white w-0" />
          </div>
        </div>
      </section>
    </>
  );
}
