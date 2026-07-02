// The EA monogram — the through-line motif. Rendered as a CSS mask so it recolors
// with currentColor on any ground (canvas, dark, accent).
export function Monogram({
  className = "",
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={`monogram ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
