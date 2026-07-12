// ─────────────────────────────────────────────────────────────
// The three funnel stages as standalone pages. Copy rules match
// the rest of the site: dash-free, no display periods, prices in
// plain numbers, never a claim the homepage doesn't already make.
// ─────────────────────────────────────────────────────────────

export type ServiceDef = {
  slug: string;
  /** funnel position — a true category, so it earns its chip */
  stage: string;
  stageIndex: string;
  nav: string;
  /** hero statement, one mask-line per entry */
  title: string[];
  support: string;
  /** the price beat (the page's one statement peak) */
  price: {
    lead: string;
    big: string;
    /** which word(s) inside `big` take the click color */
    accent: string;
    note: string;
    chips: string[];
  };
  deliverables: { name: string; body: string }[];
  /** the Lesse-grammar process cards: how this stage actually runs */
  process: { name: string; body: string }[];
  faqs: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
  /** schema.org Service name */
  schemaName: string;
};

export const SERVICES: ServiceDef[] = [
  {
    slug: "google-ads",
    stage: "The click",
    stageIndex: "01",
    nav: "Google Ads",
    title: ["Every click,", "accounted for"],
    support:
      "Google Ads, managed. Campaigns built on what your customers actually search, conversion tracking you can read, and a monthly number that says what a lead cost.",
    price: {
      lead: "Management is",
      big: "$500/mo",
      accent: "$500/mo",
      note: "plus whatever you spend on the ads themselves. You approve the budget.",
      chips: ["No minimum term", "Tracking included", "One monthly report"],
    },
    deliverables: [
      {
        name: "Campaigns built on real searches",
        body: "We build around what your customers actually type, not what a keyword tool guesses. Negative lists keep the budget off the wrong clicks.",
      },
      {
        name: "Tracking you can read",
        body: "Calls, forms and bookings wired up as conversions. You see which ad produced which lead, in a report that fits on one screen.",
      },
      {
        name: "A monthly number that means something",
        body: "Every month: what you spent, what a lead cost, and what we are changing next. If a campaign isn't earning, we say so.",
      },
      {
        name: "The landing page, tuned with it",
        body: "If we built your site, the ads and the page get tuned from the same data. One team, accountable for the whole click.",
      },
    ],
    process: [
      {
        name: "The call",
        body: "Twenty minutes on your business: what a customer is worth, what people search, where the clicks should land.",
      },
      {
        name: "The build",
        body: "Campaigns around real searches, negative lists against the wrong ones, and every call and form wired as a conversion.",
      },
      {
        name: "The launch",
        body: "You approve the budget before anything spends. The ads go live, and the tracking starts telling the truth from day one.",
      },
      {
        name: "The number",
        body: "Every month: spend, leads, cost per lead, and what we're changing next. Stay because it's working, not because of a contract.",
      },
    ],
    faqs: [
      {
        q: "What does Google Ads management cost?",
        a: "Management is $500/mo plus whatever you spend on the ads themselves. You approve the budget, the tracking shows what every lead cost, and there is no minimum term. If we also built your landing page, we tune both from the same data.",
      },
      {
        q: "Can you run ads to my existing website?",
        a: "Yes. Plenty of clients start with ads only. If your current page is losing the clicks we send it, the tracking will show it, and we will tell you what that is costing before we ever pitch a rebuild.",
      },
      {
        q: "Do I need a monthly retainer?",
        a: "Only for the management itself. There is no lock-in and no minimum term: the reporting makes the case to stay, or it doesn't.",
      },
    ],
    metaTitle: "Google Ads Management | Executive AI Solutions",
    metaDescription:
      "Google Ads managed from $500/mo plus spend. Campaigns built on real searches, conversion tracking you can read, and a monthly number that says what a lead cost.",
    schemaName: "Google Ads management and conversion tracking",
  },
  {
    slug: "websites",
    stage: "The landing",
    stageIndex: "02",
    nav: "Websites",
    title: ["The page the", "click deserves"],
    support:
      "A custom website, designed from your business and built by hand. Fast enough that nobody leaves while it loads, and every line of it yours.",
    price: {
      lead: "Projects start at",
      big: "$2.5k",
      accent: "$2.5k",
      note: "and every project gets a fixed quote within two days of the call. The price never moves after.",
      chips: ["Fixed quote in 2 days", "Hand-coded, no templates", "You own everything"],
    },
    deliverables: [
      {
        name: "Designed from your business",
        body: "No templates. We design from your customers, your prices and your photos, so the page could not belong to anyone else.",
      },
      {
        name: "Built by hand, built to load",
        body: "No page builders, no plugin stacks. Hand-coded pages that load before your visitor thinks about leaving.",
      },
      {
        name: "Built to convert the click",
        body: "Booking and quote forms where the eye lands, one clear action per page, and tracking wired in so you can see it working.",
      },
      {
        name: "Yours, outright",
        body: "Your domain, your content, your code. Nothing you will outgrow, no platform rent, no lock-in.",
      },
    ],
    process: [
      {
        name: "The call",
        body: "Twenty minutes on the business and its customers. Two days later, a fixed quote and a timeline in writing.",
      },
      {
        name: "The design",
        body: "Real pages in your brand, not wireframes. We iterate together until you'd be proud to send the link.",
      },
      {
        name: "The build",
        body: "Hand-coded, fast, and search-ready. You watch it come together on a live preview link, not in a deck.",
      },
      {
        name: "The launch",
        body: "Your domain, your code, live. Then ads, SEO or AI follow-up can bolt straight onto a page built to convert.",
      },
    ],
    faqs: [
      {
        q: "What does a website cost?",
        a: "Projects start at $2.5k and every project is quoted individually. The estimator computes a live number from our real pricing: pick what you need and watch it move. After a twenty-minute call you get a fixed quote within two days.",
      },
      {
        q: "Who owns the site when it's done?",
        a: "You do. Your domain, your content, your code. Everything is hand-built. No page builders, no platform lock-in, nothing you'll outgrow.",
      },
      {
        q: "Can you redesign my existing site?",
        a: "Yes. Redesigns follow the same process as new builds, and the estimator has a toggle for it. We keep what's working, rebuild what isn't, and make sure search engines don't lose track of you in the move.",
      },
    ],
    metaTitle: "Custom Website Design and Build | Executive AI Solutions",
    metaDescription:
      "Hand-built custom websites from $2.5k with a fixed quote in two days. Designed from your business, fast enough that nobody leaves, and you own everything.",
    schemaName: "Custom website design and build",
  },
  {
    slug: "ai",
    stage: "The follow-up",
    stageIndex: "03",
    nav: "AI automation",
    title: ["No lead", "goes cold"],
    support:
      "AI that answers and chases. Chat that answers visitors from your own pages, and follow-ups that send themselves, at 9pm on a Sunday.",
    price: {
      lead: "AI automation is",
      big: "Quoted per project",
      accent: "per project",
      note: "because every business needs a different piece of it. The call is where we work out what's worth building for yours.",
      chips: ["Built and managed for you", "Answers from your own pages"],
    },
    deliverables: [
      {
        name: "Chat that answers from your pages",
        body: "Visitors ask, it answers from your actual content, and it offers the booking. No canned scripts, no wrong prices.",
      },
      {
        name: "Follow-ups that send themselves",
        body: "An enquiry at 9pm on a Sunday gets a reply at 9:01, not on Monday. The chase happens whether or not you're at a desk.",
      },
      {
        name: "Pages that adapt to the visitor",
        body: "The headline a flight student sees isn't the one a restaurant owner sees. Same site, aimed at each visitor.",
      },
      {
        name: "Built and managed for you",
        body: "We build it, watch it and tune it. You read the results, not the manuals.",
      },
    ],
    process: [
      {
        name: "The scope",
        body: "A short call on where your leads actually go cold. We only quote the pieces worth building for your business.",
      },
      {
        name: "The build",
        body: "The chat learns your pages, the follow-ups get wired to your forms, and nothing answers a visitor until you've seen it answer.",
      },
      {
        name: "The check",
        body: "We review what it says against your real prices and policies before it goes live. No hallucinated discounts.",
      },
      {
        name: "The watch",
        body: "Built and managed for you. We read the transcripts and tune it; you read the results.",
      },
    ],
    faqs: [
      {
        q: "What is the AI automation, exactly?",
        a: "Three things, built and managed for you: chat that answers visitors from your own pages, follow-ups that send themselves so no enquiry goes cold, and pages that adapt to each visitor. It's quoted per project. The call is where we work out what's worth building for your business.",
      },
      {
        q: "Do I need a monthly retainer?",
        a: "No. AI automation is scoped and quoted per project, and each piece is explained in plain numbers before you commit.",
      },
      {
        q: "Does it need a website you built?",
        a: "It works best on one, because the chat answers from pages we know convert. But the follow-up automation can sit on top of whatever you run today.",
      },
    ],
    metaTitle: "AI Automation for Local Business | Executive AI Solutions",
    metaDescription:
      "AI that answers and chases: chat answering from your own pages, follow-ups that send themselves, pages that adapt per visitor. Built and managed for you, quoted per project.",
    schemaName: "AI automation for business websites",
  },
];

export const getService = (slug: string) =>
  SERVICES.find((s) => s.slug === slug);

export const siblingServices = (slug: string) =>
  SERVICES.filter((s) => s.slug !== slug);

/** the one-line pitch + price used wherever services cross-link */
export const SERVICE_META: Record<string, { line: string; price: string }> = {
  "google-ads": { line: "Google Ads, managed, with tracking you can read", price: "$500/mo + spend" },
  websites: { line: "A hand-built website that converts the click", price: "From $2.5k" },
  ai: { line: "Chat and follow-ups that never let a lead go cold", price: "Quoted per project" },
};
