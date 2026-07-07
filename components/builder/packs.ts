/* Content packs for the 60-second builder — one pack per industry, each a
   complete mini-site voice (headline, CTA, nav, cards, photo, review, and the
   alive-layer toast). The packs are also the seed content for future
   ad-personalized heroes (?i= carries the same industry ids), so keep the ids
   stable once ads point at them. */

export type SkinId = "warm" | "dark";

export const SKINS: { id: SkinId; label: string }[] = [
  { id: "warm", label: "Warm & clean" },
  { id: "dark", label: "Dark & bold" },
];

/* curated accent swatches — every colored surface in the mini site derives
   from the one --ms-acc variable (button, thumbs, star row, photo duotone),
   so a swatch click re-inks the whole site. Curated, never a color wheel. */
export type Accent = { id: string; label: string; hex: string };

export const ACCENTS: Accent[] = [
  { id: "steel", label: "Steel", hex: "#4c6b7c" },
  { id: "clay", label: "Clay", hex: "#8a5340" },
  { id: "moss", label: "Moss", hex: "#4a6350" },
  { id: "brass", label: "Brass", hex: "#8a7036" },
  { id: "plum", label: "Plum", hex: "#6b5a78" },
];

export type CardArt = { src: "img" | "about"; size: string; pos: string };

export type IndustryPack = {
  id: string;
  label: string;
  /* the short label on the mini browser's tab strip */
  tab: string;
  /* the one word the EAS hero swaps for labeled traffic:
     "Websites that win <heroWord>" */
  heroWord: string;
  defaultName: string;
  nav: [string, string, string];
  headline: string;
  /* the mini hero's one-line tagline — real words where a sketch would put a
     fill bar */
  tag: string;
  cta: string;
  cards: [string, string, string];
  /* how each service-card thumb crops the pack's two photos — tuned per
     industry so every thumb lands on a subject, not empty background */
  cardArt: [CardArt, CardArt, CardArt];
  img: string;
  review: { quote: string; author: string };
  toast: string;
  /* the fullscreen demo site — real copy at real scale, no fill bars */
  demo: {
    sub: string;
    ticker: string[];
    services: { title: string; desc: string }[];
    aboutKicker: string;
    about: string;
    aboutImg: string;
    stats: [string, string][];
    contactLine: string;
  };
};

