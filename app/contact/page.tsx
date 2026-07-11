import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/contact-page";

const SITE_URL = "https://executiveaisolutions.com";

export const metadata: Metadata = {
  title: "Contact | Executive AI Solutions",
  description:
    "One email starts it. Tell us about your business, get a reply within one business day and a fixed quote in two days. No call required.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Executive AI Solutions",
    description:
      "One email starts it. A reply within one business day, a fixed quote in two days.",
    url: `${SITE_URL}/contact`,
    siteName: "Executive AI Solutions",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Executive AI Solutions",
  url: `${SITE_URL}/contact`,
  about: {
    "@type": "Organization",
    name: "Executive AI Solutions",
    url: SITE_URL,
    email: "hello@executiveaisolutions.com",
  },
};

export default function Page() {
  return (
    <>
      <ContactPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
