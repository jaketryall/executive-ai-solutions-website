"use client";

import { useEffect, useState } from "react";
import { Archivo, Instrument_Sans } from "next/font/google";
import { RoomNav } from "@/components/room/nav";
import CloseSection from "@/components/dark/close-section";
import { useScrollEngine } from "@/components/dark/scroll-engine";

/* THE ROOM, as the site.

   .dr-root used to be the homepage's own wrapper: its tokens, its ground,
   its fonts, its nav and its ending all lived on one route while every
   other page ran the launched site's chrome. This puts the wrapper in
   the layout, so the tokens, the ground, the nav and the ending are the
   FRAME every page sits in — and the interior pages get the new frame
   before any of them has been redesigned inside it.

   What stays on the homepage: the atmosphere (the key light, the wall,
   the grain, the vignette) and the sections. Those are the room's own;
   an interior page opens on its content, not on a cold open. */

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

export function RoomShell({ children }: { children: React.ReactNode }) {
  useScrollEngine();

  /* Theming is NOT done here. The room's ground and fonts ride on this
     server-rendered wrapper, so the first frame is already the room.
     This effect only ARMS the entrances. */
  const [lit, setLit] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setLit(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* ── THE ROOM IS LIGHT (Jake, 2026-09-10: "i like this a lot, i think
     the light is a lot better"). Light is the default and `?dark` is what
     you ask for — the comparison stays runnable for one boolean.

     It is still expressed as --flip rather than rewritten into the
     stylesheet, deliberately: --flip is the room's OWN inversion, already
     written and reviewed, and re-authoring 3,200 lines to move a default
     is churn with no pixel behind it. The stylesheet still READS
     dark-first; the block in room.css says so at the top.

     LIGHT IS SERVER-RENDERED. It used to be decided in this effect from a
     default of false, so every load painted the DARK room first — black
     ground, the light rig, the strip floating white on it — for the
     ~100ms before hydration, then flipped (screencast 2026-09-14: 76→158ms
     dark, then a blank light page). The server and the first client pass
     now both say light; only `?dark` turns it off, in the effect, and
     that one flips light→dark because it is the comparison, not the site.
     (`?film` is gone: the film hero is THE hero now.) */
  /* DARK IS THE DEFAULT AGAIN (2026-09-19 — Jake, with x2ycreative.com:
     "i kina want to try dark … make dark the default i just want to try
     it"). The same one boolean, inverted: the server and the first
     client pass both say dark, `?light` turns the light room back on in
     the effect for the comparison. First paint is already black
     (room.css, body:has(.dr-root)), so there is nothing to flash. The
     light era's own rules stand under .dr-light, untouched.

     SUPERSEDED THE SAME DAY (2026-09-19 — THE ROOM: WHITE PAGE, BLACK
     HERO, Jake with hugeinc.com as the model: "yea lets do white page
     with black hero"). That trial was a "want to try," never a
     measurement, and the model settles it: Huge's own seam is a light
     page with a dark hero, which is neither plain room as they stood —
     the light room returns as the default, `?dark` is the comparison
     again, and the hero itself now carries its own dark zone
     (app/page.tsx's `.dr-hero-wrap.dr-zone-dark`, room.css) regardless
     of which room the rest of the page is in. Still one boolean, still
     one flag — the two full rooms (`?dark` vs default) are untouched by
     the zone; only the hero's own ground changed shape. */
  const [light, setLight] = useState(true);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.has("dark")) setLight(false);
  }, []);

  return (
    <div
      className={`dr-root ${archivo.variable} ${instrument.variable}${
        lit ? " dr-lit" : ""
      }${light ? " dr-light" : ""}`}
    >
      <RoomNav />
      {children}
      <CloseSection />
    </div>
  );
}
