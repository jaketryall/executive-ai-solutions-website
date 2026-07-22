/* The NAMES marquee (Jake, 2026-07-22, the viral split): the surfaces
   we run, drifting as quiet wordmarks in their own band under the hero
   — the hero's chip row shows the logos, this band names them. Third
   life of the logo-marquee idea, and the frame that will hold CLIENT
   logos once 5-6 real marks exist (his stated endgame). Pure CSS
   animation; reduced motion rests it as a static row.

   Seamless-loop law (learned the hard way, 2026-07-17): the track
   animates -50%, so each HALF must outspan the widest window — 6 sets
   ≈ 3× ~1150px per half, clear of 2560 ultrawide. */

const NAMES = [
  "Google Ads",
  "Google Maps",
  "Google Guaranteed",
  "ChatGPT",
  "AI Overviews",
];

export function SurfaceMarquee() {
  return (
    <section aria-label="Platforms we run" className="bg-white py-fib-4">
      <div className="smq" aria-hidden>
        <div className="smq-track">
          {[0, 1, 2, 3, 4, 5].map((set) => (
            <span key={set} className="smq-set">
              {NAMES.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">
        We run Google Ads, Google Maps, Google Guaranteed, ChatGPT, and AI
        Overviews.
      </p>
    </section>
  );
}
