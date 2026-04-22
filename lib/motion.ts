// Apple × motion — shared motion vocabulary.
// Every reveal uses these values so the site feels like one instrument.

export const ease = {
  expoOut: [0.19, 1, 0.22, 1] as const,
  expoInOut: [0.87, 0, 0.13, 1] as const,
  soft: [0.25, 0.46, 0.45, 0.94] as const,
  spring: { type: "spring", stiffness: 220, damping: 28 } as const,
  springSnappy: { type: "spring", stiffness: 360, damping: 32 } as const,
} as const;

export const duration = {
  micro: 0.2,
  comp: 0.4,
  section: 0.7,
  cinematic: 1.2,
} as const;

export const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.section, ease: ease.expoOut } },
};

export const revealStagger = (stagger = 0.08) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: stagger, delayChildren: 0.1 },
  },
});

export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
