"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ease } from "@/lib/motion";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-6"
      style={{ backgroundColor: "var(--paper)", color: "var(--ink)" }}
    >
      {/* Giant 404 as background gesture */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: ease.expoOut }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span
          className="font-display font-semibold leading-none"
          style={{
            fontSize: "clamp(12rem, 36vw, 32rem)",
            color: "rgba(26,24,22,0.06)",
            letterSpacing: "-0.06em",
          }}
        >
          404
        </span>
      </motion.div>

      <div className="relative z-10 text-center max-w-lg">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: ease.expoOut }}
          className="text-[11px] uppercase tracking-[0.3em] mb-6"
          style={{ color: "var(--taupe)" }}
        >
          Lost at sea
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: ease.expoOut }}
          className="font-display font-semibold leading-[1]"
          style={{
            fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
            letterSpacing: "-0.04em",
          }}
        >
          This page got away from me.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: ease.expoOut }}
          className="mt-6 text-base md:text-lg"
          style={{ color: "var(--taupe)" }}
        >
          The link doesn't go anywhere anymore. Let's get you back to the work.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: ease.expoOut }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 h-11 pl-5 pr-2 rounded-full press"
            style={{ background: "var(--ink)", color: "var(--paper)" }}
          >
            <span className="text-[13px] font-medium tracking-tight">Back home</span>
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:translate-x-[2px]"
              style={{ background: "var(--paper)", color: "var(--ink)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
          <Link
            href="/work"
            className="h-11 px-5 inline-flex items-center rounded-full press text-[13px]"
            style={{
              color: "var(--ink)",
              border: "1px solid rgba(26,24,22,0.12)",
            }}
          >
            Browse work
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
