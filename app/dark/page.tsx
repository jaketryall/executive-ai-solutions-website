"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Archivo, Instrument_Sans } from "next/font/google";
import { CustomEase } from "gsap/CustomEase";
import { gsap, reducedMotion } from "@/components/anim/ease";
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

/* The room runs its own two curves — the same two the stylesheet declares,
   registered here so JS and CSS can never drift apart. Nothing in this room
   is allowed a third curve. */
const S = "dr-structure";
const U = "dr-ui";
CustomEase.create(S, "M0,0 C0.25,1 0.5,1 1,1"); //   --ease-structure
CustomEase.create(U, "M0,0 C0.16,1 0.3,1 1,1"); //   --ease-ui

const useIsoLayout = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* §01 · COLD OPEN — "The Dark Room"
   Job: state the offer, the geography and the promise in three seconds;
   prove craft with one lit object; hand off two doors at different
   commitment levels. ~78% untouched black, six text objects. */
export default function DarkRoom() {
  const [lit, setLit] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLElement>(null);
  const monoRef = useRef<HTMLSpanElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("darkroom", archivo.variable, instrument.variable);
    const id = requestAnimationFrame(() => setLit(true));
    return () => {
      cancelAnimationFrame(id);
      root.classList.remove("darkroom", archivo.variable, instrument.variable);
    };
  }, []);

  /* THE RAIL'S TITLE SEQUENCE
     A circle arrives → stretches into the pill → the wordmark appears at
     full scale, centred inside it → shrinks into its resting place → the
     mark lands to its left → the rest of the rail arrives from the right.
     Measured, not guessed: the centred position is the live delta between
     the rail's centre and the wordmark's own, so it holds at every width. */
  useIsoLayout(() => {
    const rail = railRef.current;
    const word = wordRef.current;
    const mono = monoRef.current;
    const tail = tailRef.current;
    if (!rail || !word || !mono || !tail) return;

    const tailKids = gsap.utils.toArray<HTMLElement>(tail.children);

    if (reducedMotion()) {
      gsap.set([rail, word, mono, ...tailKids], { autoAlpha: 1, clearProps: "transform" });
      return;
    }

    const ctx = gsap.context(() => {
      /* Hide FIRST, synchronously, so nothing flashes — then measure only
         once the route CSS and the variable font have actually landed.
         Measuring in the layout effect read a 1400px rail (the wrap padding
         had not applied yet) and a pre-swap wordmark width, so the centred
         beat sat 37px off. Fonts change the wordmark's width; CSS changes
         the rail's. Both have to be settled before a single measurement. */
      gsap.set([word, mono], { autoAlpha: 0 });
      gsap.set(tailKids, { autoAlpha: 0, y: 9 });
      gsap.set(rail, { autoAlpha: 0 });

      let raf = 0;
      const play = () => {
        const railBox = rail.getBoundingClientRect();
        const wordBox = word.getBoundingClientRect();
        // scale is about the wordmark's own centre, so this delta alone
        // parks it dead-centre in the pill at any width
        const dx =
          railBox.left + railBox.width / 2 - (wordBox.left + wordBox.width / 2);

        // 2.2 is the ceiling, not the value: on a phone rail that scale runs
        // the wordmark wider than the pill and it clips. Derive it.
        const big = Math.min(2.2, (railBox.width - 56) / wordBox.width);

        gsap.set(rail, { width: rail.offsetHeight, scale: 0.5 });

        const tl = gsap
          .timeline({ defaults: { ease: S } })
          .to(rail, { autoAlpha: 1, scale: 1, duration: 0.45, ease: U })
          .to(rail, { width: "100%", duration: 0.65 }, "+=0.05")
          .fromTo(
            word,
            { autoAlpha: 0, x: dx, scale: big },
            { autoAlpha: 1, x: dx, scale: big, duration: 0.35 },
            "-=0.2"
          )
          .to(word, { x: 0, scale: 1, duration: 0.6 }, "+=0.15")
          .to(mono, { autoAlpha: 1, duration: 0.4, ease: U }, "-=0.3")
          .to(
            tailKids,
            { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.07, ease: U },
            "-=0.24"
          )
          // hand the width back to CSS so the rail stays fluid afterwards
          .set(rail, { clearProps: "width" });

        /* A load choreography is over before any screenshot fires, so the
           only way to review it is to seek it paused. Exposed on purpose. */
        (window as unknown as { __drIntro?: gsap.core.Timeline }).__drIntro = tl;
      };

      const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
      Promise.resolve(fonts ? fonts.ready : undefined).then(() => {
        raf = requestAnimationFrame(() => {
          raf = requestAnimationFrame(play);
        });
      });
      return () => cancelAnimationFrame(raf);
    }, railRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={lit ? "dr-lit" : undefined}>
      {/* the mark is the ROOM, not the object: engraved into the black,
          bled off the edge, with light travelling around its cut contour */}
      <div className="dr-mark" aria-hidden>
        <span />
        <i />
      </div>
      <div className="dr-key" aria-hidden />
      <div className="dr-grain" aria-hidden />
      <div className="dr-vignette" aria-hidden />

      <div className="dr-stage">
        <header className="dr-nav wrap">
          <div className="dr-rail dr-edge" ref={railRef}>
            <div className="dr-rail-in">
              <Link className="dr-lockup" href="/">
                <span className="dr-mono" ref={monoRef} aria-hidden />
                <b ref={wordRef}>Executive AI Solutions</b>
              </Link>

              <div className="dr-rail-tail" ref={tailRef}>
                <nav className="dr-links" aria-label="Main">
                  <Link href="/work">
                    <span data-label="Work">Work</span>
                  </Link>
                  <Link href="/services/websites">
                    <span data-label="Services">Services</span>
                  </Link>
                  <Link href="/pricing">
                    <span data-label="Pricing">Pricing</span>
                  </Link>
                </nav>

                <Link href="/contact" className="dr-navcta dr-edge t-cta">
                  Book the call
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="dr-main wrap">
          <div className="dr-row">
            <div className="dr-copy">
              <p className="t-label dr-eyebrow">
                Mesa, Arizona · Web design + the system behind it
              </p>

              <h1 className="t-hero" style={{ marginTop: "var(--fib-4)" }}>
                <span className="dr-line">
                  <span className="sweep">A website that books</span>
                </span>
                <span className="dr-line">
                  <span className="sweep">while you&rsquo;re</span>
                </span>
                <span className="dr-line">
                  <span className="sweep">on the job.</span>
                </span>
              </h1>

              <p className="t-body dr-sub">
                We build your site and wire up the system behind it — so every
                call, form and text gets answered in seconds instead of days,
                and you can finally see which ad paid for which job.
              </p>

              <div className="dr-actions">
                <Link href="/contact" className="dr-pill t-cta">
                  Book the call
                </Link>

                {/* the second action is a FIELD on its own surface, never a
                    second button — a text field cannot compete with a button
                    for the primary click */}
                <form
                  className="dr-check dr-panel dr-edge"
                  onSubmit={(e) => e.preventDefault()}
                  aria-label="Free site check"
                >
                  <span className="t-label dr-check-h">Free site check</span>
                  <div className="dr-check-row">
                    <input
                      type="text"
                      placeholder="yoursite.com"
                      aria-label="Your website address"
                    />
                    <button type="submit" className="t-label">
                      Check it
                    </button>
                  </div>
                  <span className="t-meta">15 checks, ten seconds, no email</span>
                </form>
              </div>
            </div>

            {/* the one lit object: a real client site, glowing against nothing,
                sitting on a surface that says whose it is */}
            <div className="dr-object">
              <figure className="dr-showcase dr-panel dr-edge">
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
                <figcaption>
                  <b>Desert Wings Flight School</b>
                  <span className="t-meta">Falcon Field, Mesa</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
