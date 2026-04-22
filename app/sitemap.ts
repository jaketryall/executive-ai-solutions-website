import type { MetadataRoute } from "next";
import { projects } from "@/lib/data";

const BASE = "https://jakeryall.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: BASE, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/work`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    ...projects.map((p) => ({
      url: `${BASE}/work/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
