"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getServices } from "@/lib/sanity.queries";

interface Service {
  _id: string;
  title: string;
  description: string;
  slug: { current: string };
  icon?: string;
  tags?: string[];
  features?: string[];
  isLarge?: boolean;
  order: number;
}

export default function EteryServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to hardcoded services if Sanity is not configured
        setServices([
          {
            _id: '1',
            title: "Reduce Operational Costs by 40-60%",
            description: "Deploy AI agents that work 24/7 without breaks, training, or overhead. Handle expert-level tasks at a fraction of the cost of human employees.",
            slug: { current: 'ai-agent-development' },
            tags: ["GPT-4/Claude", "Custom Training", "Multi-Modal AI", "Real-Time Processing"],
            isLarge: true,
            order: 1
          },
          {
            _id: '2',
            title: "Automate 40+ Hours of Work Weekly",
            description: "Transform repetitive workflows into automated systems. What takes your team hours happens in seconds with zero errors.",
            slug: { current: 'process-automation' },
            isLarge: false,
            order: 2
          },
          {
            _id: '3',
            title: "Make Decisions 100x Faster",
            description: "Turn mountains of data into actionable insights instantly. Spot trends, predict outcomes, and react to changes in real-time.",
            slug: { current: 'ai-analytics' },
            tags: ["Predictive Analytics"],
            isLarge: false,
            order: 3
          },
          {
            _id: '4',
            title: "Scale Without Adding Headcount",
            description: "Handle 10x more work with your existing team. Our enterprise AI grows with you, processing thousands of tasks simultaneously.",
            slug: { current: 'enterprise-integration' },
            isLarge: true,
            order: 4
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-zinc-800 rounded w-1/3 mx-auto mb-8" />
            <div className="h-6 bg-zinc-800 rounded w-2/3 mx-auto mb-16" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-zinc-800 rounded-2xl" />
              <div className="h-96 bg-zinc-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Separate services into rows for alternating layout
  const firstRowServices = services.filter((_, index) => index < 2);
  const secondRowServices = services.filter((_, index) => index >= 2 && index < 4);

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
Real Problems, Smart Solutions
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Stop losing money on repetitive tasks. Our AI handles the work that drains 
            your team's time and budget, delivering ROI in weeks, not years.
          </p>
        </motion.div>

        {/* Services Grid - Alternating Layout */}
        <div className="space-y-6">
          {/* First Row - Large Left, Small Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chatbot Development - Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              animate={{ 
                boxShadow: [
                  "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                  "0 10px 25px -3px rgba(0, 102, 255, 0.15)",
                  "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
                ]
              }}
              transition={{ 
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.6 }
              }}
              viewport={{ once: true }}
              className="lg:col-span-2 bg-[#0d0d0d] border border-zinc-800 border-t-zinc-700 rounded-2xl p-8 cursor-pointer"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Reduce Operational Costs by 40-60%</h3>
                <p className="text-zinc-400">Deploy AI agents that work 24/7 without breaks, training, or overhead. Handle expert-level tasks at a fraction of the cost of human employees.</p>
              </div>

              {firstRowServices[0]?.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {firstRowServices[0].tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <motion.div 
                className="bg-zinc-900 rounded-xl p-4 mb-4"
                animate={{ 
                  borderColor: ["rgb(39 39 42)", "rgb(0 102 255 / 0.3)", "rgb(39 39 42)"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ borderWidth: "1px", borderStyle: "solid" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div 
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-zinc-300 text-sm">Live Preview</span>
                </div>
                <div className="text-zinc-500 text-sm">
                  GPT-4 Turbo • Claude 3 • 99.9% Uptime
                </div>
              </motion.div>
              
              <div className="bg-zinc-900 rounded-xl p-4">
                <p className="text-zinc-300 text-sm mb-2">Expected Business Impact:</p>
                <p className="text-zinc-400 text-sm whitespace-pre-line">
                  {`✓ Save $10,000-15,000 monthly vs. hiring
✓ Handle 1,000+ tasks daily automatically
✓ Respond to customers in seconds, not hours
✓ Work 168 hours/week (vs 40 for humans)
✓ Zero sick days, vacation, or training time
✓ Scale instantly during peak periods
✓ 3-5x ROI within 6 months`}
                </p>
              </div>
            </motion.div>

            {/* Voice Assistants - Small Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              animate={{
                rotate: [0, 0.5, 0, -0.5, 0]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.6, delay: 0.1 }
              }}
              viewport={{ once: true }}
              className="bg-[#0d0d0d] border border-zinc-800 border-t-zinc-700 rounded-2xl p-8 shadow-lg shadow-black/30 cursor-pointer"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Automate 40+ Hours Weekly</h3>
                <p className="text-zinc-400">Transform repetitive workflows into automated systems. Free your team from mind-numbing tasks so they can focus on growth.</p>
              </div>

              <div className="relative h-[200px] overflow-hidden">
                {/* Gradient fade at top and bottom */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0d0d0d] to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0d0d0d] to-transparent z-10 pointer-events-none" />
                
                <motion.div 
                  className="space-y-2"
                  animate={{
                    y: ["0%", "-50%"]
                  }}
                  transition={{
                    y: {
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                >
                  {/* Double the items for seamless loop */}
                  {['Salesforce', 'HubSpot', 'Slack', 'Microsoft 365', 'Salesforce', 'HubSpot', 'Slack', 'Microsoft 365'].map((platform, idx) => (
                    <div 
                      key={idx} 
                      className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="w-8 h-8 bg-zinc-700 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="text-zinc-300 text-sm">{platform}</span>
                      </div>
                      <span className="text-zinc-500 text-xs">AI Integrated</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Second Row - Small Left, Large Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Optimization - Small Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#0d0d0d] border border-zinc-800 border-t-zinc-700 rounded-2xl p-8 shadow-lg shadow-black/30 cursor-pointer"
              whileTap={{ scale: 0.98 }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Eliminate 95% of Errors</h3>
                <p className="text-zinc-400">Human mistakes cost money. Our AI performs complex tasks with near-perfect accuracy, every time, 24/7.</p>
              </div>

              {/* Performance Metrics Animation */}
              <div className="space-y-4">
                {[
                  { label: "Accuracy Rate", value: 98, color: "bg-green-400" },
                  { label: "Response Time", value: 100, color: "bg-[#0066ff]" },
                  { label: "Task Completion", value: 95, color: "bg-cyan-400" },
                  { label: "Cost Reduction", value: 92, color: "bg-purple-400" }
                ].map((metric, idx) => (
                  <div key={metric.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">{metric.label}</span>
                      <span className="text-white font-medium">{metric.value}</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${metric.color} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.value}%` }}
                        transition={{ 
                          duration: 1.5, 
                          delay: 0.5 + idx * 0.1,
                          ease: "easeOut"
                        }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Lighthouse Score Circle */}
              <motion.div 
                className="mt-6 flex justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="rgb(39 39 42)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="226"
                      initial={{ strokeDashoffset: 226 }}
                      whileInView={{ strokeDashoffset: 20 }}
                      transition={{ duration: 2, delay: 0.5 }}
                      viewport={{ once: true }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0066ff" />
                        <stop offset="100%" stopColor="#00ffff" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">96</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Launch & Support - Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.3 }
              }}
              className="lg:col-span-2 bg-[#0d0d0d] border border-zinc-800 border-t-zinc-700 rounded-2xl p-8 shadow-lg shadow-black/30 cursor-pointer"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Scale 10x Without Hiring</h3>
                <p className="text-zinc-400">Handle explosive growth without the headcount headaches. Our AI scales instantly to meet demand, no recruitment needed.</p>
              </div>

              {/* Project Timeline Animation */}
              <div className="relative mb-6">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-zinc-800" />
                {[
                  { phase: "AI Assessment", time: "Week 1", status: "complete" },
                  { phase: "Model Selection", time: "Week 2-3", status: "complete" },
                  { phase: "Training & Development", time: "Week 4-6", status: "active" },
                  { phase: "Integration Testing", time: "Week 7", status: "upcoming" },
                  { phase: "Deployment", time: "Week 8", status: "upcoming" }
                ].map((item, idx) => (
                  <motion.div
                    key={item.phase}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="relative pl-8 pb-4 last:pb-0"
                  >
                    {/* Timeline dot */}
                    <motion.div
                      className={`absolute left-0 w-2 h-2 rounded-full -translate-x-[3px] ${
                        item.status === 'complete' ? 'bg-green-400' :
                        item.status === 'active' ? 'bg-[#0066ff]' : 'bg-zinc-600'
                      }`}
                      animate={item.status === 'active' ? {
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">{item.phase}</h4>
                        <p className="text-zinc-500 text-sm">{item.time}</p>
                      </div>
                      {item.status === 'complete' && (
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {item.status === 'active' && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <svg className="w-5 h-5 text-[#0066ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Live Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-zinc-900 rounded-lg p-3 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Lightning Bolt Icon */}
                  <svg className="w-6 h-6 text-yellow-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                  <div className="text-white font-bold text-sm">99.9%</div>
                  <div className="text-zinc-500 text-xs">Uptime</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-zinc-900 rounded-lg p-3 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Rocket Icon */}
                  <svg className="w-6 h-6 text-[#0066ff] mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c0 0-7 5-7 13 0 3.86 3.14 7 7 7s7-3.14 7-7c0-8-7-13-7-13zm0 18c-2.76 0-5-2.24-5-5 0-4.42 3.58-8.09 5-9.56 1.42 1.47 5 5.14 5 9.56 0 2.76-2.24 5-5 5zm0-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  <div className="text-white font-bold text-sm">&lt;200ms</div>
                  <div className="text-zinc-500 text-xs">Response</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  viewport={{ once: true }}
                  className="bg-zinc-900 rounded-lg p-3 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Chat Icon */}
                  <svg className="w-6 h-6 text-green-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                  </svg>
                  <div className="text-white font-bold text-sm">24/7</div>
                  <div className="text-zinc-500 text-xs">Support</div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Extra Card - Full Width CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            animate={{
              backgroundImage: [
                "linear-gradient(45deg, rgb(13 13 13) 0%, rgb(13 13 13) 100%)",
                "linear-gradient(45deg, rgb(13 13 13) 0%, rgb(0 102 255 / 0.05) 100%)",
                "linear-gradient(45deg, rgb(13 13 13) 0%, rgb(13 13 13) 100%)"
              ]
            }}
            viewport={{ once: true }}
            transition={{ 
              backgroundImage: { duration: 4, repeat: Infinity },
              opacity: { duration: 0.6, delay: 0.4 }
            }}
            className="bg-zinc-900 rounded-2xl p-10 text-center cursor-pointer"
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-4">
              Stop Wasting Money on Repetitive Tasks
            </h3>
            <p className="text-zinc-400 mb-6">
              See exactly how much you could save with AI automation
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-6 py-3 bg-[#0066ff] text-white font-medium rounded-full hover:bg-[#0052cc] transition-colors duration-300"
            >
              Calculate Your Savings
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}