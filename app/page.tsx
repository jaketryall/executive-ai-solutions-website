"use client";

import { useEffect } from "react";
import Link from "next/link";
import ServicesSection, { OfferHead } from "@/components/dark/services-section";
import ProofSection from "@/components/dark/proof-section";
import VoicesSection from "@/components/dark/voices-section";
import RunsSection from "@/components/dark/runs-section";
import ObjectionsSection from "@/components/dark/objections-section";
import { CustomEase } from "gsap/CustomEase";
import { gsap, reducedMotion } from "@/components/anim/ease";
import { GOOGLE_REVIEWS, CLIENT_MARKS, TICKER } from "@/lib/proof";

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

  /* THE REEL'S REST TRANSFORM — measured, not guessed. The slot in the
     line and the reel in the dock are both laid out by the browser; this
     reads where each one IS and writes the three numbers that put the
     reel onto the slot: the scale that makes it the slot's height, and
     the x/y from its own centre to the slot's. The CSS does the rest
     (see THE GROW in room.css). Re-read on resize and whenever the slot
     changes size, which is whenever the headline reflows or its font
     arrives. The reel's box is read through offsetLeft/Top — its rect
     would include the very transform being computed. */
  useEffect(() => {
    const slot = document.querySelector<HTMLElement>(".dr-slot");
    const reel = document.querySelector<HTMLElement>(".dr-hero-reel");
    if (!slot || !reel) return;
    const measure = () => {
      if (!window.matchMedia("(min-width: 901px)").matches) {
        reel.removeAttribute("data-ready");
        reel.closest(".dr-hero-wrap")?.removeAttribute("data-ready");
        return;
      }
      /* ⚠ BOTH boxes through the offset chain, never getBoundingClientRect:
         the reel's rect includes the transform being computed, and the
         slot's includes the line's ENTRANCE transform — measured at mount
         the line is still 103% below its place, and the reel landed 93px
         under the slot for exactly that reason. Offsets ignore transforms. */
      const box = (el: HTMLElement) => {
        let x = 0, y = 0;
        for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) {
          x += e.offsetLeft; y += e.offsetTop;
        }
        return { x, y, w: el.offsetWidth, h: el.offsetHeight };
      };
      const s = box(slot), r = box(reel);
      if (!s.h || !r.h) return;
      /* the headline's white copy is clipped to the film's box */
      const h1 = document.querySelector<HTMLElement>(".dr-h1");
      if (h1) {
        const hb = box(h1);
        h1.style.setProperty("--cross-top", `${Math.max(0, s.y - hb.y)}px`);
        h1.style.setProperty("--cross-left", `${Math.max(0, s.x - hb.x)}px`);
        h1.style.setProperty("--cross-right", `${Math.max(0, hb.x + hb.w - (s.x + s.w))}px`);
      }
      /* on the DOCK, so the reel and its shade both inherit the same numbers.
         Three frames (see THE GROW in room.css): the slot at p 0 — the reel
         and the slot are the same column box now, so this is a translate
         — the viewport at p 1, which is 0.9vh of scroll down, and home. */
      const dock = reel.closest<HTMLElement>(".dr-dock") ?? reel;
      const vw = document.documentElement.clientWidth;
      dock.style.setProperty("--dx0", `${s.x + s.w / 2 - (r.x + r.w / 2)}px`);
      /* THE BOX IS WRITTEN IN THE VIEWPORT'S FRAME (room.css, .dr-dock):
         the slot's top and the letterbox's height give the two edges'
         laws, the reel's flow centre is what the translate is measured
         from, --sx1 is the mask's full width, --hr the letterbox over
         the 16:9 picture so the picture's scale can be derived */
      dock.style.setProperty("--t0", `${s.y}px`);
      dock.style.setProperty("--h", `${r.h}px`);
      dock.style.setProperty("--c0", `${r.y + r.h / 2}px`);
      dock.style.setProperty("--sx1", String(vw / r.w));
      dock.style.setProperty("--hr", String(r.h / (r.w * 9 / 16)));
      /* the shade sits on the reel's box; `top` cannot read the padding's
         width-based percentage, so it is handed the measured offset */
      dock.style.setProperty("--reel-y", `${reel.offsetTop}px`);
      reel.setAttribute("data-ready", "");
      reel.closest(".dr-hero-wrap")?.setAttribute("data-ready", "");
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(slot);
    ro.observe(reel);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
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

      {/* §01 · THE LINE. Jake, 2026-09-13, with a HeartBloom landing
          (dribbble 27394246): "can we try this but instead of that image
          in the card its my showreel and we have the itsjay effect for
          the video grow. i want a 5 star review thing somewhere too and
          we would be the white background version of course."

          Then a day of it — the chip in the title, the big card, the
          drop cap — and, with the Hyperactive pizza shot (dribbble
          25319896: a headline across the top of a big picture, words
          ON it): "im thinking the video could be dimmed so you get the
          text on top of it and when you scroll it grows and undims."
          And, on the first cut of that (the film washed light, the
          room's wide face): "it doesnt really look like the reference."
          It did not: theirs is a dark picture with LIGHT writing on it,
          a huge condensed one-line headline, and the picture's top edge
          cutting through the letters. So: one condensed uppercase line
          the width of the measure; the film DIMMED DARK with light copy
(the sprayed tags were tried and cut — Jake:
          "i dont like the tags"); the headline
          white where it crosses the film (a clipped second copy of the
          line, never a blend). On scroll the reel grows
          out of the card into the dock and the scrim lifts with it. On scroll, itsjay's grow (decodes/itsjay.md
          §5.3, measured): the reel's real home is a full-width block in
          the section right after the hero; at rest it is transformed UP
          into the chip in the line (scale ~0.13, translated to its
          centre),
          and across the first 0.9 viewports of scroll it scales and
          travels LINEARLY back to where it lives — so it grows out of
          the hero, takes the screen, and docks. No
          pin: the words leave at scroll's own rate and fade as the reel
          takes over.

          Retires the stage (d5daaf3), the lift (9cd34bc), the shutter
          (da61f3c) and the screening (b7637cd) — all of today. Kept: the
          film is there from the first frame, the minimal caption, the
          rail's wordmark as the name.

          --hero-p is measured on the WRAPPER's top edge: 0 at rest, 1
          at 0.9vh of scroll, itsjay's domain exactly. The wrapper holds
          the stage AND the dock so the reel inherits it in both. */}
      <div
        className="dr-hero-wrap"
        data-sp
        data-sp-edge="top"
        data-sp-from="0"
        data-sp-to="-0.9"
        data-sp-var="--hero-p"
      >
        {/* the rail (components/room/nav) watches this by selector: the
            pill and the action are what the first scroll earns */}
        <div className="dr-top" aria-hidden />

        <div className="dr-stage">
          <main className="dr-main wrap">
            <div className="dr-hero">
              {/* ONE LINE, condensed, uppercase, the width of the measure —
                  the Hyperactive shot's DISCOVER THE TASTE. The second
                  half of the statement moves onto the card as its
                  heading (their PIZZA WITH URBAN FLAIR). ⚠ THE
                  POSITIONING LINE still holds: design first, systems
                  second, ads not in the statement. It crosses the film's
                  top edge, and is white where it does — see the second
                  copy below. */}
              <h1 className="t-hero dr-h1">
                <span className="dr-line">
                  <span className="sweep">Design that sells</span>
                </span>
                {/* THE SAME LINE, WHITE, CLIPPED TO THE FILM. Where the
                    headline crosses the film's box this copy shows and
                    the ink one is under it; everywhere else it is
                    clipped away. The clip is three measured numbers
                    (page.tsx measure(): the film box against the
                    headline box), static at rest, so nothing re-rasters.
                    Not a blend mode: `difference` inverts on a bright
                    frame of film, and the reference never inverts —
                    the words are white on the picture, full stop. */}
                <span className="dr-line dr-line--film" aria-hidden>
                  <span>Design that sells</span>
                </span>
              </h1>

              {/* THE STRIP — thin, white, between the title and the film,
                  for the small things (Jake, 2026-09-13: "a thin strip
                  as white where some small things are there, like
                  reviews with the little half circle things on far left,
                  just stuff that doesn't take up much vertical space" …
                  "the little avatar icons on left that rotate, that are
                  images of real people, and to the right of that an
                  infinite logo marquee"). Left: the faces, rotating, and
                  the rating. Middle: the clients' marquee. Right: the one
                  door. The panel that held the description is at def30b4
                  if wanted back. ⚠ The faces are initials until Jake
                  clears real photographs; the marquee is wordmarks until
                  the logo files exist. */}
              <div className="dr-strip">
                {GOOGLE_REVIEWS.count > 0 && (
                  <a
                    className="dr-strip-rating"
                    href={GOOGLE_REVIEWS.url || undefined}
                    target={GOOGLE_REVIEWS.url ? "_blank" : undefined}
                    rel={GOOGLE_REVIEWS.url ? "noopener noreferrer" : undefined}
                    aria-label={`Rated ${GOOGLE_REVIEWS.rating.toFixed(1)} on Google from ${GOOGLE_REVIEWS.count} reviews`}
                  >
                    {/* the businesses the rating comes from, rotating: a
                        mark where the file exists, initials until then */}
                    <span className="dr-faces" aria-hidden>
                      {CLIENT_MARKS.map((c) => (
                        <span className="dr-face" key={c.initials} title={c.name}>
                          {c.src ? <img src={c.src} alt="" /> : c.initials}
                        </span>
                      ))}
                    </span>
                    <span className="dr-strip-l">
                      <b>{GOOGLE_REVIEWS.rating.toFixed(1)} on Google</b>
                      <span>{GOOGLE_REVIEWS.count} client reviews</span>
                    </span>
                  </a>
                )}

                {/* THE TICKER, to the right of the marks (Jake: "instead
                    of companies … the services in infinite marquee"):
                    what is sold and the real things inside it, running.
                    Two sets, the track travels one; the second is
                    decoration. */}
                <div className="dr-logos" aria-label="What we build">
                  <div className="dr-logos-track">
                    {[0, 1].map((i) => (
                      <div className="dr-logos-set" key={i} aria-hidden={i === 1}>
                        {TICKER.map((c) => (
                          <span key={c}>{c}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>


                {/* THE DOOR, inside the strip at its right end (Jake: "put
                    cta inside that bar somehow") */}
                <Link href="/contact" className="dr-herocta dr-edge t-cta">
                  Book the call
                </Link>
              </div>

              {/* THE CARD — the reel's rest position: full width, its top
                  in the first screen and its bottom past the fold, the way
                  Cosmos's video sits low. Undimmed from the first frame;
                  nothing on it. The reel lives in the dock and is measured
                  onto this box. */}
              <div className="dr-slot" aria-hidden />
            </div>
          </main>
        </div>

        {/* THE DOCK — where the reel actually lives: a full-width block
            right after the hero, 16:9 at the room's gutter, radius
            --radius-panel. At rest it is transformed up into the slot;
            by 0.9vh of scroll it is here, and the page carries on. */}
        {/* GROW, THEN LEAVE (Jake, 2026-09-15, with Snows' plain hero
            video: "do you think the video effect is too much" → A). The
            hold and the shrink-in-place are gone — they were a pin in
            everything but name, 0.45vh of film choreography between the
            scroll and the first sentence. Now the reel is the whole screen
            at 0.9vh and simply scrolls off, full width; the offer's head
            follows it directly (see --dock-pad in room.css). No window on
            the dock any more: --p is the only number. */}
        <section className="dr-dock" aria-label="Showreel">
          {/* THE SHADE: the reel's shadow, on a sibling. The reel's own
              radius is recomputed every frame (divided by the scale), and
              a shadow on a changing radius re-rasters the whole layer per
              frame; this box and its 24px radius are constant, so it
              paints once and only transforms — the same numbers, under
              the reel. */}
          <div className="dr-hero-shade" aria-hidden />
          <div className="dr-hero-reel">
            {/* ⚠ 1920, not 1280: docked, the well is 1394 wide and a
                1280 source is soft in it. Six seconds (t=4.3-10.4, the
                dark half of the source), 30fps, crf 23, 885KB. Jake is
                having a longer reel cut ON BLACK to
                design-dna/reel-spec.md; it drops in here with its
                poster and nothing else changes. Until it lands, the v1
                cut's own baked-in type is in the frame. */}
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
        </section>
      </div>

      {/* No numbers band. It was tried (acquisition.com's stats row, done
          as receipts with a window and a source each — 2026-09-13/14) and
          cut: our honest figures need their captions to mean anything,
          and a number that needs a caption is a report, not proof (Jake:
          "people are way too lazy to read these days … if you need them
          to grasp something big you almost have to show them with
          visuals"). The receipts live on in lib/proof.ts for the pages
          where they are context, not a headline. */}

      {/* §02 · THE OFFER — the statement and the three services under it
          (Jake, 2026-09-14, with danielsnows.framer.website: "a centered
          approach thing like this and then just having services
          underneath" → "go"). The statement is the positioning sentence
          Cosmos and itsjay both put after their hero (measured: "WE ARE —
          UI/UX design agency that keeps your product growing"; Cosmos's
          actual About Us is section five) — what, for whom, how — and it
          is what stands between the reel and the work cards so they do
          not read as a repeat. Ours names the three columns under it.

          The head sits OUTSIDE the card's wrapper: --climb is measured on
          the wrapper's top, which has to be the card's own top. */}
      <OfferHead />

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
