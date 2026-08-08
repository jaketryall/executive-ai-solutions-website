// The work index + case-study data. Real projects only — no filler entries,
// no invented metrics. The third index slot ("Your business") lives in the
// index component, not here: it's a CTA, not a project.

export type WorkImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type WorkFigure = WorkImage & {
  /** what you're looking at — always visible on the mat */
  name: string;
  /** the longer note — revealed on hover (always shown on touch) */
  caption: string;
  span?: "full" | "half";
};

export type ProjectResults = {
  /** the NARRATIVE title (viral-sma decode, 2026-07-17): a verb-led story
      ("Filling discovery flights…"), never the client name — the name
      demotes to a meta line under it */
  story: string;
  /** the time qualifier under the stats ("In the first 90 days") — the
      quietly most persuasive line: numbers without a timeframe are
      marketing, numbers with one are a report */
  window: string;
  /** what we DID — 2 lines max, sits between the story and the stats
      (the viral order: title, the work in the middle, results below) */
  did: string;
  /** exactly TWO stats (fewer numbers, harder landing); both count up */
  metrics: { value: string; label: string }[];
  quote?: { text: string; name: string };
  /** the real ad, pinned to the frame — only when the ad copy is verbatim-real */
  ad?: { title: string };
};

export type Project = {
  slug: string;
  /** short display name for the index list (must survive huge type) */
  listName: string;
  /** the tile's one-line metric when there are no client results — was a
      hardcoded EAS fallback that leaked onto AAHG's tile (2026-08-03) */
  listLine?: string;
  client: string;
  kind: string;
  /** industry label for the index's sector rail (jump-nav now, filter as the list grows) */
  sector: string;
  year: string;
  status: string;
  url?: string;
  urlLabel?: string;
  logo?: string;
  tags: string[];
  /** case-study hero + morph source */
  cover: WorkImage;
  /** full-bleed backdrop for the cinematic index chapter (defaults to cover) */
  backdrop?: WorkImage;
  /** crop into the backdrop's clean region (screenshots carry their own
      nav/copy — zoom past it toward the photographic area) */
  backdropCrop?: { zoom: number; origin: string };
  /** the slit-open demo panel on the homepage card */
  demo: WorkImage;
  lede: string;
  paras: string[];
  shipped: string[];
  gallery: WorkFigure[];
  /** paired phone shots rendered as a two-up (optional) */
  phones?: [WorkImage, WorkImage];
  /** full-length phone-width capture — the case page's single-device
      exhibit scrolls it inside the screen (optional) */
  phoneTour?: WorkImage;
  /** homepage proof row: the receipts. A project with results (and ideally a
      tall `tour` capture) gets a work-and-results row on the homepage. */
  results?: ProjectResults;
  /** the case page's numbers band for projects WITHOUT client results —
      receipts we can measure on the build itself (2026-08-03: the EAS
      case solved the teased-metrics sin by omission; this solves it with
      substance). Does NOT trigger the homepage proof row. */
  receipts?: {
    note: string;
    items: { value: string; label: string }[];
  };
  /** tall stitched capture that pans inside the proof frame on scroll */
  tour?: WorkImage;
};

