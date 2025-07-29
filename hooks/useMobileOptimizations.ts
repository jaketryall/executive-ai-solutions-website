"use client";

import { useEffect } from 'react';

export function useMobileOptimizations() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Add passive event listeners for better scroll performance
    const addPassiveSupport = () => {
      let passiveSupported = false;
      try {
        const options = {
          get passive() {
            passiveSupported = true;
            return false;
          }
        };
        window.addEventListener("test", null as any, options);
        window.removeEventListener("test", null as any);
      } catch (err) {
        passiveSupported = false;
      }
      return passiveSupported;
    };

    const supportsPassive = addPassiveSupport();
    const passiveOption = supportsPassive ? { passive: true } : false;

    // Optimize touch events
    const touchStartHandler = () => {};
    const touchMoveHandler = () => {};
    
    document.addEventListener('touchstart', touchStartHandler, passiveOption);
    document.addEventListener('touchmove', touchMoveHandler, passiveOption);

    // Add will-change hints for frequently animated elements
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => {
      (el as HTMLElement).style.willChange = 'transform, opacity';
    });

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', touchStartHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      animatedElements.forEach(el => {
        (el as HTMLElement).style.willChange = 'auto';
      });
    };
  }, []);
}

// Hook to preload critical resources
export function useResourceHints() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Preconnect to external domains
    const preconnectUrls = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    preconnectUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // DNS prefetch for potential external resources
    const dnsPrefetchUrls = [
      'https://www.google-analytics.com',
      'https://vitals.vercel-insights.com',
    ];

    dnsPrefetchUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }, []);
}