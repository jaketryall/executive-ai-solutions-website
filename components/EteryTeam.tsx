"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function EteryTeam() {
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  const teamMembers = [
    {
      id: 1,
      name: "Lucas Harris",
      role: "AI Expert",
      image: "/team/lucas.jpg", // Placeholder
      bio: "Visionary leader passionate about building innovative digital solutions and growing strong teams.",
      social: {
        twitter: "#",
        linkedin: "#"
      },
      color: "from-cyan-400 to-blue-500"
    },
    {
      id: 2,
      name: "Peter Johnson",
      role: "Founder at Etery",
      image: "/team/peter.jpg", // Placeholder
      bio: "Creative founder with 12+ years of experience in AI and machine learning technologies.",
      social: {
        twitter: "#",
        linkedin: "#"
      },
      color: "from-orange-400 to-red-500"
    },
    {
      id: 3,
      name: "Daniel Lee",
      role: "Full-Stack Developer",
      image: "/team/daniel.jpg", // Placeholder
      bio: "Expert developer specializing in scalable AI infrastructure and cloud architectures.",
      social: {
        twitter: "#",
        linkedin: "#"
      },
      color: "from-blue-400 to-purple-500"
    },
    {
      id: 4,
      name: "Sofia Martin",
      role: "Product Manager",
      image: "/team/sofia.jpg", // Placeholder
      bio: "Strategic product leader focused on delivering AI solutions that drive real business value.",
      social: {
        twitter: "#",
        linkedin: "#"
      },
      color: "from-pink-400 to-purple-500"
    }
  ];

  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Our Team
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Skilled experts and generic teams — we craft tailored AI systems that
            drive success and lasting impact.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div
                className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#0066ff]/50 transition-all duration-300 cursor-pointer h-[320px]"
                onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
              >
                {/* Full Background Image - using color as placeholder for now */}
                <div className={`absolute inset-0 bg-gradient-to-br ${member.color}`} />

                {/* Dark box that expands - contains name/title that move with it */}
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedMember === member.id ? "calc(100% - 24px)" : "72px",
                    bottom: "12px"
                  }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 1.2
                  }}
                  style={{ willChange: "height" }}
                  className="absolute left-3 right-3 bg-black rounded-xl z-10 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 h-full flex flex-col">
                    {/* Header with name, role and icon - always visible */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-base">{member.name}</h3>
                        <p className="text-zinc-400 text-sm">{member.role}</p>
                      </div>
                      
                      {/* Plus/Minus Icon with animation */}
                      <button 
                        onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-all duration-200"
                      >
                        <AnimatePresence mode="wait">
                          {expandedMember !== member.id ? (
                            <motion.svg
                              key="plus"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ 
                                type: "spring",
                                stiffness: 500,
                                damping: 30
                              }}
                              className="w-4 h-4 text-zinc-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </motion.svg>
                          ) : (
                            <motion.svg
                              key="minus"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ 
                                type: "spring",
                                stiffness: 500,
                                damping: 30
                              }}
                              className="w-4 h-4 text-zinc-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </motion.svg>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>

                    {/* Bio and social links - only visible when expanded */}
                    <AnimatePresence mode="wait">
                      {expandedMember === member.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ 
                            opacity: {
                              duration: 0.3,
                              ease: "easeInOut"
                            }
                          }}
                          className="flex-1 flex flex-col mt-4"
                        >
                          {/* Bio text */}
                          <p className="text-zinc-300 text-sm leading-relaxed flex-1">{member.bio}</p>
                      
                          {/* Social Links at bottom */}
                          <div className="flex gap-2 mt-4">
                            <a
                              href={member.social.twitter}
                              className="w-8 h-8 bg-zinc-800/50 rounded flex items-center justify-center hover:bg-zinc-700/50 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                              </svg>
                            </a>
                            <a
                              href={member.social.linkedin}
                              className="w-8 h-8 bg-zinc-800/50 rounded flex items-center justify-center hover:bg-zinc-700/50 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}