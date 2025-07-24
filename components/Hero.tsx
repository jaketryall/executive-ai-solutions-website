"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      opacity: number;
    }> = [];

    const lines: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      progress: number;
      speed: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    // Initialize animated lines
    const createLine = () => {
      lines.push({
        x1: Math.random() * canvas.width,
        y1: Math.random() * canvas.height,
        x2: Math.random() * canvas.width,
        y2: Math.random() * canvas.height,
        progress: 0,
        speed: Math.random() * 0.02 + 0.005,
      });
    };

    for (let i = 0; i < 5; i++) {
      createLine();
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 187, 253, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw animated lines
      lines.forEach((line, index) => {
        line.progress += line.speed;

        if (line.progress >= 1) {
          lines[index] = {
            x1: Math.random() * canvas.width,
            y1: Math.random() * canvas.height,
            x2: Math.random() * canvas.width,
            y2: Math.random() * canvas.height,
            progress: 0,
            speed: Math.random() * 0.02 + 0.005,
          };
          return;
        }

        const x = line.x1 + (line.x2 - line.x1) * line.progress;
        const y = line.y1 + (line.y2 - line.y1) * line.progress;

        // Draw line trail
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(x, y);
        const gradient = ctx.createLinearGradient(line.x1, line.y1, x, y);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.3)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw leading particle
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(147, 187, 253, 0.8)';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a8a]/10 via-transparent to-black/50" />
      
      {/* Animated particles canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-50"
      />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-sm sm:text-base text-[#93bbfd] uppercase tracking-widest mb-8 font-light"
        >
          AI Workforce Solutions
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-6xl sm:text-7xl lg:text-8xl font-medium mb-6 text-white leading-tight"
        >
          Your AI Workforce
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#93bbfd] mb-10"
        >
          AI Employees
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-lg sm:text-xl text-zinc-400 mb-16 max-w-3xl mx-auto font-light leading-relaxed"
        >
          Deploy robots that never sleep. Scale without limits.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <button className="bg-white text-black px-8 py-4 rounded-lg font-medium text-base hover:bg-zinc-100 transition-all duration-300 shadow-lg">
            Start Building
          </button>
          <button className="border border-zinc-700 text-white px-8 py-4 rounded-lg font-medium text-base hover:bg-zinc-900 transition-all duration-300">
            Book a Demo
          </button>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
            <rect x="1" y="1" width="22" height="38" rx="11" stroke="#93bbfd" strokeWidth="2" opacity="0.5"/>
            <motion.rect
              x="10" y="8"
              width="4" height="8"
              rx="2"
              fill="#93bbfd"
              animate={{ y: [8, 16, 8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}