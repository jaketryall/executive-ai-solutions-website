import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/anim/smooth-scroll";

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
  title: "Executive AI Solutions | Websites that win customers",
  description:
    "Custom web design, SEO and Google Ads, and AI automation for serious local businesses. No templates. Every project individually quoted, from $2.5k.",
  openGraph: {
    title: "Executive AI Solutions | Websites that win customers",
    description:
      "Custom web design, SEO and Google Ads, and AI automation for serious local businesses. Every project individually quoted.",
    url: SITE_URL,
    siteName: "Executive AI Solutions",
    type: "website",
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
    "Web design agency building custom websites, running SEO and Google Ads, and shipping AI automation for local businesses.",
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom website design and build" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO and Google Ads management" } },
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
        <Nav />
        <main className="bg-canvas relative z-10">{children}</main>
        <Footer />
        <SmoothScroll />
      </body>
    </html>
  );
}
