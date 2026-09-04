"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Archivo, Instrument_Sans } from "next/font/google";
import "./dark.css";

/* Archivo is requested WITH the wdth axis on purpose: pulled without it,
   Google silently serves default-width Archivo — a different, much worse
   face, with no error and nothing visible in a screenshot review. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

/* §01 · COLD OPEN — "The Dark Room"
   Job: state the offer, the geography and the promise in three seconds;
   prove craft with one lit object; hand off two doors at different
   commitment levels. ~78% untouched black, six text objects. */
export default function DarkRoom() {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("darkroom", archivo.variable, instrument.variable);
    // everything readable by ~1.0s — no enter gate, no loader, no video
    const id = requestAnimationFrame(() => setLit(true));
    return () => {
      cancelAnimationFrame(id);
      root.classList.remove("darkroom", archivo.variable, instrument.variable);
    };
  }, []);

  return (
    <div className={lit ? "dr-lit" : undefined}>
      <div className="dr-key" aria-hidden />
      <div className="dr-grain" aria-hidden />
      <div className="dr-vignette" aria-hidden />

      <div className="dr-stage">
        <header className="dr-nav wrap">
          <div className="dr-nav-in">
            <div className="dr-lockup">
              <b>Executive AI Solutions</b>
              <span className="t-meta">Mesa, Arizona</span>
            </div>
            <a href="#book" className="t-label" style={{ color: "var(--ink)" }}>
              Book the call
            </a>
          </div>
        </header>

        <main className="dr-main wrap">
          <div className="dr-row">
            <div className="dr-copy">
              <p className="t-label dr-eyebrow">
                Mesa, Arizona · Web design + the front desk behind it
              </p>

              <h1 className="t-hero" style={{ marginTop: "var(--fib-4)" }}>
                <span className="dr-line">
                  <span className="sweep">The site they see.</span>
                </span>
                <span className="dr-line">
                  <span className="sweep">The front desk they don&rsquo;t.</span>
                </span>
              </h1>

              <p className="t-body dr-sub">
                We build your website and wire up the front desk behind it, so
                every lead that comes in gets answered in seconds instead of
                days — and you can finally see which ad paid for which job.
              </p>

              <div className="dr-actions">
                <a href="#book" id="book" className="dr-pill t-cta">
                  Book the call
                </a>

                <form
                  className="dr-check"
                  onSubmit={(e) => e.preventDefault()}
                  aria-label="Free site check"
                >
                  <input
                    type="text"
                    placeholder="yoursite.com"
                    aria-label="Your website address"
                  />
                  <button type="submit" className="t-label">
                    Check it free
                  </button>
                  <span className="t-meta">
                    15 checks, ten seconds, no email
                  </span>
                </form>
              </div>
            </div>

            {/* the one lit object: a real client site, glowing against nothing */}
            <div className="dr-object">
              <div className="dr-device">
                <div className="dr-glow" aria-hidden />
                <Image
                  src="/work/dw-phone-tour.jpg"
                  alt="Desert Wings flight school website on a phone"
                  width={620}
                  height={1343}
                  priority
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
