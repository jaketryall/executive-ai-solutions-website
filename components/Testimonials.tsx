"use client";

import { motion, useMotionValue, useSpring, PanInfo } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const testimonials = [
  {
    quote: "The website exceeded our expectations. Clean, professional, and it actually brings in new students every week. The ROI has been incredible.",
    author: "Michael Torres",
    role: "Owner, Desert Wings Aviation",
    rating: 5,
    result: "3x increase in student inquiries",
  },
  {
    quote: "Working with them was seamless. They understood our vision immediately and delivered a site that perfectly captures our brand. Highly recommend.",
    author: "Sarah Chen",
    role: "CEO, Meridian Consulting",
    rating: 5,
    result: "40% improvement in lead quality",
  },
  {
    quote: "Our new website has transformed how clients perceive us. The attention to detail and user experience is outstanding. Worth every penny.",
    author: "James Richardson",
    role: "Principal, Apex Interiors",
    rating: 5,
    result: "Featured in Design Weekly",
  },
  {
    quote: "Fast, responsive, and incredibly talented. They took our outdated site and turned it into something we're genuinely proud to show clients.",
    author: "Emily Watson",
    role: "Founder, Bloom Marketing",
    rating: 5,
    result: "2x website conversion rate",
  },
  {
    quote: "The level of professionalism and creativity exceeded all expectations. Our bounce rate dropped significantly after the redesign.",
    author: "David Park",
    role: "Director, Summit Tech",
    rating: 5,
    result: "60% reduction in bounce rate",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-[#2563eb]" : "text-zinc-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const clientWidth = carouselRef.current.clientWidth;
      setCarouselWidth(scrollWidth - clientWidth);
    }
  }, []);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else if (info.offset.x < -threshold && activeIndex < testimonials.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40 bg-white overflow-hidden rounded-t-[2rem] -mt-8"
    >
      <div className="max-w-7xl mx-auto relative z-10 px-6 md:px-12 lg:px-24">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-12 h-px bg-zinc-300 origin-left"
              />
              <span className="text-sm text-zinc-500 uppercase tracking-[0.2em]">
                Testimonials
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#0a0a0a] tracking-tight">
              Client <span className="font-serif italic text-[#2563eb]">success</span> stories
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="flex gap-3">
            <motion.button
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                activeIndex === 0
                  ? "border-zinc-200 text-zinc-300 cursor-not-allowed"
                  : "border-zinc-300 text-zinc-600 hover:border-[#2563eb] hover:text-[#2563eb]"
              }`}
              whileHover={activeIndex > 0 ? { scale: 1.05 } : {}}
              whileTap={activeIndex > 0 ? { scale: 0.95 } : {}}
              disabled={activeIndex === 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              onClick={() => setActiveIndex(Math.min(testimonials.length - 1, activeIndex + 1))}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                activeIndex === testimonials.length - 1
                  ? "border-zinc-200 text-zinc-300 cursor-not-allowed"
                  : "border-zinc-300 text-zinc-600 hover:border-[#2563eb] hover:text-[#2563eb]"
              }`}
              whileHover={activeIndex < testimonials.length - 1 ? { scale: 1.05 } : {}}
              whileTap={activeIndex < testimonials.length - 1 ? { scale: 0.95 } : {}}
              disabled={activeIndex === testimonials.length - 1}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="relative bg-[#0a0a0a] rounded-2xl p-8 md:p-12 lg:p-16">
            {/* Large quote mark */}
            <div className="absolute top-8 right-8 md:top-12 md:right-12 text-[120px] md:text-[180px] leading-none font-serif text-white/5 select-none">
              &ldquo;
            </div>

            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <StarRating rating={testimonials[activeIndex].rating} />

              <blockquote className="mt-6 mb-8">
                <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-relaxed">
                  &ldquo;{testimonials[activeIndex].quote}&rdquo;
                </p>
              </blockquote>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-xl font-semibold">
                    {testimonials[activeIndex].author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg">{testimonials[activeIndex].author}</p>
                    <p className="text-zinc-400">{testimonials[activeIndex].role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-[#2563eb]/10 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                  <span className="text-sm text-[#2563eb] font-medium">{testimonials[activeIndex].result}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonial cards carousel */}
        <div className="relative">
          <motion.div
            ref={carouselRef}
            className="flex gap-6 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: -carouselWidth, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                className={`flex-shrink-0 w-[320px] md:w-[400px] p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                  index === activeIndex
                    ? "border-[#2563eb] bg-blue-50/50"
                    : "border-zinc-200 bg-white hover:border-zinc-300"
                }`}
                onClick={() => setActiveIndex(index)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <StarRating rating={testimonial.rating} />
                <p className="mt-4 text-zinc-600 line-clamp-3">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-medium">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-[#0a0a0a] text-sm">{testimonial.author}</p>
                    <p className="text-xs text-zinc-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Drag hint */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-zinc-400 mt-6 md:hidden"
          >
            Drag to explore more reviews
          </motion.p>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 bg-[#2563eb]"
                  : "bg-zinc-300 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 pt-12 border-t border-zinc-200 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "50+", label: "Happy Clients" },
            { value: "5.0", label: "Average Rating" },
            { value: "100%", label: "Satisfaction Rate" },
            { value: "48hr", label: "Avg Response Time" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-semibold text-[#0a0a0a]">{stat.value}</p>
              <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
