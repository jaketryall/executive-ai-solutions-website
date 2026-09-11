import React from "react";

/* §01b · THE REEL — the beat the room never had, sitting between the
   hero and the services.

   IT TAKES §02's OLD SLOT, which preserves the seam rather than adding a
   sixth device: `.dr-stage` is position:sticky and whatever sits as the
   SECOND CHILD of `.dr-hero-wrap` with z-index 10 is what climbs over
   it. The hero now climbs into the reel; §02 keeps its own
   grow-into-the-room as its entrance and simply arrives after this.
   (decisions.md law 1 — five seams, five distinct devices — is intact:
   the climb still happens exactly once.)

   THE WELL IS STILL. No parallax, no scrub, no clip-open. On record from
   §02: "the animation on the images drags my eyes to it." A playing reel
   is already the most moving thing on the page; giving its container a
   second motion would put two animations in one object. The climb is the
   arrival, the footage is the content, and nothing else moves. */

export default function ReelSection() {
  return (
    <section className="dr-reel" aria-label="Recent work">
      <div className="wrap">
        <div className="dr-reel-well">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/dark/reel-poster.jpg"
            preload="metadata"
            aria-label="Recent Executive AI Solutions client sites, shown on a laptop and a phone"
          >
            <source src="/dark/reel.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
