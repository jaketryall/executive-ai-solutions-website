"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, use, useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { TransitionLink } from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { useSound } from "@/components/SoundManager";
import { getProjectBySlug, getNextProject } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Warm cinematic color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Animated counter that counts up
function AnimatedCounter({ value, delay = 0 }: { value: string; delay?: number }) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const match = value.match(/^([+-]?)(\d+)(.*)/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const [, prefix, num, suffix] = match;
    const target = parseInt(num);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const duration = 2000;
          const startTime = Date.now() + delay * 1000;

          const animate = () => {
            const now = Date.now();
            if (now < startTime) {
              requestAnimationFrame(animate);
              return;
            }

            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            setDisplayValue(`${prefix}${current}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, delay]);

  return <span ref={ref}>{displayValue}</span>;
}

// Split text component for letter-by-letter animation
function SplitText({
  children,
  className = "",
  delay = 0
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll(".char");

    gsap.fromTo(
      chars,
      {
        y: "100%",
        opacity: 0,
        rotateX: -90,
      },
      {
        y: "0%",
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.03,
        delay,
        ease: "power3.out",
      }
    );
  }, [delay]);

  return (
    <span ref={containerRef} className={className} style={{ perspective: "1000px" }}>
      {children.split("").map((char, i) => (
        <span
          key={i}
          className="char inline-block"
          style={{
            transformStyle: "preserve-3d",
            display: char === " " ? "inline" : "inline-block",
            width: char === " " ? "0.3em" : "auto",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

// Horizontal gallery section with GSAP
function HorizontalGallery({ images, title }: { images: string[]; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || !galleryRef.current) return;

    const ctx = gsap.context(() => {
      const gallery = galleryRef.current;
      if (!gallery) return;

      const totalWidth = gallery.scrollWidth - window.innerWidth;

      gsap.to(gallery, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-[#0a0908]">
      <div
        ref={galleryRef}
        className="flex items-center h-screen gap-8 px-8 md:px-16"
        style={{ width: `${(images.length + 1) * 80}vw` }}
      >
        {/* Title card */}
        <div className="shrink-0 w-[40vw] h-[70vh] flex flex-col justify-center">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-4"
            style={{ color: accentColorMuted }}
          >
            Project Gallery
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-[-0.03em]">
            Visual
            <br />
            <span className="text-white/30">Journey</span>
          </h2>
        </div>

        {/* Gallery images */}
        {images.map((image, index) => (
          <div
            key={image}
            className="gallery-item shrink-0 w-[60vw] h-[70vh] rounded-sm overflow-hidden relative group"
          >
            <Image
              src={image}
              alt={`${title} - Image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="60vw"
            />
            {/* Subtle warm overlay on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(to top, rgba(255, 200, 150, 0.1), transparent)` }}
            />
            {/* Number overlay */}
            <div className="absolute bottom-6 left-6">
              <span
                className="text-6xl font-black"
                style={{ color: "rgba(255,255,255,0.1)" }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sticky reveal section for challenge/solution
function StickyRevealSection({
  challenge,
  solution
}: {
  challenge: string;
  solution: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const challengeRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);

  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Challenge text reveal
      gsap.fromTo(
        ".challenge-word",
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.03,
          scrollTrigger: {
            trigger: challengeRef.current,
            start: "top 70%",
            end: "bottom 50%",
            scrub: 1,
          },
        }
      );

      // Solution text reveal
      gsap.fromTo(
        ".solution-word",
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.03,
          scrollTrigger: {
            trigger: solutionRef.current,
            start: "top 70%",
            end: "bottom 50%",
            scrub: 1,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const splitIntoWords = (text: string, className: string) => {
    return text.split(" ").map((word, i) => (
      <span key={i} className={`${className} inline-block mr-[0.3em]`}>
        {word}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="py-32 md:py-48 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Challenge */}
        <div ref={challengeRef} className="mb-32 md:mb-48">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-8"
            style={{ color: accentColorMuted }}
          >
            The Challenge
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-[1.4] tracking-[-0.01em]">
            {splitIntoWords(challenge, "challenge-word")}
          </p>
        </div>

        {/* Solution */}
        <div ref={solutionRef}>
          <p
            className="text-xs uppercase tracking-[0.3em] mb-8"
            style={{ color: accentColorMuted }}
          >
            The Solution
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-[1.4] tracking-[-0.01em]">
            {splitIntoWords(solution, "solution-word")}
          </p>
        </div>
      </div>
    </div>
  );
}

// Big result section with dramatic reveal
function ResultsSection({ result, metrics }: { result: string; metrics: { label: string; value: string }[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || !numberRef.current) return;

    const ctx = gsap.context(() => {
      // Big result number animation
      gsap.fromTo(
        numberRef.current,
        {
          scale: 0.5,
          opacity: 0,
          y: 100,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Metrics stagger in
      gsap.fromTo(
        ".metric-item",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".metrics-grid",
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="py-32 md:py-48 px-6 md:px-12 lg:px-20 relative overflow-hidden">
      {/* Background accent glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255, 200, 150, 0.06) 0%, transparent 60%)`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Big result */}
        <div ref={numberRef} className="text-center mb-24">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-6"
            style={{ color: accentColorMuted }}
          >
            The Result
          </p>
          <h2
            className="text-7xl md:text-9xl lg:text-[12rem] font-black tracking-[-0.04em] leading-none"
            style={{ color: accentColor }}
          >
            {result}
          </h2>
        </div>

        {/* Metrics grid */}
        <div className="metrics-grid grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <div key={metric.label} className="metric-item text-center">
              <span
                className="text-3xl md:text-4xl lg:text-5xl font-black block mb-2"
                style={{ color: accentColor }}
              >
                <AnimatedCounter value={metric.value} delay={index * 0.1} />
              </span>
              <span className="text-white/40 text-xs uppercase tracking-wider">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Testimonial with dramatic quote marks
function TestimonialSection({ quote, author, role }: { quote: string; author: string; role: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Quote marks scale in
      gsap.fromTo(
        ".quote-mark",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Quote text fades in
      gsap.fromTo(
        ".quote-text",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Author fades in
      gsap.fromTo(
        ".quote-author",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          delay: 0.6,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="py-32 md:py-48 px-6 md:px-12 lg:px-20 border-y border-white/5">
      <div className="max-w-5xl mx-auto text-center relative">
        {/* Large quote mark */}
        <div
          className="quote-mark absolute -top-8 left-1/2 -translate-x-1/2 text-[200px] md:text-[300px] font-serif leading-none pointer-events-none select-none"
          style={{ color: "rgba(255, 200, 150, 0.05)" }}
        >
          "
        </div>

        <blockquote className="quote-text relative z-10 text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-relaxed mb-12">
          "{quote}"
        </blockquote>

        <div className="quote-author">
          <p className="text-white font-medium text-lg">{author}</p>
          <p className="text-white/40 text-sm mt-1">{role}</p>
        </div>
      </div>
    </div>
  );
}

// Next project teaser with image preview
function NextProjectSection({ project }: { project: ReturnType<typeof getNextProject> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();
  const [isHovered, setIsHovered] = useState(false);

  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || !project) return;

    const ctx = gsap.context(() => {
      // Image reveal on scroll
      gsap.fromTo(
        imageRef.current,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [project]);

  if (!project) return null;

  return (
    <div ref={containerRef} className="py-32 md:py-48 px-6 md:px-12 lg:px-20">
      <TransitionLink href={`/work/${project.slug}`}>
        <div
          className="max-w-6xl mx-auto cursor-pointer group"
          onMouseEnter={() => {
            setIsHovered(true);
            play("hover", { volume: 0.05 });
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-6"
                style={{ color: accentColorMuted }}
              >
                Next Project
              </p>
              <motion.h3
                className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-[-0.03em] mb-4"
                animate={{ x: isHovered ? 20 : 0 }}
                transition={{ duration: 0.4 }}
              >
                {project.title}
              </motion.h3>
              <p className="text-white/40 italic text-lg mb-8">{project.tagline}</p>

              <motion.div
                className="inline-flex items-center gap-4"
                style={{ color: accentColor }}
                animate={{ x: isHovered ? 10 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-lg tracking-wide">View Project</span>
                <motion.span
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  →
                </motion.span>
              </motion.div>
            </div>

            {/* Image */}
            <div
              ref={imageRef}
              className="relative aspect-[4/3] overflow-hidden rounded-sm"
            >
              <motion.div
                className="absolute inset-0"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </motion.div>
              {/* Warm overlay on hover */}
              <motion.div
                className="absolute inset-0"
                style={{ backgroundColor: accentColor }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0.15 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </TransitionLink>
    </div>
  );
}

export default function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const project = getProjectBySlug(slug);
  const nextProject = getNextProject(slug);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const titleY = useTransform(heroProgress, [0, 1], ["0%", "100%"]);

  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Hero image zoom effect on load
      gsap.fromTo(
        ".hero-image",
        { scale: 1.3 },
        {
          scale: 1,
          duration: 2,
          ease: "power2.out",
        }
      );

      // Gradient overlay animate in
      gsap.fromTo(
        ".hero-gradient",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          delay: 0.5,
        }
      );

      // Category line expand
      gsap.fromTo(
        ".category-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          delay: 0.8,
          ease: "power2.out",
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [slug]);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main ref={containerRef} className="relative bg-[#0a0908]" style={{ zIndex: 10 }}>
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          className="relative h-[120vh] overflow-hidden"
        >
          {/* Background image with parallax */}
          <motion.div
            className="absolute inset-0"
            style={{ y: heroY, scale: heroScale }}
          >
            <div className="hero-image absolute inset-0">
              <Image
                src={project.heroImage}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="hero-gradient absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/60 to-transparent" />
            <div className="hero-gradient absolute inset-0 bg-gradient-to-r from-[#0a0908]/80 via-transparent to-transparent" />
          </motion.div>

          {/* Content */}
          <motion.div
            className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-12 lg:px-20"
            style={{ opacity: heroOpacity, y: titleY }}
          >
            <div className="max-w-5xl">
              {/* Category and year */}
              <motion.div
                className="flex items-center gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <span
                  className="text-xs uppercase tracking-[0.3em]"
                  style={{ color: accentColor }}
                >
                  {project.category}
                </span>
                <div
                  className="category-line h-px w-16 origin-left"
                  style={{ backgroundColor: accentColorMuted }}
                />
                <span className="text-white/50 text-sm">{project.year}</span>
              </motion.div>

              {/* Title with split text animation */}
              <h1
                ref={titleRef}
                className="text-5xl md:text-7xl lg:text-9xl font-black text-white leading-[0.85] tracking-[-0.04em] mb-8 overflow-hidden"
              >
                <SplitText delay={0.7}>{project.title}</SplitText>
              </h1>

              {/* Tagline */}
              <motion.p
                className="text-xl md:text-2xl lg:text-3xl text-white/60 italic max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                {project.tagline}
              </motion.p>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{ opacity: heroOpacity }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-white/40 text-[10px] uppercase tracking-[0.3em]">
                Scroll
              </span>
              <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent" />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Overview Section */}
        <section className="py-32 md:py-48 px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p
                className="text-xs uppercase tracking-[0.3em] mb-6"
                style={{ color: accentColorMuted }}
              >
                Overview
              </p>
              <p className="text-2xl md:text-3xl lg:text-4xl text-white/80 leading-relaxed max-w-4xl">
                {project.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Challenge & Solution with scroll reveal */}
        <StickyRevealSection challenge={project.challenge} solution={project.solution} />

        {/* Horizontal Gallery */}
        <HorizontalGallery images={project.gallery} title={project.title} />

        {/* Results Section */}
        <ResultsSection result={project.result} metrics={project.metrics} />

        {/* Testimonial */}
        <TestimonialSection
          quote={project.testimonial.quote}
          author={project.testimonial.author}
          role={project.testimonial.role}
        />

        {/* Next Project */}
        <NextProjectSection project={nextProject} />
      </main>
      <Footer />
    </>
  );
}
