"use client";

import { motion } from "framer-motion";

// Placeholder logos - these would be replaced with actual client/technology logos
const logos = [
  { name: "Vercel", svg: "M12 2L2 19.5h20L12 2z" },
  { name: "Next.js", svg: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" },
  { name: "React", svg: "M12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" },
  { name: "TypeScript", svg: "M3 3h18v18H3V3zm11.46 11.04v1.36c.23.12.53.22.88.29.36.07.73.11 1.11.11.38 0 .72-.04 1.02-.13.3-.09.56-.21.76-.38.21-.17.37-.37.48-.62.11-.25.16-.53.16-.85 0-.24-.04-.45-.11-.64-.08-.19-.19-.36-.34-.52-.15-.15-.34-.29-.57-.42-.23-.13-.5-.25-.81-.37-.23-.09-.44-.18-.62-.27-.18-.09-.34-.18-.46-.29-.13-.1-.23-.22-.29-.35-.06-.13-.09-.28-.09-.45 0-.16.03-.31.09-.44.06-.13.15-.24.27-.34.12-.1.27-.17.45-.23.18-.05.39-.08.63-.08.18 0 .36.02.54.05.18.03.36.08.54.14.18.06.35.13.52.22.17.09.32.18.46.29V8.85c-.25-.1-.53-.17-.84-.21-.31-.05-.64-.07-.98-.07-.36 0-.7.04-1 .14-.3.09-.56.23-.78.41-.22.18-.39.4-.51.67-.12.26-.19.56-.19.89 0 .4.1.74.29 1.03.19.29.52.54.97.76.25.11.48.22.69.32.21.1.39.21.54.32.15.11.27.24.35.38.08.14.12.31.12.51 0 .16-.03.31-.08.44-.05.13-.14.24-.26.33-.12.09-.27.16-.45.21-.18.05-.4.08-.65.08-.3 0-.6-.05-.9-.14-.3-.09-.58-.24-.85-.44zm-3.96-1.5h2.47V11.4H6.53v2.14h2.47v6.47h2.5v-6.47z" },
  { name: "Tailwind", svg: "M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.5 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.5 12 7 12z" },
  { name: "Figma", svg: "M8 24c2.21 0 4-1.79 4-4v-4H8c-2.21 0-4 1.79-4 4s1.79 4 4 4zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4h4v-8H8zm0-8C5.79 4 4 5.79 4 8s1.79 4 4 4h4V4H8zm8 0h-4v8h4c2.21 0 4-1.79 4-4s-1.79-4-4-4zm0 12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" },
];

export default function LogoCloud() {
  return (
    <section className="py-16 md:py-20 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] border-b border-zinc-800">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-sm text-zinc-500 uppercase tracking-[0.2em] mb-12"
        >
          Technologies We Work With
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, color: "#b89a5e" }}
              className="group cursor-pointer"
            >
              <div className="flex flex-col items-center gap-3">
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 md:w-10 md:h-10 text-zinc-500 group-hover:text-[#b89a5e] transition-colors duration-300"
                  fill="currentColor"
                >
                  <path d={logo.svg} />
                </svg>
                <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">
                  {logo.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
