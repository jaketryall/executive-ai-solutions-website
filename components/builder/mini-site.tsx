import type { CSSProperties } from "react";
import { Monogram } from "@/components/ui/monogram";
import {
  INDUSTRIES,
  getAccent,
  toDomain,
  type IndustryPack,
  type SkinId,
} from "./packs";

/* The skinnable mini client site — the builder's centerpiece toy. The
   controls live ON the browser fiction instead of in a form: industries are
   the browser's TABS, and the whole frame is the open button (the .ms-open
   overlay, with the docked pill as its visible face). Pure presentation
   otherwise: builder.tsx staggers [data-ms] on tab swaps and drives the
   ghost self-demo; skin/accent swaps morph via the CSS custom-prop
   transitions. The browser chrome stays neutral on both skins — the browser
   isn't the website. */

export function MiniSite({
  pack,
  skin,
  accent,
  name,
  onOpen,
  onPickIndustry,
}: {
  pack: IndustryPack;
  skin: SkinId;
  accent: string;
  name: string;
  onOpen: () => void;
  onPickIndustry: (id: string) => void;
}) {
  const brand = name.trim() || pack.defaultName;
  const domain = toDomain(name, pack.defaultName);

  return (
    <div
      className="stage-frame ms-frame ms-skin"
      data-skin={skin}
      style={{ "--ms-acc": getAccent(accent).hex } as CSSProperties}
    >
      {/* ── the tab strip — industries as browser tabs ── */}
      <div className="ms-tabs" role="group" aria-label="Pick your industry">
        {INDUSTRIES.map((p) => (
          <button
            key={p.id}
            type="button"
            className="ms-tab"
            data-tab={p.id}
            aria-pressed={p.id === pack.id}
            onClick={() => onPickIndustry(p.id)}
          >
            <span className="ms-tab-dot" aria-hidden />
            {p.tab}
          </button>
        ))}
      </div>

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

        <div data-ms className="ms-hero flex flex-1 items-center gap-fib-2 p-fib-2 md:gap-fib-4 md:p-fib-4">
          <div className="flex flex-1 flex-col items-start gap-[8px] md:gap-fib-2">
            <span className="ms-head">{pack.headline}</span>
            <span className="ms-tag">{pack.tag}</span>
            <span className="ms-btn mt-[4px] md:mt-[8px]">{pack.cta}</span>
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
          {pack.cards.map((card, i) => (
            <div key={card} className="ms-card flex flex-col gap-[6px] rounded-[8px] p-fib-1 md:gap-[9px] md:p-fib-2">
              <span
                className="ms-img h-[24px] rounded-[6px] md:h-[76px]"
                style={{
                  backgroundImage: `url(${pack.cardArt[i].src === "img" ? pack.img : pack.demo.aboutImg})`,
                  backgroundSize: pack.cardArt[i].size,
                  backgroundPosition: pack.cardArt[i].pos,
                }}
              />
              <span className="ms-card-title">{card}</span>
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
      </div>

      {/* ── the frame-wide open button — the docked pill is its visible face ── */}
      <button
        type="button"
        className="ms-open"
        aria-label={`See ${brand}'s site live, fullscreen`}
        onClick={onOpen}
      >
        <span className="ms-open-pill">
          See it live
          <svg viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M3 13 13 3M5.5 3H13v7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* ── the ghost self-demo layer — frame-level so it can reach the tabs
          (builder.tsx drives it; rests hidden) ── */}
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
  );
}
