"use client";

// Diagonal shine sweep. Show on hover by toggling `data-on="true"` on ancestor.
export default function Shine({ intensity = 0.25 }: { intensity?: number }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <span
        className="absolute top-0 left-0 h-full w-[60%] -translate-x-full skew-x-[-18deg] opacity-0 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-[220%] group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${intensity}) 50%, transparent 100%)`,
        }}
      />
    </span>
  );
}
