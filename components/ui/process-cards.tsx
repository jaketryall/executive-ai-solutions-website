/* The Lesse-grammar process row: tall soft panel cards, step name up top, the
   site's outline numeral as the card's quiet middle anchor, description pinned
   to the bottom. A TRUE sequence, so the numerals earn their place. Parent
   components animate the cards via the data-anim hook they pass in. */
export function ProcessCards({
  steps,
  anim,
  numeralLead,
}: {
  steps: { name: string; body: string }[];
  anim: string;
  /* the Apple pure-type variant (home steps, 2026-07-17): the numeral
     LEADS the card — quiet solid stat-tier digits up top, then title,
     then the sentence. No icons, no imagery; restraint is the design. */
  numeralLead?: boolean;
}) {
  const cols =
    steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4";
  return (
    <ol className={`grid list-none gap-fib-2 md:gap-fib-3 ${cols}`}>
      {steps.map((s, i) => (
        <li key={s.name} data-anim={anim} className="proc-card">
          {numeralLead ? (
            <>
              <span className="t-numeral-step text-ink/20" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* mt-auto pins the text to the card's floor — numeral
                  anchors the ceiling, the card's height does the talking
                  (all-top clustering read as smushed) */}
              <h3 className="t-title mt-auto font-display">{s.name}</h3>
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
