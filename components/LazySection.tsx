"use client";

import { useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
}

export default function LazySection({ 
  children, 
  fallback = <div className="h-screen bg-black" />,
  rootMargin = "200px"
}: LazySectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: rootMargin 
  });

  return (
    <div ref={ref}>
      {isInView ? children : fallback}
    </div>
  );
}