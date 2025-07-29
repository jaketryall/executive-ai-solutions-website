"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

// AI Workflow Automation Visualization
export function WorkflowVisualization({ isActive }: { isActive: boolean }) {
  const [currentStep, setCurrentStep] = React.useState(0);
  
  React.useEffect(() => {
    if (isActive) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => (prev >= 3 ? 0 : prev + 1));
      }, 2000); // Change step every 2 seconds
      return () => clearInterval(timer);
    } else {
      setCurrentStep(0);
    }
  }, [isActive]);
  
  const animationStep = isActive ? 4 : 0;

  const nodes = [
    { id: 1, x: 50, y: 70, label: "Daily Trigger", icon: "clock", subtitle: "Every 24 hours" },
    { id: 2, x: 150, y: 70, label: "Retrieve Inventory", icon: "sheet", subtitle: "Read sheet" },
    { id: 3, x: 250, y: 70, label: "Check Threshold", icon: "compare", subtitle: "Below limit?" },
    { id: 4, x: 350, y: 70, label: "Send", icon: "email", subtitle: "Send message" },
  ];


  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateZ(0)' }}>
      <svg viewBox="0 0 400 140" className="w-full h-full opacity-50" style={{ willChange: 'transform' }}>
        {/* Static placeholder lines - hide when active */}
        {!isActive && (
          <>
            <path
              d="M 90 70 L 110 70"
              stroke="#3f3f46"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 190 70 L 210 70"
              stroke="#3f3f46"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 290 70 L 310 70"
              stroke="#3f3f46"
              strokeWidth="2"
              fill="none"
            />
          </>
        )}
        
        {/* Connection lines - animate after boxes */}
        <motion.path
          d="M 90 70 L 110 70"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isActive && animationStep >= 1 ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        />
        <motion.path
          d="M 190 70 L 210 70"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isActive && animationStep >= 2 ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 2.6 }}
        />
        <motion.path
          d="M 290 70 L 310 70"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isActive && animationStep >= 3 ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 4.6 }}
        />
        
        {/* Animated data flow - animate after lines */}
        <AnimatePresence>
          {isActive && animationStep >= 1 && (
            <motion.circle
              key="flow-1"
              r="3"
              fill="#60a5fa"
              initial={{ x: 90, y: 70, opacity: 0 }}
              animate={{ x: 110, y: 70, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            />
          )}
          {isActive && animationStep >= 2 && (
            <motion.circle
              key="flow-2"
              r="3"
              fill="#60a5fa"
              initial={{ x: 190, y: 70, opacity: 0 }}
              animate={{ x: 210, y: 70, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 3.2 }}
            />
          )}
          {isActive && animationStep >= 3 && (
            <motion.circle
              key="flow-3"
              r="3"
              fill="#60a5fa"
              initial={{ x: 290, y: 70, opacity: 0 }}
              animate={{ x: 310, y: 70, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 5.2 }}
            />
          )}
        </AnimatePresence>

        {/* Static placeholder nodes - hide when active */}
        {!isActive && nodes.map((node) => (
          <g key={`static-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
            <rect
              x="-40"
              y="-20"
              width="80"
              height="40"
              rx="8"
              fill="rgba(39, 39, 42, 0.3)"
              stroke="#3f3f46"
              strokeWidth="2"
            />
          </g>
        ))}

        {/* Animated Nodes */}
        {nodes.map((node, i) => (
          <motion.g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            {/* Node background */}
            <motion.rect
              x="-40"
              y="-20"
              width="80"
              height="40"
              rx="8"
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3b82f6"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isActive && animationStep > i ? 1 : 0,
                opacity: isActive && animationStep > i ? 1 : 0,
              }}
              transition={{ duration: 0.6, delay: i * 2.0 }}
            />
            
            {/* Icons */}
            {node.icon === "clock" && (
              <motion.g>
                <motion.circle
                  cx="0"
                  cy="0"
                  r="10"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive && animationStep > i ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: i * 2.0 }}
                />
                <motion.path
                  d="M 0 -5 L 0 0 L 5 3"
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                  fill="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive && animationStep > i ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: i * 2.0 }}
                />
              </motion.g>
            )}
            {node.icon === "sheet" && (
              <motion.g>
                <motion.rect
                  x="-8"
                  y="-10"
                  width="16"
                  height="20"
                  rx="2"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive && animationStep > i ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: i * 2.0 }}
                />
                <motion.line 
                  x1="-4" y1="-5" x2="4" y2="-5" 
                  stroke="#60a5fa" 
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive && animationStep > i ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: i * 2.0 }}
                />
                <motion.line 
                  x1="-4" y1="0" x2="4" y2="0" 
                  stroke="#60a5fa" 
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive && animationStep > i ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: i * 2.0 }}
                />
                <motion.line 
                  x1="-4" y1="5" x2="4" y2="5" 
                  stroke="#60a5fa" 
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive && animationStep > i ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: i * 2.0 }}
                />
              </motion.g>
            )}
            {node.icon === "compare" && (
              <motion.g>
                <motion.path
                  d="M 0 -10 L 10 0 L 0 10 L -10 0 Z"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive && animationStep > i ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: i * 2.0 }}
                />
                <motion.text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#60a5fa"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive && animationStep > i ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: i * 2.0 }}
                >
                  ?
                </motion.text>
              </motion.g>
            )}
            {node.icon === "email" && (
              <motion.path
                d="M -12 -8 L 12 -8 L 12 8 L -12 8 Z M -12 -8 L 0 2 L 12 -8"
                stroke="#60a5fa"
                strokeWidth="1.5"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive && animationStep > i ? 1 : 0 }}
                transition={{ duration: 0.6, delay: i * 2.0 }}
              />
            )}
            
            {/* Labels */}
            <motion.text
              textAnchor="middle"
              y="-35"
              fontSize="13"
              fontWeight="600"
              fill="#93bbfd"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive && currentStep === i ? 1 : 0 }}
              transition={{ 
                duration: 0.15,
                ease: "easeOut" 
              }}
            >
              {node.label}
            </motion.text>
            <motion.text
              textAnchor="middle"
              y="32"
              fontSize="10"
              fill="#60a5fa"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive && animationStep > i ? 0.7 : 0 }}
              transition={{ duration: 0.6, delay: i * 2.0 }}
            >
              {node.subtitle}
            </motion.text>
          </motion.g>
        ))}
        

        <defs>
          <linearGradient id="workflow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Landing Page Creation Visualization
export function PageBuilderVisualization({ isActive }: { isActive: boolean }) {
  // Static animation state for better performance
  const animationStep = isActive ? 3 : -1;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateZ(0)' }}>
      <div className="relative w-48 h-32 opacity-50" style={{ willChange: 'transform' }}>
        {/* Static browser outline - always visible */}
        <div className="absolute inset-0 border-2 border-zinc-700 rounded-lg bg-zinc-800/30">
          {/* Static browser bar */}
          <div className="h-5 border-b border-zinc-700 flex items-center px-2 gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          </div>
          {/* Static content blocks */}
          <div className="p-2 space-y-1">
            <div className="h-3 bg-zinc-700/40 rounded" />
            <div className="grid grid-cols-2 gap-1">
              <div className="h-6 bg-zinc-700/30 rounded" />
              <div className="h-6 bg-zinc-700/30 rounded" />
            </div>
          </div>
        </div>

        {/* Animated browser mockup overlay */}
        <motion.div
          className="absolute inset-0 border-2 border-purple-500/40 rounded-lg bg-purple-500/10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Browser bar */}
          <div className="h-5 border-b border-purple-500/40 flex items-center px-2 gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
          </div>

          {/* Page sections animating in */}
          <div className="p-2 space-y-1">
            <AnimatePresence mode="wait">
              {isActive && animationStep >= 0 && (
                <motion.div
                  key="header"
                  className="h-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-1">
              <AnimatePresence>
                {isActive && animationStep >= 1 && (
                  <motion.div
                    key="section1"
                    className="h-6 bg-purple-500/20 rounded"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  />
                )}
                {isActive && animationStep >= 2 && (
                  <motion.div
                    key="section2"
                    className="h-6 bg-pink-500/20 rounded"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.4 }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>


        {/* Step indicator */}
        <motion.div
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-purple-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
        >
          {isActive ? "Deploy" : ""}
        </motion.div>
      </div>
    </div>
  );
}

// AI Consulting Visualization
export function ConsultingVisualization({ isActive }: { isActive: boolean }) {
  const metrics = [
    { label: "Productivity", current: 45, potential: 85, prefix: "+", suffix: "%" },
    { label: "Efficiency", current: 35, potential: 90, prefix: "+", suffix: "%" },
    { label: "Time Saved", current: 20, potential: 75, prefix: "", suffix: "h/week" }
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateZ(0)' }}>
      <div className="w-full h-full relative flex items-center justify-center px-6" style={{ willChange: 'transform' }}>
        {/* Metrics Display */}
        <div className="w-full max-w-xs mt-10">
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <div key={metric.label} className="relative">
                {/* Label */}
                <motion.div
                  className="flex justify-between items-baseline mb-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <span className="text-xs text-zinc-500">{metric.label}</span>
                  <motion.span
                    className="text-xs font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ delay: 0.8 + index * 0.2 }}
                  >
                    <span className="text-orange-400">{metric.current}{metric.suffix}</span>
                    <motion.span
                      className="inline-block mx-1 text-zinc-600"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0 }}
                      transition={{ delay: 1.2 + index * 0.2 }}
                    >
                      →
                    </motion.span>
                    <span className="text-green-400">{metric.prefix}{metric.potential}{metric.suffix}</span>
                  </motion.span>
                </motion.div>

                {/* Progress Bar Background */}
                <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                  {/* Current State Bar */}
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-600 to-red-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: isActive ? `${metric.current}%` : "0%" }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.2, ease: "easeOut" }}
                  />
                  
                  {/* Potential State Bar */}
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full opacity-60"
                    initial={{ width: "0%" }}
                    animate={{ width: isActive ? `${metric.potential}%` : "0%" }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.2, ease: "easeOut" }}
                  />

                  {/* Animated Glow Effect */}
                  <motion.div
                    className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ left: "0%" }}
                    animate={{ left: isActive ? "100%" : "0%" }}
                    transition={{ 
                      duration: 1.5, 
                      delay: 1 + index * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                </div>

              </div>
            ))}
          </div>

          {/* Summary */}
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ delay: 2 }}
          >
            <div className="text-sm font-light text-white">
              <span className="text-xl font-medium text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                2.4x
              </span>
              {" "}Growth Potential
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}