"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

// heroFan: front-loads shrink, back-loads spread. Cards "snap" into place at the end.
export const heroFan = CustomEase.create("heroFan", "M0,0 C0.32,0 0.45,0.18 0.6,0.5 0.72,0.76 0.86,0.96 1,1");

// processRule: accelerates past terminal with micro-overshoot, then settles.
export const processRule = CustomEase.create("processRule", "M0,0 C0.35,0 0.5,0.6 0.68,1.05 0.82,1.02 0.95,1 1,1");

// estimatorCounter: linear middle, snap finish. Slot-machine digit roll.
export const estimatorCounter = CustomEase.create("estimatorCounter", "M0,0 C0.1,0.35 0.3,0.68 0.6,0.85 0.82,0.93 0.96,1 1,1");

// actionTagShuffle: abrupt start, soft end. For cursor-verb character morph.
export const actionTagShuffle = CustomEase.create("actionTagShuffle", "M0,0 C0.05,0.45 0.2,0.82 0.45,0.95 0.7,1 1,1 1,1");

// sectionDeliver: slow start, fast middle, soft end for IN TRANSIT → DELIVERED morph.
export const sectionDeliver = CustomEase.create("sectionDeliver", "M0,0 C0.15,0 0.55,0.85 0.75,0.98 0.88,1 1,1 1,1");

// Ease registry — use these names everywhere, never a literal string.
export const eases = {
  heroFan,
  processRule,
  estimatorCounter,
  actionTagShuffle,
  sectionDeliver,
} as const;

export type EaseName = keyof typeof eases;
