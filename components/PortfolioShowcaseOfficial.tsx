"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function PortfolioShowcaseOfficial() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [45, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const [currentProject, setCurrentProject] = useState(0);
  const [deviceLoaded, setDeviceLoaded] = useState(false);

  const projects = [
    {
      name: "TechStart Inc.",
      type: "SaaS Platform",
      url: "techstart.com",
      image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      stats: { visitors: "50K+", conversion: "4.2%", speed: "98/100" }
    },
    {
      name: "Green Energy Co.",
      type: "Corporate Site",
      url: "greenenergy.com",
      image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      stats: { visitors: "120K+", conversion: "3.8%", speed: "96/100" }
    },
    {
      name: "Fashion Forward",
      type: "E-commerce",
      url: "fashionforward.com",
      image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      stats: { visitors: "200K+", conversion: "5.1%", speed: "94/100" }
    },
    {
      name: "FitLife App",
      type: "Web Application",
      url: "fitlifeapp.com",
      image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      stats: { visitors: "80K+", conversion: "6.3%", speed: "97/100" }
    }
  ];

  return (
    <div ref={containerRef} className="relative flex justify-center items-center min-h-[700px] py-12">
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformPerspective: "1200px",
          transformStyle: "preserve-3d"
        }}
        className="relative w-full max-w-[1000px]"
      >
        <div className="relative">
          {/* Official Apple Device Frame */}
          {/* Download from: https://developer.apple.com/design/resources/ */}
          {/* Place in: public/devices/macbook-pro-14.png */}
          
          {!deviceLoaded && (
            <div className="bg-zinc-900 rounded-2xl animate-pulse" style={{ aspectRatio: '16/10', width: '100%' }}>
              <div className="flex items-center justify-center h-full text-zinc-600">
                <div className="text-center">
                  <p className="mb-2">Loading device frame...</p>
                  <p className="text-sm">Download official frame from Apple Design Resources</p>
                </div>
              </div>
            </div>
          )}
          
          <img 
            src="/devices/macbook-pro-14.png"
            alt="MacBook Pro"
            className={`w-full h-auto ${!deviceLoaded ? 'hidden' : ''}`}
            onLoad={() => setDeviceLoaded(true)}
            onError={() => {
              console.log("Official device frame not found. Please download from Apple.");
            }}
          />
          
          {/* Website Content Overlay */}
          {/* These percentages need to be adjusted based on the actual Apple device frame */}
          <div className="absolute" style={{
            top: '5.8%',     // Adjust based on actual frame
            left: '11.5%',    // Adjust based on actual frame
            width: '77%',     // Adjust based on actual frame
            height: '78%',    // Adjust based on actual frame
            overflow: 'hidden',
            borderRadius: '8px'
          }}>
            <motion.div
              key={currentProject}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
              style={{ background: projects[currentProject].image }}
            >
              <div className="p-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {projects[currentProject].name}
                  </h3>
                  <p className="text-white/80 mb-4">{projects[currentProject].type}</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-white/60 text-xs">Monthly Visitors</p>
                      <p className="text-white font-bold">{projects[currentProject].stats.visitors}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Conversion</p>
                      <p className="text-white font-bold">{projects[currentProject].stats.conversion}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Speed Score</p>
                      <p className="text-white font-bold">{projects[currentProject].stats.speed}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentProject(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentProject === idx 
                  ? 'w-8 bg-[#0066ff]' 
                  : 'bg-zinc-600 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>

        {/* Side text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute -left-48 top-1/2 -translate-y-1/2 hidden lg:block"
        >
          <p className="text-zinc-400 text-sm mb-2">Recent Work</p>
          <p className="text-white text-lg font-semibold">250+ Sites Built</p>
          <p className="text-zinc-500 text-sm mt-4">Click to explore →</p>
        </motion.div>
      </motion.div>

      {/* Instructions Banner (remove after setup) */}
      {!deviceLoaded && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-500/10 border border-yellow-500/30 p-4 text-center">
          <p className="text-yellow-200 text-sm">
            📥 To use official Apple device frames:
          </p>
          <ol className="text-yellow-200/80 text-xs mt-2 space-y-1">
            <li>1. Visit developer.apple.com/design/resources/</li>
            <li>2. Download "MacBook Pro" under Product Bezels</li>
            <li>3. Save as: public/devices/macbook-pro-14.png</li>
          </ol>
        </div>
      )}
    </div>
  );
}