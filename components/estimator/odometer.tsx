"use client";

import { useEffect, useRef } from "react";
import { gsap, EASE_UI, reducedMotion } from "@/components/anim/ease";

// B12 — mechanical odometer. One value drives every wheel; higher wheels sit on
// their integer and only roll during a carry window near the top of the wheel
// below (C0 high so arbitrary targets never rest part-rolled). Power ease, never
// expo (expo's clamped endpoint snaps the fast wheel on the last frame).
const STRIP = "01234567890"; // 0–9 + duplicate 0 → seamless 9→0 wrap
const C0 = 0.9;
const C1 = 0.99;

function buildWheels(el: HTMLElement, digitCount: number) {
  const groups: string[] = [];
  for (let i = 0; i < digitCount; i++) {
    if (i > 0 && (digitCount - i) % 3 === 0) groups.push('<span class="od-sep">,</span>');
    groups.push(
      `<span class="od-col">${[...STRIP].map((d) => `<span>${d}</span>`).join("")}</span>`
    );
  }
  el.innerHTML = groups.join("");
}

function render(el: HTMLElement, v: number, exact = false) {
  const cols = el.querySelectorAll<HTMLElement>(".od-col");
  const k0 = cols.length - 1;
  cols.forEach((col, i) => {
    const k = k0 - i;
    const place = 10 ** k;
    const base = Math.floor(v / place) % 10;
    let frac: number;
    if (exact) frac = 0;
    else if (k === 0) frac = v % 1;
    else {
      const fl = (v % place) / place;
      frac = Math.min(1, Math.max(0, (fl - C0) / (C1 - C0)));
    }
    col.style.transform = `translateY(${-(base + frac)}em)`;
  });
}

export function Odometer({ value, className = "" }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null!);
  const state = useRef({ v: 0, digits: 0, started: false });
  const tween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = ref.current;
    const target = Math.max(0, Math.round(value));
    const digits = String(target).length;

    if (reducedMotion()) {
      state.current.v = target;
      buildWheels(el, digits);
      render(el, target, true);
      return;
    }

    if (!state.current.started) {
      // first paint: build at rest on the initial value, roll happens on the
      // section's entrance (parent calls nothing; we roll from 0 once mounted)
      state.current.started = true;
      buildWheels(el, digits);
      state.current.digits = digits;
      render(el, 0, true);
    }

    // one live tween at a time — a proxy object per run defeats overwrite,
    // so kill the previous roll explicitly before starting the next
    tween.current?.kill();
    tween.current = gsap.to(state.current, {
      v: target,
      duration: 1.2,
      ease: EASE_UI,
      onUpdate: () => {
        const liveDigits = String(Math.max(1, Math.floor(state.current.v))).length;
        if (liveDigits !== state.current.digits) {
          state.current.digits = liveDigits;
          buildWheels(el, liveDigits);
        }
        render(el, state.current.v);
      },
      onComplete: () => {
        state.current.v = target;
        if (state.current.digits !== digits) {
          state.current.digits = digits;
          buildWheels(el, digits);
        }
        render(el, target, true);
      },
    });
    return () => {
      tween.current?.kill();
    };
  }, [value]);

  return (
    <span className={`od t-num ${className}`} aria-hidden ref={ref} />
  );
}
