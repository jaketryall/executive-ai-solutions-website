"use client";

import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  isLowEnd: boolean;
  hasSufficientMemory: boolean;
  connectionType: 'slow' | 'fast' | 'unknown';
  devicePixelRatio: number;
  hardwareConcurrency: number;
}

export function usePerformance(): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    isLowEnd: false,
    hasSufficientMemory: true,
    connectionType: 'unknown',
    devicePixelRatio: 1,
    hardwareConcurrency: 4,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkPerformance = () => {
      const newMetrics: PerformanceMetrics = {
        isLowEnd: false,
        hasSufficientMemory: true,
        connectionType: 'unknown',
        devicePixelRatio: window.devicePixelRatio || 1,
        hardwareConcurrency: navigator.hardwareConcurrency || 4,
      };

      // Check device memory (if available)
      if ('deviceMemory' in navigator) {
        const deviceMemory = (navigator as any).deviceMemory;
        newMetrics.hasSufficientMemory = deviceMemory >= 4;
        if (deviceMemory < 4) newMetrics.isLowEnd = true;
      }

      // Check connection type
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          const effectiveType = connection.effectiveType;
          if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            newMetrics.connectionType = 'slow';
            newMetrics.isLowEnd = true;
          } else if (effectiveType === '4g') {
            newMetrics.connectionType = 'fast';
          } else {
            newMetrics.connectionType = effectiveType === '3g' ? 'slow' : 'unknown';
          }
        }
      }

      // Check hardware concurrency (CPU cores)
      if (navigator.hardwareConcurrency <= 2) {
        newMetrics.isLowEnd = true;
      }

      // Check if it's a mobile device with high pixel ratio (battery concern)
      if (window.innerWidth < 768 && window.devicePixelRatio > 2) {
        newMetrics.isLowEnd = true;
      }

      // Performance observer check (if available)
      if ('PerformanceObserver' in window) {
        try {
          // Check for long tasks
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const hasLongTasks = entries.some(entry => entry.duration > 50);
            if (hasLongTasks) {
              newMetrics.isLowEnd = true;
            }
          });
          observer.observe({ entryTypes: ['longtask'] });
          
          // Disconnect after 2 seconds
          setTimeout(() => observer.disconnect(), 2000);
        } catch (e) {
          // Performance observer not supported
        }
      }

      setMetrics(newMetrics);
    };

    checkPerformance();

    // Listen for connection changes
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        connection.addEventListener('change', checkPerformance);
        return () => connection.removeEventListener('change', checkPerformance);
      }
    }
  }, []);

  return metrics;
}

export function useOptimizedAnimation() {
  const { isLowEnd } = usePerformance();
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return {
    // Disable complex animations on low-end devices
    enableParticles: !isLowEnd && !prefersReducedMotion,
    enableBlur: !isLowEnd,
    enableParallax: !isLowEnd && !prefersReducedMotion,
    enable3D: !isLowEnd,
    animationDuration: isLowEnd ? 0.1 : undefined,
    // Reduce particle count on low-end devices
    particleCount: isLowEnd ? 5 : 20,
  };
}