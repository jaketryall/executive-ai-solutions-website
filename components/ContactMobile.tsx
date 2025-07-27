"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
// import { useReducedMotion } from "@/hooks/useMobile";

export default function ContactMobile() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  // const prefersReducedMotion = useReducedMotion();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };
  
  const inputVariants = {
    focused: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    unfocused: {
      scale: 1,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Enhanced background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,102,255,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.15),transparent_50%)]" />
      
      <div className="relative z-10 px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-medium text-white mb-4 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">Let&apos;s Talk</h2>
          <p className="text-zinc-300 max-w-md mx-auto font-normal">
            Ready to transform your business with AI? We&apos;re here to help.
          </p>
        </motion.div>
        
        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field */}
            <motion.div
              variants={inputVariants}
              animate={focusedField === "name" ? "focused" : "unfocused"}
              className="relative"
            >
              <input
                type="text"
                id="name"
                required
                className="w-full px-5 py-5 bg-gradient-to-b from-zinc-800/60 to-zinc-900/60 backdrop-blur-md border border-zinc-700/50 rounded-2xl text-white placeholder-transparent peer focus:border-[#0066ff] focus:shadow-[0_0_20px_rgba(0,102,255,0.3)] transition-all"
                placeholder="Name"
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
              <label
                htmlFor="name"
                className="absolute left-4 -top-2.5 bg-black px-3 text-sm text-zinc-300 font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-5 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-black peer-focus:text-[#0066ff] peer-focus:font-medium"
              >
                Your Name
              </label>
            </motion.div>
            
            {/* Email field */}
            <motion.div
              variants={inputVariants}
              animate={focusedField === "email" ? "focused" : "unfocused"}
              className="relative"
            >
              <input
                type="email"
                id="email"
                required
                className="w-full px-5 py-5 bg-gradient-to-b from-zinc-800/60 to-zinc-900/60 backdrop-blur-md border border-zinc-700/50 rounded-2xl text-white placeholder-transparent peer focus:border-[#0066ff] focus:shadow-[0_0_20px_rgba(0,102,255,0.3)] transition-all"
                placeholder="Email"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
              <label
                htmlFor="email"
                className="absolute left-4 -top-2.5 bg-black px-3 text-sm text-zinc-300 font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-5 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-black peer-focus:text-[#0066ff] peer-focus:font-medium"
              >
                Email Address
              </label>
            </motion.div>
            
            {/* Message field */}
            <motion.div
              variants={inputVariants}
              animate={focusedField === "message" ? "focused" : "unfocused"}
              className="relative"
            >
              <textarea
                id="message"
                required
                rows={4}
                className="w-full px-5 py-5 bg-gradient-to-b from-zinc-800/60 to-zinc-900/60 backdrop-blur-md border border-zinc-700/50 rounded-2xl text-white placeholder-transparent peer focus:border-[#0066ff] focus:shadow-[0_0_20px_rgba(0,102,255,0.3)] transition-all resize-none"
                placeholder="Message"
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
              />
              <label
                htmlFor="message"
                className="absolute left-4 -top-2.5 bg-black px-3 text-sm text-zinc-300 font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-5 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-black peer-focus:text-[#0066ff] peer-focus:font-medium"
              >
                Your Message
              </label>
            </motion.div>
            
            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || isSuccess}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 bg-gradient-to-r from-[#0066ff] to-blue-600 text-white rounded-full font-medium relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all group"
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </motion.div>
                ) : isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Message Sent!</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Send Message
                  </motion.span>
                )}
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-r from-[#0066ff] to-blue-600 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
              
              {/* Progress bar */}
              {isSubmitting && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "linear" }}
                />
              )}
            </motion.button>
          </form>
          
          {/* Success message */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 p-5 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-2xl backdrop-blur-sm shadow-lg shadow-green-500/10"
              >
                <p className="text-green-400 text-center text-sm font-medium">
                  Thanks for reaching out! We&apos;ll get back to you within 24 hours.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Quick contact options */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-zinc-400 text-sm mb-6 font-medium">Or reach us directly</p>
          <div className="flex justify-center">
            <a
              href="mailto:jaker@executiveaisolutions.com"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-zinc-800/80 to-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-full text-zinc-300 hover:text-white hover:border-zinc-600 transition-all shadow-lg group"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}