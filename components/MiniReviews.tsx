"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function MiniReviews() {
  const [activeReview, setActiveReview] = useState(0);

  const reviews = [
    {
      id: 1,
      initials: "JR",
      name: "James Richardson",
      role: "CEO",
      company: "TechCorp Solutions",
      review: "The AI agents completely transformed our customer service. We're handling 3x more inquiries with half the staff.",
      rating: 5,
      color: "from-blue-400 to-cyan-500"
    },
    {
      id: 2,
      initials: "SM",
      name: "Sarah Mitchell",
      role: "VP of Operations",
      company: "Global Retail Inc",
      review: "Incredible ROI. Our AI implementation paid for itself in just 2 months through automation savings.",
      rating: 5,
      color: "from-purple-400 to-pink-500"
    },
    {
      id: 3,
      initials: "TC",
      name: "Thomas Chen",
      role: "CTO",
      company: "FinanceHub",
      review: "The 24/7 operations capability has been game-changing. Our AI agents never sleep, and neither do our profits.",
      rating: 5,
      color: "from-green-400 to-emerald-500"
    },
    {
      id: 4,
      initials: "EW",
      name: "Emma Williams",
      role: "Director of Innovation",
      company: "Healthcare Plus",
      review: "Patient scheduling and follow-ups are now completely automated. Staff can focus on actual patient care.",
      rating: 5,
      color: "from-orange-400 to-red-500"
    }
  ];

  // Auto-scroll through reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length);
    }, 5000); // Change review every 5 seconds

    return () => clearInterval(interval);
  }, [reviews.length]);

  const goToNext = () => {
    setActiveReview((prev) => (prev + 1) % reviews.length);
  };

  const goToPrevious = () => {
    setActiveReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="py-12 bg-[#0a0a0a] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-4xl mx-auto">
          {/* Arrow Controls */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 lg:-translate-x-28 z-10 w-12 h-12 bg-zinc-900 hover:bg-zinc-800 rounded-full flex items-center justify-center transition-all group"
            aria-label="Previous review"
          >
            <svg 
              className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 lg:translate-x-28 z-10 w-12 h-12 bg-zinc-900 hover:bg-zinc-800 rounded-full flex items-center justify-center transition-all group"
            aria-label="Next review"
          >
            <svg 
              className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Review Content - Image Left, Content Right */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-[240px_1fr] gap-8 items-center"
            >
          {/* Left Side - Image Box */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 relative">
              {/* Placeholder Image - Using gradient and initials */}
              <div className={`absolute inset-0 bg-gradient-to-br ${reviews[activeReview].color} opacity-20`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/20 text-[60px] font-bold select-none">
                  {reviews[activeReview].initials}
                </div>
              </div>
              
              {/* Company Info Overlay at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 pt-16">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <p className="text-white font-bold text-lg mb-1">{reviews[activeReview].name}</p>
                  <p className="text-zinc-400 text-xs font-normal tracking-normal">
                    {reviews[activeReview].company}, {reviews[activeReview].role}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right Side - Review Content */}
          <div>
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <motion.svg
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
              ))}
            </div>

            {/* Review Text */}
            <blockquote className="text-xl lg:text-2xl text-white font-medium mb-6 leading-relaxed">
              "{reviews[activeReview].review}"
            </blockquote>

            {/* Bottom Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Customer since 2023</p>
              </div>
              <button className="text-[#0066ff] hover:text-[#0052cc] transition-colors flex items-center gap-2 group">
                <span>Read full case study</span>
                <svg 
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveReview(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeReview === index 
                    ? 'w-8 bg-[#0066ff]' 
                    : 'bg-zinc-600 hover:bg-zinc-500'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}