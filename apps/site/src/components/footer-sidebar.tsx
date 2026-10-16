"use client";

import { useState } from "react";

import { FOOTERS } from "@footer-labs/registry";
import { CATEGORIES } from "@footer-labs/registry/schema";

import { LibrarySidebar, SidebarColumn } from "@/components/library-sidebar";

/**
 * Showcase sidebar.
 *
 * The same grouped column the browse index mounts, so moving between the two
 * pages does not rearrange the room. A footer is one click from anywhere, and
 * the group you are in stays open around the page you are reading.
 *
 * It owns its own search query. The showcase is a server component and this is
 * not, so the state has to live down here rather than being threaded in from
 * `page.tsx` — which means the sidebar filters itself here and not on the
 * browse page. That is the same behaviour: one field, one list underneath it.
 */
export function FooterSidebar({ active }: { active: string }) {
  const [query, setQuery] = useState("");

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
    <SidebarColumn>
      <LibrarySidebar
        categories={categories}
        footers={footers}
        active={active}
        query={query}
        onQueryChange={setQuery}
      />
    </SidebarColumn>
  );
}
