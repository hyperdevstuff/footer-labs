import type { MetadataRoute } from "next";

import { footers } from "@footer-labs/registry/catalog";

const BASE = "https://footer-labs.dev";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/blocks`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/credits`, changeFrequency: "monthly", priority: 0.4 },
    ...footers.map((footer) => ({
      url: `${BASE}/footers/${footer.name}`,
      lastModified: new Date(footer.meta.dateAdded),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
