"use client";

const ITEMS = [
  "NEXT.JS",
  "REACT",
  "GSAP",
  "FRAMER MOTION",
  "TAILWIND",
  "TYPESCRIPT",
];

const ROW_CONTENT = Array(8)
  .fill(ITEMS)
  .flat()
  .map((item, i) => (
    <span key={i} className="whitespace-nowrap">
      {item} <span className="mx-2">&mdash;</span>
    </span>
  ));

export default function Marquee() {
  return (
    <section data-bg="dark" className="py-12 md:py-16 overflow-hidden">
      <style jsx>{`
        @keyframes translateXLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes translateXRight {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .marquee-left {
          animation: translateXLeft 30s linear infinite;
        }
        .marquee-right {
          animation: translateXRight 30s linear infinite;
        }
        .marquee-track:hover .marquee-left,
        .marquee-track:hover .marquee-right {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex flex-col gap-4">
        {/* Row 1 - scrolls left */}
        <div
          className="marquee-track flex"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div
            className="marquee-left flex shrink-0 items-center text-xs md:text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: "rgba(229, 225, 219, 0.15)" }}
          >
            {ROW_CONTENT}
          </div>
          <div
            className="marquee-left flex shrink-0 items-center text-xs md:text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: "rgba(229, 225, 219, 0.15)" }}
            aria-hidden
          >
            {ROW_CONTENT}
          </div>
        </div>

        {/* Row 2 - scrolls right */}
        <div
          className="marquee-track flex"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div
            className="marquee-right flex shrink-0 items-center text-xs md:text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: "rgba(229, 225, 219, 0.15)" }}
          >
            {ROW_CONTENT}
          </div>
          <div
            className="marquee-right flex shrink-0 items-center text-xs md:text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: "rgba(229, 225, 219, 0.15)" }}
            aria-hidden
          >
            {ROW_CONTENT}
          </div>
        </div>
      </div>
    </section>
  );
}
