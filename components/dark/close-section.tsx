"use client";

import { useRef, useState } from "react";
import Link from "next/link";

/* §06 · THE CLOSE
   The page's one action, and the thing that earns it.

   GIVE, THEN ASK. The check runs against the visitor's OWN site and
   reports what it actually found — real findings from the fetched
   document, never an invented score, which is why /api/site-check refuses
   to produce one. Being told something true and specific about your own
   site is worth more than any claim this page could make about us, and it
   is a small commitment that makes the call the obvious next step rather
   than a cold one.

   THE CTA DOES NOT DEPEND ON IT. Anyone who just wants to book is one
   click away at all times — the tool is an on-ramp, not a toll gate.

   THE SIGNATURE: the report develops, one finding at a time. Same law as
   everywhere else in this room — the thing that happens to a line is that
   light reaches it — and here it doubles as honest pacing, because a
   check that returned twelve verdicts in one frame would look fabricated
   whether or not it was. */

type Finding = { id: string; status: "good" | "fix"; title: string; detail: string };
type Result = { host: string; findings: Finding[]; summary: string };

export default function CloseSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    const address = url.trim();
    if (state === "busy" || !address) return;
    setState("busy");
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/site-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: address }),
      });
      const data = (await res.json()) as Result & { error?: string };
      if (!res.ok || data.error) {
        // the API's own wording is better than a generic failure line
        setError(data.error ?? "Something went sideways. Try again?");
        setState("idle");
        return;
      }
      setResult(data);
      setState("done");
    } catch {
      setError("We couldn't reach that site from here. Check the address?");
      setState("idle");
    }
  };

  return (
    /* THE BOOKEND (grammar law 12). The last room reuses the first room's
       grammar: the hero's black room, its light rig and its mark, arriving
       at the bottom of the page as ONE rigid object on the lifted ground —
       the composition without the motion. Nothing in here rides scroll:
       no window, no lag, no ramp. The ground flip that used to live here
       moved up to the §04→§05 seam, so by the time this arrives the room
       is already light and the panel is the dark thing in it.

       The seam in is glow → cut: white light pooled on the ground just
       above the crest, then a hard edge into black — and the edge is an
       elliptical cap rather than a straight line, so the panel reads as a
       horizon the mark rises over. The mark is the ONE breaching object,
       on the centre axis, part over the glow and part over the black. */
    <section className="dr-close" aria-labelledby="dr-close-h">
      <div className="dr-close-panel">
        {/* painted UNDER the panel (negative z), so the dome cuts it */}
        <div className="dr-close-glow" aria-hidden />
        {/* the panel's black and the hero's rig, held still, in ONE layer
            that also carries the dome — see the stylesheet */}
        <div className="dr-close-rig" aria-hidden />
        <span className="dr-close-mark" aria-hidden />

      <div className="dr-close-in">
        <span className="t-label dr-close-kicker" data-wipe>
          The next step
        </span>
        <h2 className="dr-close-h" id="dr-close-h" data-wipe data-wipe-delay="150">
          Book the call. Or check your site first — we&rsquo;ll tell you what
          we find.
        </h2>

        <div className="dr-close-act">
          <Link href="/contact" className="dr-close-cta t-cta">
            Book the call
          </Link>
          <span className="dr-close-note">
            Twenty minutes. A fixed quote within two days.
          </span>
        </div>

        <form className="dr-check" onSubmit={run}>
          <label className="dr-check-label" htmlFor="dr-check-url">
            Already have a site? Put the address in.
          </label>
          <div className="dr-check-row">
            <input
              id="dr-check-url"
              ref={inputRef}
              className="dr-check-input"
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder="yourbusiness.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-describedby={error ? "dr-check-err" : undefined}
              aria-invalid={error ? true : undefined}
            />
            <button
              type="submit"
              className="dr-check-go"
              disabled={state === "busy" || !url.trim()}
            >
              {state === "busy" ? "Checking…" : "Run the check"}
            </button>
          </div>

          {error && (
            <p className="dr-check-err" id="dr-check-err" role="alert">
              {error}
            </p>
          )}
        </form>

        {/* the report. aria-live so it is announced when it lands, and
            role=status rather than alert because it is information, not a
            problem to interrupt for. */}
        <div className="dr-report" role="status" aria-live="polite">
          {state === "busy" && (
            <p className="dr-report-wait">Reading {url.trim()}…</p>
          )}

          {result && (
            <>
              <p className="dr-report-head">
                <span className="dr-report-host">{result.host}</span>
                <span className="dr-report-sum">{result.summary}</span>
              </p>

              <ul className="dr-report-list">
                {result.findings.map((f, i) => (
                  <li
                    key={f.id}
                    className="dr-finding"
                    data-status={f.status}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <span className="dr-finding-mark" aria-hidden />
                    <span className="dr-finding-body">
                      <b>{f.title}</b>
                      <span>{f.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <p className="dr-report-foot">
                Want these fixed?{" "}
                <Link href="/contact" className="dr-report-link">
                  Book the call
                  <i aria-hidden>→</i>
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

        {/* the utility row, on the object itself — the page's end, so the
            legal line and the address live here. A div, not <footer>:
            this route hides every footer element to drop the site's own,
            and a real one here would vanish with it. Sits under the one
            edge the whole room shares. */}
        <div className="dr-close-util" role="contentinfo">
          <span className="dr-close-copy">
            &copy; {new Date().getFullYear()} Executive AI Solutions
            <i aria-hidden>&middot;</i>
            Phoenix, Arizona
          </span>
          <nav className="dr-close-links" aria-label="Footer">
            <Link href="/work">Work</Link>
            <Link href="/services/websites">Services</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/privacy">Privacy</Link>
          </nav>
          <a className="dr-close-mail" href="mailto:hello@executiveaisolutions.com">
            hello@executiveaisolutions.com
          </a>
        </div>
      </div>
    </section>
  );
}
