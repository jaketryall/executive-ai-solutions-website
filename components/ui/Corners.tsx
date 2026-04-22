"use client";

// Four tiny L-shaped crosshair marks that grow in from each corner on parent `group-hover`.
export default function Corners({
  size = 14,
  color = "rgba(243,241,238,0.85)",
  inset = 14,
}: {
  size?: number;
  color?: string;
  inset?: number;
}) {
  const base =
    "absolute pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]";
  return (
    <>
      {/* Top-left */}
      <span
        aria-hidden
        className={`${base} opacity-0 -translate-x-2 -translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`}
        style={{ top: inset, left: inset, width: size, height: size, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }}
      />
      <span
        aria-hidden
        className={`${base} opacity-0 translate-x-2 -translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`}
        style={{ top: inset, right: inset, width: size, height: size, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` }}
      />
      <span
        aria-hidden
        className={`${base} opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`}
        style={{ bottom: inset, left: inset, width: size, height: size, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` }}
      />
      <span
        aria-hidden
        className={`${base} opacity-0 translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`}
        style={{ bottom: inset, right: inset, width: size, height: size, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }}
      />
    </>
  );
}
