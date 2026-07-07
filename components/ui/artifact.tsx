import type { ReactNode } from "react";
import { Monogram } from "@/components/ui/monogram";

/* The artifact frame — v3's through-line motif. Every "image" on the page is
   a real surface of the funnel (an ad, a SERP listing, a landing page in a
   browser, the chat, the estimator), and they all wear this ONE frame system.
   Exactly two variants:
     chrome — full browser chrome: 34px bar (dots + url) over the content
     card   — compact card: tight inset, no bar (ad card, SERP card, chip)
   Hairlines are allowed INSIDE an artifact (diegetic UI) and nowhere else. */
export function ArtifactFrame({
  variant = "card",
  tone = "paper",
  url,
  className = "",
  bodyClassName = "",
  children,
  label,
}: {
  variant?: "chrome" | "card";
  tone?: "ink" | "paper";
  /** chrome variant: the display url in the bar */
  url?: string;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
  /** accessible name for the framed surface */
  label?: string;
}) {
  return (
    <figure
      className={`af af--${variant} af--${tone} ${className}`}
      role={label ? "group" : undefined}
      aria-label={label}
    >
      {variant === "chrome" ? (
        <div className="af-bar" aria-hidden>
          <Monogram className="h-[13px] w-[13px] opacity-70" />
          {url ? <span className="af-url">{url}</span> : null}
        </div>
      ) : null}
      <div className={`af-body ${bodyClassName}`}>{children}</div>
    </figure>
  );
}
