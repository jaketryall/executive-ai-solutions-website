import { forwardRef } from "react";
import type { CSSProperties } from "react";
import { getAccent, toDomain, type IndustryPack, type SkinId } from "./packs";

/* The fullscreen demo site — their build at real scale: a scrollable
   one-pager with real copy, real type, hover states, and no fill bars.
   Pure presentation; builder.tsx owns the FLIP open/close and drives the
   entrance + scroll choreography via the data-demo hooks. The pinned EAS bar
   at the bottom is the one thing that ISN'T their site — it's the ask. */

export const DemoSite = forwardRef<
  HTMLDivElement,
  {
    pack: IndustryPack;
    skin: SkinId;
    accent: string;
    name: string;
    onClose: (e?: React.MouseEvent) => void;
  }
>(function DemoSite({ pack, skin, accent, name, onClose }, ref) {
  const brand = name.trim() || pack.defaultName;
  const domain = toDomain(name, pack.defaultName);
  const d = pack.demo;

  const jump = (idx: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    const scroller = (e.currentTarget as HTMLElement).closest(".demo-scroll");
    scroller
      ?.querySelectorAll("[data-demo-section]")
      [idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      ref={ref}
      className="demo-root ms-skin"
      data-skin={skin}
      style={{ "--ms-acc": getAccent(accent).hex } as CSSProperties}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview of ${brand}'s website`}
    >
      <div className="demo-scroll" data-lenis-prevent>
        {/* ── their nav ── */}
        <header className="demo-nav" data-demo="nav">
          <span className="demo-brand">{brand}</span>
          <nav className="demo-links" aria-label="Demo site sections">
            <button type="button" onClick={jump(0)}>{pack.nav[0]}</button>
            <button type="button" onClick={jump(1)}>{pack.nav[1]}</button>
            <button type="button" onClick={jump(2)}>{pack.nav[2]}</button>
          </nav>
          <span className="demo-btn demo-btn--sm">{pack.cta}</span>
        </header>

        {/* ── hero ── */}
        <section className="demo-hero" data-demo-section>
          <div className="demo-hero-copy">
            <h1 className="demo-head" data-demo="head" aria-label={pack.headline}>
              {pack.headline.split(" ").map((word, i) => (
                <span key={i} className="demo-word">
                  <span className="demo-word-inner">{word}</span>
                </span>
              ))}
            </h1>
            <p className="demo-sub" data-demo="rise">
              {d.sub}
            </p>
            <span className="demo-btn" data-demo="rise">
              {pack.cta}
            </span>
          </div>
          <div
            className="demo-photo demo-hero-photo"
            data-demo="photo"
            style={{ backgroundImage: `url(${pack.img})` }}
          />
        </section>

        {/* ── the ticker — the site breathing between sections ── */}
        <div className="demo-ticker" data-demo-anim aria-hidden>
          <div className="demo-ticker-track">
            {[...d.ticker, ...d.ticker].map((word, i) => (
              <span key={i} className="demo-ticker-item">
                {word}
                <span className="demo-ticker-dot">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── services — numbered editorial rows ── */}
        <section className="demo-band" data-demo-section>
          <p className="demo-kicker demo-kicker-row" data-demo-anim>
            {pack.nav[0]}
          </p>
          <div className="demo-rows">
            {d.services.map((s, i) => (
              <article key={s.title} className="demo-row" data-demo-anim>
                <span className="demo-row-num">{String(i + 1).padStart(2, "0")}</span>
                <h2>{s.title}</h2>
                <p>{s.desc}</p>
                <span className="demo-row-arrow" aria-hidden>
                  <svg viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 13 13 3M5.5 3H13v7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* ── about — photo with the headline stat floated over it ── */}
        <section className="demo-band demo-about" data-demo-section>
          <div className="demo-about-photo-wrap" data-demo-anim>
            <div
              className="demo-photo demo-about-photo"
              style={{ backgroundImage: `url(${d.aboutImg})` }}
            />
            <div className="demo-stat-float">
              <span className="demo-stat-val">{d.stats[0][0]}</span>
              <span className="demo-stat-label">{d.stats[0][1]}</span>
            </div>
          </div>
          <div className="demo-about-copy">
            <p className="demo-kicker demo-kicker-row" data-demo-anim>
              {d.aboutKicker}
            </p>
            <p className="demo-about-text" data-demo-anim>
              {d.about}
            </p>
            <div className="demo-stats">
              {d.stats.slice(1).map(([val, label]) => (
                <div key={label} className="demo-stat" data-demo-anim>
                  <span className="demo-stat-val">{val}</span>
                  <span className="demo-stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── the review, at full size ── */}
        <section className="demo-band demo-quote" data-demo-section>
          <span className="demo-stars" data-demo-anim aria-hidden>
            ★★★★★
          </span>
          <blockquote data-demo-anim>“{pack.review.quote}”</blockquote>
          <p className="demo-quote-author" data-demo-anim>
            — {pack.review.author}
          </p>
        </section>

        {/* ── contact footer — closes on their name, enormous ── */}
        <footer className="demo-foot-band">
          <p className="demo-foot-line" data-demo-anim>
            {d.contactLine}
          </p>
          <span className="demo-btn" data-demo-anim>
            {pack.cta}
          </span>
          <div className="demo-foot-meta">
            <span>© {brand}</span>
            <span>{domain}</span>
          </div>
          <p className="demo-mark" data-demo-anim aria-hidden>
            {brand}
          </p>
        </footer>

        {/* breathing room above the pinned bar */}
        <div className="h-fib-6" aria-hidden />
      </div>

      {/* ── the EAS bar — the one piece that isn't their site ── */}
      <div className="demo-bar" data-demo="bar">
        <p className="demo-bar-line">
          <span className="demo-bar-strong">Built in 60 seconds.</span>
          <span className="demo-bar-tail"> Imagine four weeks.</span>
        </p>
        <a href="#contact" className="demo-bar-cta" onClick={onClose}>
          Make it real
          <svg viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M3 13 13 3M5.5 3H13v7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <button type="button" className="demo-close" onClick={onClose} aria-label="Close the preview">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
});
