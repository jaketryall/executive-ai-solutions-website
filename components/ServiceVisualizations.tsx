"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// AI Workflow Automation Visualization
export function WorkflowVisualization({ isActive }: { isActive: boolean }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % 5);
      }, 1200);
      return () => clearInterval(interval);
    } else {
      setCurrentStep(0);
    }
  }, [isActive]);

  const nodes = [
    { id: 1, x: 50, y: 70, label: "Daily Trigger", icon: "clock", subtitle: "Every 24 hours" },
    { id: 2, x: 150, y: 70, label: "Retrieve Inventory", icon: "sheet", subtitle: "Read sheet" },
    { id: 3, x: 250, y: 70, label: "Check Threshold", icon: "compare", subtitle: "Below limit?" },
    { id: 4, x: 350, y: 70, label: "Send", icon: "email", subtitle: "Send message" },
  ];


  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg viewBox="0 0 400 140" className="w-full h-full opacity-50">
        {/* Connection lines */}
        <motion.path
          d="M 90 70 L 110 70"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isActive && currentStep >= 1 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d="M 190 70 L 210 70"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isActive && currentStep >= 2 ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
        <motion.path
          d="M 290 70 L 310 70"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isActive && currentStep >= 3 ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        
        {/* Animated data flow */}
        <AnimatePresence>
          {isActive && currentStep >= 1 && (
            <motion.circle
              key="flow-1"
              r="3"
              fill="#60a5fa"
              initial={{ x: 90, y: 70, opacity: 0 }}
              animate={{ x: 110, y: 70, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
          {isActive && currentStep >= 2 && (
            <motion.circle
              key="flow-2"
              r="3"
              fill="#60a5fa"
              initial={{ x: 190, y: 70, opacity: 0 }}
              animate={{ x: 210, y: 70, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
          )}
          {isActive && currentStep >= 3 && (
            <motion.circle
              key="flow-3"
              r="3"
              fill="#60a5fa"
              initial={{ x: 290, y: 70, opacity: 0 }}
              animate={{ x: 310, y: 70, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            />
          )}
        </AnimatePresence>

        {/* Nodes */}
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
                scale: isActive && currentStep >= i ? 1 : 0,
                opacity: isActive && currentStep >= i ? 1 : 0,
              }}
              transition={{ duration: 0.5, delay: i * 0.3 }}
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
                  animate={{ opacity: isActive && currentStep >= i ? 1 : 0 }}
                />
                <motion.path
                  d="M 0 -5 L 0 0 L 5 3"
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                  fill="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive && currentStep >= i ? 1 : 0 }}
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
                  animate={{ opacity: isActive && currentStep >= i ? 1 : 0 }}
                />
                <motion.line 
                  x1="-4" y1="-5" x2="4" y2="-5" 
                  stroke="#60a5fa" 
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive && currentStep >= i ? 1 : 0 }}
                />
                <motion.line 
                  x1="-4" y1="0" x2="4" y2="0" 
                  stroke="#60a5fa" 
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive && currentStep >= i ? 1 : 0 }}
                />
                <motion.line 
                  x1="-4" y1="5" x2="4" y2="5" 
                  stroke="#60a5fa" 
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive && currentStep >= i ? 1 : 0 }}
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
                  animate={{ opacity: isActive && currentStep >= i ? 1 : 0 }}
                />
                <motion.text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#60a5fa"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive && currentStep >= i ? 1 : 0 }}
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
                animate={{ opacity: isActive && currentStep >= i ? 1 : 0 }}
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
                duration: isActive && currentStep === i ? 0.5 : 0.2,
                delay: isActive && currentStep === i ? i * 0.3 : 0,
                ease: "easeInOut" 
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
              animate={{ opacity: isActive && currentStep >= i ? 0.7 : 0 }}
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
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Idea", "Design", "Content", "Deploy"];

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [isActive, steps.length]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-48 h-32 opacity-50">
        {/* Browser mockup */}
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
              {isActive && currentStep >= 0 && (
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
                {isActive && currentStep >= 1 && (
                  <motion.div
                    key="section1"
                    className="h-6 bg-purple-500/20 rounded"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  />
                )}
                {isActive && currentStep >= 2 && (
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
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-purple-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
        >
          {steps[currentStep]}
        </motion.div>
      </div>
    </div>
  );
}

// AI Consulting Visualization
export function ConsultingVisualization({ isActive }: { isActive: boolean }) {
  const [chartData, setChartData] = useState([30, 35, 45, 40, 55, 60, 70, 65, 80, 85]);
  const [currentHighlight, setCurrentHighlight] = useState(0);

  useEffect(() => {
    if (isActive) {
      // Animate chart bars growing
      const interval = setInterval(() => {
        setCurrentHighlight((prev) => (prev + 1) % 10);
        // Gradually increase values to show growth
        setChartData(prev => prev.map((val, i) => {
          const maxVal = 30 + (i * 6) + Math.sin(Date.now() / 1000 + i) * 5;
          return Math.min(maxVal, 90);
        }));
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-full h-full flex items-center justify-center gap-3 px-8">
        {/* Bar Chart */}
        <div className="flex items-end gap-1.5 h-24">
          {chartData.map((height, i) => (
            <motion.div
              key={i}
              className="w-3 bg-gradient-to-t from-orange-600 to-red-500 rounded-t"
              initial={{ height: 0 }}
              animate={{ 
                height: isActive ? `${height}%` : 0,
                opacity: currentHighlight === i ? 1 : 0.5
              }}
              transition={{ 
                height: { duration: 0.5, delay: i * 0.05 },
                opacity: { duration: 0.3 }
              }}
            />
          ))}
        </div>

        {/* Metrics */}
        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 20 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-xs text-zinc-400">Growth</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 20 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-xs text-zinc-400">ROI</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 20 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span className="text-xs text-zinc-400">AI Ready</span>
          </motion.div>
        </div>
      </div>

      {/* Trend Line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 150">
        <motion.path
          d="M 20 120 Q 80 100 150 60 T 280 30"
          fill="none"
          stroke="url(#trend-gradient)"
          strokeWidth="2"
          strokeDasharray="5,5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: isActive ? 1 : 0,
            opacity: isActive ? 0.3 : 0
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="trend-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}