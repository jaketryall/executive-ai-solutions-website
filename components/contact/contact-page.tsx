"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  gsap,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";
import { whenArrived } from "@/components/anim/arrival";
import { CTA } from "@/components/ui/cta";
import { Monogram } from "@/components/ui/monogram";
import { ProcessCards } from "@/components/ui/process-cards";

/* Contact — the page IS the action. The form is drawn as the artifact it
   really is (the email that starts the project: an ink compose window in the
   site's frame language), the reassurances sit beside it, and the three steps
   after "send" are the only other thing on the page. */

type FormStatus = "idle" | "sending" | "success" | "error";

const STEPS = [
  {
    name: "The reply",
    body: "Within one business day, from Jake, not an autoresponder. Plain answers to whatever you asked.",
  },
  {
    name: "The call, if it fits",
    body: "Twenty minutes to work out scope together. No deck, no discovery-phase invoice, no pressure to book anything.",
  },
  {
    name: "The fixed quote",
    body: "Two days later: one number and a timeline, in writing. The price never moves after you say yes.",
  },
];

export function ContactPage() {
  const root = useRef<HTMLElement>(null!);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const nav = document.querySelector(".site-nav");

      if (reducedMotion()) {
        if (nav) gsap.set(nav, { autoAlpha: 1 });
        gsap.set(q("[data-anim]"), { autoAlpha: 1, x: 0, y: 0, scale: 1 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        return;
      }

      /* statement rises, the compose window settles last, fields deal in */
      const enter = contextSafe!(() => {
        const tl = gsap.timeline({ defaults: { ease: EASE_STRUCTURE } });
        // pre-hidden site-wide; no-op on a soft nav, a beat on a hard load
        if (nav) tl.to(nav, { autoAlpha: 1, duration: 0.6, ease: EASE_UI }, 0.1);
        tl.fromTo(
            q(".ct-hero .mask-inner"),
            { yPercent: 118, y: 0 },
            { yPercent: 0, y: 0, duration: 0.95, stagger: 0.09 }
          )
          .fromTo(
            q("[data-anim='h-sub']"),
            { autoAlpha: 0, y: 13 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: EASE_UI },
            "-=0.5"
          )
          .fromTo(
            q("[data-anim='compose']"),
            { autoAlpha: 0, y: 21 },
            { autoAlpha: 1, y: 0, duration: 0.9 },
            "-=0.35"
          )
          .fromTo(
            q("[data-anim='field']"),
            { autoAlpha: 0, y: 13 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: EASE_UI },
            "-=0.45"
          );
      });
      let dead = false;
      whenArrived().then(() => !dead && enter());

      /* the three steps: one at a time */
      gsap.fromTo(
        q("[data-anim='step']"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: EASE_STRUCTURE,
          stagger: 0.12,
          scrollTrigger: { trigger: q(".ct-steps")[0], start: "top 78%", once: true },
        }
      );

      return () => {
        dead = true;
      };
    },
    { scope: root }
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;
    const errs: Record<string, string> = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email ?? ""))
      errs.email = "That email doesn't look right";
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
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const field = (
    name: string,
    label: string,
    opts: { type?: string; required?: boolean; autoComplete?: string } = {}
  ) => (
    <div
      className={`field ${errors[name] ? "is-invalid" : ""}`}
      data-anim="field"
    >
      <input
        id={`ct-${name}`}
        name={name}
        type={opts.type ?? "text"}
        autoComplete={opts.autoComplete}
        placeholder=" "
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `ct-${name}-err` : undefined}
        onInput={(e) =>
          e.currentTarget.parentElement!.classList.toggle(
            "has-value",
            !!e.currentTarget.value
          )
        }
      />
      <label htmlFor={`ct-${name}`}>{label}</label>
      {errors[name] && (
        <p className="field-error" id={`ct-${name}-err`} role="alert">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <article ref={root}>
      {/* ── the statement + the compose window ── */}
      <section className="ct-hero relative" data-pcta-hide>
        <div className="wrap grid items-start gap-fib-5 pb-fib-6 pt-[144px] md:grid-cols-[45fr_55fr] md:gap-fib-6 md:pt-[176px]">
          <div>
            <h1 className="t-display-title max-w-[10ch]">
              <span className="mask-line">
                <span className="mask-inner">One email</span>
              </span>
              <span className="mask-line">
                <span className="mask-inner">starts it</span>
              </span>
            </h1>
            <p data-anim="h-sub" className="mt-fib-3 max-w-[40ch] text-ink/70">
              Tell us about your business in a sentence or two. No call
              required, no discovery form, nothing to book.
            </p>
            <ul data-anim="h-sub" className="mt-fib-4 flex flex-col gap-fib-2">
              <li className="max-w-[42ch] text-ink/70">
                <span className="font-semibold text-ink">
                  A reply within one business day.
                </span>{" "}
                I read every message myself.
              </li>
              <li className="max-w-[42ch] text-ink/70">
                <span className="font-semibold text-ink">
                  A fixed quote in two days
                </span>{" "}
                once we know the scope. The price never moves after.
              </li>
            </ul>
            <p data-anim="h-sub" className="t-meta mt-fib-4 text-ink/60">
              Prefer your own inbox?{" "}
              <a
                href="mailto:hello@executiveaisolutions.com"
                className="u-link text-ink/80"
              >
                hello@executiveaisolutions.com
              </a>
            </p>
          </div>

          {/* the compose window — the project's first artifact */}
          <div data-anim="compose">
            <figure
              className="af af--ink af--chrome compose"
              role="group"
              aria-label="Message form, sent straight to Executive AI Solutions"
            >
              <div className="af-bar" aria-hidden>
                <Monogram className="h-[13px] w-[13px] opacity-70" />
                <span className="af-url">
                  New message · to Executive AI Solutions
                </span>
              </div>
              <div className="af-body">
                {status === "success" ? (
                  <div role="status" className="py-fib-4">
                    <Monogram className="h-fib-4 w-fib-4 text-accent-bright" />
                    <p className="t-title mt-fib-3 text-paper">
                      Got it. We&apos;ll reply within one business day
                    </p>
                    <p className="mt-fib-2 max-w-[44ch] text-paper/70">
                      Watch for a reply from Jake. If a build makes sense,
                      the next email after that is your fixed quote.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} noValidate className="flex flex-col gap-fib-2">
                    {field("email", "Your email", {
                      type: "email",
                      required: true,
                      autoComplete: "email",
                    })}
                    <div className="grid gap-fib-2 sm:grid-cols-2">
                      {field("name", "Your name", { autoComplete: "name" })}
                      {field("business", "Your business", {
                        autoComplete: "organization",
                      })}
                    </div>
                    <div className="field" data-anim="field">
                      <textarea
                        id="ct-message"
                        name="message"
                        rows={5}
                        placeholder=" "
                        onInput={(e) =>
                          e.currentTarget.parentElement!.classList.toggle(
                            "has-value",
                            !!e.currentTarget.value
                          )
                        }
                      />
                      <label htmlFor="ct-message">
                        What should more customers mean for you?
                      </label>
                    </div>
                    <div
                      data-anim="field"
                      className="flex flex-wrap items-center justify-between gap-fib-3"
                    >
                      <p className="t-meta max-w-[30ch] text-paper/50">
                        Only the email is required. No spam, no list, one
                        human reply.
                      </p>
                      <CTA
                        type="submit"
                        label={status === "sending" ? "Sending" : "Send it over"}
                        tone="accent"
                        disabled={status === "sending"}
                      />
                    </div>
                    {status === "error" && (
                      <p className="t-meta text-[#d8a08a]" role="alert">
                        That didn&apos;t send. Try again, or email
                        hello@executiveaisolutions.com directly.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* ── what happens after send — a true sequence, so the numbers earn it ── */}
      <section className="ct-steps py-fib-6 md:py-fib-7">
        <div className="wrap">
          <h2 data-anim="step" className="t-display-lg max-w-[14ch]">
            What happens next
          </h2>
          <div className="mt-fib-4 md:mt-fib-5">
            <ProcessCards steps={STEPS} anim="step" />
          </div>
          <div data-anim="step" className="mt-fib-6 flex flex-wrap items-center gap-fib-3">
            <CTA href="/pricing#estimate" label="Price it first, if you'd rather" tone="ink" />
            <span className="t-meta text-ink/60">
              The estimator gives you a live number before you ever send a message
            </span>
          </div>
        </div>
      </section>
    </article>
  );
}
