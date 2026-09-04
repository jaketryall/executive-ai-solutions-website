"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import WorksList from "@/components/dark/works-list";
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
    return () => {
      window.removeEventListener("pointermove", onMove);
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
      {/* massive, half off the left edge, barely there — the room's own wall */}
      <div className="dr-figure" aria-hidden>
        <span />
      </div>
      <div className="dr-grain" aria-hidden />
      <div className="dr-vignette" aria-hidden />

      <div className="dr-stage">
        {/* the rail watches this, not a scroll number */}
        <div className="dr-top" ref={topRef} aria-hidden />
        <header className="dr-nav wrap">
          <div className="dr-rail dr-edge" data-stuck={stuck ? "true" : undefined}>
            <div className="dr-rail-in">
              <Link className="dr-lockup" href="/">
                <span className="dr-mono" aria-hidden />
                <b>Executive AI Solutions</b>
              </Link>

              <div className="dr-rail-tail">
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
          </div>
        </header>

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
    </div>
  );
}
