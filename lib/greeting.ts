/* THE DAY LINE AND THE RETURN — Huge's mechanism (decodes/hugeinc.md §3):
   under "Hello." a line picked by Date().getDay() from a four-key day
   table, replaced from the second visit by an escalating return-visit
   table with its own door label. Ours, in the honest-capacity register
   (never quippy — the buyer is an owner, decisions.md 2026-09-19), and
   on PHOENIX time: the room speaks to the visitor in front of it, not
   to the server that happened to build the page.

   BOUNDARY CASES (read, not run — the callers are pure and total):
     dayKey  — Sun -> weekend, Mon -> monday, Thu -> midweek, Fri -> friday
               (Tue/Wed also midweek, Sat also weekend: the default arm).
     pickGreeting — visits <= 1 -> the day line, door "See your price";
               2 -> "Back again", same door; 3 -> "Third visit", door
               "Book the call" -> /contact; 9 (the localStorage cap) and
               every visit above 4 -> "You keep coming back", same door
               as visit 3 — the escalation has nowhere further to go. */

export type Door = { label: string; href: string };
export type Greeting = { line: string; door: Door };
export type DayKey = "monday" | "midweek" | "friday" | "weekend";

const DAY_LINES: Record<DayKey, string> = {
  monday: "Monday. Quotes go out by Wednesday.",
  midweek: "Midweek. A call today, a fixed quote in two days.",
  friday: "Friday. Book now, start the plan over the weekend.",
  weekend: "Weekend. Book the call now, we reply Monday morning.",
};

const DEFAULT_DOOR: Door = { label: "See your price", href: "/pricing#estimate" };
const CALL_DOOR: Door = { label: "Book the call", href: "/contact" };

/* one row per RETURN visit, indexed by visits - 2 (so 2nd visit = [0]) —
   clamped to the last row for every visit past the third, which is
   also where the localStorage cap (9) always lands. */
const RETURN_LINES: Greeting[] = [
  { line: "Back again. The price takes sixty seconds.", door: DEFAULT_DOOR },
  { line: "Third visit. The call is twenty minutes.", door: CALL_DOOR },
  { line: "You keep coming back. Let's talk.", door: CALL_DOOR },
];

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

export function pickGreeting(visits: number, now: Date): Greeting {
  if (visits <= 1) {
    return { line: DAY_LINES[dayKey(now)], door: DEFAULT_DOOR };
  }
  const idx = Math.min(visits - 2, RETURN_LINES.length - 1);
  return RETURN_LINES[idx];
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
