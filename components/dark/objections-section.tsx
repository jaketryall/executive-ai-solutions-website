"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/services";

/* §05 · THE OBJECTIONS
   The four things a buyer actually worries about, answered before they
   have to ask — price, lock-in, ownership, and whether we can work with
   what they already have.

   THE CHIPS ANSWER FROM OUR OWN DATA, NOT THE MODEL. lib/services.ts
   carries these answers already, written and approved, and they are about
   money and ownership — the two things you least want paraphrased. So a
   chip resolves instantly, offline, with no network and no chance of
   drift. The assistant is for the questions we did not anticipate.

   That split is also why the section still works with no API key: the
   four answers a visitor most needs are never behind a request. */

/* selected by service and position rather than copied, so editing an
   answer in lib/services.ts edits it here too */
const PICKS: [string, number][] = [
  ["websites", 0],    // what does it cost
  ["google-ads", 2],  // do I need a retainer
  ["websites", 1],    // who owns it
  ["websites", 2],    // can you redesign mine
];

type Answer = { q: string; a: string; source: "written" | "assistant" };

function pick(slug: string, i: number) {
  return SERVICES.find((s) => s.slug === slug)?.faqs?.[i] ?? null;
}

export default function ObjectionsSection() {
  const asked = PICKS.map(([slug, i]) => pick(slug, i)).filter(
    (f): f is { q: string; a: string } => !!f
  );

  const [answer, setAnswer] = useState<Answer | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  const ask = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || busy) return;
    setBusy(true);
    setAnswer({ q, a: "", source: "assistant" });
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: q }] }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      setAnswer({
        q,
        // the API's own error wording is better than a generic failure line
        a: data.reply ?? data.error ?? "That one didn't go through. Try again?",
        source: "assistant",
      });
      setInput("");
    } catch {
      setAnswer({
        q,
        a: "That one didn't go through — try again, or email hello@executiveaisolutions.com and a human answers within a business day.",
        source: "assistant",
      });
    } finally {
      setBusy(false);
    }
  };

  if (!asked.length) return null;

  return (
    /* THE PAGE'S ONE GROUND FLIP LIVES HERE (grammar law 2). Black holds
       from the top through §04; this seam lifts it ONCE, to --surface-2,
       and it holds to the end. LATE and DECOUPLED: the ramp is declared on
       the SECTION, on a later window than the content's own arrival
       (--ap on .dr-obj-in), so the copy is already resolved when the room
       around it brightens — the lift is the seam's event, not the text's.
       §06 then paints its own black over the lifted ground, which is what
       lets it read as an object rather than as more page. */
    <section
      className="dr-obj"
      aria-labelledby="dr-obj-h"
      data-sp
      data-sp-from="0.72"
      data-sp-to="0.22"
      data-sp-var="--gp"
      data-bg-from="void"
      data-bg-to="surface-2"
    >
      {/* declares its arrival; the three blocks inside read --ap at three
          rates, the same lag hierarchy §02 uses */}
      <div
        className="wrap dr-obj-in"
        data-sp
        data-sp-from="1"
        data-sp-to="0.4"
        data-sp-var="--ap"
        data-sp-lerp="0.1"
      >
        <span className="t-label dr-obj-kicker">Before you ask</span>
        <h2 className="dr-obj-h" id="dr-obj-h">
          The four questions everyone asks, answered without the call.
        </h2>

        <ul className="dr-obj-chips">
          {asked.map((f, i) => {
            const on = answer?.q === f.q;
            return (
              <li key={f.q}>
                <button
                  type="button"
                  className="dr-chip"
                  aria-pressed={on}
                  style={{ "--i": i } as React.CSSProperties}
                  onClick={() =>
                    setAnswer(on ? null : { q: f.q, a: f.a, source: "written" })
                  }
                >
                  {f.q}
                </button>
              </li>
            );
          })}
        </ul>

        {/* one panel for both sources — a chip and a typed question land in
            the same place, so the section never grows a second column */}
        <div
          className="dr-obj-panel"
          ref={panel}
          role="status"
          aria-live="polite"
          data-open={answer ? "true" : undefined}
        >
          {answer && (
            <>
              <p className="dr-obj-q">{answer.q}</p>
              <p className="dr-obj-a">
                {answer.a || (busy ? "Thinking…" : "")}
              </p>
              {answer.source === "assistant" && answer.a && !busy && (
                /* say where it came from. A written answer is approved copy;
                   this one is generated, and pretending otherwise on a page
                   about money would be the wrong kind of confident. */
                <p className="dr-obj-src">
                  Answered by the site&rsquo;s assistant.{" "}
                  <Link href="/contact">Book the call</Link> for anything it
                  gets wrong.
                </p>
              )}
            </>
          )}
        </div>

        <form className="dr-obj-form" onSubmit={ask}>
          <label className="dr-obj-label" htmlFor="dr-obj-q">
            Something else on your mind?
          </label>
          <div className="dr-obj-row">
            <input
              id="dr-obj-q"
              className="dr-obj-input"
              type="text"
              placeholder="Ask anything about the work"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="dr-obj-go"
              disabled={busy || !input.trim()}
            >
              {busy ? "Asking…" : "Ask"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
