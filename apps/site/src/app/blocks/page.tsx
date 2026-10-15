import type { Metadata } from "next";

import { LibraryView, type SidebarCategory, type SidebarFooter } from "@/components/library-view";
import { FOOTERS } from "@footer-labs/registry";
import { CATEGORIES } from "@footer-labs/registry/schema";

export const metadata: Metadata = {
  title: "Footers — footer-labs",
  description:
    "Browse every footer in the library by category and dependency tier. One self-contained file each.",
};

const CATEGORY_LABELS: Record<string, string> = {
  minimal: "Minimal",
  editorial: "Editorial",
  kinetic: "Kinetic",
  generative: "Generative",
  photographic: "Photographic",
  terminal: "Terminal",
  data: "Data",
  isometric: "Isometric",
};

/**
 * Browse index.
 *
 * Categories are collapsible groups in the sidebar and footers are direct links
 * inside them, so every footer is one click away. The earlier version made
 * Category/Tier/Status facet filters the primary verb, which meant picking a
 * filter first and then finding the footer — two decisions where one would do,
 * and a page that could not be read as a list of what the library contains.
 *
 * Search lives in the navbar with ⌘K because it filters the whole library, not
 * the sidebar's column. It arrives here as a prop.
 *
 * Every declared category is listed even when it is empty, with a real count.
 * The structure is the roadmap: a visitor can see that `isometric` exists and
 * that nothing is in it yet, which is more honest than a sidebar that silently
 * re-lays-out every time a footer is added.
 */
export default function BlocksPage() {
  const categories: readonly SidebarCategory[] = CATEGORIES.map((id) => ({
    id,
    label: CATEGORY_LABELS[id] ?? id,
  }));

  const footers: readonly SidebarFooter[] = FOOTERS.map((footer) => ({
    name: footer.name,
    title: footer.title,
    description: footer.description,
    category: footer.meta.category,
    tier: footer.meta.tier,
    experimental: footer.meta.status === "experimental",
  }));

  return <LibraryView categories={categories} footers={footers} />;
}
