// Sparkle / particle field — tiny white points scattered through the hero, a
// few brighter "stars". Positions come from a cheap deterministic hash so SSR
// and client agree. Perf: the dots are STATIC; the whole <svg> breathes its
// opacity as ONE compositor layer (`sparkle-field` in globals), so the field
// rasterizes once instead of running 88 independent per-element animations.
// No per-dot filters — bright stars get a larger radius instead of a blur.

const W = 1600;
const H = 900;
const N = 60;

// deterministic pseudo-random in [0,1)
const rnd = (n: number) => {
  const v = Math.sin(n * 12.9898) * 43758.5453;
  return v - Math.floor(v);
};

export default function Sparkles({ className }: { className?: string }) {
  const dots = Array.from({ length: N }, (_, i) => {
    const x = rnd(i + 1) * W;
    // bias slightly toward the lower 2/3 where the wave field lives
    const y = (0.12 + 0.88 * rnd(i + 7.3)) * H;
    const bright = rnd(i + 11) > 0.85;
    const r = bright ? 1.9 + rnd(i + 3.1) * 1.5 : 0.4 + rnd(i + 3.1) * 1.1;
    // Round so SSR (Node) and client (browser) serialize identical strings.
    const op = Number(
      (bright ? 0.75 + rnd(i + 5.5) * 0.25 : 0.12 + rnd(i + 5.5) * 0.4).toFixed(3),
    );
    return { x, y, r, op };
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={`${className ?? ""} sparkle-field`}
    >
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x.toFixed(1)}
          cy={d.y.toFixed(1)}
          r={d.r.toFixed(2)}
          fill="rgb(255 255 255)"
          opacity={d.op}
        />
      ))}
    </svg>
  );
}
