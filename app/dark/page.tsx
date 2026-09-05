"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import WorksList from "@/components/dark/works-list";
import ServicesSection from "@/components/dark/services-section";
import ProofSection from "@/components/dark/proof-section";
import RunsSection from "@/components/dark/runs-section";
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




/* §01 · COLD OPEN — "The Dark Room"
   Job: state the offer, the geography and the promise in three seconds;
   prove craft with one lit object; hand off two doors at different
   commitment levels. ~78% untouched black, six text objects. */

/* Per-character roll. Each letter is its own cell with a duplicate one line
   below and a delay keyed to its index, so the swap cascades across the word
   instead of the whole label flipping at once. The link keeps a real label
   for screen readers; the split is decoration. */
function Roll({ label }: { label: string }) {
  return (
    <span className="dr-roll" aria-hidden>
      {label.split("").map((ch, i) => (
        <span
          key={i}
          className="dr-char"
          data-char={ch}
          style={{ "--i": i } as React.CSSProperties}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function DarkRoom() {
  const [lit, setLit] = useState(false);

  /* Theming is NOT done here any more. Adding the class in an effect meant
     the browser painted the root layout's light sheet first and the reload
     flashed white. The room's ground and its fonts now ride on the
     server-rendered wrapper below, so the first frame is already black.
     This effect only arms the entrance. */
  useEffect(() => {
    const id = requestAnimationFrame(() => setLit(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* The rail transforms on SCROLL, not on load. A sentinel at the very top
     of the stage says the moment the page has left the top — cheaper and
     more honest than guessing a scroll offset. */
  const topRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const top = topRef.current;
    if (!top) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), {
      threshold: 0,
    });
    io.observe(top);
    return () => io.disconnect();
  }, []);

  /* PARALLAX — the LIGHT only. The mark holds still: it is the object in the
     room, and an object that slides with your cursor stops reading as one.
     Pointer only; on touch there is nothing to answer and the ambient drift
     already carries it. */
  useEffect(() => {
    const atmos = document.querySelector<HTMLElement>(".dr-atmos");
    if (
      !atmos ||
      reducedMotion() ||
      !window.matchMedia("(hover: hover)").matches
    )
      return;
    const ax = gsap.quickTo(atmos, "x", { duration: 1.2, ease: U });
    const ay = gsap.quickTo(atmos, "y", { duration: 1.2, ease: U });
    const onMove = (e: PointerEvent) => {
      ax((e.clientX / window.innerWidth - 0.5) * 78);
      ay((e.clientY / window.innerHeight - 0.5) * 46);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    /* THE WALL RISES ON SCROLL, at a tenth of the page's rate. It is a fixed
       layer, so without this it sits dead still while everything moves past
       it; a slow climb is what makes it read as depth rather than wallpaper.
       Capped so it never drifts out of frame on a long page. */
    const wall = document.querySelector<HTMLElement>(".dr-wall");
    /* THE HERO DIMS AS IT LEAVES. It used to shrink and lag as well —
       copied wholesale off a reference where the hero is a photograph.
       On type that read as a zoom rather than as depth, and it made §02
       feel like it arrived too fast, because the hero was running away
       from it. Only the dim survives, which was the honest half: a thing
       moving away from the light gets darker.

       It rides .dr-main because .dr-line and .dr-sub already own transform
       for the entrance, and a second writer on one property is the
       collision this room keeps re-learning. */
    const main = document.querySelector<HTMLElement>(".dr-main");
    const stage = document.querySelector<HTMLElement>(".dr-stage");
    let frame = 0;
    const onScroll = () => {
      if (frame || !wall) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = Math.min(window.scrollY * 0.1, window.innerHeight * 0.42);
        wall.style.transform = `translate3d(0, ${-y}px, 0)`;

        if (main && stage) {
          const h = stage.offsetHeight || window.innerHeight;
          const p = Math.max(0, Math.min(1, window.scrollY / h));
          // clamp the TRAVEL, not the rate: past the hero it holds its
          // final offset instead of drifting on down the page
          main.style.setProperty("--hero-p", String(p));
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      gsap.killTweensOf(atmos);
      gsap.set(atmos, { clearProps: "transform" });
    };
  }, []);

  return (
    <div
      className={`dr-root ${archivo.variable} ${instrument.variable}${
        lit ? " dr-lit" : ""
      }`}
    >
      <div className="dr-atmos" aria-hidden>
        <div className="dr-key" />
      </div>
      {/* massive, half off the left edge, barely there — the room's own wall.
          No contour: the shape is carried entirely by its material. The
          wrapper exists so scroll can move the wall while the wall keeps its
          own drift — both want `transform`, and one would overwrite the other. */}
      <div className="dr-wall" aria-hidden>
        <div className="dr-figure" />
      </div>
      <div className="dr-grain" aria-hidden />
      <div className="dr-vignette" aria-hidden />

      {/* THE NAV LIVES OUTSIDE .dr-stage. It is position:fixed at
          z-index 30, but .dr-stage is position:relative z-index:4 — a
          stacking context — so that 30 was only ever ranked INSIDE the
          stage, never against the stage's siblings. Section 02 is a later
          sibling at the same z-index 4, so it painted over the entire
          stage subtree, nav included: past the hero the header and its CTA
          were invisible AND unclickable (elementFromPoint at the nav's
          centre returned .dr-svc-title). Out here the 30 competes where it
          was always meant to. */}
      <header className="dr-nav wrap">
        <div className="dr-rail dr-edge" data-stuck={stuck ? "true" : undefined}>
          <nav className="dr-links" aria-label="Main">
            <Link href="/work" aria-label="Work">
              <Roll label="Work" />
            </Link>
            <Link href="/services/websites" aria-label="Services">
              <Roll label="Services" />
            </Link>
            <Link href="/pricing" aria-label="Pricing">
              <Roll label="Pricing" />
            </Link>
          </nav>

          <div className="dr-rail-in">
            <Link className="dr-lockup" href="/">
              <span className="dr-mono" aria-hidden />
              <b>Executive AI Solutions</b>
            </Link>


              {/* collapsed at the top of the page, so it must not be
                  reachable by keyboard or read out until it is really there */}
              <Link
                href="/contact"
                className="dr-navcta dr-edge t-cta"
                tabIndex={stuck ? undefined : -1}
                aria-hidden={!stuck}
              >
                Book the call
              </Link>
          </div>
        </div>
      </header>

      <div className="dr-stage">
        {/* the rail watches this, not a scroll number */}
        <div className="dr-top" ref={topRef} aria-hidden />

        <main className="dr-main wrap">
          <div className="dr-hero">
            <div className="dr-left">
              <h1 className="t-hero">
                <span className="dr-line">
                  <span className="sweep">A website that books</span>
                </span>
                <span className="dr-line">
                  <span className="sweep">while you&rsquo;re on the job.</span>
                </span>
              </h1>

              <p className="t-body dr-sub">
                We build your site and wire up the system behind it, so every
                call, form and text gets answered in seconds instead of days.
              </p>

            </div>

            <WorksList />

          </div>
        </main>
      </div>

      <ServicesSection />
      <ProofSection />
      <RunsSection />
    </div>
  );
}
