"use client";

import { useEffect } from "react";
import Link from "next/link";
import ServicesSection from "@/components/dark/services-section";
import AboutSection from "@/components/dark/about-section";
import ProofSection from "@/components/dark/proof-section";
import VoicesSection from "@/components/dark/voices-section";
import RunsSection from "@/components/dark/runs-section";
import ObjectionsSection from "@/components/dark/objections-section";
import { CustomEase } from "gsap/CustomEase";
import { gsap, reducedMotion } from "@/components/anim/ease";

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

export default function DarkRoom() {
  /* The frame — tokens, ground, nav, ending, the scroll engine, the
     entrance arm and the ?dark switch — is the layout's
     RoomShell now. This page is the room's own atmosphere and sections. */
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

       That progress now comes from the engine — .dr-stage declares the
       window and --hero-p inherits down to everything in the hero. The
       WALL stays hand-rolled here, and deliberately: it is a FIXED layer,
       so its rect never moves and there is no element progress to measure.
       Its input is absolute scroll, which is a genuinely different thing
       from "how far through its own box has this element travelled". */
    let frame = 0;
    const onScroll = () => {
      if (frame || !wall) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = Math.min(window.scrollY * 0.1, window.innerHeight * 0.42);
        wall.style.transform = `translate3d(0, ${-y}px, 0)`;
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
    <>
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

      {/* §01 · THE STAGE. Jake, 2026-09-13, with a portfolio hero
          (codebyhicham.com): "what if we do something like this with
          the video in the middle, infinite marquee at the bottom, video
          grows on scroll … and when you scroll the texts should have a
          scroll driven exit." So: the reel is the OBJECT in the middle
          of the first screen, the statement flanks it — one line at the
          left with the one door under it, one line at the right — and
          a giant marquee runs along the fold, cropped by it, so the
          bottom of the screen is type in motion and nothing is empty.
          On scroll the stage pins, the reel grows about its own centre
          until it is the screen, and the two lines exit OUTWARD at
          scroll's rate — the film takes the room they leave. Hold a
          beat, release, scroll away.

          It retires the lift (9cd34bc) and the shutter (da61f3c) of the
          same morning. Kept: the film there from the first frame, the
          minimal caption, the rail's wordmark as the name.

          --hero-p is measured on the WRAPPER's top edge, not the
          stage's: a pinned element's rect does not move. */}
      <div
        className="dr-hero-wrap"
        data-sp
        data-sp-from="0"
        data-sp-to="-0.7"
        data-sp-var="--hero-p"
      >
        {/* the rail (components/room/nav) watches this by selector: the
            pill and the action are what the first scroll earns. It sits
            OUTSIDE the sticky stage — a sentinel that pins with the hero
            never leaves the viewport and the action would never arrive */}
        <div className="dr-top" aria-hidden />

        <div className="dr-stage">
          <main className="dr-main wrap">
            {/* THE FIELD: three columns, the reel in the middle one. The
                h1 is `display: contents` so its two lines can take the
                outer columns while it stays ONE heading for a reader. */}
            <div className="dr-hero">
              <h1 className="t-hero dr-h1">
                {/* ⚠ THE POSITIONING LINE. Jake, 2026-09-10: "im
                    shifting more towards design and crms than ads
                    right now" — the statement names the two things he
                    leads with, in that order; ads are not in it. Read
                    left to right across the reel: the claim, the
                    object, the promise. */}
                <span className="dr-line dr-l1">
                  <span className="sweep">Design that sells,</span>
                </span>
                <span className="dr-line dr-l2">
                  <span className="sweep">systems that follow up.</span>
                </span>
              </h1>

              <Link href="/contact" className="dr-herocta dr-edge t-cta">
                Book the call
              </Link>

              {/* THE REEL, the object in the middle. .dr-screen holds the
                  grid cell; the reel inside it is what scales — a scaled
                  element cannot be its own ruler. */}
              <div className="dr-screen">
                <div className="dr-hero-reel">
                  {/* ⚠ 1920, not 1280: grown, the well is the whole
                      screen and a 1280 source is soft in it. Six seconds
                      (t=4.3-10.4, the dark half of the source), 30fps,
                      crf 23, 885KB. Jake is having a longer reel cut ON
                      BLACK to design-dna/reel-spec.md; it drops in here
                      with its poster and nothing else changes. Until it
                      lands, the v1 cut's own baked-in type is in the
                      frame. */}
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/dark/reel-film-poster.jpg"
                    preload="metadata"
                    aria-label="Recent Executive AI Solutions client work"
                  >
                    <source src="/dark/reel-film.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </main>

          {/* THE MARQUEE, along the fold and cropped by it. The meta line
              — the three things sold — promoted from a 12px caption to
              the biggest type on the page, in motion. Two identical
              sets; the track travels exactly one set and starts over,
              so the loop has no seam. The second set is decoration and
              is hidden from readers. */}
          <div className="dr-marquee" aria-label="Websites, automation, Google Ads">
            <div className="dr-marquee-track">
              {[0, 1].map((i) => (
                <div className="dr-marquee-set" key={i} aria-hidden={i === 1}>
                  <span>Websites</span>
                  <span>Automation</span>
                  <span>Google Ads</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* About is a plain sibling (Jake: "i dont want that rise thing for
          the about section"). Nothing climbs over the hero: the pin
          releases with the reel open, it scrolls away, and About simply
          arrives after it. */}
      <AboutSection />

      {/* §02 comes out of the wrapper and brings its own ruler. Inside it,
          it read --hero-p — the hero's progress — and its
          grow-into-the-room was tied to the hero's geometry by accident
          of nesting rather than on purpose. Measured on ITSELF the number
          finally means what §02's own comment always claimed: 0 with the
          card's top at the fold, 1 with it at the top of the viewport.
          Renamed --climb, because a variable that means two different
          things in two subtrees is a trap waiting for whoever reads it
          next. */}
      <div data-sp data-sp-from="1" data-sp-to="0" data-sp-var="--climb">
        <ServicesSection />
      </div>

      <ProofSection />
      <VoicesSection />

      {/* ══ THE FLIP ══════════════════════════════════════════════════
          The room turns inside out between the testimonials and the
          process (Jake, 2026-09-07: "i want the whole background to go
          from black to white and the white aspects to go to black like
          completely flip").

          ⚠ SUPERSEDES the standing "never a light room mid-page" call
          (decisions.md, 2026-09-06) — that one was made against a light
          §04 revealed by a curtain lift, and it was the whole treatment
          he rejected on sight. This is the opposite instruction, given
          knowingly, so it wins; the old entry stays on the record.

          ONE ELEMENT OWNS THE GROUND. Every bg track writes its target
          every frame, clamped — so a track resting at progress 0 paints
          its `from` colour over everything above it, and two of them
          means the lower one wins the whole page. §04 and §05 both gave
          theirs up for this.

          The same track writes --flip, and the token block below re-mixes
          EVERY colour in the room against it — ink, surfaces, edges — so
          the inversion is one number and nothing can flip out of step
          with anything else. Its subtree is the back half, which is why
          the wrapper starts here and not at the top of the page. */}
      {/* ⚠ THE FLIP IS PARKED (Jake, 2026-09-08: "can we kill the
          background transition for now"). Nothing about it has been
          deleted — the wrapper, the token block on .dr-root, the crossed
          surfaces in the back half and the atmos/vignette factors are all
          still here and all still correct. What is gone is the TRACK: with
          no data-sp on this div the engine never writes --flip, every
          token falls through to its `var(--flip, 0)` default, and the room
          simply stays dark, which is exactly the page as it read before
          the flip was built.

          TO BRING IT BACK, put these eight attributes back on this div and
          change nothing else:

            data-sp data-sp-from="0.86" data-sp-to="0.3"
            data-sp-var="--flip" data-sp-target=".dr-root"
            data-sp-lerp="0.1" data-sp-step="0.03125"
            data-bg-from="void" data-bg-to="#f2f2f4"

          data-sp-target puts the value on the ROOT so the fixed light rig
          ABOVE this wrapper can read it — a var only inherits downward.
          data-sp-step is a measured perf requirement, not a preference:
          twelve color-mix tokens resolving a new colour every frame
          re-rasterise every glyph and surface on screen (2026-09-08 —
          mean 13.6ms a frame and 14 dropped, against 8.6 with --flip
          held still). Publishing at 1/32 costs nothing visible and buys
          all of it back. The GROUND deliberately does not step.

          ONE ELEMENT OWNS THE GROUND still holds, and matters more now
          than it did: §04 and §05 both gave up their own bg tracks so
          this one could have the page, so with this track gone the back
          half has NO ground ramp at all and sits on the void end to end.
          If the ending needs its lifted ground back before the flip is
          re-sited, that is §05's track to re-declare — not a second one
          here. */}
      <div className="dr-flip">
        <RunsSection />
        <ObjectionsSection />
      </div>
    </>
  );
}
