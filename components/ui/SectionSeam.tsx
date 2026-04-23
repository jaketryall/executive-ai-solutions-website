"use client";

type SeamDirection = "paper-to-ink" | "ink-to-paper";

interface SectionSeamProps {
  direction: SeamDirection;
  toLabel: {
    num: string;
    name: string;
    era?: string;
  };
}

// Transition band between a dark and a light section (or vice versa).
// Per spec: 40vh mobile, 80vh desktop. Linear gradient from the source
// surface to the target surface with a centered oxblood hairline and a
// "you're moving here" label sitting on top of it.
export default function SectionSeam({ direction, toLabel }: SectionSeamProps) {
  const fromColor =
    direction === "paper-to-ink" ? "var(--paper)" : "var(--ink-deep)";
  const toColor =
    direction === "paper-to-ink" ? "var(--ink-deep)" : "var(--paper)";
  const labelColor =
    direction === "paper-to-ink" ? "var(--paper)" : "var(--ink)";

  return (
    <div
      aria-hidden
      className="relative w-full h-[40vh] md:h-[80vh]"
      style={{
        background: `linear-gradient(to bottom, ${fromColor} 0%, ${toColor} 100%)`,
      }}
    >
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center gap-4 px-6 md:px-12 lg:px-24">
        {/* Oxblood "moving here" dot */}
        <span
          className="shrink-0 w-2 h-2 rounded-full"
          style={{ background: "var(--oxblood)" }}
        />
        {/* Hairline — left segment */}
        <div
          className="flex-1 h-px"
          style={{ background: "var(--oxblood)", opacity: 0.6 }}
        />
        {/* Label */}
        <span
          className="font-mono uppercase shrink-0"
          style={{
            color: labelColor,
            fontSize: "10px",
            letterSpacing: "0.22em",
          }}
        >
          → {toLabel.num} / {toLabel.name}
          {toLabel.era && (
            <span style={{ marginLeft: "12px", opacity: 0.7 }}>
              · {toLabel.era}
            </span>
          )}
        </span>
        {/* Hairline — right segment */}
        <div
          className="flex-1 h-px"
          style={{ background: "var(--oxblood)", opacity: 0.6 }}
        />
      </div>
    </div>
  );
}
