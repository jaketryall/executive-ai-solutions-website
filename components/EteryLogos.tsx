"use client";

import { motion } from "framer-motion";

export default function EteryLogos() {
  const companies = [
    "IPSUM", "LUMI", "IPSUM", "LOGO", "LUMI", "IPSUM", "LOGO", "LUMI"
  ];

  return (
    <section className="pt-0 pb-2 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-white text-sm mb-4"
        >
          Trusted by 100+ companies worldwide
        </motion.p>

        {/* Logo scroll container */}
        <div className="relative">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />
          
          {/* Scrolling logos */}
          <motion.div
            className="flex gap-12"
            animate={{
              x: [-1000, 0],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate logo sets for seamless scrolling */}
            {[...Array(3)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-12 items-center">
                {companies.map((company, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    className="text-zinc-400 text-2xl font-bold whitespace-nowrap select-none"
                  >
                    {company}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}