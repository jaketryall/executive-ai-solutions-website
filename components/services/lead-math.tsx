"use client";

import { useRef, useState } from "react";
import { CTA } from "@/components/ui/cta";
import { revealUp } from "@/components/anim/reveal";
import { gsap, useGSAP, reducedMotion } from "@/components/anim/ease";

/* The lead math — the ads convincer (Jake, 2026-07-15: "i want to convince
   them they need ads"). Three numbers every owner knows by heart, pure
   arithmetic back: no keyword data, no invented benchmarks, nothing that can
   be wrong — the visitor persuades themselves with their own figures. And
   when the numbers DON'T work, it says so — the qualifier-out is what makes
   the rest believable.

   Two homes, one core: the ads page's own section (white card, before the
   price beat so $500/mo lands pre-anchored), and the tail of the homepage
   site-check report (dark skin) — the findings say where clicks leak, the
   math says what they're worth. */

const MGMT = 500;

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

function Field({
  label,
  display,
  value,
  min,
  max,
  step,
  onChange,
  aria,
  soft,
}: {
  label: string;
  display: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  aria: string;
  soft: string;
}) {
  // the filled track is pure f(input) — the slider paints its own progress
  const p = ((value - min) / (max - min)) * 100;
  return (
    <label className="lm-field">
      <span className="lm-field-row">
        <span className={soft}>{label}</span>
        <span className="t-num font-display text-[1.2rem] font-semibold">
          {display}
        </span>
      </span>
      <input
        type="range"
        className="lm-range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--p": `${p}%` } as React.CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={aria}
      />
    </label>
  );
}

/* ── the core: sliders + arithmetic, tone-aware, no chrome of its own ── */
export function LeadMathCore({
  dark = false,
  showCta = true,
}: {
  dark?: boolean;
  showCta?: boolean;
}) {
  const [value, setValue] = useState(1500);
  const [close, setClose] = useState(25);
  const [budget, setBudget] = useState(750);

  const rate = close / 100;
  const leadWorth = value * rate;
  const total = budget + MGMT;
  const beCustomers = Math.max(1, Math.ceil(total / value));
  const beLeads = Math.ceil(beCustomers / rate);
  // past ~3 break-even customers the honest read is "maybe" — say it
  const works = beCustomers <= 3;

  const c = dark
    ? {
        soft: "text-paper/70",
        body: "text-paper/85",
        sub: "text-paper/60",
        meta: "text-paper/45",
        line: "border-paper/10",
      }
    : {
        soft: "text-ink/70",
        body: "text-ink/80",
        sub: "text-ink/60",
        meta: "text-ink/45",
        line: "border-ink/10",
      };

  return (
    <div className={`grid gap-fib-4 md:grid-cols-2 md:gap-fib-5 ${dark ? "lm-dark" : ""}`}>
      {/* ── the three knowns ── */}
      <div className="flex flex-col justify-center gap-fib-4">
        <Field
          label="An average customer is worth"
          display={fmt(value)}
          value={value}
          min={200}
          max={10000}
          step={100}
          onChange={setValue}
          aria="Average customer value in dollars"
          soft={c.soft}
        />
        <Field
          label="Enquiries that become customers"
          display={`${close}%`}
          value={close}
          min={10}
          max={75}
          step={5}
          onChange={setClose}
          aria="Percentage of enquiries that become customers"
          soft={c.soft}
        />
        <Field
          label="Monthly ad budget you'd try"
          display={fmt(budget)}
          value={budget}
          min={300}
          max={3000}
          step={50}
          onChange={setBudget}
          aria="Monthly ad budget in dollars"
          soft={c.soft}
        />
      </div>

      {/* ── the answer ── */}
      <div className="lm-out">
        <div className="flex items-baseline justify-between gap-fib-2">
          <span className={c.soft}>A lead is worth</span>
          <span className="t-num font-display text-[1.2rem] font-semibold">
            {fmt(leadWorth)}
          </span>
        </div>
        <div className="mt-fib-2 flex items-baseline justify-between gap-fib-2">
          <span className={c.soft}>All-in monthly cost</span>
          <span className="t-num font-display text-[1.2rem] font-semibold">
            {fmt(total)}
          </span>
        </div>
        <p className={`t-meta mt-[5px] text-right ${c.meta}`}>
          your budget + {fmt(MGMT)} management
        </p>

        <div className={`mt-fib-3 border-t pt-fib-3 ${c.line}`}>
          <p className="t-num font-display text-[3.2rem] font-extrabold leading-none tracking-[-0.03em]">
            {beCustomers}
          </p>
          <p className={`mt-fib-1 max-w-[26ch] ${c.body}`}>
            {works
              ? `customer${beCustomers === 1 ? "" : "s"} a month and the ads have paid for themselves`
              : `customers a month just to break even`}
          </p>
          <p className={`mt-fib-2 max-w-[34ch] text-[0.9375rem] leading-[1.5] ${c.sub}`}>
            That&rsquo;s {beLeads} enquir{beLeads === 1 ? "y" : "ies"} at your
            close rate.{" "}
            {works
              ? "Everything after is profit."
              : "At those numbers, ads are a maybe — worth a twenty-minute call before you spend a dollar."}
          </p>
        </div>

        <p className={`t-meta mt-fib-3 ${c.meta}`}>
          Arithmetic from your inputs, not a promise — it&rsquo;s the math we
          open every call with.
        </p>
        {showCta && (
          <div className="mt-fib-3">
            <CTA href="/pricing#estimate" label="Price my project" tone="accent" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── the ads page's own section: the core on a white card ── */
export function LeadMath() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      if (reducedMotion()) {
        gsap.set("[data-anim='lm']", { autoAlpha: 1, y: 0 });
        return;
      }
      revealUp(gsap.utils.selector(root)("[data-anim='lm']"), root.current);
    },
    { scope: root }
  );

  return (
    <section id="lead-math" ref={root} className="svc-math py-fib-5 md:py-fib-6">
      <div className="wrap">
        <div className="mx-auto max-w-[640px] text-center">
          <h2 data-anim="lm" className="t-display-lg">
            Run your own numbers
          </h2>
          <p data-anim="lm" className="mx-auto mt-fib-3 max-w-[44ch] text-ink/70">
            Three numbers you already know. The arithmetic every ad budget
            lives or dies on — see it before you spend a dollar.
          </p>
        </div>

        <div data-anim="lm" className="lm-card mx-auto mt-fib-5 max-w-[920px]">
          <LeadMathCore />
        </div>
      </div>
    </section>
  );
}
