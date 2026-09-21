import { QUOTES } from "@/lib/quotes";
import { CLIENT_MARKS } from "@/lib/proof";

/* §02c · THE VOICES AS TILES (2026-09-20 — where Huge has its 4×2 logo
   grid between the paragraph and the dark "Our work.", decodes/hugeinc
   §15; Jake: "having the logos underneath i think making a cool little
   testimonial thing might be cool"). We have three clients, not eight
   logos, so: three tiles in a row, each a client's mark, one sentence
   in their words, and who said it. Sits on the light page, right before
   the flip to dark. The words are lib/quotes.ts's PLACEHOLDERS — de-named
   by Jake's own rule — until his real names and quotes arrive; the marks
   pair with them by index (lib/proof.ts CLIENT_MARKS), so the day the
   real ones land nothing here changes but the data. The room's one
   triggered gesture (data-wipe) brings the sentences in, staggered. */
export default function VoicesTiles() {
  return (
    <section className="wrap dr-tiles" aria-label="What clients say">
      <ul className="dr-tiles-row">
        {QUOTES.map((q, i) => {
          const mark = CLIENT_MARKS[i] ?? CLIENT_MARKS[0];
          return (
            <li className="dr-tile" key={q.name}>
              <span className="dr-tile-mark" aria-label={mark.name}>
                {mark.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mark.src} alt="" width={40} height={40} loading="lazy" />
                ) : (
                  mark.initials
                )}
              </span>
              <blockquote className="dr-tile-q">
                <p data-wipe data-wipe-delay={String(120 + i * 120)}>{q.text}</p>
              </blockquote>
              <span className="dr-tile-who">{q.name}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
