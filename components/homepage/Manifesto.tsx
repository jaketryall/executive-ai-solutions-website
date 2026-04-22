"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  CustomEase.create("appleOut", "0.16, 1, 0.3, 1");
  CustomEase.create("appleSnap", "0.76, 0, 0.24, 1");
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SIGNATURE_PATH = "M60,160 C65,100 80,60 95,55 C115,48 110,100 108,130 C105,165 90,200 80,210 Q70,220 85,215 C110,205 135,160 155,155 C175,150 170,185 160,200 Q148,218 165,210 C185,200 195,175 210,165 Q230,152 225,180 C220,205 200,225 195,218 Q188,208 210,195 C225,186 250,175 270,200 Q275,208 265,208 C250,208 280,170 310,120 C325,95 340,75 350,70 Q365,64 358,90 C350,120 335,165 340,185 Q345,200 360,185 C375,168 385,145 400,155 Q408,160 400,178 C390,200 365,230 360,248 Q355,265 370,250 C390,228 410,195 430,188 Q445,182 442,200 C438,215 425,225 435,220 Q450,212 460,140 L462,210 Q465,130 475,128 L477,210 C485,205 520,188 560,182 Q600,176 620,190";

// Mantra — split into phrases so we can reveal it in two moves.
const MANTRA = {
  lead: "I don't just build websites.",
  punch: "I build unfair advantages.",
};

type Service = {
  number: string;
  name: string;
  tagline: string;
  desc: string;
  image: string;
  imageAlt: string;
  bullets: string[];
};

const SERVICES: Service[] = [
  {
    number: "01",
    name: "Conversion Websites",
    tagline: "Every scroll earns its place.",
    desc: "Sites built with conversion architecture from the first wireframe. Every section has to defend its spot — or it gets cut.",
    image: "/Celestial Laptop Mockup.webp",
    imageAlt: "Conversion website mockup",
    bullets: ["Wireframe → design → launch in 4 weeks", "Built on Next.js · Sanity CMS", "Analytics + A/B baked in"],
  },
  {
    number: "02",
    name: "AI Automations",
    tagline: "Back-office that runs on its own.",
    desc: "Inbox triage, lead routing, content pipelines. Workflows that do the 10 small things you keep forgetting.",
    image: "/custom-dashboard-mockup.webp",
    imageAlt: "AI automation dashboard",
    bullets: ["n8n / OpenAI / custom webhooks", "Slack + CRM + inbox integration", "Replaces 8 hrs/week of admin"],
  },
  {
    number: "03",
    name: "Custom Software",
    tagline: "One system instead of twelve tabs.",
    desc: "Internal tools and dashboards shaped to your operation. One login, one schema, one place your team actually looks.",
    image: "/Elegant Black Laptop Mockup.webp",
    imageAlt: "Custom software dashboard",
    bullets: ["Next.js · Supabase · role-based auth", "Purpose-built, not SaaS-bent", "Owned by you, deployed by me"],
  },
];

