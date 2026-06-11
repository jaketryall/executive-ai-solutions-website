import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // NOTE: redirect source matching is case-INSENSITIVE — a source of
    // "/FAQ" would match "/faq" itself and loop forever. Only redirect
    // genuinely different paths.
    return [{ source: "/faqs", destination: "/faq", permanent: true }];
  },
};

export default nextConfig;
