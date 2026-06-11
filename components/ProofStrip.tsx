// Proof strip — slow infinite marquee of client wordmarks, hairline-anchored.
// Pauses on hover; static under prefers-reduced-motion.

// TODO(owner): confirm/extend the client list — pulled from visible project work.
const BRANDS = [
  "Riled Up",
  "Desert Wings",
  "Wings N Wheels",
  "Lando",
  "AZ Gyro Tours",
];

function Sequence({ hidden = false }: { hidden?: boolean }) {
  return (
    <span className="marquee-seq" aria-hidden={hidden || undefined}>
      {BRANDS.map((b) => (
        <span key={b} className="flex items-center gap-[inherit]">
          <span className="text-lg font-semibold tracking-tight text-ink/55 whitespace-nowrap uppercase">
            {b}
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full bg-oxblood/40 shrink-0"
            aria-hidden
          />
        </span>
      ))}
    </span>
  );
}

export default function ProofStrip() {
  return (
    <section
      aria-label="Brands we've worked with"
      className="relative border-t border-ink/8 pt-9 pb-20"
    >
      <p className="micro text-taupe text-center">
        Trusted by owners who needed results
      </p>
      <div className="marquee-wrap mt-6">
        <div className="marquee">
          <Sequence />
          <Sequence hidden />
        </div>
      </div>
    </section>
  );
}
