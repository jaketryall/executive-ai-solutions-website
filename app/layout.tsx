import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { PersonaCapture } from "@/components/persona-capture";
import { PersistentCta } from "@/components/ui/persistent-cta";
import { SiteChat } from "@/components/ui/site-chat";
import { Footer } from "@/components/footer";
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
  title: "Executive AI Solutions | Google Ads and websites that bring local business more customers",
  description:
    "We run the ads and build the page they land on. Google Ads management from $500/mo, hand-built websites from $2.5k, AI follow-up. One team, accountable for the whole click.",
  // root default: pages without their own alternates inherit this (only the
  // homepage — every interior page declares its own canonical)
  alternates: { canonical: "/" },
  openGraph: {
    title: "Executive AI Solutions | Google Ads and websites that bring local business more customers",
    description:
      "We run the ads and build the page they land on. Google Ads management, hand-built websites, AI follow-up. One team, accountable for the whole click.",
    url: SITE_URL,
    siteName: "Executive AI Solutions",
    type: "website",
    // sitewide default share card; pages with a better image override it
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Executive AI Solutions — Google Ads, websites, and AI follow-up. Mesa, AZ.",
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
  description:
    "Ads agency running Google Ads, building the custom websites they land on, and shipping AI follow-up for local businesses. One team accountable for the whole click.",
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Google Ads management and conversion tracking" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom website design and build" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI automation for business websites" } },
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
        <Nav />
        <PersistentCta />
        <SiteChat />
        <main className="bg-canvas relative z-10">{children}</main>
        <Footer />
        <SmoothScroll />
        <ViewTransitions />
      </body>
    </html>
  );
}
