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
  /** metrics[0] leads the homepage proof row (biggest); keep it the strongest */
  metrics: { value: string; label: string }[];
  quote?: { text: string; name: string };
  /** the real ad, pinned to the frame — only when the ad copy is verbatim-real */
  ad?: { title: string };
};

export type Project = {
  slug: string;
  /** short display name for the index list (must survive huge type) */
  listName: string;
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
  /** homepage proof row: the receipts. A project with results (and ideally a
      tall `tour` capture) gets a work-and-results row on the homepage. */
  results?: ProjectResults;
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
    /* ═══ PLACEHOLDER results — swap with real Desert Wings data + the real
       owner quote (with permission) before launch ═══ */
    results: {
      metrics: [
        { value: "3x", label: "more discovery-flight bookings" },
        { value: "$38", label: "cost per lead" },
        { value: "90", label: "days to get there" },
      ],
      quote: {
        text: "The phone started ringing the week the ads went live, and the new site actually books people instead of just looking good.",
        name: "Owner, Desert Wings Flight School",
      },
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
    slug: "executive-ai-solutions",
    listName: "Executive AI",
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
