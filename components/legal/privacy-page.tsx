"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";
import { whenArrived } from "@/components/anim/arrival";
import { revealUp } from "@/components/anim/reveal";

/* Privacy — a plain-language policy in the site's own voice, honest to what
   the site actually does: a contact form (emailed via Resend), the
   ask-this-site chat (sent to Anthropic to answer), and the free site audit
   (fetches the public URL you give it). No tracking cookies, no analytics,
   nothing sold. Reveals the nav on arrival like every interior page. */

const UPDATED = "August 8, 2026";

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  {
    h: "The short version",
    body: (
      <>
        We collect only what you send us so we can reply and do the work.
        We don&rsquo;t run tracking cookies or analytics on this site, we
        don&rsquo;t sell your information, and you can ask us to delete
        anything you&rsquo;ve sent at any time.
      </>
    ),
  },
  {
    h: "What we collect",
    body: (
      <>
        <p>Only what you choose to give us:</p>
        <ul>
          <li>
            <b>The contact and estimate forms.</b> Your name, email, business,
            and message, plus any estimate details you build. This goes
            straight to our inbox.
          </li>
          <li>
            <b>The &ldquo;ask this site&rdquo; chat.</b> The messages you type
            are sent to our AI provider to generate a reply. Don&rsquo;t put
            anything sensitive in it.
          </li>
          <li>
            <b>The free site audit.</b> The website address you enter, which we
            fetch and analyze. We only read what&rsquo;s publicly on that page.
          </li>
        </ul>
        <p>
          That&rsquo;s it. We don&rsquo;t set tracking cookies, we don&rsquo;t
          run advertising or analytics scripts, and we don&rsquo;t build a
          profile of you.
        </p>
      </>
    ),
  },
  {
    h: "How we use it",
    body: (
      <>
        To answer you, prepare a quote, run the audit or chat you asked for,
        and keep a record of our conversation so we can pick it back up. That
        is the only reason we hold any of it.
      </>
    ),
  },
  {
    h: "Who processes it",
    body: (
      <>
        <p>
          We keep the work in a few trusted services, each handling one job:
        </p>
        <ul>
          <li>
            <b>Resend</b> delivers the form emails to us.
          </li>
          <li>
            <b>Anthropic</b> powers the chat and receives the messages you send
            it.
          </li>
          <li>
            <b>Vercel</b> hosts the site and processes standard server request
            logs.
          </li>
        </ul>
        <p>
          They act on our behalf and only for these purposes. We never sell or
          rent your information to anyone.
        </p>
      </>
    ),
  },
  {
    h: "How long we keep it",
    body: (
      <>
        Form messages stay in our inbox as long as they&rsquo;re useful for
        working together, then get cleared out. Chat and audit inputs aren&rsquo;t
        stored beyond generating your answer. Ask us to delete anything and we
        will.
      </>
    ),
  },
  {
    h: "Your choices",
    body: (
      <>
        Email us at{" "}
        <a href="mailto:jaker@executiveaisolutions.com" className="u-link">
          jaker@executiveaisolutions.com
        </a>{" "}
        to see what we hold about you, correct it, or have it deleted.
        There&rsquo;s no account to manage and no marketing list to leave.
      </>
    ),
  },
  {
    h: "Changes",
    body: (
      <>
        If this policy changes, we&rsquo;ll update the date below. Material
        changes will be obvious on this page.
      </>
    ),
  },
];

export function PrivacyPage() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const nav = document.querySelector(".site-nav");

      if (reducedMotion()) {
        if (nav) gsap.set(nav, { autoAlpha: 1 });
        gsap.set(q("[data-anim]"), { autoAlpha: 1, y: 0 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        return;
      }

      const enter = contextSafe!(() => {
        const tl = gsap.timeline({ defaults: { ease: EASE_STRUCTURE } });
        if (nav) tl.to(nav, { autoAlpha: 1, duration: 0.6, ease: EASE_UI }, 0.1);
        tl.fromTo(
          q(".pv-hero .mask-inner"),
          { yPercent: 118, y: 0 },
          { yPercent: 0, y: 0, duration: 0.95, stagger: 0.09 },
          "<"
        ).fromTo(
          q("[data-anim='h-sub']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          "-=0.5"
        );
      });
      let dead = false;
      whenArrived().then(() => !dead && enter());

      revealUp(q("[data-anim='sec']"), q(".pv-body")[0], { stagger: 0.06 });

      return () => {
        dead = true;
      };
    },
    { scope: root }
  );

  return (
    <article ref={root} className="overflow-x-clip">
      <div className="wrap pb-fib-6 pt-fib-7 md:pt-[176px]">
        <header className="pv-hero max-w-[24ch]">
          <h1 className="t-display-title">
            <span className="mask-line">
              <span className="mask-inner">Privacy</span>
            </span>
          </h1>
          <p data-anim="h-sub" className="t-lede mt-fib-3 max-w-[46ch] text-ink/70">
            What we collect, why, and how to have it removed. Plain language,
            no surprises.
          </p>
          <p data-anim="h-sub" className="t-meta mt-fib-2 text-ink/45">
            Last updated {UPDATED}
          </p>
        </header>

        <div className="pv-body mt-fib-6 flex max-w-[760px] flex-col gap-fib-5">
          {SECTIONS.map((s) => (
            <section key={s.h} data-anim="sec" className="pv-sec">
              <h2 className="t-title--lg font-display">{s.h}</h2>
              <div className="pv-prose mt-fib-2 text-ink/75">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
