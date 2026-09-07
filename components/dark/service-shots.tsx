import type { ReactNode } from "react";
import Image from "next/image";

/* §02 · THE SHOTS
   A photograph per stage, of the real screen in real hardware. These
   replaced the CSS mocks that stood here before (an .dvc phone wearing
   the shared Google / chat skins from globals.css, which the shipped
   site's own sections still use — those classes stay, this page just
   stopped drawing them).

   HOW THEY WERE MADE, because it is not obvious and it is repeatable:
   the site's own screens were captured at 3x, padded at the top with a
   drawn iOS status bar (scripts/services/statusbar.py), and handed to
   nano_banana_pro at 4k as an image_reference with a prompt that says
   the screen shows exactly that image, unchanged. The model paints the
   photograph around it and every word survives. design-dna/higgsfield/
   has the recipe, the failure modes, and the measurements that caught
   them — including the one frame that quietly spelled it "Fiight".

   The middle stage is the DUO — the desktop build on a laptop with the
   mobile build on a phone in front of it, both screens real, one
   generation. It replaced a third phone of the same client's site
   (2026-09-07): with the duo already showing that page on two screens, a
   phone of it as well was the same evidence twice.

   Still ONE client across all three (Desert Wings), on purpose: their
   search won, their pages, their booking. One customer's story end to
   end is a demonstration; three customers' would be a collage.

   Decorative to a screen reader — the row's own text is the row's name,
   and the well that holds these is already aria-hidden. */

function Shot({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={1400}
      height={1050}
      /* the well is 440px at its widest and the row's whole width on a
         phone; nothing here is ever bigger than that */
      sizes="(max-width: 900px) 92vw, 440px"
      className="dr-svc-shot"
    />
  );
}

/* keyed by lib/services.ts slug; a slug with no entry renders no well */
export const SHOTS: Record<string, ReactNode> = {
  "google-ads": <Shot src="/services/ad.jpg" />,
  websites: <Shot src="/services/websites.jpg" />,
  ai: <Shot src="/services/follow-up.jpg" />,
};
