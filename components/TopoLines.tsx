// Flowing wave field behind the hero — contour lines that warp like a
// terrain/soundwave, packed and brightened toward the bottom so the glow of
// the mark sits in clean air up top. Procedurally generated and fully
// deterministic, so SSR and client render identically (no hydration drift).

export default function TopoLines({ className }: { className?: string }) {
  const W = 1600;
  const H = 900;
  const N = 46;

  const lines = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    // ease-in distribution → lines bunch toward the bottom of the frame
    const baseY = H * (0.16 + 0.9 * t * t);
    // amplitude grows toward the bottom so the top stays calm and uncluttered
    const amp = (12 + 30 * Math.abs(Math.sin(i * 0.45 + 1))) * (0.4 + 0.6 * t);
    const phase = i * 0.7;
    const freq = 0.004 + 0.0016 * Math.sin(i * 0.3);
    let d = `M -160 ${baseY.toFixed(1)}`;
    for (let x = -160; x <= W + 160; x += 36) {
      const y =
        baseY +
        amp * Math.sin(x * freq + phase) +
        8 * Math.sin(x * 0.011 + i * 0.5) +
        3 * Math.sin(x * 0.022 + i);
      d += ` L ${x} ${y.toFixed(1)}`;
    }
    const op = 0.05 + 0.27 * t; // brighter toward the bottom
    return { d, op };
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={className}
    >
      {lines.map((l, i) => (
        <path
          key={i}
          d={l.d}
          fill="none"
          stroke="rgb(236 233 228)"
          strokeWidth={1.1}
          strokeOpacity={l.op}
        />
      ))}
    </svg>
  );
}
