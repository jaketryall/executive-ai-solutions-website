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

      {/* §01 · THE LIFT. The film is full screen UNDER the first screen
          from the first frame. Over it, the room's own ground carries the
          big statement and the label row, and its bottom edge sits at
          60% of the viewport — so at rest the film shows in the bottom
          band like a stage under a curtain. Scroll lifts the ground:
          the words ride its edge up and out of the way at scroll's own
          rate, and the film is revealed beneath them edge to edge. It
          holds full screen for a beat, then the pin releases and it
          scrolls away like anything else. Lando's law — reveal the next
          room UNDER the current one — run at the top of the page.

          Jake, 2026-09-13, on the Cosmos shutter this replaces: "i
          really like the big text, and i want to find a different
          mechanism for the video reveal. i want nothing to feel empty."
          So: the statement a size up, the film full bleed rather than a
          card, and every pixel of the first screen is either ground or
          film at every moment of the scroll — nothing opens INTO a
          hole, because there is no hole; the film was always there.

          THE PIN is the wrapper: [sticky stage] held for the lift plus
          a beat (THE HOLD in room.css). --hero-p is measured on the
          WRAPPER's top edge, not the stage's — a pinned element's rect
          does not move, so measured on the stage it would freeze at 0
          the moment the pin engaged. */}
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
          {/* THE FILM, under everything: a full-viewport box anchored to
              the fold. Its HEIGHT is what the lift changes — the box is
              clipped at its top edge — while the footage inside is
              pinned to the same fold at full viewport height, so the
              picture never moves or re-fits. More of it is uncovered;
              none of it is scaled. */}
          <div className="dr-hero-reel">
            {/* ⚠ 1920, not 1280: revealed, the well is the whole screen
                and a 1280 source is soft in it. Six seconds (t=4.3-10.4,
                the dark half of the source), 30fps, crf 23, 885KB. Jake
                is having a longer reel cut ON BLACK to
                design-dna/reel-spec.md; it drops in here with its poster
                and nothing else changes. Until it lands, the v1 cut's
                own baked-in type is in the frame. */}
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

          <main className="dr-main wrap">
            <div className="dr-hero">
              {/* THE STATEMENT, big, in the top of the screen. */}
              <h1 className="t-hero dr-left">
                {/* ⚠ THE POSITIONING LINE. Jake, 2026-09-10: "im
                    shifting more towards design and crms than ads
                    right now" — the statement names the two things he
                    leads with, in that order; ads are not in it.
                    Short over long on purpose: that step is what
                    keeps the block from reading as a slab. */}
                <span className="dr-line">
                  <span className="sweep">Design that sells,</span>
                </span>
                <span className="dr-line">
                  <span className="sweep">systems that follow up.</span>
                </span>
              </h1>

              {/* THE LABEL ROW sits ON the edge — the last thing on the
                  ground before the film — the meta line at the left and
                  the one door at the right, on one baseline. */}
              <div className="dr-labels">
                <p className="dr-cap-meta t-meta">
                  Websites &middot; Automation &middot; Google Ads
                </p>
                <Link href="/contact" className="dr-herocta dr-edge t-cta">
                  Book the call
                </Link>
              </div>
            </div>
          </main>
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
