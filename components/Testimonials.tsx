"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    quote: "The website exceeded our expectations. Clean, professional, and it actually brings in new students every week.",
    author: "Desert Wings Aviation",
    role: "Flight Training Academy",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40 px-6 md:px-12 lg:px-24 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <span className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 block">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#0a0a0a] tracking-tight">
            Real Results
          </h2>
        </motion.div>

        {/* Testimonial */}
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.author}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="max-w-4xl"
          >
            <blockquote className="mb-8">
              <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-[#0a0a0a] leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#2563eb] flex items-center justify-center text-white font-semibold">
                {testimonial.author.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-[#0a0a0a]">{testimonial.author}</p>
                <p className="text-sm text-zinc-500">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
