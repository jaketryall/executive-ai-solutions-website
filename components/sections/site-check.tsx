"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CTA } from "@/components/ui/cta";
import { revealUp } from "@/components/anim/reveal";
import { gsap, useGSAP, EASE_UI, reducedMotion } from "@/components/anim/ease";

/* The give (selling-architecture.md law 5, Jake 2026-07-14: "something they
   can do that helps convert them"). A visitor pastes their address and we
   read their homepage the way we'd read a client's — real checks, plain
   sentences, no email, no score theater. Placed AFTER the proof: show,
   then give, then ask. The findings themselves are the pitch; the CTA
   underneath just names the obvious next step. */

type Finding = {
  id: string;
  status: "good" | "fix";
  title: string;
  detail: string;
};
type Result = {
  host: string;
  findings: Finding[];
  summary: string;
};

export function SiteCheck() {
  const root = useRef<HTMLElement>(null!);
  const listRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  useGSAP(
    () => {
      if (reducedMotion()) {
        gsap.set("[data-anim='sc']", { autoAlpha: 1, y: 0 });
        return;
      }
      revealUp(
        gsap.utils.selector(root)("[data-anim='sc']"),
        root.current
      );
    },
    { scope: root }
  );

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "busy" || !url.trim()) return;
    setState("busy");
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/site-check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await res.json()) as Result & { error?: string };
      if (!res.ok || data.error) {
        setError(data.error ?? "Something went sideways. Try again?");
        setState("idle");
        return;
      }
      setResult(data);
      setState("done");
      // findings land one at a time — the data is real, only the arrival
      // is staged (structural motion, ~.35s each on the house curve)
      requestAnimationFrame(() => {
        if (reducedMotion() || !listRef.current) return;
        gsap.fromTo(
          listRef.current.querySelectorAll(".scheck-row, .scheck-verdict, .scheck-next"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.09, ease: EASE_UI }
        );
      });
    } catch {
      setError("We couldn't reach our own checker — that one's on us.");
      setState("idle");
    }
  };

  const fixes = result?.findings.filter((f) => f.status === "fix") ?? [];
  const goods = result?.findings.filter((f) => f.status === "good") ?? [];

  return (
    <section
      id="site-check"
      ref={root}
      // chapter one continues: same ink as the proof above
      className="relative bg-[var(--color-dark-2)] pb-fib-8 text-paper"
    >
      <div className="wrap">
        <div className="mx-auto max-w-[640px] text-center">
          <h2 data-anim="sc" className="t-display-lg">
            Try us on your own site
          </h2>
          <p data-anim="sc" className="mx-auto mt-fib-3 max-w-[42ch] text-paper/70">
            Paste your address and we&rsquo;ll read your homepage the way we
            read a client&rsquo;s — what&rsquo;s working, what&rsquo;s leaking
            leads. Thirty seconds. Free, no email.
          </p>

          <form data-anim="sc" className="scheck-form mt-fib-4" onSubmit={run}>
            <input
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              placeholder="yourbusiness.com"
              aria-label="Your website address"
              className="scheck-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={state === "busy"}
            />
            <button
              type="submit"
              className="scheck-go"
              disabled={state === "busy" || !url.trim()}
            >
              {state === "busy" ? "Reading it…" : "Check my site"}
            </button>
          </form>
          {error && (
            <p className="mt-fib-2 text-[0.9375rem] text-paper/70" role="alert">
              {error}
            </p>
          )}
        </div>

        {result && (
          <div
            ref={listRef}
            className="dark-chapter proof-card mx-auto mt-fib-5 max-w-[820px] rounded-panel p-fib-3 md:p-fib-4"
            aria-live="polite"
          >
            <p className="scheck-verdict t-title font-display">
              {result.host} — {result.summary}
            </p>
            <div className="mt-fib-3">
              {[...fixes, ...goods].map((f) => (
                <div key={f.id} className="scheck-row">
                  <span
                    className={`scheck-mark ${f.status === "fix" ? "scheck-mark--fix" : ""}`}
                    aria-hidden
                  >
                    {f.status === "fix" ? "→" : "✓"}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">
                      {f.title}
                      <span className="sr-only">
                        {f.status === "fix" ? " — worth fixing" : " — good"}
                      </span>
                    </span>
                    <span className="mt-[3px] block text-[0.9375rem] leading-[1.5] text-paper/65">
                      {f.detail}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <div className="scheck-next mt-fib-4 flex flex-wrap items-center gap-fib-3">
              <CTA href="#estimate" label="Price my project" tone="paper" />
              <Link href="/contact" className="u-link t-meta text-paper/70">
                Want the human read? Send it over
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
