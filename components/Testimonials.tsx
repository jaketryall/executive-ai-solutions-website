"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    quote: "The website exceeded our expectations. Clean, professional, and it actually brings in new students every week.",
    author: "Michael Torres",
    role: "Owner, Desert Wings Aviation",
    initials: "MT",
  },
  {
    quote: "Working with them was seamless. They understood our vision immediately and delivered a site that perfectly captures our brand.",
    author: "Sarah Chen",
    role: "CEO, Meridian Consulting",
    initials: "SC",
  },
  {
    quote: "Our new website has transformed how clients perceive us. The attention to detail is outstanding.",
    author: "James Richardson",
    role: "Principal, Apex Interiors",
    initials: "JR",
  },
  {
    quote: "Fast, responsive, and incredibly talented. They took our outdated site and turned it into something we're proud of.",
    author: "Emily Watson",
    role: "Founder, Bloom Marketing",
    initials: "EW",
  },
  {
    quote: "The ROI has been incredible. Our conversion rate doubled within the first month of launch.",
    author: "David Park",
    role: "Director, Vertex Labs",
    initials: "DP",
  },
  {
    quote: "Best investment we've made for our business. The design quality is on par with sites costing 10x more.",
    author: "Lisa Martinez",
    role: "Owner, Artisan Coffee",
    initials: "LM",
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      className="flex-shrink-0 w-[400px] md:w-[500px] p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-lg md:text-xl text-white leading-relaxed mb-8">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
          {testimonial.initials}
        </div>
        <div>
          <p className="font-semibold text-white">{testimonial.author}</p>
          <p className="text-sm text-zinc-500">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Infinite scroll row
function MarqueeRow({ direction = "left", speed = 30 }: { direction?: "left" | "right"; speed?: number }) {
  const items = [...testimonials, ...testimonials]; // Duplicate for seamless loop

  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex gap-6"
        animate={{
          x: direction === "left" ? [0, -50 * testimonials.length + "%"] : [-50 * testimonials.length + "%", 0],
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {items.map((testimonial, index) => (
          <TestimonialCard key={`${testimonial.author}-${index}`} testimonial={testimonial} index={0} />
        ))}
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section ref={sectionRef} className="relative bg-[#0a0a0a] py-24 md:py-32 overflow-hidden">
      {/* Header */}
      <div className="px-6 md:px-12 lg:px-20 mb-12 md:mb-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-blue-500 text-sm font-medium tracking-wider uppercase mb-4"
              >
                Testimonials
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase"
              >
                Trusted By <span className="text-blue-500">Industry</span>
                <br />
                Leaders
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-8"
            >
              <div className="text-center">
                <p className="text-4xl font-bold text-white">50+</p>
                <p className="text-sm text-zinc-500">Happy Clients</p>
              </div>
              <div className="w-px h-12 bg-zinc-800" />
              <div className="text-center">
                <p className="text-4xl font-bold text-white">5.0</p>
                <p className="text-sm text-zinc-500">Avg Rating</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marquee Rows */}
      <div className="space-y-6">
        <motion.div style={{ x: y1 }}>
          <MarqueeRow direction="left" speed={40} />
        </motion.div>
        <motion.div style={{ x: y2 }}>
          <MarqueeRow direction="right" speed={35} />
        </motion.div>
      </div>

      {/* Gradient overlays for fade effect */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none z-10" />
    </section>
  );
}
