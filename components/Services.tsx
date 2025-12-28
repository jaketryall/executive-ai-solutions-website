"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Brand Identity",
    description: "Crafting bold, memorable brand identities from logos to full brand guidelines that set you apart from competitors.",
    features: ["Logo Design", "Color Systems", "Typography", "Brand Guidelines"],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Web Design",
    description: "High-performance websites with stunning visuals and seamless user experiences that convert visitors into customers.",
    features: ["Custom Design", "Responsive", "Animations", "SEO-Ready"],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "UI/UX Design",
    description: "Intuitive digital experiences designed to enhance user engagement and drive conversions for your business.",
    features: ["User Research", "Wireframing", "Prototyping", "Testing"],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Development",
    description: "Clean, scalable code that brings designs to life with modern technologies and best practices.",
    features: ["Next.js", "React", "CMS Integration", "Deployment"],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: typeof services[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative h-full p-8 md:p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800 overflow-hidden"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{
            background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.08), transparent 40%)",
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <motion.div
              className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500"
              animate={{
                scale: isHovered ? 1.1 : 1,
                backgroundColor: isHovered ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)",
              }}
              transition={{ duration: 0.3 }}
            >
              {service.icon}
            </motion.div>

            <span className="text-sm font-mono text-zinc-600">{service.number}</span>
          </div>

          {/* Title */}
          <motion.h3
            className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-blue-500 transition-colors duration-300"
            animate={{ x: isHovered ? 8 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {service.title}
          </motion.h3>

          {/* Description */}
          <p className="text-zinc-400 leading-relaxed mb-8">{service.description}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-8">
            {service.features.map((feature, i) => (
              <motion.span
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                className="px-4 py-2 text-sm text-zinc-400 bg-zinc-800/50 border border-zinc-700/50 rounded-full"
              >
                {feature}
              </motion.span>
            ))}
          </div>

          {/* Learn more link */}
          <motion.div
            className="flex items-center gap-2 text-sm font-medium text-blue-500"
            animate={{ x: isHovered ? 8 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span>Learn more</span>
            <motion.svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.div>
        </div>

        {/* Hover border accent */}
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-blue-500/0"
          animate={{
            borderColor: isHovered ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0)",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative bg-[#0a0a0a] py-32">
      <div className="px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 mb-20">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-blue-500 text-sm font-medium tracking-wider uppercase mb-4"
              >
                What We Do
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
              >
                Our Services
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-end"
            >
              <p className="text-xl text-zinc-400 leading-relaxed">
                End-to-end design and development services to help ambitious brands
                stand out and convert more customers.
              </p>
            </motion.div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative p-10 md:p-16 rounded-3xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
              {/* Content */}
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Ready to start your project?
                  </h3>
                  <p className="text-zinc-400 text-lg">
                    Every project includes unlimited revisions and 30 days of support.
                  </p>
                </div>

                <Link href="#contact">
                  <motion.button
                    className="px-8 py-4 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center gap-2">
                      Get a Quote
                      <span>→</span>
                    </span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
