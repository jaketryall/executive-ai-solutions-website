"use client";

import { motion } from "framer-motion";

export default function SocialProof() {
  return (
    <section className="py-16 bg-[#0a0a0f] border-y border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Left text */}
          <p className="text-zinc-500 text-sm md:text-base">
            Trusted by businesses across industries
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {[
              { icon: "✓", text: "Fast Turnaround" },
              { icon: "✓", text: "Unlimited Revisions" },
              { icon: "✓", text: "100% Satisfaction" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-2"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">
                  {item.icon}
                </span>
                <span className="text-zinc-400 text-sm">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
