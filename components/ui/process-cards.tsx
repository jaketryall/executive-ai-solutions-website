/* The Lesse-grammar process row: tall soft panel cards, step name up top, the
   site's outline numeral as the card's quiet middle anchor, description pinned
   to the bottom. A TRUE sequence, so the numerals earn their place. Parent
   components animate the cards via the data-anim hook they pass in. */
export function ProcessCards({
  steps,
  anim,
}: {
  steps: { name: string; body: string; demo?: React.ReactNode }[];
  anim: string;
}) {
  const cols =
    steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4";
  return (
    <ol className={`grid list-none gap-fib-2 md:gap-fib-3 ${cols}`}>
      {steps.map((s, i) => (
        <li key={s.name} data-anim={anim} className="proc-card">
          {/* chip-led variant (home steps): the icon chip anchors the
              card, the step number becomes a quiet meta line, and the
              big ghost numeral stands down — two decorative anchors on
              one card read as clutter (Jake, 2026-07-17) */}
          {s.demo ? (
            <>
              <div className="proc-demo">{s.demo}</div>
              <div>
                <p className="t-meta uppercase text-ink/45">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="t-title mt-fib-1 font-display">{s.name}</h3>
              </div>
              <p className="text-ink/70">{s.body}</p>
            </>
          ) : (
            <>
              <h3 className="t-title font-display">{s.name}</h3>
              <span className="t-numeral-step proc-num" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-ink/70">{s.body}</p>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}
