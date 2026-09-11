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

     `?film` is the Apple-style film hero (reel first, words second), an
     experiment the homepage reads. Both read in an effect rather than at
     render so the server and the first client pass agree. */
  const [light, setLight] = useState(false);
  const [film, setFilm] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setLight(!q.has("dark"));
    setFilm(q.has("film"));
  }, []);

  return (
    <div
      className={`dr-root ${archivo.variable} ${instrument.variable}${
        lit ? " dr-lit" : ""
      }${light ? " dr-light" : ""}${film ? " dr-film" : ""}`}
    >
      <RoomNav />
      {children}
      <CloseSection />
    </div>
  );
}
