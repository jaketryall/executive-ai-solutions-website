"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function SocialProofBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const metrics = [
    {
      value: "300K+",
      label: "Work Hours Automated",
      description: "Annually across all clients",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      value: "95%",
      label: "Accuracy Rate",
      description: "On automated workflows",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      value: "$2.4M",
      label: "Saved for Clients",
      description: "In operational costs this year",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      value: "24/7",
      label: "AI Operations",
      description: "Never stops working",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  const CountUpAnimation = ({ target, duration = 2000 }: { target: string; duration?: number }) => {
    const [count, setCount] = useState("0");
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
      if (isInView && !hasStarted) {
        setHasStarted(true);
        const numericValue = parseFloat(target.replace(/[^0-9.]/g, ""));
        const suffix = target.replace(/[0-9.]/g, "");
        const increment = numericValue / (duration / 50);
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= numericValue) {
            clearInterval(timer);
            setCount(target);
          } else {
            if (suffix.includes("%")) {
              setCount(Math.floor(current) + suffix);
            } else if (suffix.includes("M")) {
              setCount((current / 1000000).toFixed(1) + suffix);
            } else if (suffix.includes("K")) {
              setCount(Math.floor(current) + suffix);
            } else if (target === "24/7") {
              setCount("24/7");
            } else {
              setCount(Math.floor(current).toString() + suffix);
            }
          }
        }, 50);

        return () => clearInterval(timer);
      }
    }, [isInView, hasStarted, target, duration]);

    return <span>{count}</span>;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-[#0a0a0a] to-[#0d1117] border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0066ff]/10 text-[#0066ff] rounded-xl mb-4 group-hover:bg-[#0066ff]/20 transition-colors">
                {metric.icon}
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                <CountUpAnimation target={metric.value} />
              </h3>
              <p className="text-zinc-300 font-medium mb-1">{metric.label}</p>
              <p className="text-zinc-500 text-sm">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 rounded-full border border-zinc-800">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-zinc-400 text-sm">
              Trusted by <span className="text-white font-medium">200+ companies</span> worldwide
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}