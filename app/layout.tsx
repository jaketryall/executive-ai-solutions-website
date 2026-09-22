import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";
import "./room.css";
import { PersonaCapture } from "@/components/persona-capture";
import { RoomShell } from "@/components/room/shell";
import { SmoothScroll } from "@/components/anim/smooth-scroll";
import { ViewTransitions } from "@/components/anim/view-transition";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const SITE_URL = "https://executiveaisolutions.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  /* ⚠ THE POSITIONING LINE, sitewide. This said "Google Ads and websites"
     — ads first, on every <title> and every share card — after the page
     itself had moved to design + systems. The title is the one string
     that outlives the page: it is what a tab, a bookmark and a search
     result say. Same order as the hero and §02: the site, the system,
     the ads. */
  title: "Executive AI Solutions | Design that sells, systems that follow up",
  description:
    "Hand-built websites from $2.5k, and the system behind them so every call, form and text gets answered. AI follow-up, Google Ads when you want the traffic. Fixed quote in two days. Mesa, AZ.",
  // root default: pages without their own alternates inherit this (only the
  // homepage — every interior page declares its own canonical)
  alternates: { canonical: "/" },
  openGraph: {
    title: "Executive AI Solutions | Design that sells, systems that follow up",
    description:
      "Hand-built websites and the system behind them, so every call, form and text gets answered. AI follow-up, Google Ads when you want the traffic. Fixed quote in two days.",
    url: SITE_URL,
    siteName: "Executive AI Solutions",
    type: "website",
    // sitewide default share card; pages with a better image override it
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Executive AI Solutions — websites, AI follow-up, and Google Ads. Mesa, AZ.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Executive AI Solutions",
  url: SITE_URL,
  logo: `${SITE_URL}/Executive%20Ai%20Solutions%20Logo.png`,
  // the schema calls the business what the page calls it — this said "Ads
  // agency" to search engines while the page said design + systems
  description:
    "Design studio building custom websites and the systems behind them for local businesses — AI follow-up so no lead goes cold, and Google Ads when you want the traffic. Fixed quote in two days.",
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom website design and build" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI automation for business websites" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Google Ads management and conversion tracking" } },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        {/* THE REEL FETCHES FIRST. `fetchpriority` is not a valid attribute on
            <video>/<source>, so the hero film's priority is granted here: the
            preload scanner finds this before it parses the body, and the
            bytes arrive beside the fonts instead of after the scripts
            (production-stack/references/video.md). MEASURED, production
            build, 4 Mbps / 100ms RTT: `playing` at 1.67s with and without
            this — the reel is bandwidth-bound (885 KB), not priority-bound;
            on a fast line it is ~180ms either way. Kept because it costs
            nothing and removes the one case where priority would matter
            (a slow line with heavy scripts ahead of the film). What makes it
            read as instant is the poster being frame 0 of the shipped file. */}
        <link rel="preload" as="video" href="/dark/reel-film.mp4" type="video/mp4" fetchPriority="high" />
        {/* load gate: pre-hide entrance elements + start every reload at the top */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("has-js");try{history.scrollRestoration="manual"}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <PersonaCapture />
        {/* THE CHAT LIVES IN THE RAIL now (components/room/nav.tsx,
            2026-09-22): Ask is one of the links, and the rail grows into
            the panel the way yeqq.com.tr's island grows into its menu.
            Its floating pill stays hidden (room.css). In production it
            still 502s on an invalid ANTHROPIC_API_KEY — owed. */}
        {/* THE ROOM IS THE FRAME. The old Nav, PersistentCta and Footer
            are gone — the room's nav and its ending wrap every page, so
            the interior pages sit in the new frame before any of them
            has been redesigned inside it. */}
        <RoomShell>
          <main className="relative z-10">{children}</main>
        </RoomShell>
        <SmoothScroll />
        <ViewTransitions />
      </body>
    </html>
  );
}
