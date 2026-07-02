import Link from "next/link";
import type { ReactNode } from "react";

// Two-copy roll link — the nav/footer link language. Pure CSS; the under-copy
// climbs in with the accent (the "fun and snappy" color-shift variant).
export function RollLink({
  href,
  children,
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link href={href} className={`roll-link ${className}`} onClick={onClick}>
      <span className="roll-mask">
        <span className="roll-stack">
          <span>{children}</span>
          <span aria-hidden>{children}</span>
        </span>
      </span>
    </Link>
  );
}
