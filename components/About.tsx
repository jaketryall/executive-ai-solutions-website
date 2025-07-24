"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-8">About Executive AI Solutions</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 text-lg text-zinc-300"
        >
          <p>
            We believe AI should be practical, not theoretical. While others chase the latest buzzwords, 
            we focus on building AI solutions that actually work for your business today.
          </p>
          
          <p>
            Founded by entrepreneurs who understand the real challenges businesses face, Executive AI Solutions 
            bridges the gap between cutting-edge AI technology and practical business applications.
          </p>
          
          <p>
            Our mission is simple: Deploy AI employees that enhance your workforce, automate repetitive tasks, 
            and scale your operations without limits. No jargon, no complexity—just results.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 p-8 bg-zinc-900 rounded-2xl"
        >
          <h3 className="text-2xl font-semibold mb-4">Why Choose Us?</h3>
          <ul className="space-y-3 text-zinc-300">
            <li className="flex items-start">
              <span className="text-green-400 mr-3">✓</span>
              <span>Practical solutions that work from day one</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3">✓</span>
              <span>No-nonsense approach to AI implementation</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3">✓</span>
              <span>Proven track record across multiple industries</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3">✓</span>
              <span>24/7 AI workforce that scales with your needs</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}