"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CTA } from "@/components/ui/cta";
import { LeadMathCore } from "@/components/services/lead-math";
import { revealUp } from "@/components/anim/reveal";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";

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

  const check = async (address: string) => {
    if (state === "busy" || !address.trim()) return;
    setState("busy");
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/site-check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: address }),
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
          listRef.current.querySelectorAll(
            ".scheck-row, .scheck-verdict, .scheck-math, .scheck-next"
          ),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.09, ease: EASE_UI }
        );
      });
    } catch {
      setError("We couldn't reach our own checker — that one's on us.");
      setState("idle");
    }
  };

  const run = (e: React.FormEvent) => {
    e.preventDefault();
    check(url);
  };

  /* the hero's input drives this section (the endgame give, 2026-07-17):
     it hands the domain down via event; the report renders HERE, so the
     visitor lands on the skeleton already reading their site */
  const checkRef = useRef(check);
  checkRef.current = check;
  useEffect(() => {
    const onHero = (e: Event) => {
      const address = (e as CustomEvent<string>).detail;
      if (!address) return;
      setUrl(address);
      checkRef.current(address);
    };
    window.addEventListener("eas:site-check", onHero);
    return () => window.removeEventListener("eas:site-check", onHero);
  }, []);

  // the results card grows AND shrinks the page (render, clear, re-render) —
  // every ScrollTrigger below (closer entrance, footer reveal scrub) measured
  // the old layout and must remeasure or the page's ending plays at stale
  // positions
  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [result]);

  const fixes = result?.findings.filter((f) => f.status === "fix") ?? [];
  const goods = result?.findings.filter((f) => f.status === "good") ?? [];

  return (
    <section
      id="site-check"
      ref={root}
      // PRIME SLOT (the acquisition order, Jake 2026-07-16): directly under
      // the hero — the first thing a cold click can DO. CONTINUOUS canvas
      // (Jake killed the gray strip): hero→audit is one beat — ask, then
      // give — and the dark report card is the section's one object. pt
      // clears the hero ad card's exit overhang.
      className="relative pb-fib-7 pt-fib-7 text-ink"
    >
      <div className="wrap">
        <div className="mx-auto max-w-[640px] text-center">
          <h2 data-anim="sc" className="t-display-lg">
            Get a free site audit, right now
          </h2>
          <p data-anim="sc" className="t-lede mx-auto mt-fib-3 max-w-[42ch] text-ink/70">
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
            <p className="mt-fib-2 text-[0.9375rem] text-ink/70" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* instant response: the report card appears AS skeleton the frame
            the button is pressed — the wait reads as "reading your site",
            never as a dead form (Jake's instant-results worry) */}
        {state === "busy" && (
          <div
            className="dark-chapter proof-card mx-auto mt-fib-5 max-w-[820px] rounded-panel p-fib-3 md:p-fib-4"
            aria-hidden
          >
            <div className="scheck-skel scheck-skel--title" />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="mt-fib-3 flex gap-fib-2">
                <div className="scheck-skel scheck-skel--mark" />
                <div className="min-w-0 flex-1">
                  <div className="scheck-skel scheck-skel--line" style={{ width: `${62 - i * 8}%` }} />
                  <div className="scheck-skel scheck-skel--sub mt-fib-1" style={{ width: `${88 - i * 6}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

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
            {/* the report's last chapter: the findings said WHERE clicks
                leak, the math says what they're WORTH — one give, one flow
                (Jake, 2026-07-15: the calculator lives with the site thing) */}
            <div className="scheck-math mt-fib-4 border-t border-paper/10 pt-fib-4">
              <p className="t-title font-display">
                {fixes.length > 0
                  ? "And what are those clicks worth?"
                  : "Solid site — so what would clicks on it earn?"}
              </p>
              <p className="mt-fib-2 max-w-[52ch] text-[0.9375rem] leading-[1.5] text-paper/65">
                Three numbers you already know. The arithmetic every ad budget
                lives or dies on.
              </p>
              <div className="mt-fib-3">
                <LeadMathCore dark showCta={false} />
              </div>
            </div>
            <div className="scheck-next mt-fib-4 flex flex-wrap items-center gap-fib-3">
              <CTA href="/pricing#estimate" label="Price my project" tone="paper" />
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
