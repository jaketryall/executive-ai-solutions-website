"use client";

import { useEffect, useRef, useState } from "react";
import { Monogram } from "@/components/ui/monogram";

/* The ask-this-site chat, live — the stage-03 demo made real. A quiet pill
   (no glowing dots), a paper panel in the house skin, the same chat-b
   bubble grammar the services demo uses. The services card's "this one's
   real" line opens it via the eas:chat-open event. Conversation survives
   soft navigation through sessionStorage. */

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Ask about prices, timelines, or how any of it works. I answer from this site's own pages, and a human reads every conversation.";

const CHIPS = [
  "What does a website cost?",
  "How do the ads work?",
  "What is the AI follow-up?",
];

const STORE = "eas-chat";

export function SiteChat() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // arrive quietly, after the page has had its entrance beat
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1600);
    try {
      const saved = sessionStorage.getItem(STORE);
      if (saved) setMsgs(JSON.parse(saved) as Msg[]);
    } catch {
      /* fresh start */
    }
    const onOpen = () => {
      setOpen(true);
      setReady(true);
    };
    window.addEventListener("eas:chat-open", onOpen);
    return () => {
      clearTimeout(t);
      window.removeEventListener("eas:chat-open", onOpen);
    };
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-16)));
    } catch {
      /* storage full/blocked — the chat still works */
    }
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy, open]);

  useEffect(() => {
    if (!open) return;
    // the input takes focus once the capsule has finished growing —
    // focusing mid-morph would yank the browser past the animation
    const t = setTimeout(() => inputRef.current?.focus(), 420);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const send = async (text: string) => {
    const content = text.trim().slice(0, 600);
    if (!content || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content }];
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
      const reply =
        data.reply ??
        data.error ??
        "That one didn't go through — try again, or use the contact page.";
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "That one didn't go through — try again, or email hello@executiveaisolutions.com.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="schat">
      <button
        type="button"
        className={`schat-pill ${ready ? "is-in" : ""} ${open ? "is-open" : ""}`}
        aria-expanded={open}
        aria-label="Ask this site a question"
        onClick={() => setOpen(true)}
      >
        <Monogram className="h-[15px] w-[15px]" />
        <span>Ask</span>
      </button>

      {/* always mounted — the capsule→card morph plays both directions */}
      <div
        className={`schat-panel ${open ? "is-open" : ""}`}
        role="dialog"
        aria-label="Ask this site"
        aria-hidden={!open}
      >
        <header className="schat-head">
          <Monogram className="h-[14px] w-[14px] opacity-70" />
          <div className="min-w-0">
            <p className="text-[0.9375rem] font-semibold leading-none">
              Ask this site
            </p>
            <p className="t-meta mt-[4px] text-ink/50">
              The chat we sell, answering live
            </p>
          </div>
          <button
            type="button"
            className="schat-x"
            aria-label="Close the chat"
            onClick={() => setOpen(false)}
          >
            <svg viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M1.5 1.5l9 9m0-9l-9 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

          <div className="schat-scroll" ref={scrollRef} aria-live="polite">
            <div className="chat-b chat-b--bot">
              <p>{GREETING}</p>
            </div>
            {msgs.length === 0 && (
              <div className="schat-chips">
                {CHIPS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="schat-chip"
                    onClick={() => send(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`chat-b ${m.role === "user" ? "chat-b--user" : "chat-b--bot"}`}
              >
                <p>{m.content}</p>
              </div>
            ))}
            {busy && (
              <div className="chat-b chat-b--bot chat-b--typing" aria-label="Answering">
                <span className="ct-dot" />
                <span className="ct-dot" />
                <span className="ct-dot" />
              </div>
            )}
          </div>

          <form
            className="schat-form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              ref={inputRef}
              type="text"
              name="schat-q"
              className="schat-input"
              placeholder="Ask about prices, timing, anything"
              aria-label="Your question"
              maxLength={600}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={busy}
            />
            <button
              type="submit"
              className="schat-send"
              disabled={busy || !input.trim()}
              aria-label="Send"
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M2 8h11M9 3.5 13.5 8 9 12.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
      </div>
    </div>
  );
}
