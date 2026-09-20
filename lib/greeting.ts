/* THE DAY LINE AND THE RETURN — Huge's mechanism (decodes/hugeinc.md §3):
   under "Hello." a line picked by Date().getDay() from a four-key day
   table, replaced from the second visit by an escalating return-visit
   table with its own door label. Ours, in the honest-capacity register
   (never quippy — the buyer is an owner, decisions.md 2026-09-19), and
   on PHOENIX time: the room speaks to the visitor in front of it, not
   to the server that happened to build the page.

   THE PERSONAL MESSAGE IS THE TITLE (2026-09-20, branch hero/greeting,
   final settle of the day — Jake, correcting an inversion of his own
   instruction: "no, the basic one is for FIRST time visit. i want the
   hero to be centered around these personal messages, i want it to be
   the big thing"). Three earlier shapes today are superseded and live
   only in git: the greeting itself made the whole h1 with no separate
   claim; the card removed for a bigger title; the day line's own second
   sentence promoted into the title as a stroked, arrowed link. What
   ships: the h1 is the PERSONAL MESSAGE — on a first visit (no signal
   yet) that message is simply `TITLE`, the site's own claim, no cyan
   lead; from the second visit it is the escalating return-visit line
   (cyan lead) — the site recognising you. The honest-capacity day line
   sits under it, always, as `sub`, and the door is its own pill under
   that again. `Greeting` is `{ title, sub, door }`; `splitLead` (below,
   exported) is the ONE place either line is cut into its cyan lead and
   white rest — the claim has no ". " to split on, so it falls through
   with `lead: null` (no cyan) by construction, not by a special case in
   the caller.

   THE PERSONA TABLE (the ad's own `?i=`/`?svc=` label, lib/persona.ts,
   already captured sitewide — components/persona-capture.tsx) would
   change the FIRST-VISIT title on an ad click, matching the pre-room
   personalized hero this room replaced; it is designed, not built:
   `pickGreeting` already takes `persona` so this can land without
   another signature change, but today every first-time visitor sees
   the same `TITLE` regardless of `persona.i`/`persona.svc`.

   BOUNDARY CASES (read, not run — the callers are pure and total):
     dayKey  — Sun -> weekend, Mon -> monday, Thu -> midweek, Fri -> friday
               (Tue/Wed also midweek, Sat also weekend: the default arm).
     pickGreeting — visits <= 1 -> title `TITLE` (no persona table yet),
               door "See your price"; 2 -> title "Back again.…", same
               door; 3 -> title "Third visit.…", door "Book the call";
               9 (the localStorage cap) and every visit above 4 -> title
               "You keep coming back.…", same door as visit 3 — the
               escalation has nowhere further to go. `sub` (the day
               line) is the SAME string at every visit count — only
               `title` and `door` change.
     splitLead — no ". " found -> `{ lead: null, rest: text }` (the
               claim's own path); every real greeting line has a lead. */

export type Door = { label: string; href: string };
export type Greeting = { title: string; sub: string; door: Door };
export type DayKey = "monday" | "midweek" | "friday" | "weekend";
/* lib/persona.ts's own shape, re-declared here rather than imported, so
   this file has no dependency on where persona capture happens to live
   — `pickGreeting`'s caller (components/dark/hero-room.tsx) imports the
   real type and passes a real value; a plain object literal ({i:null,
   svc:null}) satisfies this from the server, where persona can't exist. */
export type Persona = { i: string | null; svc: "ai" | "websites" | null };

/* THE CLAIM — §02's own positioning sentence (THE OFFER, 2026-09-14),
   sentence case. What a first-time, no-persona visitor sees as the
   title until the persona table above lands. "Shorten copy, never the
   size" (the final settle's own rule, room.css's own note): at the
   118px rung this is the longest of the four titles the h1 ever shows,
   and §02's exact wording ("Websites, automation and ads for owner-run
   businesses.") measured THREE lines at the h1's 22ch — "Websites" ->
   "Sites" (one word shorter, same meaning, "owner-run businesses"
   untouched) measures exactly two. */
export const TITLE = "Sites, automation and ads for owner-run businesses.";

