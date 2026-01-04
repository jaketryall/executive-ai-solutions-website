"use client";

import { motion } from "framer-motion";

// Smooth easing curve
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div
      className="flex-shrink-0 w-[400px] md:w-[500px] p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5 text-[#b89a5e]"
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
        <div className="w-12 h-12 rounded-full bg-[#9a7b3c] flex items-center justify-center text-sm font-bold text-white">
          {testimonial.initials}
        </div>
        <div>
          <p className="font-semibold text-white">{testimonial.author}</p>
          <p className="text-sm text-zinc-500">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

// Infinite scroll row using CSS animation
function MarqueeRow({ direction = "left", speed = 40 }: { direction?: "left" | "right"; speed?: number }) {
  const items = [...testimonials, ...testimonials]; // Duplicate for seamless loop
  const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex gap-6 pr-6 ${animationClass}`}
        style={{ "--marquee-duration": `${speed}s` } as React.CSSProperties}
      >
        {items.map((testimonial, index) => (
          <TestimonialCard key={`${testimonial.author}-${index}`} testimonial={testimonial} />
        ))}
      </div>
      {/* Duplicate track for seamless loop */}
      <div
        className={`flex gap-6 pr-6 ${animationClass}`}
        style={{ "--marquee-duration": `${speed}s` } as React.CSSProperties}
      >
        {items.map((testimonial, index) => (
          <TestimonialCard key={`${testimonial.author}-dup-${index}`} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative bg-[#0a0a0a] py-24 md:py-32 overflow-hidden rounded-t-[3rem] -mt-12 z-30 shadow-section-stack">
      {/* Animated border shine effect - rotating conic gradient */}
      <div className="absolute inset-0 rounded-t-[3rem] pointer-events-none overflow-hidden">
        {/* Rotating gradient border */}
        <motion.div
          className="absolute -inset-[1px] rounded-t-[3rem]"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, transparent 340deg, rgba(255, 200, 150, 0.4) 350deg, rgba(255, 220, 180, 0.9) 355deg, rgba(255, 200, 150, 0.4) 360deg)",
            filter: "blur(1px)",
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner mask to show only the border */}
        <div
          className="absolute inset-[1px] rounded-t-[calc(3rem-1px)] bg-[#0a0a0a]"
        />

        {/* Static border on top */}
        <div className="absolute inset-0 rounded-t-[3rem] border-t border-l border-r border-zinc-800/50" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 mb-12 md:mb-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="text-[#b89a5e] text-sm font-medium tracking-wider uppercase mb-4"
          >
            Testimonials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight"
          >
            Trusted By <span className="text-[#b89a5e]">Industry</span>
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight"
          >
            Leaders
          </motion.h2>
        </div>
      </div>

      {/* Marquee Rows */}
      <div className="relative z-10 space-y-6">
        <MarqueeRow direction="left" speed={40} />
        <MarqueeRow direction="right" speed={35} />
      </div>

      {/* Gradient overlays for fade effect */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none z-10" />
    </section>
  );
}
