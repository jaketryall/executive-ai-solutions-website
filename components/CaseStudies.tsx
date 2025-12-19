"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity.image";

interface PortfolioProject {
  _id: string;
  name: string;
  type: string;
  url: string;
  description: string;
  previewImage?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  color: string;
  tech: string[];
  features: string[];
  stats?: {
    visitors?: string;
    conversion?: string;
    speed?: string;
  };
  timeline?: string;
  featured?: boolean;
}

interface CaseStudiesProps {
  projects?: PortfolioProject[];
}

export default function CaseStudies({ projects = [] }: CaseStudiesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [selectedProject, setSelectedProject] = useState<number>(0);

  // Fallback data if no projects from Sanity
  const fallbackProjects: PortfolioProject[] = [
    {
      _id: "1",
      name: "TechCorp Solutions",
      type: "Enterprise SaaS",
      url: "techcorp.com",
      description: "Automated customer support system handling 10,000+ inquiries daily",
      color: "#0066ff",
      tech: ["GPT-4", "Next.js", "Python", "Redis"],
      features: [
        "24/7 intelligent customer support",
        "Multi-language support in 15 languages",
        "Seamless CRM integration",
        "Real-time sentiment analysis"
      ],
      stats: {
        visitors: "85% reduction",
        conversion: "in response time",
        speed: "10,000+ tickets/day"
      },
      timeline: "6 weeks",
      featured: true
    },
    {
      _id: "2",
      name: "Global Retail Inc",
      type: "E-Commerce",
      url: "globalretail.com",
      description: "AI-powered inventory management reducing stockouts by 60%",
      color: "#00d4ff",
      tech: ["Claude AI", "React", "Node.js", "PostgreSQL"],
      features: [
        "Predictive inventory forecasting",
        "Automated reorder system",
        "Real-time demand analysis",
        "Supply chain optimization"
      ],
      stats: {
        visitors: "60% fewer",
        conversion: "stockouts",
        speed: "$2.4M saved/year"
      },
      timeline: "8 weeks",
      featured: true
    },
    {
      _id: "3",
      name: "HealthTech Plus",
      type: "Healthcare",
      url: "healthtechplus.com",
      description: "Patient intake automation saving 30 hours per week per location",
      color: "#00ff88",
      tech: ["OpenAI", "Vue.js", "Django", "MongoDB"],
      features: [
        "HIPAA-compliant AI processing",
        "Insurance verification automation",
        "Appointment scheduling AI",
        "Medical record extraction"
      ],
      stats: {
        visitors: "30 hrs/week",
        conversion: "saved per location",
        speed: "99.9% accuracy"
      },
      timeline: "4 weeks",
      featured: true
    }
  ];

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;
  const currentProject = displayProjects[selectedProject] || displayProjects[0];

  return (
    <section ref={ref} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0066ff]/5 via-transparent to-[#0066ff]/5 opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Real Results, <span className="text-[#0066ff]">Real ROI</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
            Don&apos;t just take our word for it. See how we&apos;ve transformed operations 
            for companies just like yours with measurable, game-changing results.
          </p>
        </motion.div>

        {/* Project Selector */}
        {displayProjects.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {displayProjects.slice(0, 4).map((project, index) => (
              <motion.button
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => setSelectedProject(index)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedProject === index
                    ? "bg-[#0066ff] text-white shadow-lg shadow-[#0066ff]/30"
                    : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {project.name}
              </motion.button>
            ))}
          </div>
        )}

        {/* Case Study Detail */}
        <motion.div
          key={currentProject._id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 backdrop-blur-sm rounded-2xl border border-zinc-800 overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Side - Project Details */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentProject.color }}
                />
                <span className="text-zinc-500 text-sm uppercase tracking-wider">
                  {currentProject.type}
                </span>
                {currentProject.featured && (
                  <span className="px-3 py-1 bg-[#0066ff]/20 text-[#0066ff] text-xs font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {currentProject.name}
              </h3>

              <p className="text-zinc-300 text-lg mb-8">
                {currentProject.description}
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {currentProject.stats && Object.entries(currentProject.stats).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-[#0d1117] rounded-lg border border-zinc-800">
                    <p className="text-2xl font-bold text-white mb-1">{value}</p>
                    <p className="text-zinc-500 text-xs capitalize">
                      {key === "visitors" ? "" : key === "conversion" ? "" : ""}
                    </p>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="mb-8">
                <h4 className="text-sm uppercase tracking-wider text-zinc-500 mb-4">
                  What We Delivered:
                </h4>
                <ul className="space-y-2">
                  {currentProject.features.slice(0, 4).map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-zinc-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div className="mb-8">
                <h4 className="text-sm uppercase tracking-wider text-zinc-500 mb-3">
                  Technology Used:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentProject.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-zinc-800/50 text-zinc-400 text-sm rounded-full border border-zinc-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline & CTA */}
              <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                <div>
                  <p className="text-zinc-500 text-sm">Implementation Time</p>
                  <p className="text-white font-semibold">{currentProject.timeline || "4-6 weeks"}</p>
                </div>
                <motion.button
                  className="px-6 py-3 bg-[#0066ff] text-white font-medium rounded-lg hover:bg-[#0052cc] transition-all duration-300 inline-flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Similar Results
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 lg:min-h-[600px] flex items-center justify-center p-8">
              {currentProject.previewImage ? (
                <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={urlForImage(currentProject.previewImage)}
                    alt={currentProject.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <div 
                    className="w-32 h-32 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${currentProject.color}20` }}
                  >
                    <svg 
                      className="w-16 h-16"
                      style={{ color: currentProject.color }}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    View live at
                  </p>
                  <p className="text-white font-medium text-lg">
                    {currentProject.url}
                  </p>
                </div>
              )}

              {/* Floating metrics badges */}
              <div className="absolute top-8 right-8 space-y-3">
                <div className="px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-500/30">
                  <p className="text-green-400 font-bold">ROI Positive</p>
                </div>
                <div className="px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-500/30">
                  <p className="text-blue-400 font-bold">Still Growing</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-zinc-400 mb-6">
            Ready to become our next success story?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              className="px-8 py-4 bg-[#0066ff] text-white font-medium rounded-xl hover:bg-[#0052cc] transition-all duration-300 inline-flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Transformation
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.button>
            <motion.button
              className="px-8 py-4 bg-zinc-900 text-white font-medium rounded-xl border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Case Studies
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}