"use client";

import { useRef, useState } from "react";
import Link from "next/link";

/* §05 · THE CLOSE
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
    /* THE LIGHTS COME UP FOR THE ASK. Declares a ground ramp and the
       engine resolves it against this room's own palette — `void` reads
       --void, `surface-1` reads --surface-1, so no colour is restated
       here. Two attributes, no scroll code in this file. Earned rather
       than decorative: §05 is where the page finally asks, and a room
       that lifts as you arrive at the question is the whole concept. */
    <section
      className="dr-close"
      aria-labelledby="dr-close-h"
      data-sp
      data-sp-from="1"
      data-sp-to="0.45"
      data-sp-lerp="0.1"
      data-bg-from="void"
      data-bg-to="surface-1"
    >
      <div className="wrap dr-close-in">
        <span className="t-label dr-close-kicker">The next step</span>
        <h2 className="dr-close-h" id="dr-close-h">
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
    </section>
  );
}
