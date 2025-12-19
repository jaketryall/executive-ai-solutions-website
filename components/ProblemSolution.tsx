"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ProblemSolution() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const problems = [
    {
      id: 0,
      problem: "Drowning in repetitive tasks?",
      description: "Your team wastes 40+ hours weekly on manual work that should be automated.",
      solutions: [
        "Automate data entry and processing instantly",
        "Handle customer inquiries 24/7 without human intervention",
        "Process documents 100x faster with AI extraction",
        "Eliminate human error in repetitive workflows"
      ],
      impact: {
        timeSaved: "40+ hrs/week",
        accuracy: "99.9%",
        roi: "300% in 3 months"
      },
      icon: "⚡",
      gradient: "from-blue-600 via-blue-500 to-cyan-500",
      accentColor: "#0066ff"
    },
    {
      id: 1,
      problem: "Can't scale without massive hiring?",
      description: "Growth means more work, but hiring is slow, expensive, and risky.",
      solutions: [
        "Handle 10x volume with your existing team",
        "Scale up or down instantly based on demand",
        "No training, no sick days, no turnover",
        "Deploy new capabilities in days, not months"
      ],
      impact: {
        capacity: "10x increase",
        costSaving: "60% vs hiring",
        deployment: "< 2 weeks"
      },
      icon: "📈",
      gradient: "from-purple-600 via-purple-500 to-pink-500",
      accentColor: "#9333ea"
    },
    {
      id: 2,
      problem: "Missing opportunities after hours?",
      description: "Customers expect instant responses, but your team can't work 24/7.",
      solutions: [
        "Respond to leads within seconds, any time",
        "Qualify prospects while you sleep",
        "Schedule appointments automatically",
        "Never miss an opportunity again"
      ],
      impact: {
        responseTime: "< 1 second",
        leadCapture: "+47%",
        availability: "24/7/365"
      },
      icon: "🌙",
      gradient: "from-green-600 via-green-500 to-emerald-500",
      accentColor: "#10b981"
    },
    {
      id: 3,
      problem: "Struggling with data chaos?",
      description: "Information scattered everywhere, insights buried in spreadsheets.",
      solutions: [
        "Unify data from all your systems automatically",
        "Generate insights and reports on demand",
        "Predict trends before they happen",
        "Make data-driven decisions confidently"
      ],
      impact: {
        dataProcessing: "1000x faster",
        insights: "Real-time",
        accuracy: "95%+"
      },
      icon: "📊",
      gradient: "from-orange-600 via-orange-500 to-red-500",
      accentColor: "#ea580c"
    },
    {
      id: 4,
      problem: "Losing to faster competitors?",
      description: "While you process manually, competitors deliver instantly with AI.",
      solutions: [
        "Match or beat any competitor's speed",
        "Offer capabilities you couldn't before",
        "Deliver personalized experiences at scale",
        "Stay ahead with continuous AI improvements"
      ],
      impact: {
        speed: "100x faster",
        capabilities: "+15 new",
        competitive: "Leading edge"
      },
      icon: "🚀",
      gradient: "from-indigo-600 via-indigo-500 to-blue-500",
      accentColor: "#4f46e5"
    }
  ];

  return (
    <section 
      ref={containerRef} 
      className="relative" 
      style={{ height: `${(problems.length + 1) * 100}vh` }}
    >
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-20 pb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h2 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4"
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [1, 1, 1, 0]),
              }}
            >
              Your Problems, <span className="text-[#0066ff]">Solved</span>
            </motion.h2>
            <motion.p 
              className="text-zinc-400 text-lg max-w-2xl mx-auto"
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.02, 0.95, 1], [1, 1, 1, 0]),
              }}
            >
              AI solutions that transform your biggest challenges into competitive advantages
            </motion.p>
          </motion.div>

          {/* Progress dots */}
          <div className="flex justify-center gap-3 mt-8 mb-16">
            {problems.map((_, index) => {
              const progress = useTransform(scrollYProgress, [0, 1], [0, problems.length]);
              
              return (
                <motion.div
                  key={index}
                  className="w-2 h-2 rounded-full bg-zinc-700"
                  style={{
                    backgroundColor: useTransform(
                      progress,
                      [index - 0.5, index, index + 0.5],
                      ["rgb(63, 63, 70)", problems[index].accentColor, "rgb(63, 63, 70)"]
                    ),
                    scale: useTransform(
                      progress,
                      [index - 0.5, index, index + 0.5],
                      [1, 1.5, 1]
                    ),
                    boxShadow: useTransform(
                      progress,
                      [index - 0.5, index, index + 0.5],
                      ["0 0 0px transparent", `0 0 20px ${problems[index].accentColor}`, "0 0 0px transparent"]
                    )
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Horizontal Card Carousel */}
        <div className="relative flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ paddingTop: "280px" }}>
          <div className="max-w-7xl w-full">
            <div className="relative" style={{ height: "550px" }}>
              {problems.map((problem, index) => {
                // Calculate horizontal position based on scroll
                const xPosition = useTransform(
                  scrollYProgress,
                  [0, 1],
                  [0, -110 * problems.length]
                );
                
                // Calculate this card's position with spacing
                const cardX = useTransform(
                  xPosition,
                  (value) => `${value + (index * 110)}%`
                );

                // Calculate opacity based on position
                const progress = useTransform(scrollYProgress, [0, 1], [0, problems.length]);
                const cardOpacity = useTransform(
                  progress,
                  [index - 0.5, index, index + 0.5],
                  [0.3, 1, 0.3]
                );
                
                // Calculate scale based on position
                const cardScale = useTransform(
                  progress,
                  [index - 0.5, index, index + 0.5],
                  [0.9, 1, 0.9]
                );

                return (
                  <motion.div
                    key={problem.id}
                    className="absolute inset-0"
                    style={{
                      x: cardX,
                      opacity: cardOpacity,
                      scale: cardScale
                    }}
                  >
                    {/* Card */}
                    <div className="relative h-full">
                      {/* Card Border */}
                      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-b from-zinc-700 to-zinc-900">
                        <div className="absolute inset-[1px] bg-[#0d1117] rounded-2xl" />
                      </div>

                      {/* Card Content */}
                      <div className="relative h-full bg-[#0d1117] rounded-2xl border border-zinc-800/50 overflow-hidden shadow-2xl">
                        {/* Top accent bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${problem.gradient}`} />
                        
                        {/* Gradient overlay */}
                        <div 
                          className="absolute top-0 left-0 right-0 h-32 opacity-30"
                          style={{
                            background: `linear-gradient(to bottom, ${problem.accentColor}40, transparent)`
                          }}
                        />
                        
                        <div className="relative p-10 lg:p-12 h-full">
                          <div className="grid lg:grid-cols-2 gap-10 h-full">
                            {/* Left Side - Problem */}
                            <div className="flex flex-col justify-center">
                              <div>
                                <div className="flex items-center gap-4 mb-6">
                                  <span className="text-5xl">{problem.icon}</span>
                                  <div className={`h-px flex-1 bg-gradient-to-r ${problem.gradient} opacity-30`} />
                                </div>
                                
                                <h3 className="text-4xl font-bold text-white mb-4">
                                  {problem.problem}
                                </h3>
                                
                                <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                                  {problem.description}
                                </p>

                                <div className="space-y-3">
                                  <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
                                    Our Solution
                                  </p>
                                  {problem.solutions.map((solution, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                      <div 
                                        className="w-1.5 h-1.5 rounded-full mt-2"
                                        style={{ backgroundColor: problem.accentColor }}
                                      />
                                      <span className="text-zinc-300 leading-relaxed">{solution}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Right Side - Impact */}
                            <div className="flex flex-col justify-center lg:pl-10">
                              <div>
                                <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium mb-6">
                                  Expected Impact
                                </p>
                                
                                <div className="grid gap-4">
                                  {Object.entries(problem.impact).map(([key, value]) => (
                                    <div key={key} className="relative group">
                                      <div className="relative bg-zinc-900/80 rounded-xl p-5 border border-zinc-800 overflow-hidden">
                                        <div
                                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                          style={{
                                            background: `linear-gradient(135deg, ${problem.accentColor}10, transparent)`
                                          }}
                                        />
                                        <div className="relative">
                                          <p 
                                            className="text-3xl font-bold mb-1"
                                            style={{
                                              background: `linear-gradient(135deg, ${problem.accentColor}, ${problem.accentColor}CC)`,
                                              WebkitBackgroundClip: "text",
                                              WebkitTextFillColor: "transparent"
                                            }}
                                          >
                                            {value}
                                          </p>
                                          <p className="text-zinc-500 text-sm capitalize">
                                            {key.replace(/([A-Z])/g, " $1").trim()}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="mt-6 flex items-center gap-2 text-green-400 text-sm">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  <span>Implementation in 2-4 weeks • ROI guaranteed</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA - Bottom */}
        <motion.div
          className="absolute bottom-20 left-0 right-0 text-center z-20"
          style={{
            opacity: useTransform(scrollYProgress, [0.9, 1], [0, 1]),
            y: useTransform(scrollYProgress, [0.9, 1], [20, 0])
          }}
        >
          <motion.button
            className="px-8 py-4 bg-[#0066ff] text-white font-medium rounded-xl hover:bg-[#0052cc] transition-all duration-300 inline-flex items-center gap-3 shadow-xl shadow-[#0066ff]/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Your Free AI Readiness Assessment
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.05, 0.85, 0.9], [1, 1, 1, 0])
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}