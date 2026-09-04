"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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


const ICON = { fill: "none", stroke: "currentColor", strokeWidth: 1.6 } as const;

/* Real handles have never existed in this repo. Rather than ship three dead
   links, an entry with no href renders as a mark and lights up the moment a
   URL is dropped in. */
const SOCIALS: { name: string; href: string; icon: React.ReactNode }[] = [
  {
    name: "LinkedIn",
    href: "",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <rect x="3" y="3" width="18" height="18" rx="4" {...ICON} />
        <path d="M7.6 10.6V17" {...ICON} strokeLinecap="round" />
        <circle cx="7.6" cy="7.5" r="1" fill="currentColor" stroke="none" />
        <path d="M11.2 17v-3.5a2.3 2.3 0 0 1 4.6 0V17" {...ICON} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <rect x="3" y="3" width="18" height="18" rx="5" {...ICON} />
        <circle cx="12" cy="12" r="4" {...ICON} />
        <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <rect x="3" y="3" width="18" height="18" rx="4" {...ICON} />
        <path d="M14.6 8.2h-1.4a1.7 1.7 0 0 0-1.7 1.7V17M9.9 12.5h4.2" {...ICON} strokeLinecap="round" />
      </svg>
    ),
  },
];

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

  /* Theming is NOT done here any more. Adding the class in an effect meant
     the browser painted the root layout's light sheet first and the reload
     flashed white. The room's ground and its fonts now ride on the
     server-rendered wrapper below, so the first frame is already black.
     This effect only arms the entrance. */
  useEffect(() => {
    const id = requestAnimationFrame(() => setLit(true));
    return () => cancelAnimationFrame(id);
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
      const cleanups: (() => void)[] = [];
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

        /* PARALLAX — the LIGHT only. The mark holds still: it is the object in
         the room, and an object that slides with your cursor stops reading as
         one. Pointer only; on touch there is nothing to answer and the
         ambient drift already carries it. */
      const atmos = document.querySelector(".dr-atmos");
      if (
        atmos && !reducedMotion() &&
        window.matchMedia("(hover: hover)").matches
      ) {
        const ax = gsap.quickTo(atmos, "x", { duration: 1.2, ease: U });
        const ay = gsap.quickTo(atmos, "y", { duration: 1.2, ease: U });
        const onMove = (e: PointerEvent) => {
          ax((e.clientX / window.innerWidth - 0.5) * 78);
          ay((e.clientY / window.innerHeight - 0.5) * 46);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        cleanups.push(() => window.removeEventListener("pointermove", onMove));
      }

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
      Promise.resolve(fonts ? fonts.ready : undefined).then(() => {
        raf = requestAnimationFrame(() => {
          raf = requestAnimationFrame(play);
        });
      });
      return () => {
        cancelAnimationFrame(raf);
        cleanups.forEach((fn) => fn());
      };
    }, railRef);

    return () => ctx.revert();
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
          <div className="dr-hero">
            {/* THE MARK, CENTRE STAGE — lit from the upper left and falling
                to black, so it reads as an object in the room rather than a
                logo pasted on it. */}
            <div className="dr-figure" aria-hidden>
              <span />
            </div>

            <div className="dr-left">
              <p className="t-label dr-eyebrow">
                Mesa, Arizona · Web design + the system behind it
              </p>

              <h1 className="t-hero">
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
                We build your site and wire up the system behind it, so every
                call, form and text gets answered in seconds instead of days.
              </p>
            </div>

            <WorksList />

            {/* where the reference parks its SCROLL DOWN cue */}
            <div className="dr-foot">
              <Link href="/contact" className="dr-pill t-cta">
                Book the call
              </Link>
              <ul className="dr-social">
                  {SOCIALS.map((s) => (
                    <li key={s.name}>
                      {s.href ? (
                        <a href={s.href} aria-label={s.name} target="_blank" rel="noreferrer">
                          {s.icon}
                        </a>
                      ) : (
                        /* no dead links: until a real handle exists this is a
                           mark, not a promise that it goes somewhere */
                        <span title={s.name} aria-hidden>
                          {s.icon}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
