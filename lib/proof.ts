/* THE NUMBERS THE PAGE VOUCHES WITH.

   ⚠ PLACEHOLDERS UNTIL JAKE SUPPLIES THE REAL ONES. The site refuses fake
   proof (see decisions.md and the site-check route), so nothing here may
   ship as-is: `rating`, `count` and `url` must come from the live Google
   Business profile, and the hero's rating card renders nothing while
   `count` is 0. Set the three values and the card appears. */
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