export default function Manifesto() {
  const desktopRef = useRef<HTMLElement>(null);
  const desktopSigRef = useRef<SVGPathElement>(null);
  const mantraRef = useRef<HTMLDivElement>(null);
  const serviceStackRef = useRef<HTMLDivElement>(null);

  const mobileRef = useRef<HTMLElement>(null);
  const mobileSigRef = useRef<SVGPathElement>(null);
  const mobileMantraRef = useRef<HTMLDivElement>(null);

  // Desktop — pinned mantra reveal + stacking service cards
  useIsomorphicLayoutEffect(() => {
    const section = desktopRef.current;
    const mantraWrap = mantraRef.current;
    const stackWrap = serviceStackRef.current;
    const sig = desktopSigRef.current;
    if (!section || !mantraWrap || !stackWrap) return;

    // SplitText instances — tracked so we can .revert() on cleanup to
    // prevent React reconciliation conflicts with our DOM mutations.
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      // ==== MANTRA ==== Pin the mantra section for ~1 viewport of scroll so
      // it breathes. SplitText the two lines into words and reveal them in
      // sequence, then fade out as the user scrolls into the service stack.
      const leadEl = mantraWrap.querySelector<HTMLElement>(".m-lead");
      const punchEl = mantraWrap.querySelector<HTMLElement>(".m-punch");
      const eyebrowEl = mantraWrap.querySelector<HTMLElement>(".m-eyebrow");
      const sublineEl = mantraWrap.querySelector<HTMLElement>(".m-subline");

      let leadSplit: SplitText | null = null;
      let punchSplit: SplitText | null = null;
      if (leadEl) {
        leadSplit = new SplitText(leadEl, { type: "words", wordsClass: "m-word" });
        splits.push(leadSplit);
      }
      if (punchEl) {
        punchSplit = new SplitText(punchEl, { type: "words", wordsClass: "m-word m-word-punch" });
        splits.push(punchSplit);
      }

      // Starting state — all hidden below
      if (leadSplit) gsap.set(leadSplit.words, { yPercent: 110, opacity: 0 });
      if (punchSplit) gsap.set(punchSplit.words, { yPercent: 110, opacity: 0 });
      if (eyebrowEl) gsap.set(eyebrowEl, { opacity: 0, y: 12 });
      if (sublineEl) gsap.set(sublineEl, { opacity: 0, y: 16 });

      // Timeline pinned to the mantra section entry.
      const mantraTl = gsap.timeline({
        scrollTrigger: {
          trigger: mantraWrap,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      if (eyebrowEl) mantraTl.to(eyebrowEl, { opacity: 1, y: 0, ease: "appleOut", duration: 0.3 }, 0);
      if (leadSplit) {
        mantraTl.to(
          leadSplit.words,
          { yPercent: 0, opacity: 1, stagger: 0.04, ease: "appleOut", duration: 0.8 },
          0.1
        );
      }
      if (punchSplit) {
        mantraTl.to(
          punchSplit.words,
          { yPercent: 0, opacity: 1, stagger: 0.05, ease: "appleOut", duration: 0.9 },
          0.6
        );
      }
      if (sublineEl) mantraTl.to(sublineEl, { opacity: 1, y: 0, ease: "appleOut", duration: 0.5 }, 1.3);

      // Hold then fade out as user scrolls toward the service stack
      mantraTl.to(
        [leadEl, punchEl, eyebrowEl, sublineEl].filter(Boolean),
        { opacity: 0, y: -30, ease: "appleSnap", duration: 0.6 },
        2.2
      );

      // Signature draw — concurrent with mantra reveal, subtle background
      if (sig) {
        const length = sig.getTotalLength();
        gsap.set(sig, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(sig, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: mantraWrap,
            start: "top 80%",
            end: "+=80%",
            scrub: 1,
          },
        });
      }

      // ==== SERVICE STACK ==== Cards stack on top of each other as the user
      // scrolls. Each card is pinned when it hits `start`, then unpinned when
      // the next card starts. Creates the Apple-style layered reveal feel.
      const cards = gsap.utils.toArray<HTMLElement>(stackWrap.querySelectorAll(".m-service-card"));

      cards.forEach((card, i) => {
        const isLast = i === cards.length - 1;

        // Pin each card (except the last one only gets a partial pin)
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          end: isLast ? "+=50%" : "bottom top",
          pin: true,
          pinSpacing: isLast ? true : false,
        });

        // Content reveal within each card — SplitText on name + fade of body
        const nameEl = card.querySelector<HTMLElement>(".ms-name");
        const taglineEl = card.querySelector<HTMLElement>(".ms-tagline");
        const descEl = card.querySelector<HTMLElement>(".ms-desc");
        const imageEl = card.querySelector<HTMLElement>(".ms-image");
        const bulletsEl = card.querySelector<HTMLElement>(".ms-bullets");
        const numberEl = card.querySelector<HTMLElement>(".ms-number");

        if (nameEl) {
          const split = new SplitText(nameEl, { type: "chars", charsClass: "ms-char" });
          splits.push(split);
          gsap.set(split.chars, { yPercent: 110, opacity: 0 });
          gsap.to(split.chars, {
            yPercent: 0,
            opacity: 1,
            stagger: 0.018,
            duration: 0.7,
            ease: "appleOut",
            scrollTrigger: {
              trigger: card,
              start: "top 75%",
              end: "top 25%",
              scrub: 0.6,
            },
          });
        }

        [taglineEl, descEl, bulletsEl, numberEl].forEach((el, idx) => {
          if (!el) return;
          gsap.fromTo(
            el,
            { y: 26, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: "appleOut",
              scrollTrigger: {
                trigger: card,
                start: `top ${70 - idx * 5}%`,
                end: `top ${30 - idx * 3}%`,
                scrub: 0.6,
              },
            }
          );
        });

        // Image — scale + parallax within the card
        if (imageEl) {
          gsap.fromTo(
            imageEl,
            { scale: 1.12, y: 40 },
            {
              scale: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "top top",
                scrub: true,
              },
            }
          );
        }

        // Fade out the previous card's content as this one pins in
        if (i > 0) {
          const prev = cards[i - 1];
          gsap.to(prev, {
            opacity: 0.3,
            scale: 0.96,
            ease: "appleSnap",
            scrollTrigger: {
              trigger: card,
              start: "top 60%",
              end: "top 0%",
              scrub: 0.6,
            },
          });
        }
      });
    }, section);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  // Mobile — simpler: SplitText mantra reveal, then static service list
  useIsomorphicLayoutEffect(() => {
    const section = mobileRef.current;
    const mantraWrap = mobileMantraRef.current;
    const sig = mobileSigRef.current;
    if (!section || !mantraWrap) return;

    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      const leadEl = mantraWrap.querySelector<HTMLElement>(".m-lead");
      const punchEl = mantraWrap.querySelector<HTMLElement>(".m-punch");
      let leadSplit: SplitText | null = null;
      let punchSplit: SplitText | null = null;
      if (leadEl) {
        leadSplit = new SplitText(leadEl, { type: "words", wordsClass: "m-word" });
        splits.push(leadSplit);
      }
      if (punchEl) {
        punchSplit = new SplitText(punchEl, { type: "words", wordsClass: "m-word" });
        splits.push(punchSplit);
      }

      if (leadSplit) {
        gsap.set(leadSplit.words, { yPercent: 110, opacity: 0 });
        gsap.to(leadSplit.words, {
          yPercent: 0,
          opacity: 1,
          stagger: 0.04,
          ease: "appleOut",
          duration: 0.7,
          scrollTrigger: {
            trigger: leadEl,
            start: "top 85%",
            end: "top 40%",
            scrub: 0.7,
          },
        });
      }
      if (punchSplit) {
        gsap.set(punchSplit.words, { yPercent: 110, opacity: 0 });
        gsap.to(punchSplit.words, {
          yPercent: 0,
          opacity: 1,
          stagger: 0.05,
          ease: "appleOut",
          duration: 0.7,
          scrollTrigger: {
            trigger: punchEl,
            start: "top 85%",
            end: "top 40%",
            scrub: 0.7,
          },
        });
      }

      if (sig) {
        const length = sig.getTotalLength();
        gsap.set(sig, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(sig, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 100%",
            end: "top 65%",
            scrub: 1,
          },
        });
      }
    }, section);

    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  const signatureSvg = (ref: React.RefObject<SVGPathElement | null>) => (
    <svg
      viewBox="30 30 630 250"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      style={{ height: "auto", opacity: 0.1 }}
    >
      <path
        ref={ref}
        d={SIGNATURE_PATH}
        stroke="rgba(26, 24, 22, 1)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  const mantraBlock = (
    <>
      <p
        className="m-eyebrow"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "0.68rem",
          fontWeight: 600,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(26,24,22,0.45)",
          marginBottom: "clamp(2rem, 4vh, 3rem)",
        }}
      >
        [ Manifesto · 01 ]
      </p>
      <div
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "clamp(2.75rem, 7.5vw, 8rem)",
          fontWeight: 900,
          lineHeight: 0.98,
          letterSpacing: "-0.045em",
          color: "#1a1816",
        }}
      >
        <div
          className="m-lead inline-block overflow-hidden"
          style={{ maxWidth: "18ch" }}
        >
          {MANTRA.lead}
        </div>
        <br />
        <div
          className="m-punch inline-block overflow-hidden"
          style={{ color: "rgba(26,24,22,0.45)", maxWidth: "22ch" }}
        >
          {MANTRA.punch}
        </div>
      </div>
      <p
        className="m-subline"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "clamp(0.95rem, 1.1vw, 1.15rem)",
          fontWeight: 500,
          color: "rgba(26,24,22,0.55)",
          marginTop: "clamp(2rem, 4vh, 3rem)",
          maxWidth: 560,
          lineHeight: 1.55,
          letterSpacing: "-0.005em",
        }}
      >
        Three services. One person. Every project gets my full attention, my real
        stack, and a real outcome. No agency overhead, no filler.
      </p>
    </>
  );

  return (
    <>
      {/* ===== MOBILE ===== */}
      <section
        ref={mobileRef}
        className="relative md:hidden overflow-hidden"
        data-bg="cream"
        style={{ padding: "10vh 1.5rem 12vh" }}
      >
        <div ref={mobileMantraRef} className="relative">
          {mantraBlock}
        </div>

        {/* Mobile service list — simpler, non-pinned */}
        <div
          className="relative mt-16 flex flex-col"
          style={{ gap: "clamp(2.5rem, 6vh, 4rem)" }}
        >
          {SERVICES.map((s) => (
            <article key={s.number} className="group">
              <div
                className="relative overflow-hidden"
                style={{
                  borderRadius: "clamp(1.25rem, 4vw, 1.75rem)",
                  aspectRatio: "4/3",
                  border: "1px solid rgba(26,24,22,0.08)",
                  marginBottom: "1.25rem",
                }}
              >
                <Image src={s.image} alt={s.imageAlt} fill className="object-cover" sizes="100vw" />
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    color: "rgba(26,24,22,0.4)",
                  }}
                >
                  {s.number}
                </span>
                <span
                  style={{
                    width: 20,
                    height: 1,
                    backgroundColor: "rgba(26,24,22,0.3)",
                  }}
                />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "clamp(1.5rem, 6vw, 2rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                  color: "#1a1816",
                  marginBottom: "0.5rem",
                }}
              >
                {s.name}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.88rem",
                  fontWeight: 500,
                  color: "rgba(26,24,22,0.5)",
                  marginBottom: "0.85rem",
                }}
              >
                {s.tagline}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.92rem",
                  lineHeight: 1.55,
                  color: "rgba(26,24,22,0.65)",
                }}
              >
                {s.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ===== DESKTOP ===== */}
      <section
        ref={desktopRef}
        className="relative hidden md:block"
        data-bg="cream"
      >
        {/* ---- Pinned mantra moment ---- */}
        <div
          ref={mantraRef}
          className="relative flex items-center overflow-hidden"
          style={{ height: "100vh", backgroundColor: "#f3f1ee" }}
        >
          {/* Signature — faded background behind mantra */}
          <div
            className="absolute top-[12vh] left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ width: "clamp(500px, 75vw, 1200px)", zIndex: 0 }}
          >
            {signatureSvg(desktopSigRef)}
          </div>

          <div
            className="relative z-10 max-w-[1400px] mx-auto w-full"
            style={{ padding: "0 clamp(2rem, 5vw, 5rem)" }}
          >
            {mantraBlock}
          </div>
        </div>

        {/* ---- Stacking service cards ----
            Each card pins when it hits the top of the viewport; the next
            card slides up over it, causing the previous one to fade / scale
            down. Creates the Apple-style layered service reveal. */}
        <div ref={serviceStackRef} className="relative">
          {SERVICES.map((s, i) => (
            <article
              key={s.number}
              className="m-service-card relative flex items-center overflow-hidden"
              style={{
                height: "100vh",
                backgroundColor: i % 2 === 0 ? "#f3f1ee" : "#ebe7df",
                zIndex: 10 + i,
              }}
            >
              <div
                className="w-full max-w-[1400px] mx-auto grid grid-cols-[1fr_1.1fr] gap-12 xl:gap-20 items-center"
                style={{ padding: "clamp(10vh, 14vh, 16vh) clamp(2rem, 5vw, 5rem)" }}
              >
                {/* Left — copy + bullets */}
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-4" style={{ marginBottom: "clamp(2rem, 4vh, 3rem)" }}>
                    <span
                      className="ms-number"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "clamp(4rem, 6vw, 6rem)",
                        fontWeight: 900,
                        lineHeight: 0.85,
                        letterSpacing: "-0.05em",
                        color: "rgba(26,24,22,0.18)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {s.number}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        height: 1,
                        backgroundColor: "rgba(26,24,22,0.12)",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: "rgba(26,24,22,0.4)",
                      }}
                    >
                      0{SERVICES.length} services
                    </span>
                  </div>

                  <h3
                    className="ms-name"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "clamp(3rem, 6vw, 5.5rem)",
                      fontWeight: 900,
                      letterSpacing: "-0.04em",
                      lineHeight: 0.95,
                      color: "#1a1816",
                      marginBottom: "clamp(1rem, 2vh, 1.5rem)",
                      overflow: "hidden",
                    }}
                  >
                    {s.name}
                  </h3>

                  <p
                    className="ms-tagline"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "clamp(1.1rem, 1.4vw, 1.4rem)",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      color: "rgba(26,24,22,0.55)",
                      marginBottom: "clamp(1.5rem, 3vh, 2.25rem)",
                    }}
                  >
                    {s.tagline}
                  </p>

                  <p
                    className="ms-desc"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "clamp(0.95rem, 1.1vw, 1.15rem)",
                      lineHeight: 1.55,
                      color: "rgba(26,24,22,0.65)",
                      marginBottom: "clamp(2rem, 4vh, 2.5rem)",
                      maxWidth: 520,
                    }}
                  >
                    {s.desc}
                  </p>

                  <ul
                    className="ms-bullets flex flex-col"
                    style={{ gap: "0.65rem" }}
                  >
                    {s.bullets.map((b, bi) => (
                      <li
                        key={bi}
                        className="flex items-center gap-3"
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.92rem",
                          fontWeight: 500,
                          color: "rgba(26,24,22,0.6)",
                          letterSpacing: "-0.005em",
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            backgroundColor: "rgba(26,24,22,0.45)",
                          }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right — large image with scale-in parallax */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    borderRadius: "clamp(1rem, 1.5vw, 1.5rem)",
                    aspectRatio: "4/3",
                    border: "1px solid rgba(26,24,22,0.08)",
                    boxShadow: "0 40px 80px -30px rgba(0,0,0,0.2), 0 20px 40px -15px rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="ms-image absolute inset-0 will-change-transform">
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
