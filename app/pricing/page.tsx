import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing/pricing-page";
import { Estimate } from "@/components/sections/estimate";
import {
  PROJECT_TYPES,
  FEATURES,
  MONTHLY,
} from "@/components/estimator/pricing";

const SITE_URL = "https://executiveaisolutions.com";

export const metadata: Metadata = {
  title: "Pricing | Executive AI Solutions",
  description:
    "The actual sheet we quote from: websites from $2.5k, Google Ads management from $500/mo, AI automation per project. Price your own project in sixty seconds, fixed quote in two days.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing | Executive AI Solutions",
    description:
      "The actual sheet we quote from, published. Price your own project in sixty seconds, fixed quote in two days.",
    url: `${SITE_URL}/pricing`,
    siteName: "Executive AI Solutions",
    type: "website",
  },
};

// answer-engine surface: the sheet, machine-readable (from the same data)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Executive AI Solutions pricing",
  url: `${SITE_URL}/pricing`,
  itemListElement: [
    ...PROJECT_TYPES.map((t) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: `${t.label} website` },
      price: t.base,
      priceCurrency: "USD",
    })),
    ...FEATURES.map((f) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: f.label },
      price: f.add,
      priceCurrency: "USD",
    })),
    ...MONTHLY.filter((m) => m.monthly > 0).map((m) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: m.label },
      price: m.monthly,
      priceCurrency: "USD",
    })),
  ],
};

export default function Page() {
  return (
    <>
      <PricingPage />
      <Estimate standalone />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
