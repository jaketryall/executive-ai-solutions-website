"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const linkVariants = {
    initial: { x: 0 },
    hover: { x: 5, transition: { duration: 0.2 } }
  };
  
  return (
    <footer className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-zinc-950 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-10" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 mb-16">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-light mb-4 text-white text-center lg:text-left">
              <span className="text-gradient-subtle">Executive AI Solutions</span>
            </h3>
            <p className="text-zinc-600 font-light text-lg text-center lg:text-left">
              Practical AI solutions that work.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-light text-zinc-500 mb-6 uppercase tracking-wider text-center lg:text-left">Navigate</h4>
              <ul className="space-y-3">
                {[
                  { href: "#services", label: "Services" },
                  { href: "#use-cases", label: "Use Cases" },
                  { href: "#about", label: "About" },
                ].map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <motion.a 
                      href={link.href} 
                      className="text-zinc-600 hover:text-white transition-colors duration-300 font-light block text-center lg:text-left lg:inline-block"
                      variants={linkVariants}
                      initial="initial"
                      whileHover="hover"
                    >
                      {link.label}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-light text-zinc-500 mb-6 uppercase tracking-wider text-center lg:text-left">Connect</h4>
              <ul className="space-y-3">
                {[
                  { href: "#contact", label: "Contact" },
                  { href: "mailto:jaker@executiveaisolutions.com", label: "Email" },
                ].map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <motion.a 
                      href={link.href} 
                      className="text-zinc-600 hover:text-white transition-colors duration-300 font-light block text-center lg:text-left lg:inline-block"
                      variants={linkVariants}
                      initial="initial"
                      whileHover="hover"
                    >
                      {link.label}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-zinc-700 font-light">
            © {currentYear} Executive AI Solutions
          </p>
          <motion.p 
            className="text-sm text-zinc-700 font-light"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            All rights reserved
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}