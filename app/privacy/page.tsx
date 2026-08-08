import type { Metadata } from "next";
import { PrivacyPage } from "@/components/legal/privacy-page";

const SITE_URL = "https://executiveaisolutions.com";

export const metadata: Metadata = {
  title: "Privacy | Executive AI Solutions",
  description:
    "What Executive AI Solutions collects, why, and how to have it removed. No tracking cookies, no analytics, nothing sold.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy | Executive AI Solutions",
    description:
      "Plain-language privacy policy: only what you send us, never sold, deleted on request.",
    url: `${SITE_URL}/privacy`,
    siteName: "Executive AI Solutions",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <PrivacyPage />;
}
