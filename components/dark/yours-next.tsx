import type { CSSProperties } from "react";

/* ══ YOURS COULD BE NEXT — OFF+BRAND'S ORB, DECODED (trial `?v=yours`,
   2026-09-23 — Jake: "i really need yo to look at theirs" → "one thing
   too is maybe it can feel like its not stuck").

   THEIRS, measured on itsoffbrand.com (1440×900, dark scheme; frames and
   numbers in design-dna/frames/offbrand-x/, scroll-probe.json):
   · the orb is FIXED (`.orb-w`, position: fixed, the whole viewport) —
     it never scrolls, and nothing around it is pinned: the page flows
     past a light that stays on screen. That is why it does not feel
     stuck.
   · its path, by scroll: centred at 720px (0.8 of the screen's height);
     y 200 → scale 1.34, x +247; y 400 → 1.60, +430; y 600 → 1.78, +558;
     y 1000 → 1.96, +690; y 1400 → 2.0, +720 — half off the right edge,
     a big soft light behind the next sections (the logo grid, the work);
     then it swings back left and shrinks to nothing by ~y 3600.
   · two thin outline rings turn around it with the scroll.
   · the words ("A different / Creative / approach") are in NORMAL FLOW,
     set around the orb — high left, right, low left — each letter in its
     own mask: it rises from +1.01em (their 103.888px at a 102.857px
     font) to arrive, and on the way out the letters drop back into
     their masks in a RANDOM order as you scroll.

   OURS: the same object and the same path on our room's own engine —
   the section's --yin (its top from the fold to −0.8 of the screen)
   brings the orb up from a small body to its size while the letters
   rise, then grows it to 2× and carries it right as the words leave;
   --yout (a marker after the services) swings it back and shrinks it
   out, so it lights the services and is gone before the voices. The
   orb is our gradient (the accent's cyan into violet and pink), CSS
   radial layers under a soft mask — no WebGL. Nothing here is sticky. */

const WORDS: { w: string; k: number }[] = [
  { w: "Yours", k: 0 },
  { w: "could be", k: 1 },
  { w: "next.", k: 2 },
];

/* deterministic per-letter "random" — the same order every visit */
const rnd = (i: number) => {
  const v = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
  return v - Math.floor(v);
};

/* `shape` (2026-09-23 — Jake: "i want the shape to not be a circle im
   worried about the logo though"): theirs is THEIR mark (the + of
   OFF+BRAND), so ours is not our mark either — three shapes of our own on
   the same fixed path and gradient: a living blob, a four-point spark,
   a pill (the site's own recurring object). The circle stays the default. */
export function YoursOrb({ shape }: { shape?: "blob" | "spark" | "pill" | "x" | "logo" }) {
  return (
    <div className={`dr-yorb${shape ? ` dr-yorb--${shape}` : ""}`} aria-hidden>
      <span className="dr-yorb-ring dr-yorb-ring--1" />
      <span className="dr-yorb-ring dr-yorb-ring--2" />
      <span className="dr-yorb-body" />
    </div>
  );
}

export default function YoursNext() {
  let n = 0;
  return (
    <section
      className="dr-yours"
      aria-label="Yours could be next"
      data-sp
      data-sp-edge="top"
      data-sp-from="1"
      data-sp-to="-0.8"
      data-sp-var="--yin"
      data-sp-target=".dr-root"
      data-sp-lerp="0.1"
    >
      <h2 className="dr-yours-h">
        <span className="sr-only">Yours could be next.</span>
        {WORDS.map(({ w, k }) => (
          <span className={`dr-yours-w dr-yours-w--${k}`} key={w} aria-hidden>
            {w.split("").map((ch, c) => (
              <span className="dr-yours-m" key={c}>
                <span className="dr-yours-c" style={{ "--rnd": rnd(n++).toFixed(3) } as CSSProperties}>
                  {ch === " " ? " " : ch}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h2>
      <a className="dr-yours-go" href="#services">
        See the services <i aria-hidden>↓</i>
      </a>
    </section>
  );
}

/* the exit marker, placed after the services */
export function YoursOut() {
  return (
    <div
      className="dr-yours-out"
      aria-hidden
      data-sp
      data-sp-edge="top"
      /* gone BEFORE the voices arrive: the swing-out starts with the
         marker 0.35 of a screen below the fold and ends as it reaches
         .55 — at 1 → .2 the orb still sat half-lit behind the voices'
         claim (first cut, measured) */
      data-sp-from="1.35"
      data-sp-to="0.55"
      data-sp-var="--yout"
      data-sp-target=".dr-root"
      data-sp-lerp="0.1"
    />
  );
}
