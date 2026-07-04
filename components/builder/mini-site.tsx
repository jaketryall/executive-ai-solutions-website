import type { CSSProperties } from "react";
import { Monogram } from "@/components/ui/monogram";
import { getAccent, toDomain, type IndustryPack, type SkinId } from "./packs";

/* The skinnable mini client site — the builder's live preview, drawn in the
   same browser-frame language as the process stage. Pure presentation: no
   animation inside (the section staggers [data-ms] on industry swaps and
   drives the alive layer; skin/accent swaps morph via the CSS custom-prop
   transitions). The browser chrome deliberately stays neutral on both skins —
   the browser isn't part of the website. */

export function MiniSite({
  pack,
  skin,
  accent,
  name,
}: {
  pack: IndustryPack;
  skin: SkinId;
  accent: string;
  name: string;
}) {
  const brand = name.trim() || pack.defaultName;
  const domain = toDomain(name, pack.defaultName);

  return (
    <div
      className="stage-frame ms-frame ms-skin"
      data-skin={skin}
      style={{ "--ms-acc": getAccent(accent).hex } as CSSProperties}
    >
      <span className="browser-chrome">
        <Monogram className="h-[13px] w-[13px] opacity-70" />
        <span className="text-trim">{domain}</span>
      </span>

      <div className="ms-canvas">
        <div data-ms className="flex items-center justify-between gap-fib-2">
          <span className="ms-brand text-trim">{brand}</span>
          <span className="flex items-center gap-fib-2">
            {pack.nav.map((link) => (
              <span key={link} className="ms-nav">
                {link}
              </span>
            ))}
          </span>
        </div>

        <div data-ms className="ms-hero flex flex-1 items-center gap-fib-2 p-fib-2 md:gap-fib-3 md:p-fib-3">
          <div className="flex flex-1 flex-col items-start gap-[9px] md:gap-[12px]">
            <span className="ms-head">{pack.headline}</span>
            <span className="ms-fill h-[8px] w-[72%]" />
            <span className="ms-btn mt-[4px]">{pack.cta}</span>
          </div>
          {/* the photo — duotone-tinted by the accent via ::after, so a swatch
              click re-grades the imagery too. min-h floors it on mobile, where
              the auto-height canvas gives the percentage nothing to resolve
              against. */}
          <span
            className="ms-img h-[76%] min-h-[89px] w-[32%] rounded-[8px]"
            style={{ backgroundImage: `url(${pack.img})` }}
          />
        </div>

        <div data-ms className="grid grid-cols-3 gap-fib-1 md:gap-fib-2">
          {pack.cards.map((card) => (
            <div key={card} className="ms-card flex flex-col gap-[6px] rounded-[8px] p-fib-1 md:p-[10px]">
              <span className="ms-thumb h-[24px] md:h-[34px]" />
              <span className="ms-card-title">{card}</span>
              <span className="ms-fill h-[6px] w-[55%]" />
            </div>
          ))}
        </div>

        {/* social proof strip — the band that makes it read as a page, not a card */}
        <div data-ms className="ms-review flex items-center gap-fib-2 rounded-[8px] px-fib-2 py-[8px]">
          <span className="ms-stars" aria-hidden>
            ★★★★★
          </span>
          <span className="ms-review-quote text-trim">
            “{pack.review.quote}” <span className="ms-review-author">— {pack.review.author}</span>
          </span>
        </div>

        <div data-ms className="flex items-center justify-between">
          <span className="ms-foot">© {brand}</span>
          <span className="ms-foot">{domain}</span>
        </div>

        {/* ── the alive layer (builder.tsx drives it; rests hidden) ── */}
        <span className="ms-cursor" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M5 3l14 7.5-6.2 1.6L9.5 18 5 3z"
              fill="currentColor"
              stroke="var(--color-paper)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="ms-toast" aria-hidden>
          <span className="ms-toast-dot" />
          {pack.toast}
        </div>
      </div>
    </div>
  );
}
