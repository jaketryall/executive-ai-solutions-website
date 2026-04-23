"use client";

import { RefObject, useState } from "react";
import { useScrub, useReveal } from "@/lib/motion/primitives";

type Options = {
  revealSelector?: string;
};

export function useSectionReveal(
  ref: RefObject<HTMLElement | null>,
  opts: Options = {}
) {
  const [progress, setProgress] = useState(0);

  useReveal(ref, { selector: opts.revealSelector ?? "[data-reveal]" });
  useScrub(ref, {
    start: "top 70%",
    end: "bottom 30%",
    onUpdate: setProgress,
  });

  return { progress };
}
