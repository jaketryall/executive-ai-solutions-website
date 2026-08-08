"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";
import { CTA } from "@/components/ui/cta";
import { Monogram } from "@/components/ui/monogram";
import { Segmented } from "@/components/ui/segmented";
import { Odometer } from "@/components/estimator/odometer";
import { getBuild, getBuildServer, subscribeBuild } from "@/components/builder/store";
import { capturePersona, getPersona } from "@/lib/persona";
import { buildPath, describeBuild } from "@/components/builder/packs";
import {
  PROJECT_TYPES,
  PAGE_BANDS,
  FEATURES,
  MONTHLY,
  TIERS,
  DEFAULT_STATE,
  compute,
  summarize,
  type EstimateState,
} from "@/components/estimator/pricing";

type FormStatus = "idle" | "sending" | "success" | "error";

export function Estimate({ standalone = false }: { standalone?: boolean } = {}) {
  const root = useRef<HTMLElement>(null!);
  const [est, setEst] = useState<EstimateState>(DEFAULT_STATE);
  const [armed, setArmed] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const result = useMemo(() => compute(est), [est]);
  const summary = useMemo(() => summarize(est), [est]);

  // the ad's label reaches the money page (review 2026-07-21): ?i= visitors
  // came through a Google Ads campaign, so ads management starts selected;
  // ?svc=ai starts the AI line selected. Both are monthly chips — the
  // headline BUILD number stays at its untouched default, so the preselect
  // personalizes without inflating the first price they see.
  const baseline = useRef<EstimateState>(DEFAULT_STATE);
  const personaApplied = useRef(false);
  useEffect(() => {
    // once only: StrictMode re-runs effects, and a second run would build a
    // FRESH baseline object — est would no longer === baseline.current and
    // the pill below would claim a price nobody asked for (caught live,
    // 2026-07-21: the capsule showed $2,500 on an untouched estimator)
    if (personaApplied.current) return;
    personaApplied.current = true;
    capturePersona();
    const p = getPersona();
    const monthly = [
      ...(p.i ? ["ads"] : []),
      ...(p.svc === "ai" ? ["ai"] : []),
    ];
    if (!monthly.length) return;
    const next: EstimateState = { ...DEFAULT_STATE, monthly };
    baseline.current = next;
    setEst(next);
  }, []);

  // the persistent CTA capsule carries the visitor's live total once they
  // have TOUCHED the estimator — an untouched price in the pill would read
  // as a claim. Guard against BOTH untouched states: DEFAULT_STATE covers
  // the commit where the persona effect has already moved baseline.current
  // but this effect still closes over the pre-persona est (same-commit
  // ordering, caught live 2026-07-21); baseline covers the persona render.
  useEffect(() => {
    if (est === DEFAULT_STATE || est === baseline.current) return;
    window.dispatchEvent(
      new CustomEvent("eas:estimate", { detail: { total: result.total } })
    );
  }, [est, result.total]);
  // what they made in the builder rides along with the message
  const build = useSyncExternalStore(subscribeBuild, getBuild, getBuildServer);
  const tierIndex = TIERS.findIndex((t) => t.name === result.tier.name);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        setArmed(true);
        // the mobile output bar is state, not motion — keep it working
        const bar = q(".est-bar")[0];
        const grid = q(".est-grid")[0];
        if (bar && grid) {
          ScrollTrigger.create({
            trigger: grid,
            start: "top 55%",
            end: "bottom 30%",
            onToggle: (self) => bar.classList.toggle("is-live", self.isActive),
          });
        }
        return;
      }

      // ── entrance: named one-at-a-time (head → controls → output LAST) ──
      const tl = gsap.timeline({
        // fire while the dark chapter is still rising — the slab must never sit empty
        scrollTrigger: { trigger: root.current, start: "top 68%" },
        defaults: { ease: EASE_STRUCTURE },
        onComplete: () => setArmed(true),
      });
      // the guided ORDER carries the meaning (head → controls → output);
      // the durations don't need to — same story at half the tax
      tl.fromTo(
        q(".est-head .mask-inner"),
        { yPercent: 118, y: 0 },
        { yPercent: 0, y: 0, duration: 0.7, stagger: 0.06 }
      )
        .fromTo(
          q("[data-anim='est-sub']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.45, ease: EASE_UI },
          "-=0.45"
        )
        .fromTo(
          q("[data-anim='ctrl']"),
          { autoAlpha: 0, x: -13 },
          { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.06 },
          "-=0.35"
        )
        .fromTo(
          q("[data-anim='out']"),
          { autoAlpha: 0, scale: 0.97 },
          { autoAlpha: 1, scale: 1, duration: 0.6 },
          "-=0.35"
        )
        .add(() => setArmed(true), "-=0.5");

      // form zone: quiet proximity rise
      gsap.fromTo(
        q("[data-anim='form']"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: EASE_STRUCTURE,
          stagger: 0.06,
          scrollTrigger: { trigger: q(".quote-grid")[0], start: "top 78%" },
        }
      );

      // ── E9 rise + dim: this chapter covers the process panel ──
      const mm = gsap.matchMedia();
      // mobile: a compact sticky output bar rides along while the controls scroll
      mm.add("(max-width: 820px)", () => {
        const bar = q(".est-bar")[0];
        if (!bar) return;
        const st = ScrollTrigger.create({
          trigger: q(".est-grid")[0],
          start: "top 55%",
          end: "bottom 30%",
          onToggle: (self) => bar.classList.toggle("is-live", self.isActive),
        });
        return () => {
          st.kill();
          bar.classList.remove("is-live");
        };
      });
    },
    { scope: root }
  );

  // tier label rolls when the tier crosses
  const tierStackRef = useRef<HTMLDivElement>(null!);
  useGSAP(
    () => {
      if (!tierStackRef.current) return;
      // translate each row by its OWN height, not the stack's (yPercent is self-relative)
      const rows = tierStackRef.current.children;
      if (reducedMotion()) {
        gsap.set(rows, { yPercent: -tierIndex * 100 });
        return;
      }
      gsap.to(rows, { yPercent: -tierIndex * 100, duration: 0.5, ease: EASE_UI });
    },
    { dependencies: [tierIndex] }
  );

  const toggle = (key: "features" | "monthly", id: string) =>
    setEst((s) => ({
      ...s,
      [key]: s[key].includes(id) ? s[key].filter((x) => x !== id) : [...s[key], id],
    }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const errs: Record<string, string> = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email ?? "")) errs.email = "That email doesn't look right";
    setErrors(errs);
    if (errs.email) {
      (form.querySelector("[name='email']") as HTMLElement)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          summary: summary.text,
          ...(build && {
            build: describeBuild(build),
            buildUrl: window.location.origin + buildPath(build),
          }),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="estimate"
      ref={root}
      data-nav="dark"
      className={`dark-chapter relative z-10 mx-[8px] rounded-panel md:mx-[13px] ${
        standalone ? "mt-[8px]" : "mt-[8px] md:mt-fib-6"
      }`}
    >
      {/* ── the instant estimate ── */}
      <div className="wrap pt-[89px]">
        <h2 className="est-head t-display-lg max-w-[14ch]">
          <span className="mask-line">
            <span className="mask-inner">What would</span>
          </span>
          <span className="mask-line">
            <span className="mask-inner">yours cost?</span>
          </span>
        </h2>
        <p data-anim="est-sub" className="mt-[21px] max-w-[46ch] text-paper/70">
          Pick what your business needs and watch the number move. It computes
          from our real pricing, not a marketing funnel.
        </p>

        <div className="est-grid mt-[34px] grid gap-[34px] md:grid-cols-[42fr_58fr] md:gap-[55px]">
          {/* controls */}
          <div className="flex flex-col gap-[21px]">
            <fieldset data-anim="ctrl">
              <legend className="t-meta mb-[13px] text-paper/60">The project</legend>
              <Segmented
                options={PROJECT_TYPES.map((t) => ({ id: t.id, label: t.label }))}
                value={est.projectType}
                onChange={(id) => setEst((s) => ({ ...s, projectType: id as EstimateState["projectType"] }))}
              />
            </fieldset>

            <fieldset data-anim="ctrl">
              <legend className="t-meta mb-[13px] text-paper/60">How big</legend>
              <div className="flex flex-wrap gap-[8px]">
                {PAGE_BANDS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className="chip-toggle"
                    aria-pressed={est.pageBand === b.id}
                    onClick={() => setEst((s) => ({ ...s, pageBand: b.id }))}
                  >
                    {b.label}
                    {/* price on the chip — "prices, on the page" applies here
                        too; blind-click-to-discover was the audit's one gripe */}
                    {b.add > 0 && (
                      <span className="ml-[8px] opacity-60">
                        + ${b.add.toLocaleString()}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset data-anim="ctrl">
              <legend className="t-meta mb-[13px] text-paper/60">What it needs</legend>
              <div className="flex flex-wrap gap-[8px]">
                {FEATURES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="chip-toggle"
                    aria-pressed={est.features.includes(f.id)}
                    onClick={() => toggle("features", f.id)}
                  >
                    {f.label}
                    <span className="ml-[8px] opacity-60">
                      + ${f.add.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset data-anim="ctrl">
              <legend className="t-meta mb-[13px] text-paper/60">Keep it growing</legend>
              <div className="flex flex-wrap gap-[8px]">
                {MONTHLY.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className="chip-toggle"
                    aria-pressed={est.monthly.includes(m.id)}
                    onClick={() => toggle("monthly", m.id)}
                  >
                    {m.label}
                    <span className="ml-[8px] opacity-60">{m.note}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* live output — the main character; rides along as the controls scroll */}
          <div data-anim="out" className="est-output relative self-start rounded-frame p-[34px] md:sticky md:top-[89px]">
            <Monogram
              className={`absolute right-[34px] top-[34px] h-[34px] w-[34px] transition-colors duration-500 ${
                tierIndex === 2 ? "text-accent-bright" : tierIndex === 1 ? "text-paper/70" : "text-paper/40"
              }`}
            />
            <p className="t-meta text-paper/60">Your estimate</p>
            <p className="t-display-lg mt-[13px] flex items-baseline" aria-live="polite">
              <span aria-hidden>$</span>
              <Odometer value={armed ? result.total : 0} />
              <span className="sr-only">{`$${result.total.toLocaleString()} estimated`}</span>
            </p>
            <div className="mt-[21px] flex items-center gap-[13px]">
              <div className="t-title overflow-hidden" style={{ height: "1.3em", lineHeight: 1.3 }}>
                <div ref={tierStackRef}>
                  {TIERS.map((t) => (
                    <span key={t.name} className="block" style={{ height: "1.3em", lineHeight: 1.3 }}>
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
              <span className="t-meta text-paper/60">{result.tier.blurb}</span>
            </div>
            {(result.monthly > 0 || result.aiSelected) && (
              <p className="t-meta mt-[13px] text-paper/60">
                {result.monthly > 0 && `Plus from $${result.monthly.toLocaleString()}/mo ongoing`}
                {result.monthly > 0 && result.aiSelected && " · "}
                {result.aiSelected && "AI automation quoted per project"}
              </p>
            )}
            <p className="t-meta mt-[21px] max-w-[38ch] text-paper/60">
              A realistic range, not a promise. Every project is quoted
              individually.
            </p>
            <div className="mt-[34px]">
              <CTA href="#contact" label="Get your exact quote" tone="accent" />
            </div>
          </div>
        </div>
      </div>

      {/* mobile sticky output bar — the number rides with the controls */}
      <div className="est-bar md:hidden">
        <span className="t-title flex items-baseline">
          <span aria-hidden>$</span>
          <Odometer value={armed ? result.total : 0} />
          <span className="sr-only">{`$${result.total.toLocaleString()} estimated, ${result.tier.name} tier`}</span>
          <span aria-hidden className="ml-[8px] text-[0.9375rem] text-paper/60">· {result.tier.name}</span>
        </span>
        <a href="#contact" className="est-bar-cta" aria-label="Get your exact quote">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 13 13 3M5.5 3H13v7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* ── the quote form (the one action). The client quote lives in the
          proof section now — this chapter stays all business. ── */}
      <div id="contact" className="wrap pb-fib-5 pt-fib-6 md:pb-fib-6">
        <h2 data-anim="form" className="t-display-lg max-w-[16ch]">
          Tell us about your business
        </h2>

        <div className="quote-grid mt-[55px] grid items-start gap-[34px] md:grid-cols-[58fr_42fr] md:gap-[55px]">
          {status === "success" ? (
            <div className="est-output rounded-frame p-[34px]" role="status">
              <Monogram className="h-[34px] w-[34px] text-accent-bright" />
              <p className="t-title mt-[21px]">Got it. We&apos;ll reply within one business day</p>
              <p className="mt-[13px] max-w-[44ch] text-paper/70">
                Your estimate came through with the message, so the first reply
                you get will already talk real numbers.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-fib-3">
              <p className="t-title max-w-[30ch]">
                Get your estimate and a fixed quote. Just an email.
              </p>
              <div className="flex flex-col gap-fib-2 sm:flex-row sm:items-start">
                <div className={`field flex-1 ${errors.email ? "is-invalid" : ""}`} data-anim="form">
                  <input id="q-email" name="email" type="email" autoComplete="email" placeholder=" " aria-invalid={!!errors.email} aria-describedby={errors.email ? "q-email-err" : undefined} onInput={(e) => e.currentTarget.parentElement!.classList.toggle("has-value", !!e.currentTarget.value)} />
                  <label htmlFor="q-email">Your email</label>
                  <p className="field-error" id="q-email-err" role="alert">{errors.email}</p>
                </div>
                <div data-anim="form" className="sm:pt-[6px]">
                  <CTA
                    type="submit"
                    label={status === "sending" ? "Sending" : "Send it over"}
                    tone="accent"
                    disabled={status === "sending"}
                  />
                </div>
              </div>
              <p data-anim="form" className="t-meta text-paper/50">
                Your estimate rides along automatically. No call, no spam,
                one reply with your fixed quote.
              </p>
              {/* ⚠️ DEMO PLACEHOLDER — invented quote, REAL name. Do not
                  ship public as-is (see lib/quotes.ts header); swap for a
                  real permissioned quote before merging to main */}
              <figure data-anim="form" className="mt-fib-3">
                <blockquote className="text-[1.0625rem] leading-[1.5] text-paper/75">
                  &ldquo;The site does the selling for us now — people land
                  on it and show up ready to book.&rdquo;
                </blockquote>
                <figcaption className="t-meta mt-fib-1 text-paper/45">
                  Rick Ryall, Desert Wings Flight School
                </figcaption>
              </figure>
              {status === "error" && (
                <p className="t-meta text-[#d8a08a]" role="alert">
                  That didn&apos;t send. Try again, or email us directly.
                </p>
              )}
            </form>
          )}

          {/* estimate summary sits beside the form (short zone — sticky here
              just made it shadow the fields) */}
          <aside data-anim="form" className="est-output rounded-frame p-[34px]">
            <div className="flex items-start justify-between">
              <p className="t-meta text-paper/60">Attached to your message</p>
              <Monogram className="h-[21px] w-[21px] text-paper/40" />
            </div>
            <p className="t-title mt-[21px] flex items-baseline">
              <span aria-hidden>$</span>
              <Odometer value={armed ? result.total : 0} />
              <span className="ml-[8px] text-paper/60">· {result.tier.name}</span>
              <span className="sr-only">{`$${result.total.toLocaleString()}, ${result.tier.name} tier`}</span>
            </p>
            <p className="mt-[13px] text-[0.9375rem] leading-[1.5] text-paper/60">{summary.text}</p>
            {build && (
              <p className="mt-[13px] text-[0.9375rem] leading-[1.5] text-paper/60">
                Your build: <span className="text-paper/85">{describeBuild(build)}</span>
              </p>
            )}
            <p className="t-meta mt-[21px] text-paper/60">
              Change it any time in the estimator above
            </p>

            {/* the human on the other end — the form's anonymity killer.
                PHOTO NEEDED: drop public/jake.jpg (desaturated reads best on
                this ground) and swap the Monogram for
                <img src="/jake.jpg" alt="" className="h-full w-full object-cover" /> */}
            <div className="mt-[34px] flex items-center gap-[13px] border-t border-paper/10 pt-[21px]">
              <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-paper/10">
                <Monogram className="h-[18px] w-[18px] opacity-70" />
              </span>
              <p className="text-[0.9375rem] leading-[1.5] text-paper/70">
                I&apos;m Jake. I read every message myself and reply within one
                business day.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
