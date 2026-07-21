"use client";

import { useEffect } from "react";
import { capturePersona } from "@/lib/persona";

/* invisible: writes the ad's ?i=/?svc= label into sessionStorage on load
   so the label survives internal navigation (lib/persona.ts) */
export function PersonaCapture() {
  useEffect(() => {
    capturePersona();
  }, []);
  return null;
}