const DAY_LINES: Record<DayKey, string> = {
  monday: "Monday. Quotes go out Wednesday.",
  midweek: "Midweek. A call today, a quote in two days.",
  friday: "Friday. Start the plan this weekend.",
  weekend: "Weekend. We reply Monday morning.",
};

const DEFAULT_DOOR: Door = { label: "See your price", href: "/pricing#estimate" };
const CALL_DOOR: Door = { label: "Book the call", href: "/contact" };

/* one row per RETURN visit, indexed by visits - 2 (so 2nd visit = [0]) —
   clamped to the last row for every visit past the third, which is
   also where the localStorage cap (9) always lands. */
const RETURN_TITLES: { title: string; door: Door }[] = [
  { title: "Back again. Sixty seconds to a price.", door: DEFAULT_DOOR },
  { title: "Third visit. Twenty minutes to a call.", door: CALL_DOOR },
  { title: "You keep coming back. Let's talk.", door: CALL_DOOR },
];

/* THE CYAN LEAD — the first sentence of a greeting-shaped line (a day
   word, or a return visit's own label) is the accent; the rest is
   white. Shared by both `title` (when it's a greeting, not the claim)
   and `sub` (always a day line, always has a lead) so the "no cyan
   without a real sentence-lead" rule can't drift between the two.
   `rest` keeps its OWN leading space when a lead exists (e.g. "
   We reply Monday morning."), so the caller can render
   `{lead && <span>{lead}</span>}{rest}` with no extra glue. */
export function splitLead(text: string): { lead: string | null; rest: string } {
  const i = text.indexOf(". ");
  if (i === -1) return { lead: null, rest: text };
  return { lead: text.slice(0, i + 1), rest: text.slice(i + 1) };
}

export function dayKey(now: Date): DayKey {
  /* Intl, not now.getDay(): getDay() reads the BUILD/BROWSER's own
     timezone, and a visitor's Monday morning is still Sunday night on
     a server in a different zone — Phoenix is fixed on purpose (no DST
     to drift the boundary either). */
  const short = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    weekday: "short",
  }).format(now);
  switch (short) {
    case "Mon":
      return "monday";
    case "Tue":
    case "Wed":
    case "Thu":
      return "midweek";
    case "Fri":
      return "friday";
    default:
      // "Sat" / "Sun"
      return "weekend";
  }
}

export function pickGreeting(visits: number, persona: Persona, now: Date): Greeting {
  // `persona` is accepted, not yet read — see THE PERSONA TABLE above.
  void persona;
  const sub = DAY_LINES[dayKey(now)];
  if (visits <= 1) {
    return { title: TITLE, sub, door: DEFAULT_DOOR };
  }
  const idx = Math.min(visits - 2, RETURN_TITLES.length - 1);
  const { title, door } = RETURN_TITLES[idx];
  return { title, sub, door };
}

/* THE REPLY LINE (2026-09-20, THE LIVE TILE) — the hero's tile carries a
   second honest promise beside the day line, keyed to the SAME Phoenix
   clock plus the hour, since a reply promise is only true inside
   business hours:
     Mon–Thu, 8:00–17:00 Phoenix -> "REPLIES WITHIN THE HOUR"
     Mon–Thu, outside that       -> "REPLIES TOMORROW 8 AM"
     Fri, before 15:00           -> "REPLIES TODAY UNTIL 3 PM"
     Fri, 15:00 or later         -> "REPLIES MONDAY 8 AM"
     Sat / Sun                   -> "REPLIES MONDAY 8 AM"
   `hour12: false` can render midnight as "24" in some engines — `% 24`
   normalises it. Used by app/page.tsx's LiveTile, ticking on the same
   1s interval as the Phoenix clock so the two never disagree. */
export function replyLine(now: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0") % 24;
  switch (weekday) {
    case "Mon":
    case "Tue":
    case "Wed":
    case "Thu":
      return hour >= 8 && hour < 17 ? "REPLIES WITHIN THE HOUR" : "REPLIES TOMORROW 8 AM";
    case "Fri":
      return hour < 15 ? "REPLIES TODAY UNTIL 3 PM" : "REPLIES MONDAY 8 AM";
    default:
      // "Sat" / "Sun"
      return "REPLIES MONDAY 8 AM";
  }
}
