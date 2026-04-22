"use client";

import { useEffect, useRef, useState } from "react";

// Animates a numeric value as it enters view. Respects non-numeric prefixes/suffixes (e.g. "100%", "2+").
export default function CountUp({
  value,
  duration = 1400,
  className,
  style,
}: {
  value: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const m = value.match(/^([^\d-]*)([-+]?\d+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    const [, prefix, numStr, suffix] = m;
    const target = parseFloat(numStr);
    const decimals = (numStr.split(".")[1] || "").length;
    setDisplay(`${prefix}0${suffix}`);

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const cur = target * eased;
            setDisplay(`${prefix}${cur.toFixed(decimals)}${suffix}`);
            if (p < 1) requestAnimationFrame(tick);
            else setDisplay(`${prefix}${numStr}${suffix}`);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}
