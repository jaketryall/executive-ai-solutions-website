"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* THE CARD STACK
   The shape is the popular glass-widget column; the contents are not
   invented telemetry. Works is the real roster, Results is the only client
   result we can actually stand behind (with its timeframe attached), and
   the chat is the live /api/chat assistant — the same one EAS sells. */

const WORK = [
  {
    slug: "desert-wings",
    client: "Desert Wings Flight School",
    kind: "Website · Ads · SEO",
    meta: "Aviation · 2026",
    src: "/work/dw-home.jpg",
  },
  {
    slug: "aahg",
    client: "Arizona Aviation Historical Group",
    kind: "Website",
    meta: "Nonprofit · 2026",
    src: "/work/aahg-hero.jpg",
  },
  {
    slug: "riled-up",
    client: "Riled Up Pickleball",
    kind: "Website · Booking system",
    meta: "Coaching · 2026",
    src: "/work/riled-hero.jpg",
  },
];

const CHIPS = ["What does it cost?", "How fast?"];

type Msg = { role: "user" | "assistant"; content: string };

function Head({ title, href }: { title: string; href?: string }) {
  return (
    <div className="dr-c-head">
      <span className="t-label">{title}</span>
      {href ? (
        <Link href={href} className="dr-c-go" aria-label={`Open ${title}`}>
          ↗
        </Link>
      ) : (
        <span className="dr-c-go" aria-hidden>
          ↗
        </span>
      )}
    </div>
  );
}

export default function HeroCards() {
  const [i, setI] = useState(0);
  const w = WORK[i];
  const step = (d: number) => setI((n) => (n + d + WORK.length) % WORK.length);

  // ── the chat: the real assistant, not a mock ──────────────────
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12) }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content:
            data.reply ??
            data.error ??
            "That didn't go through. Try again, or use the contact page.",
        },
      ]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: "No connection. Try again in a moment." },
      ]);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [msgs, busy]);

  /* SHRINK + STICK. The card docks once you have actually scrolled PAST it,
     watched by a zero-height slot that stays in flow — a scroll-offset
     threshold cannot know that, and the first one I wrote sat beyond this
     page's entire scroll range, so it could never fire. The slot also keeps
     the card's height reserved, so nothing jumps when it leaves flow. */
  const slotRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [docked, setDocked] = useState(false);
  useEffect(() => {
    const slot = slotRef.current;
    const card = chatRef.current;
    if (!slot || !card) return;
    slot.style.minHeight = `${card.offsetHeight}px`;
    const io = new IntersectionObserver(
      ([e]) => setDocked(!e.isIntersecting && e.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(slot);
    return () => io.disconnect();
  }, []);

  return (
    <div className="dr-cards">
      {/* ── WORKS ── */}
      <article className="dr-c dr-edge" data-c="work">
        <Head title="Works" href={`/work/${w.slug}`} />
        <div className="dr-c-shot">
          <Image
            src={w.src}
            alt={`${w.client} website`}
            fill
            sizes="(max-width: 900px) 90vw, 360px"
          />
        </div>
        <b>{w.client}</b>
        <span className="t-meta">
          {w.kind} · {w.meta}
        </span>
        <div className="dr-c-nav">
          <button type="button" aria-label="Previous project" onClick={() => step(-1)}>
            ←
          </button>
          <span className="dr-c-dots" aria-hidden>
            {WORK.map((p, n) => (
              <i key={p.slug} data-on={n === i ? "true" : undefined} />
            ))}
          </span>
          <button type="button" aria-label="Next project" onClick={() => step(1)}>
            →
          </button>
        </div>
      </article>

      {/* ── RESULTS — the only client numbers we can stand behind, with
             the timeframe attached, because a number without one is an ad ── */}
      <article className="dr-c dr-edge" data-c="results">
        <Head title="Results" href="/work/desert-wings" />
        <span className="dr-c-big">1,000+</span>
        <span className="t-meta">page views the new site has served</span>
        <div className="dr-c-split">
          <div>
            <b>Dozens</b>
            <span className="t-meta">contact-form leads</span>
          </div>
          <div>
            <b>Since launch</b>
            <span className="t-meta">Desert Wings</span>
          </div>
        </div>
      </article>

      {/* ── THE CHAT — live, and the product itself ── */}
      <div className="dr-chat-slot" ref={slotRef}>
      <article
        className="dr-c dr-edge dr-chat"
        data-c="chat"
        data-docked={docked ? "true" : undefined}
        ref={chatRef}
      >
        <Head title="Ask this site" />
        <div className="dr-chat-log" ref={logRef} aria-live="polite">
          {msgs.length === 0 ? (
            <p className="t-meta dr-chat-hi">
              Answers from this site&rsquo;s own pages. A human reads every
              conversation.
            </p>
          ) : (
            msgs.map((m, n) => (
              <p key={n} className="dr-chat-msg" data-role={m.role}>
                {m.content}
              </p>
            ))
          )}
          {busy && (
            <p className="dr-chat-msg" data-role="assistant">
              Thinking…
            </p>
          )}
        </div>
        {msgs.length === 0 && (
          <div className="dr-chat-chips">
            {CHIPS.map((c) => (
              <button key={c} type="button" onClick={() => send(c)}>
                {c}
              </button>
            ))}
          </div>
        )}
        <form
          className="dr-chat-row"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question"
            aria-label="Ask this site a question"
          />
          <button type="submit" disabled={busy} aria-label="Send">
            →
          </button>
        </form>
      </article>
      </div>
    </div>
  );
}
