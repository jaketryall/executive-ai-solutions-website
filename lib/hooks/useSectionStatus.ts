"use client";

import { RefObject, useEffect, useState } from "react";

export type SectionStatus = "queued" | "in-transit" | "delivered";

export function useSectionStatus(ref: RefObject<HTMLElement | null>): SectionStatus {
  const [status, setStatus] = useState<SectionStatus>("queued");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const rect = entry.boundingClientRect;
        if (!entry.isIntersecting) {
          // Section is entirely off-screen
          if (rect.bottom < 0) setStatus("delivered");
          else setStatus("queued");
        } else {
          setStatus("in-transit");
        }
      },
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return status;
}