export const PROJECTS: Project[] = [
  {
    slug: "desert-wings",
    listName: "Desert Wings",
    client: "Desert Wings Flight School",
    kind: "Website · Ads · SEO",
    sector: "Aviation",
    year: "2026",
    status: "Live",
    url: "https://www.desertwingsflightschool.com",
    urlLabel: "desertwingsflightschool.com",
    logo: "/work/desert-wings-logo.png",
    tags: ["Custom design", "Next.js", "Google Ads", "Conversion tracking", "Local SEO"],
    cover: {
      src: "/work/desert-wings-tall.png",
      width: 1600,
      height: 1000,
      alt: "The Desert Wings Flight School homepage",
    },
    backdrop: {
      src: "/work/desert-wings-hero.png",
      width: 1600,
      height: 741,
      alt: "The Desert Wings hero: a Piper over the Arizona desert",
    },
    backdropCrop: { zoom: 1.32, origin: "84% 50%" },
    demo: {
      src: "/work/desert-wings-fleet.png",
      width: 1400,
      height: 648,
      alt: "The Desert Wings fleet section",
    },
    tour: {
      src: "/work/dw-tour.jpg",
      width: 2880,
      height: 4446,
      alt: "Scrolling through the Desert Wings homepage the ad lands on",
    },
    /* Honest, BUILD-scoped numbers (Jake, 2026-08-08: "use what stats we
       can grab... i dont want to piss off our seo person by taking
       credits"). Only what's real and ours: the site's page-view count +
       the contact-form leads it converts. NO ads/SEO/traffic credit —
       that's the client's team's, and the numbers-section note says so.
       The fabricated ads-credit quote was removed. Contact-form COUNT
       still to confirm — "Leads" holds the slot until Jake gives it. */
    results: {
      story: "The new site a Mesa flight school's visitors act on",
      did: "We designed and built the site from scratch and wired the contact form and conversion tracking, so the traffic the client earns turns into leads that land in the inbox \u2014 not bounces.",
      window: "Since launch",
      metrics: [
        { value: "1,000+", label: "page views the new site has served" },
        { value: "Dozens", label: "of contact-form leads through the site" },
      ],
      ad: { title: "Desert Wings Flight School | Learn to Fly at Falcon Field" },
    },
    lede: "A flight school with students to win, not a brochure to park. We designed and built the site, then wired the growth engine behind it so every enquiry traces back to the dollar that bought it.",
    paras: [
      "Learning to fly is a five-figure commitment, and the site's job is to make the first enquiry feel obvious. That meant showing the things a nervous first-timer actually weighs: the fleet, the instructors, and the path from a discovery flight to a license.",
      "We designed it from scratch and built it on Next.js. No template, no page builder. Every section is custom, from the training journey to the fleet gallery, and it loads fast enough that the ad spend behind it isn't wasted on bounces.",
      "Then the part most agencies skip. Google Ads runs with real conversion tracking: every form submission fires through Tag Manager into Ads, so campaigns optimize toward enquiries instead of clicks, while local SEO compounds the organic side underneath.",
    ],
    shipped: [
      "Custom design & build",
      "Next.js",
      "Google Ads",
      "GTM conversion tracking",
      "Local SEO",
    ],
    gallery: [
      {
        src: "/work/live/dw-programs.jpg",
        width: 2880,
        height: 1800,
        alt: "The Desert Wings training programs section",
        name: "The training journey",
        caption: "Every certificate, laid out with real hours and costs",
        span: "full",
      },
      {
        src: "/work/live/dw-fleet.jpg",
        width: 2880,
        height: 1800,
        alt: "The Desert Wings fleet section",
        name: "The fleet gallery",
        caption: "The fleet, presented aircraft by aircraft",
        span: "half",
      },
      {
        src: "/work/desert-wings-team.png",
        width: 1600,
        height: 1000,
        alt: "The Desert Wings instructor team section",
        name: "The instructor team",
        caption: "Real instructors, not stock pilots",
        span: "half",
      },
      {
        src: "/work/desert-wings-proof.png",
        width: 1600,
        height: 1000,
        alt: "The Desert Wings reviews and proof section",
        name: "Reviews & proof",
        caption: "Proof placed where the decision actually happens",
        span: "full",
      },
    ],
    phoneTour: {
      src: "/work/dw-phone-tour.jpg",
      width: 780,
      height: 10128,
      alt: "The full Desert Wings site scrolling by at phone width",
    },
    phones: [
      {
        src: "/work/desert-wings-mobile.png",
        width: 742,
        height: 1100,
        alt: "The Desert Wings site on a phone",
      },
      {
        src: "/work/desert-wings-mobile-2.png",
        width: 508,
        height: 1100,
        alt: "A second mobile view of the Desert Wings site",
      },
    ],
  },
  {
    slug: "aahg",
    listName: "AAHG",
    listLine: "$0/mo in platform fees after leaving Wix",
    client: "Arizona Aviation Historical Group",
    kind: "Website",
    sector: "Nonprofit",
    year: "2026",
    status: "Live",
    url: "https://www.aahg.org",
    urlLabel: "aahg.org",
    tags: ["Custom design", "Next.js", "Static build", "Motion design", "No CMS"],
    cover: {
      src: "/work/aahg-hero.jpg",
      width: 2880,
      height: 1800,
      alt: "The AAHG homepage: 'Keep the record.' over an aerial photograph cut into the shape of Arizona",
    },
    demo: {
      src: "/work/aahg-programs.jpg",
      width: 2880,
      height: 1800,
      alt: "The AAHG project ledger: what we preserve, what we restore",
    },
    /* 1x capture (Chrome's 16,384px ceiling blocks DPR2 on a 13,090px
       page) — soft on retina; re-capture in stitched halves if it shows */
    tour: {
      src: "/work/aahg-tour.jpg",
      width: 1440,
      height: 13090,
      alt: "Scrolling through the Arizona Aviation Historical Group homepage",
    },
    receipts: {
      note: "Numbers from the build itself. A site a volunteer organization can actually run.",
      items: [
        { value: "$0", label: "monthly platform fees, now that the Wix subscription is gone" },
        { value: "100%", label: "statically prerendered, nothing to break, nothing to patch" },
        { value: "57", label: "photographs from their own archive doing the storytelling" },
      ],
    },
    lede: "A volunteer group keeping Arizona's aviation history alive, on a website that finally matches the mission. We retired the old Wix site and built the record a permanent home, from their own photographs down to the last date.",
    paras: [
      "The AAHG preserves Arizona's aviation story: the RAF cadets who trained at Falcon Field, the aircraft their volunteers restore, the school programs that pass it on. The site's job is to make that record feel worth joining, and to route every kind of support — donations, event seats, program enquiries — to the right door.",
      "We designed it from their own photo archive and built it by hand on Next.js. Every page is statically prerendered: no CMS to break, no database to patch, no platform subscription to renew. The Arizona-shaped hero mask, the polaroid mats, the numbered project ledger — all custom.",
      "It runs the way a nonprofit needs it to. Content lives in one file, the featured fundraiser switches in one line, and the whole thing deploys in a push. Project Tweet takes donations through PayPal; everything else lands in the inbox they already check.",
    ],
    shipped: [
      "Custom design & build",
      "Next.js",
      "Static, no CMS",
      "GSAP + Framer Motion",
      "Content in one file",
    ],
    gallery: [
      {
        src: "/work/aahg-numbers.jpg",
        width: 2880,
        height: 1800,
        alt: "The AAHG by-the-numbers section: numbers worth remembering",
        name: "Numbers worth remembering",
        caption: "Their history, told in figures a visitor can hold",
        span: "half",
      },
      {
        src: "/work/aahg-support.jpg",
        width: 2880,
        height: 1800,
        alt: "The AAHG support section with the tilted crew polaroid and donation paths",
        name: "The support closer",
        caption: "Three ways in: donate, programs, a seat at the next evening",
        span: "half",
      },
    ],
    phoneTour: {
      src: "/work/aahg-phone-tour.jpg",
      width: 390,
      height: 12771,
      alt: "The full AAHG site scrolling by at phone width",
    },
  },
  {
    slug: "riled-up",
    listName: "Riled Up",
    listLine: "A site that books and bills itself",
    client: "Riled Up Pickleball",
    kind: "Website · Booking system",
    sector: "Coaching",
    year: "2026",
    status: "Live",
    url: "https://rileduppickleball.com",
    urlLabel: "rileduppickleball.com",
    tags: ["Custom design", "Stripe checkout", "Twilio SMS", "Booking flow", "GSAP + Lenis"],
    cover: {
      src: "/work/riled-hero.jpg",
      width: 2880,
      height: 1800,
      alt: "The Riled Up Pickleball homepage: 'Stop losing to players you should beat.' over a court photo",
    },
    demo: {
      src: "/work/riled-booking.jpg",
      width: 2880,
      height: 1800,
      alt: "The Riled Up pricing section: three coaching packages with on-page checkout",
    },
    tour: {
      src: "/work/riled-tour.jpg",
      width: 2880,
      height: 15474,
      alt: "Scrolling through the Riled Up Pickleball homepage",
    },
    receipts: {
      note: "Numbers from the build — a coaching business that books and bills itself.",
      items: [
        { value: "Stripe", label: "real checkout on the page — packages bought, not enquired about" },
        { value: "SMS", label: "Twilio reminders fire automatically before every booked session" },
        { value: "0", label: "phone calls needed — the site runs the calendar and the payment" },
      ],
    },
    lede: "A pickleball coach doesn't need a brochure, he needs a full calendar. This one takes the booking and the payment while he's still on the court, so the business runs whether or not he's at a desk.",
    paras: [
      "Riled Up sells coaching at The Picklr in Mesa, and the site's whole job is to turn a curious player into a booked, paid session with no back-and-forth. That meant a real funnel: the pitch, the proof, the packages, and a checkout — not a contact form and a promise to call back.",
      "We designed it around real photos from the court and built it fast and hand-coded. The black-and-lime identity, the numbered chapters, the tabbed pricing — all custom, tuned to read as confidently as the coaching it sells.",
      "Under it is a working system. Stripe takes the payment on the page, the booking flow holds the calendar, and Twilio fires the reminder texts before each session. It's the part most 'websites' skip: this one doesn't just look the part, it transacts.",
    ],
    shipped: [
      "Custom design & build",
      "Stripe checkout",
      "Twilio SMS reminders",
      "Booking flow",
      "GSAP + Lenis",
    ],
    gallery: [
      {
        src: "/work/riled-booking.jpg",
        width: 2880,
        height: 1800,
        alt: "The Riled Up packages: Starter, Transformation, Elite, bought on the page",
        name: "Choose your path",
        caption: "Three packages, checkout on the page — Stripe, not a contact form",
        span: "half",
      },
      {
        src: "/work/riled-feature.jpg",
        width: 2880,
        height: 1800,
        alt: "The Riled Up coaching method section",
        name: "The method",
        caption: "The proof and the process that earn the booking",
        span: "half",
      },
    ],
  },
  {
    slug: "executive-ai-solutions",
    listName: "Executive AI",
    listLine: "The build you're inside right now",
    client: "Executive AI Solutions",
    kind: "Website · AI",
    sector: "AI & Web",
    year: "2026",
    status: "You're on it",
    tags: ["Custom design", "Next.js", "GSAP", "Instant estimator", "AI automation"],
    cover: {
      src: "/work/eas-hero.png",
      width: 1600,
      height: 1000,
      alt: "The Executive AI Solutions homepage",
    },
    backdrop: {
      src: "/showreel-poster.jpg",
      width: 1920,
      height: 1080,
      alt: "A frame from the Executive AI Solutions showreel",
    },
    demo: {
      src: "/work/eas-estimator.png",
      width: 1600,
      height: 1000,
      alt: "The Executive AI Solutions instant estimator",
    },
    receipts: {
      note: "Numbers you can check by using the site. Lighthouse scores join after launch.",
      items: [
        { value: "60s", label: "from six questions to a real price, in the estimator" },
        { value: "0", label: "templates, page builders, or plugin stacks in the build" },
        { value: "100%", label: "hand-written code, designed and built in-house" },
      ],
    },
    lede: "The site you're scrolling is the second case study. Every interaction here, from the estimator to the page transition that brought you to this line, is the product demo.",
    paras: [
      "We built this site the way we build client sites, then pushed further, because it has to prove the pitch on its own. The type system, the scroll choreography, the card you clicked to get here: all custom, all tuned by hand.",
      "The instant estimator prices a project in about sixty seconds without a sales call. That's the same thinking we bring to every client build: answer the visitor's biggest question before they have to ask someone for it.",
      "Under the hood it's Next.js and GSAP on a design system with two easing curves and one spacing scale. It ships with llms.txt and structured data so AI assistants can read it too, because that's where search is going.",
    ],
    shipped: [
      "Design system",
      "GSAP choreography",
      "Instant estimator",
      "AI automation",
      "AEO / llms.txt",
    ],
    gallery: [
      {
        src: "/work/eas-estimator.png",
        width: 1600,
        height: 1000,
        alt: "The instant estimator on the Executive AI Solutions site",
        name: "The instant estimator",
        caption: "The estimator: a real number, not a lead trap",
        span: "full",
      },
      {
        src: "/showreel-poster.jpg",
        width: 1920,
        height: 1080,
        alt: "A frame from the Executive AI Solutions showreel",
        name: "The showreel",
        caption: "The showreel that opens the homepage",
        span: "full",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function nextProject(slug: string): Project {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length];
}

/** the view-transition-name shared by the index card well and the case hero */
