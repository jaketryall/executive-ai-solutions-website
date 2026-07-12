import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the dev-tools badge parks bottom-left, exactly where the case-study
  // on-page nav lives — and it doesn't exist in production anyway
  devIndicators: false,
  async redirects() {
    // NOTE: redirect source matching is case-INSENSITIVE — a source of
    // "/FAQ" would match "/faq" itself and loop forever. Only redirect
    // genuinely different paths.
    return [
      { source: "/faqs", destination: "/faq", permanent: true },
      // the three stages have their own pages; the bare index is the
      // homepage funnel overview
      { source: "/services", destination: "/#services", permanent: false },
    ];
  },
};

export default nextConfig;
