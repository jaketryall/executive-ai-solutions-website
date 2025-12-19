"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export default function IndustryGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [hoveredIndustry, setHoveredIndustry] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Create transform values for alternating row movements
  const leftTransform = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const rightTransform = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const industries = [
    {
      id: 0,
      name: "Healthcare",
      icon: "🏥",
      useCases: [
        "Patient intake automation",
        "Appointment scheduling AI",
        "Medical record processing",
        "Insurance verification"
      ],
      metrics: "45% reduction in admin time",
      color: "from-red-500/20 to-pink-500/20"
    },
    {
      id: 1,
      name: "E-Commerce",
      icon: "🛍️",
      useCases: [
        "24/7 customer support",
        "Product recommendations",
        "Order tracking automation",
        "Inventory management AI"
      ],
      metrics: "3x conversion rate increase",
      color: "from-purple-500/20 to-indigo-500/20"
    },
    {
      id: 2,
      name: "Finance",
      icon: "💰",
      useCases: [
        "Fraud detection systems",
        "Loan application processing",
        "Risk assessment automation",
        "Compliance monitoring"
      ],
      metrics: "90% faster processing",
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      id: 3,
      name: "Real Estate",
      icon: "🏠",
      useCases: [
        "Lead qualification AI",
        "Property matching",
        "Virtual tour scheduling",
        "Document automation"
      ],
      metrics: "60% more qualified leads",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      id: 4,
      name: "Legal",
      icon: "⚖️",
      useCases: [
        "Contract analysis",
        "Case research automation",
        "Document generation",
        "Client intake processing"
      ],
      metrics: "70% time savings",
      color: "from-yellow-500/20 to-orange-500/20"
    },
    {
      id: 5,
      name: "Manufacturing",
      icon: "🏭",
      useCases: [
        "Quality control AI",
        "Supply chain optimization",
        "Predictive maintenance",
        "Production planning"
      ],
      metrics: "35% efficiency gain",
      color: "from-gray-500/20 to-slate-500/20"
    },
    {
      id: 6,
      name: "Education",
      icon: "🎓",
      useCases: [
        "Student support chatbots",
        "Grading automation",
        "Enrollment processing",
        "Personalized learning"
      ],
      metrics: "80% faster responses",
      color: "from-indigo-500/20 to-purple-500/20"
    },
    {
      id: 7,
      name: "Hospitality",
      icon: "🏨",
      useCases: [
        "Booking automation",
        "Guest service AI",
        "Review management",
        "Revenue optimization"
      ],
      metrics: "25% revenue increase",
      color: "from-pink-500/20 to-rose-500/20"
    },
    {
      id: 8,
      name: "Retail",
      icon: "🏪",
      useCases: [
        "Inventory tracking AI",
        "Customer service bots",
        "Price optimization",
        "Demand forecasting"
      ],
      metrics: "40% cost reduction",
      color: "from-orange-500/20 to-red-500/20"
    },
    {
      id: 9,
      name: "Logistics",
      icon: "🚚",
      useCases: [
        "Route optimization",
        "Shipment tracking",
        "Warehouse automation",
        "Delivery predictions"
      ],
      metrics: "50% faster delivery",
      color: "from-cyan-500/20 to-blue-500/20"
    },
    {
      id: 10,
      name: "Insurance",
      icon: "🛡️",
      useCases: [
        "Claims processing AI",
        "Risk assessment",
        "Policy recommendations",
        "Customer onboarding"
      ],
      metrics: "85% faster claims",
      color: "from-emerald-500/20 to-green-500/20"
    },
    {
      id: 11,
      name: "Marketing",
      icon: "📱",
      useCases: [
        "Content generation",
        "Campaign optimization",
        "Lead scoring AI",
        "Social media automation"
      ],
      metrics: "5x ROI improvement",
      color: "from-violet-500/20 to-purple-500/20"
    }
  ];

  // Organize industries into rows
  const rows = [];
  const itemsPerRow = 4;
  for (let i = 0; i < industries.length; i += itemsPerRow) {
    rows.push(industries.slice(i, i + itemsPerRow));
  }

  return (
    <section ref={containerRef} className="py-24 bg-gradient-to-b from-[#0d1117] to-[#0a0a0a] relative overflow-hidden">
      
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            AI Solutions for <span className="text-[#0066ff]">Every Industry</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
            No matter your industry, we have battle-tested AI solutions that deliver 
            immediate ROI. Hover over any industry to explore specific use cases.
          </p>
        </motion.div>

        <div className="space-y-6 overflow-hidden">
          {rows.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              className="relative"
              style={{
                x: rowIndex % 2 === 0 ? leftTransform : rightTransform,
              }}
            >
              <div className="flex gap-4 px-8 w-max">
                {/* Create continuous scrolling by duplicating the row */}
                {[...row, ...row].map((industry, idx) => (
                  <motion.div
                    key={`${industry.id}-${idx}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: (idx % itemsPerRow) * 0.05 }}
                    onMouseEnter={() => setHoveredIndustry(industry.id)}
                    onMouseLeave={() => setHoveredIndustry(null)}
                    className="relative group cursor-pointer flex-shrink-0 w-80"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all duration-300 h-full min-h-[220px]">
                      <div className="text-center mb-4">
                        <span className="text-4xl">{industry.icon}</span>
                      </div>
                      
                      <h3 className="text-white font-semibold text-center mb-3">
                        {industry.name}
                      </h3>

                      <div className={`transition-all duration-300 overflow-hidden ${
                        hoveredIndustry === industry.id ? "max-h-96" : "max-h-8"
                      }`}>
                        <p className="text-[#0066ff] text-sm font-medium text-center mb-3">
                          {industry.metrics}
                        </p>
                        
                        {hoveredIndustry === industry.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="border-t border-zinc-800 pt-3 mb-3">
                              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                                Use Cases:
                              </p>
                              <ul className="space-y-1">
                                {industry.useCases.map((useCase, useCaseIdx) => (
                                  <li key={useCaseIdx} className="text-xs text-zinc-400 flex items-start gap-1">
                                    <span className="text-green-400 mt-0.5">•</span>
                                    <span>{useCase}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <button className="w-full py-2 bg-[#0066ff]/10 hover:bg-[#0066ff]/20 text-[#0066ff] text-xs font-medium rounded-lg transition-colors">
                              Learn More →
                            </button>
                          </motion.div>
                        )}
                      </div>

                      {hoveredIndustry !== industry.id && (
                        <div className="flex justify-center">
                          <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <p className="text-zinc-400">
              Don&apos;t see your industry?
            </p>
            <motion.button
              className="px-6 py-3 bg-zinc-900 text-white font-medium rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all duration-300 inline-flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Let&apos;s Talk Custom Solutions
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}