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
  const steps = ["Template", "Design", "Content", "Deploy"];

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
  const [connections, setConnections] = useState<Array<{ x1: number; y1: number; x2: number; y2: number }>>([]);

  useEffect(() => {
    if (isActive) {
      let connectionIndex = 0;
      const timer = setInterval(() => {
        // Use deterministic positions based on index
        const positions = [
          { x1: 80, y1: 30, x2: 220, y2: 70 },
          { x1: 100, y1: 70, x2: 200, y2: 30 },
          { x1: 120, y1: 50, x2: 180, y2: 50 },
          { x1: 90, y1: 40, x2: 210, y2: 60 },
          { x1: 110, y1: 60, x2: 190, y2: 40 },
        ];
        const newConnection = positions[connectionIndex % positions.length];
        connectionIndex++;
        setConnections((prev) => [...prev.slice(-4), newConnection]);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setConnections([]);
    }
  }, [isActive]);

  // Brain/Network nodes - using fixed positions
  const nodes = [
    { x: 210, y: 50, size: 3 },
    { x: 192, y: 79, size: 4.5 },
    { x: 150, y: 80, size: 6 },
    { x: 108, y: 79, size: 3 },
    { x: 90, y: 50, size: 4.5 },
    { x: 108, y: 21, size: 6 },
    { x: 150, y: 20, size: 3 },
    { x: 192, y: 21, size: 4.5 },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg viewBox="0 0 300 80" className="w-full h-full opacity-50">
        {/* Dynamic connections */}
        <AnimatePresence>
          {connections.map((conn, i) => (
            <motion.line
              key={`conn-${i}-${conn.x1}-${conn.y1}`}
              x1={conn.x1}
              y1={conn.y1}
              x2={conn.x2}
              y2={conn.y2}
              stroke="url(#consulting-gradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          ))}
        </AnimatePresence>

        {/* Central brain/hub */}
        <motion.circle
          cx="150"
          cy="50"
          r="20"
          fill="rgba(251, 146, 60, 0.2)"
          stroke="#fb923c"
          strokeWidth="2"
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* AI text in center */}
        <motion.text
          x="150"
          y="55"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="#fb923c"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.5 }}
        >
          AI
        </motion.text>

        {/* Network nodes */}
        {nodes.map((node, i) => (
          <motion.g key={`node-${i}`}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="#fdba74"
              initial={{ scale: 0 }}
              animate={isActive ? { scale: [1, 1.5, 1] } : { scale: 1 }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: isActive ? Infinity : 0,
                repeatDelay: 2,
              }}
            />
            {/* Connection to center */}
            <motion.line
              x1="150"
              y1="50"
              x2={node.x}
              y2={node.y}
              stroke="#fb923c"
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? [0, 0.5, 0] : 0 }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: isActive ? Infinity : 0,
              }}
            />
          </motion.g>
        ))}

        {/* Orbiting AI service logos */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {/* ChatGPT Logo */}
          <motion.g transform="translate(190, 50)">
            <motion.circle
              r="10"
              fill="rgba(116, 185, 138, 0.2)"
              stroke="#74b98a"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
            />
            {/* OpenAI Logo */}
            <motion.path
              d="M -5 -2 C -5 -4 -3 -6 0 -6 C 3 -6 5 -4 5 -1 C 5 2 3 4 0 4 C -3 4 -5 2 -5 -1 L -5 -2 M -2 0 L 2 0 M 0 -2 L 0 2"
              stroke="#74b98a"
              strokeWidth="1.2"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
            />
          </motion.g>
          
          {/* Claude Logo */}
          <motion.g transform="translate(110, 50)">
            <motion.circle
              r="10"
              fill="rgba(220, 168, 96, 0.2)"
              stroke="#dca860"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
            />
            {/* Claude Logo - Anthropic A */}
            <motion.path
              d="M -4 4 L -1 -4 L 0 -4 L 3 4 M -2.5 1 L 2.5 1"
              stroke="#dca860"
              strokeWidth="1.5"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
            />
          </motion.g>
          
          {/* Perplexity Logo */}
          <motion.g transform="translate(150, 10)">
            <motion.circle
              r="10"
              fill="rgba(32, 195, 204, 0.2)"
              stroke="#20c3cc"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
            />
            {/* Perplexity Logo - Stylized P with arrow */}
            <motion.g>
              <motion.path
                d="M -3 -4 L -3 4 M -3 -4 L 1 -4 C 3 -4 4 -2 4 0 C 4 2 3 4 1 4 L -3 4"
                stroke="#20c3cc"
                strokeWidth="1.5"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
              />
              <motion.path
                d="M 2 0 L 4 -2 M 2 0 L 4 2"
                stroke="#20c3cc"
                strokeWidth="1.5"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
              />
            </motion.g>
          </motion.g>
          
          {/* Gemini Logo */}
          <motion.g transform="translate(150, 90)">
            <motion.circle
              r="10"
              fill="rgba(66, 133, 244, 0.2)"
              stroke="#4285f4"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
            />
            {/* Gemini Logo - Two curved paths */}
            <motion.g>
              <motion.path
                d="M -3 -3 C -3 -5 -1 -5 0 -5 C 3 -5 5 -3 5 0 C 5 3 3 5 0 5"
                stroke="#4285f4"
                strokeWidth="1.5"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
              />
              <motion.path
                d="M 3 3 C 3 5 1 5 0 5 C -3 5 -5 3 -5 0 C -5 -3 -3 -5 0 -5"
                stroke="#ea4335"
                strokeWidth="1.5"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
              />
            </motion.g>
          </motion.g>
        </motion.g>

        <defs>
          <linearGradient id="consulting-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}