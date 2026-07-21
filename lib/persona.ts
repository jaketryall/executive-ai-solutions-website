/* The ad click's memory. ?i= (industry campaign) and ?svc= (service
   campaign) label the visitor at the door; sessionStorage carries that
   label through every internal navigation so the pitch stays personal
   after the URL params fall away (review 2026-07-21: the plumber who
   clicked a plumber ad lost his persona at his first click — the money
   page greeted him like a stranger). Session-scoped on purpose: the
   label belongs to the visit, not the browser. */

export type Persona = { i: string | null; svc: "ai" | "websites" | null };

const KEY = "eas:persona";
const NONE: Persona = { i: null, svc: null };

/* idempotent — safe to call from any component that needs the persona
   before reading it, whatever order effects fire in */
export function capturePersona() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const i = params.get("i");
    const s = params.get("svc");
    if (!i && !s) return;
    const prev = getPersona();
    const next: Persona = {
      i: i ?? prev.i,
      svc: s === "ai" || s === "websites" ? s : prev.svc,
    };
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage blocked — the params still work on the page they're on */
  }
}

export function getPersona(): Persona {
  if (typeof window === "undefined") return NONE;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return NONE;
    const p = JSON.parse(raw) as Persona;
    return {
      i: typeof p.i === "string" ? p.i : null,
      svc: p.svc === "ai" || p.svc === "websites" ? p.svc : null,
    };
  } catch {
    return NONE;
  }
}