export const INDUSTRIES: IndustryPack[] = [
  {
    id: "flight",
    label: "Flight school",
    tab: "Flight school",
    heroWord: "students",
    defaultName: "Skyline Aviation",
    nav: ["Training", "Fleet", "Pricing"],
    headline: "Learn to fly with instructors who love teaching",
    tag: "Twelve aircraft, patient instructors, honest pricing.",
    cta: "Book a discovery flight",
    cards: ["Discovery flight", "Private pilot", "Instrument rating"],
    cardArt: [
      { src: "img", size: "cover", pos: "50% 38%" },
      { src: "about", size: "cover", pos: "50% 45%" },
      { src: "img", size: "280%", pos: "56% 44%" },
    ],
    img: "/builder/flight.jpg",
    review: { quote: "Went from zero to solo in four months.", author: "Marcus T." },
    toast: "New enquiry · discovery flight",
    demo: {
      sub: "From your first discovery flight to the checkride handshake: clear pricing, patient instructors, and a fleet maintained like it matters.",
      ticker: ["Discovery flights", "Private pilot", "Instrument rating", "Night endorsement", "Twelve aircraft", "FAA certified"],
      services: [
        { title: "Discovery flight", desc: "Thirty minutes on the controls with an instructor beside you. Most people book their training the same week." },
        { title: "Private pilot", desc: "The full journey to your certificate: structured stages, honest timelines, and no surprise costs." },
        { title: "Instrument rating", desc: "Fly in more weather, more days of the year. Precision training for pilots who want real utility." },
      ],
      aboutKicker: "Why train here",
      about: "We were founded by instructors who never lost the love of teaching it. Small classes, aircraft washed and maintained like they're ours (because they are), and a pass rate we'd put on a billboard.",
      aboutImg: "/builder/flight-about.jpg",
      stats: [
        ["400+", "students soloed"],
        ["98%", "checkride pass rate"],
        ["7 days", "average wait to start"],
      ],
      contactLine: "The sky's been waiting. Book your discovery flight and see the field from above this weekend.",
    },
  },
  {
    id: "restaurant",
    label: "Restaurant",
    tab: "Restaurant",
    heroWord: "bookings",
    defaultName: "The Copper Table",
    nav: ["Menu", "Events", "Find us"],
    headline: "Seasonal plates, neighborhood soul",
    tag: "A short menu, natural wine, open late.",
    cta: "Reserve a table",
    cards: ["Dinner menu", "Private dining", "Order pickup"],
    cardArt: [
      { src: "img", size: "cover", pos: "42% 62%" },
      { src: "about", size: "cover", pos: "50% 55%" },
      { src: "img", size: "300%", pos: "42% 66%" },
    ],
    img: "/builder/restaurant.jpg",
    review: { quote: "The tasting menu alone is worth the drive.", author: "Alina R." },
    toast: "New booking · table for four",
    demo: {
      sub: "A short menu that changes with the season, a room that feels like a dinner party, and a kitchen that treats Tuesday like Saturday.",
      ticker: ["Seasonal menu", "Local farms", "Private dining", "Natural wine", "Open till late", "Walk-ins welcome"],
      services: [
        { title: "Dinner menu", desc: "Five to seven plates, rewritten as the market changes. If it's on the menu, it's at its best right now." },
        { title: "Private dining", desc: "The back room seats eighteen. Birthdays, closings, reunions: we'll build the menu around your night." },
        { title: "Order pickup", desc: "The kitchen's favorites, packed properly. Order by six, on your table by seven." },
      ],
      aboutKicker: "The room",
      about: "We opened with one idea: cook what the season gives us and charge what it's worth. No freezer full of backups, no laminated menu. Just a small room, warm light, and food we'd drive across town for.",
      aboutImg: "/builder/restaurant-about.jpg",
      stats: [
        ["14", "menus a year"],
        ["4.9★", "across 600 reviews"],
        ["18", "seats in the back room"],
      ],
      contactLine: "The corner table is open. Reserve for this weekend before the room fills up.",
    },
  },
  {
    id: "trades",
    label: "Trades & home services",
    tab: "Trades",
    heroWord: "call-outs",
    defaultName: "Hartley Plumbing",
    nav: ["Services", "Reviews", "Service area"],
    headline: "Fixed right the first time, guaranteed",
    tag: "Licensed, insured, on time. Ten-year guarantee.",
    cta: "Get a free quote",
    cards: ["Emergency call-outs", "Renovations", "Maintenance plans"],
    cardArt: [
      { src: "img", size: "cover", pos: "50% 55%" },
      { src: "about", size: "cover", pos: "50% 55%" },
      { src: "img", size: "260%", pos: "48% 74%" },
    ],
    img: "/builder/trades.jpg",
    review: { quote: "Called at nine, fixed by lunch. Unreal.", author: "Dana W." },
    toast: "New request · emergency call-out",
    demo: {
      sub: "Licensed, insured, and on time, with photos of the work, a price agreed before we start, and a guarantee we actually honor.",
      ticker: ["24/7 call-outs", "Licensed & insured", "Fixed quotes", "Ten-year guarantee", "Same-week starts", "Tidy sites"],
      services: [
        { title: "Emergency call-outs", desc: "Burst pipe at midnight, no hot water on Sunday. One number, a real person answers, average arrival under an hour." },
        { title: "Renovations", desc: "Bathrooms, kitchens, repipes. Fixed quotes, tidy sites, and trades who show up when the schedule says." },
        { title: "Maintenance plans", desc: "An annual once-over that catches the small stuff before it floods the big stuff. Priority booking all year." },
      ],
      aboutKicker: "How we work",
      about: "Twenty years in, we still answer our own phone. Every job gets a written quote before work starts, boots come off at the door, and if something we fixed fails, we come back and fix it free. That's the whole pitch.",
      aboutImg: "/builder/trades-about.jpg",
      stats: [
        ["60 min", "average call-out"],
        ["4.9★", "on Google"],
        ["10 yr", "workmanship guarantee"],
      ],
      contactLine: "Tell us what's broken. You'll have a quote today and, most weeks, a fix tomorrow.",
    },
  },
  {
    id: "other",
    label: "Something else",
    tab: "Something else",
    heroWord: "customers",
    defaultName: "Your Business",
    nav: ["About", "Services", "Contact"],
    headline: "The business customers find first",
    tag: "The obvious choice, the moment they find you.",
    cta: "Get in touch",
    cards: ["What you do", "Why you", "Proof it works"],
    cardArt: [
      { src: "img", size: "cover", pos: "50% 60%" },
      { src: "about", size: "cover", pos: "42% 55%" },
      { src: "about", size: "260%", pos: "24% 48%" },
    ],
    img: "/builder/other.jpg",
    review: { quote: "Exactly what we needed, faster than we hoped.", author: "Sam K." },
    toast: "New enquiry · Sarah M.",
    demo: {
      sub: "The customers you want are already searching. This is the site that makes you the obvious choice when they find you.",
      ticker: ["Serving the region", "Trusted since day one", "Real reviews", "Fast replies", "Honest pricing", "One call away"],
      services: [
        { title: "What you do", desc: "Said plainly, priced honestly, and easy to act on. Your best work, front and center." },
        { title: "Why you", desc: "The experience, the guarantee, the difference: the reasons customers pick you, made unmissable." },
        { title: "Proof it works", desc: "Reviews, results, and real numbers. Trust built before they ever pick up the phone." },
      ],
      aboutKicker: "The short version",
      about: "Every business says quality and service. The ones that win show it: a site that looks like the work costs what it costs, answers questions before they're asked, and makes getting in touch the easiest thing on the page.",
      aboutImg: "/builder/other-about.jpg",
      stats: [
        ["4.9★", "customer rating"],
        ["10+", "years serving"],
        ["1", "call to get started"],
      ],
      contactLine: "You've seen the sketch. The real thing takes about four weeks.",
    },
  },
];

