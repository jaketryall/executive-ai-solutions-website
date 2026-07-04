import type { Metadata } from "next";
import { WorkIndex } from "@/components/work/work-index";

export const metadata: Metadata = {
  title: "Work | Executive AI Solutions",
  description:
    "Live websites we designed, built, and grew. Custom design, Google Ads with real conversion tracking, local SEO, and AI automation for serious local businesses.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work | Executive AI Solutions",
    description:
      "Live websites we designed, built, and grew. Open a case study and judge the craft up close.",
    url: "https://executiveaisolutions.com/work",
    siteName: "Executive AI Solutions",
    type: "website",
  },
};

export default function WorkPage() {
  return <WorkIndex />;
}
