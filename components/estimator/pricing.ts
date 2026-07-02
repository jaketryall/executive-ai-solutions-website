// ─────────────────────────────────────────────────────────────
// OWNER-EDITABLE PRICING — every number the estimator uses lives
// here. Adjust bands/adders freely; the UI recomputes from this.
// (Jake: confirm currency + bands before launch.)
// ─────────────────────────────────────────────────────────────

export const PROJECT_TYPES = [
  { id: "new", label: "New site", base: 2500 },
  { id: "redesign", label: "Redesign", base: 2200 },
] as const;

export const PAGE_BANDS = [
  { id: "p13", label: "1–3 pages", add: 0 },
  { id: "p46", label: "4–6 pages", add: 900 },
  { id: "p710", label: "7–10 pages", add: 2100 },
  { id: "p10plus", label: "10+ pages", add: 3600 },
] as const;

export const FEATURES = [
  { id: "booking", label: "Booking or quote forms", add: 1200 },
  { id: "ecommerce", label: "Online store", add: 2800 },
  { id: "copywriting", label: "Copywriting", add: 800 },
  { id: "photography", label: "Photo sourcing", add: 600 },
  { id: "cms", label: "Blog or CMS", add: 900 },
] as const;

export const MONTHLY = [
  { id: "seo", label: "SEO and content", monthly: 600, note: "from $600/mo" },
  { id: "ads", label: "Google Ads management", monthly: 500, note: "from $500/mo + ad spend" },
  { id: "ai", label: "AI automation", monthly: 0, note: "quoted per project" },
] as const;

export const TIERS = [
  { name: "Launch", min: 0, max: 4500, blurb: "Launch projects typically land $2.5k–$4.5k" },
  { name: "Growth", min: 4500, max: 9000, blurb: "Growth projects typically land $4.5k–$9k" },
  { name: "Flagship", min: 9000, max: Infinity, blurb: "Flagship projects typically land $9k–$18k+" },
] as const;

export type EstimateState = {
  projectType: (typeof PROJECT_TYPES)[number]["id"];
  pageBand: (typeof PAGE_BANDS)[number]["id"];
  features: string[];
  monthly: string[];
};

export const DEFAULT_STATE: EstimateState = {
  projectType: "new",
  pageBand: "p13",
  features: [],
  monthly: [],
};

export function compute(state: EstimateState) {
  const base = PROJECT_TYPES.find((t) => t.id === state.projectType)!.base;
  const pages = PAGE_BANDS.find((b) => b.id === state.pageBand)!.add;
  const features = FEATURES.filter((f) => state.features.includes(f.id)).reduce(
    (sum, f) => sum + f.add,
    0
  );
  const total = base + pages + features;
  const tier = TIERS.find((t) => total >= t.min && total < t.max) ?? TIERS[TIERS.length - 1];
  const monthly = MONTHLY.filter((m) => state.monthly.includes(m.id) && m.monthly > 0).reduce(
    (sum, m) => sum + m.monthly,
    0
  );
  const aiSelected = state.monthly.includes("ai");
  return { total, tier, monthly, aiSelected };
}

export function summarize(state: EstimateState) {
  const { total, tier, monthly, aiSelected } = compute(state);
  const parts = [
    PROJECT_TYPES.find((t) => t.id === state.projectType)!.label,
    PAGE_BANDS.find((b) => b.id === state.pageBand)!.label,
    ...FEATURES.filter((f) => state.features.includes(f.id)).map((f) => f.label),
    ...MONTHLY.filter((m) => state.monthly.includes(m.id)).map((m) => m.label),
  ];
  return {
    text: `${parts.join(" · ")} · estimated $${total.toLocaleString()} (${tier.name} tier)${
      monthly ? ` + $${monthly.toLocaleString()}/mo ongoing` : ""
    }${aiSelected ? " + AI automation (quoted per project)" : ""}`,
    total,
    tier,
    monthly,
    aiSelected,
  };
}