export function getPack(id: string): IndustryPack {
  return INDUSTRIES.find((p) => p.id === id) ?? INDUSTRIES[0];
}

export function getSkin(id: string): { id: SkinId; label: string } {
  return SKINS.find((s) => s.id === id) ?? SKINS[0];
}

export function getAccent(id: string): Accent {
  return ACCENTS.find((a) => a.id === id) ?? ACCENTS[0];
}

/* the fake domain in the browser chrome — their name, slugified */
export function toDomain(name: string, fallback: string): string {
  const slug = (name.trim() || fallback)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
  return `${slug || "yourbusiness"}.com`;
}

export type BuildChoice = { industry: string; skin: SkinId; accent: string; name: string };

/* the human-readable line that rides the contact email */
export function describeBuild(c: BuildChoice): string {
  const pack = getPack(c.industry);
  const name = c.name.trim() || pack.defaultName;
  return `${pack.label} · ${getSkin(c.skin).label} · ${getAccent(c.accent).label} · “${name}”`;
}

/* the reopen link — opens the fullscreen demo of this build directly (o=1),
   with the builder pre-loaded underneath when they close it */
export function buildPath(c: BuildChoice): string {
  const params = new URLSearchParams({ i: c.industry, s: c.skin, a: c.accent });
  if (c.name.trim()) params.set("n", c.name.trim());
  params.set("o", "1");
  return `/?${params.toString()}#builder`;
}
