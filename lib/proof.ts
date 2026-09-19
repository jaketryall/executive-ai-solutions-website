/* THE NUMBERS THE PAGE VOUCHES WITH.

   ⚠ PLACEHOLDERS UNTIL JAKE SUPPLIES THE REAL ONES. The site refuses fake
   proof (see decisions.md and the site-check route), so nothing here may
   ship as-is: `rating`, `count` and `url` must come from the live Google
   Business profile, and the hero's rating card renders nothing while
   `count` is 0. Set the three values and the card appears. */
/* THE ONE HONEST URGENCY (2026-09-18). One person builds these, which is
   real capacity: "One build at a time. Next start: October 6." is the only
   scarcity this site will ever state, and only while it is TRUE — a
   countdown or a "3 spots left" would break the no-fake-proof rule and
   repel exactly the owner it is meant for. Set the date to show the line
   in the close; keep it current or set it back to null. */
export const NEXT_START: string | null = null; // ← Jake: e.g. "October 6", or null to hide

export const GOOGLE_REVIEWS = {
  rating: 5.0, // ← PLACEHOLDER so the card can be seen in review
  count: 14, // ← PLACEHOLDER — Jake: the real count from Google, or 0 to hide
  url: "", // ← the Business profile's reviews link
};

/* THE RECEIPTS — the numbers band under the hero (acquisition.com's stats
   row, Jake 2026-09-13: "i want to have a similar idea just look
   significantly better"). Theirs are four boasts at scale; ours are four
   RECEIPTS, each with a timeframe and a source you can click, because a
   number with a window is a report and a number without one is marketing
   (design-laws.md). Every value here is already on the record elsewhere on
   the site (lib/work.ts, lib/services.ts) — nothing is new and nothing is
   invented. `asOf` is rendered so a visitor knows when it was true.

   ⚠ JAKE: "1,000+" is round because the exact page-view count was never
   pulled (project_launched, 2026-08-08: "upgrade Dozens to an exact form
   count when Jake pulls it"). Put the real GA number in `value` and drop
   the `+` — specific beats round (uxpeak §1). */
export const RECEIPTS_AS_OF = "September 2026";
export const RECEIPTS: {
  value: number; prefix?: string; suffix?: string;
  label: string; window: string; source: string; href: string;
}[] = [
  { value: 1000, suffix: "+", label: "page views the new site has served",
    window: "since launch", source: "Desert Wings Flight School", href: "/work/desert-wings" },
  { value: 0, prefix: "$", label: "in monthly platform fees, now the Wix subscription is gone",
    window: "every month since", source: "Arizona Aviation Historical Group", href: "/work/aahg" },
  { value: 2, suffix: " days", label: "from the call to a fixed quote in writing",
    window: "every project", source: "how it runs", href: "/pricing" },
  { value: 60, suffix: " s", label: "from six questions to a real price",
    window: "no email required", source: "the estimator", href: "/pricing" },
];

/* THE BUSINESSES in the strip's circles — the clients the rating comes
   from, rotating (Jake, 2026-09-13: "rotate icons inside of the circle
   things for businesses"). A mark file where one exists (only Desert
   Wings', in public/work), the business's initials otherwise, until the
   others are cleared. Never padded: three is three. */
export const CLIENT_MARKS: { initials: string; name: string; src?: string }[] = [
  { initials: "DW", name: "Desert Wings Flight School", src: "/work/desert-wings-logo.png" },
  { initials: "AA", name: "Arizona Aviation Historical Group" },
  { initials: "RP", name: "Riled Pickleball" },
];

/* THE TICKER in the strip — what is sold, as a running line (Jake: "have
   the services in infinite marquee"): the three services and the real
   things inside them, every one an item the estimator or a service page
   already names. Nothing here is a promise the site does not make. */
export const TICKER = [
  "Websites",
  "Google Ads",
  "Automation",
  "Booking forms",
  "Follow-up texts",
  "Live chat",
  "Conversion tracking",
  "Fixed quotes",
];
