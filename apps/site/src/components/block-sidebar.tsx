"use client";

import { FOOTERS } from "@footer-labs/registry";
import { CATEGORIES } from "@footer-labs/registry/schema";

import { LibrarySidebar } from "@/components/library-sidebar";

/**
 * Showcase sidebar.
 *
 * The same grouped component the browse index uses, so moving between the two
 * pages does not rearrange the room. A footer is one click from anywhere, and
 * the group you are in stays open around the page you are reading.
 */
export function BlockSidebar({ active }: { active: string }) {
  const categories = CATEGORIES.map((id) => ({
    id,
    label: id.charAt(0).toUpperCase() + id.slice(1),
  }));

  const footers = FOOTERS.map((footer) => ({
    name: footer.name,
    title: footer.title,
    description: footer.description,
    category: footer.meta.category,
    tier: footer.meta.tier,
    experimental: footer.meta.status === "experimental",
  }));

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-0 flex h-dvh flex-col overflow-y-auto px-5 py-6">
        <LibrarySidebar categories={categories} footers={footers} active={active} query="" />
      </div>
    </aside>
  );
}
