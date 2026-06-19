import "server-only";
import { cookies, headers } from "next/headers";

// Adaptive hero — the "one funnel" for visitor personalization.
//
// Every signal we know about a visitor (ad campaign, geo, and later a
// logged-in user) is collected into ONE VisitorContext, and ONE pure function
// (resolveHeroContent) turns that context into hero copy. Adding a new signal
// later — e.g. the logged-in experience — means populating another field on
// the context and adding a branch here, NOT rewiring the hero or the page.
//
// Decision happens server-side (RSC), so the right copy is rendered before the
// page reaches the browser: no flicker, and crawlers/direct visitors get the
// sensible default. The route goes dynamic because we read headers/cookies —
// expected and fine for a personalized hero.

export type VisitorContext = {
  /** Normalized industry key from the ad campaign (?ind=…). */
  industry?: string;
  /** Edge geo (Vercel headers; absent in local dev). */
  city?: string;
  region?: string;
  country?: string;
  /**
   * Reserved for the future logged-in experience. When auth ships, populate
   * this from the session and add a branch in resolveHeroContent — nothing
   * else changes.
   */
  user?: { name?: string } | null;
};

export type HeroContent = {
  tagline: string;
  /** The subject phrase that got slotted in — handy for analytics/debugging. */
  subject: string;
  /** True if anything was actually personalized (vs the default copy). */
  personalized: boolean;
};

// Ad-campaign ?ind= values → the noun we drop into the tagline. Keys are
// lowercased; alias freely. Extend this as you launch new campaigns.
const INDUSTRY: Record<string, string> = {
  dentist: "dentists",
  dentists: "dentists",
  dental: "dentists",
  restaurant: "restaurants",
  restaurants: "restaurants",
  cafe: "cafés",
  coffee: "cafés",
  gym: "gyms",
  fitness: "gyms",
  salon: "salons",
  spa: "spas",
  contractor: "contractors",
  construction: "contractors",
  roofing: "roofers",
  hvac: "HVAC pros",
  plumber: "plumbers",
  plumbing: "plumbers",
  electrician: "electricians",
  realtor: "real estate agents",
  realestate: "real estate agents",
  law: "law firms",
  lawyer: "law firms",
  attorney: "law firms",
  auto: "auto shops",
  automotive: "auto shops",
  tours: "tour operators",
  tour: "tour operators",
  clinic: "clinics",
  medical: "clinics",
  retail: "shops",
  ecommerce: "online stores",
};

const DEFAULT_SUBJECT = "local brands";

function titleCaseCity(raw: string): string {
  return raw
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Signals in, hero copy out. Pure + synchronous, so it's trivial to test and
// to extend. The subject phrase escalates with how much we know:
//   industry + city → "Phoenix dentists"
//   industry        → "local dentists"
//   city            → "Phoenix businesses"
//   nothing         → "local brands" (the original copy)
export function resolveHeroContent(ctx: VisitorContext): HeroContent {
  const industry = ctx.industry ? INDUSTRY[ctx.industry.toLowerCase()] : undefined;
  const city = ctx.city?.trim() || undefined;

  let subject: string;
  if (industry && city) subject = `${city} ${industry}`;
  else if (industry) subject = `local ${industry}`;
  else if (city) subject = `${city} businesses`;
  else subject = DEFAULT_SUBJECT;

  return {
    subject,
    tagline: `Websites that get ${subject} found on Google & booked solid.`,
    personalized: subject !== DEFAULT_SUBJECT,
  };
}

// Collect the context from the incoming request. RSC-only (reads headers +
// cookies). `searchParams` is passed in because only the page has access to it.
export async function getVisitorContext(searchParams?: {
  ind?: string | string[];
}): Promise<VisitorContext> {
  const h = await headers();
  const c = await cookies();

  // industry: prefer the live ?ind= param, fall back to the sticky cookie
  // (set by middleware) so it survives internal nav and return visits.
  const paramInd = Array.isArray(searchParams?.ind)
    ? searchParams?.ind[0]
    : searchParams?.ind;
  const industry = (paramInd || c.get("eas_ind")?.value || undefined)?.toLowerCase();

  // geo: Vercel injects these in production; they're simply absent locally.
  const rawCity = h.get("x-vercel-ip-city") || undefined;
  const city = rawCity ? titleCaseCity(decodeURIComponent(rawCity)) : undefined;
  const region = h.get("x-vercel-ip-country-region") || undefined;
  const country = h.get("x-vercel-ip-country") || undefined;

  return { industry, city, region, country, user: null };
}
