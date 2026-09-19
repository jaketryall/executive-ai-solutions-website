"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NEXT_START } from "@/lib/proof";

/* §06 · THE CLOSE
   The page's one action, and the thing that earns it — now built as CTA
   and footer in ONE room, on the same lifted ground §05's card recedes to
   reveal (design-dna/decodes/offbrand.md). The old bookend — the hero's
   rig/glow/dome/mark returning as a rigid black object — is retired
   (decisions.md, 2026-09-06 supersede): there is no second ground paint
   here, no dome cut, no mark on a crest. This is just the room, wide open,
   with the last thing the visitor is asked to do and the last thing they
   can look up.

   GIVE, THEN ASK. The check runs against the visitor's OWN site and
   reports what it actually found — real findings from the fetched
   document, never an invented score, which is why /api/site-check refuses
   to produce one. Being told something true and specific about your own
   site is worth more than any claim this page could make about us, and it
   is a small commitment that makes the call the obvious next step rather
   than a cold one.

   THE CTA DOES NOT DEPEND ON IT. The pill sits inline in the headline
   itself — one click away the moment the line is read — and a second
   copy waits below the note for mobile, where the headline can't carry
   it. Only one is ever in the tab order at a time (CSS display, not a
   duplicate landing target).

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

  // the one live element in the footer — rendered "" on the server so
  // hydration matches, then ticked from the client every 30s
  const [time, setTime] = useState("");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Phoenix",
      hour: "numeric",
      minute: "2-digit",
    });
    const tick = () => setTime(`${f.format(new Date())} local`);
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

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
    <section className="dr-close" aria-labelledby="dr-close-h">
      <div className="wrap dr-close-in">
        <div className="dr-close-say">
          <span className="t-label dr-close-kicker" data-wipe>
            The next step
          </span>
          {/* the hero's closing line, said again — a single data-wipe
              heading carrying its own CTA as one inline word on desktop.
              Sized to its own column via cqw (see dark.css), not the
              viewport, so it never outgrows the space it actually has. */}
          <h2 className="dr-close-h" id="dr-close-h" data-wipe data-wipe-delay="150">
            <span className="dr-close-line">How about</span>
            <span className="dr-close-line">a site that books</span>
            <span className="dr-close-line">
              for you,{" "}
              <Link href="/contact" className="dr-close-cta t-cta is-desk">
                Book the call<i aria-hidden>→</i>
              </Link>
            </span>
            <span className="dr-close-line">while you work.</span>
          </h2>

          <p className="dr-close-note">
            Twenty minutes. A fixed quote within two days.
            {/* the capacity line, only while it is true (lib/proof.ts) */}
            {NEXT_START && <> One build at a time — next start {NEXT_START}.</>}
          </p>

          {/* the mobile copy of the pill — the headline can't carry an
              inline button at this width, so it drops to its own row */}
          <Link href="/contact" className="dr-close-cta t-cta is-mob">
            Book the call<i aria-hidden>→</i>
          </Link>
        </div>

        {/* column 2 — the footer nav, then the site-check underneath it.
            Moved out of the headline's own column so the h2 above can be
            sized to ITS column alone, not shared with a form. */}
        <div className="dr-close-side">
          <nav className="dr-close-nav" aria-label="Footer">
            <div className="dr-close-col">
              <span className="t-label dr-close-colh">Site</span>
              <ul>
                <li>
                  <Link href="/work">Work</Link>
                </li>
                <li>
                  <Link href="/services/websites">Services</Link>
                </li>
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="dr-close-col">
              <span className="t-label dr-close-colh">Reach</span>
              <ul>
                <li>
                  <a href="mailto:hello@executiveaisolutions.com">
                    hello@executiveaisolutions.com
                  </a>
                </li>
                <li>
                  <Link href="/contact">Book the call</Link>
                </li>
              </ul>
            </div>
            <div className="dr-close-col">
              <span className="t-label dr-close-colh">Office</span>
              <ul>
                <li>Phoenix, Arizona</li>
                <li>
                  <span className="dr-close-time" suppressHydrationWarning>
                    {time}
                  </span>
                </li>
              </ul>
            </div>
          </nav>

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

        {/* the wordmark, and under it the legal line — the page's actual
            end. A div, not <footer>: this route hides every footer
            element to drop the site's own, and a real one here would
            vanish with it. */}
        <div className="dr-close-foot">
          <p className="dr-close-lockup">
            <span className="dr-close-mk" aria-hidden />
            <span className="dr-close-wm">Executive AI Solutions</span>
          </p>
          <div className="dr-close-util" role="contentinfo">
            <span className="dr-close-copy">
              &copy; {new Date().getFullYear()} Executive AI Solutions
            </span>
            <Link href="/privacy" className="dr-close-priv">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
