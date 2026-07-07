import Link from "next/link";

// Soft-rectangle CTA (v3) — the site's one CTA language: fill-wipe ground
// (CSS ::before rises from the bottom, label inverts) + trailing arrow that
// nudges x+3px. All motion lives in globals.css on the UI curve; this stays
// a server-renderable component with a real text label.

function Arrow() {
  return (
    <svg className="cta-arrow" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 8h11M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Tone = "accent" | "ink" | "paper";

export function CTA({
  href,
  label,
  meta,
  tone = "accent",
  type,
  disabled,
  onClick,
  className = "",
}: {
  href?: string;
  label: string;
  /** small trailing detail (e.g. the live estimate total) */
  meta?: string;
  tone?: Tone;
  type?: "submit" | "button";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const inner = (
    <>
      <span className="text-trim">{label}</span>
      {meta ? <span className="pcta-total">{meta}</span> : null}
      <Arrow />
    </>
  );

  const cls = `cta-btn cta-btn--${tone} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button
      type={type ?? "button"}
      className={cls}
      disabled={disabled}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}
