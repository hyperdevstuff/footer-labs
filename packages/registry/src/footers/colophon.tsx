/**
 * colophon
 *
 * The colophon is the last leaf of a book: where an edition states who set
 * it, in what, and under what licence. This footer takes that page as its
 * structure, so the links read like a contents page and the metadata reads
 * like a specification of the thing the links belong to.
 *
 * Tier: css. Zero npm dependencies.
 *
 * It is a client component, not a server one. The licence line is a disclosure
 * controlled by `useState`, which is what makes it a disclosure rather than a
 * tooltip or a popover — it stays in the document flow, so it cannot cover the
 * links above it. The cost is one `useState` and a hydration boundary on a
 * component that is otherwise static markup. `quiet-minimal` has no script at
 * all; that is the trade this footer makes for a real one.
 *
 * ── What is borrowed, and from where ────────────────────────────────────────
 *
 * Techniques studied on two public footers and rebuilt from scratch. The
 * layouts, colours, type and words are ours; `meta.credit` in `footers-meta.ts`
 * records the source.
 *
 *   · A two-level column header built as a SCALE JUMP rather than a style
 *     change — a quiet label, then the sub-brand set larger in the same
 *     family. Studied on hermes-agent.nousresearch.com.
 *
 *   · A link hover that is a filled chip which inverts, at zero colour
 *     duration so it snaps instead of fading, with the rows butted together
 *     by a negative margin so a column's links read as one continuous block.
 *     Studied on hermes-agent.nousresearch.com. The focus state is the same
 *     inversion, so pointer and keyboard see one object.
 *
 *   · A licence set at the same size as the legal links beside it — a peer,
 *     not fine print. Studied on hermes-agent.nousresearch.com.
 *
 *   · Legal as a peer column with its own heading, holding the documents that
 *     only matter to companies. Studied on paper.design.
 *
 * ── Theming ────────────────────────────────────────────────────────────────
 *
 * Structural colour comes from shadcn's semantic tokens, so this footer
 * re-themes for free inside a themed project.
 *
 * The accent comes from `--fl-hue`, read through var() with a fallback. The
 * root *does* declare it, inline, from the `hue` prop — that is the sanctioned
 * explicit layer. What it must never do is read it back: an element that both
 * declares and reads a property resolves to its own declaration, which would
 * break both the theme snippet set on an ancestor and the live knobs. So every
 * `var(--fl-hue)` in this file sits on a descendant, and the root only writes.
 *
 *   <Colophon hue={200} />                // explicit prop
 *   :root { --fl-hue: 200 }               // theme snippet on an ancestor
 *   nothing — the fallback below           // the default is already tasteful
 */

"use client";

import { useState } from "react";

export type ColophonProps = {
  /** Accent hue, 0–360. The only knob this footer has. */
  hue?: number;
  className?: string;
};

/**
 * The first line of the MIT licence, shown when the licence line is opened.
 *
 * A real document, not filler: for an open-source tool this is the sentence a
 * reader actually needs, and it is the reason the licence belongs in the
 * footer at all.
 */
const LICENCE_BODY =
  "Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files.";

const COLUMNS = [
  {
    label: "Build",
    title: "Plinth",
    links: ["Overview", "Install", "Changelog", "Roadmap"],
  },
  {
    label: "Project",
    title: "Open source",
    links: ["Source", "Issues", "Contributing", "Releases"],
  },
  {
    label: "Learn",
    title: "Documentation",
    links: ["Guides", "Migration", "Support", "Status"],
  },
  {
    label: "Legal",
    title: "The small print",
    links: ["Privacy", "Terms", "Sub-processors", "DPAs"],
  },
] as const;

/**
 * Shared class for a metadata pair. The label sits above the value rather than
 * beside it so the strip stays a set of stacked facts at 320px and does not
 * turn into a two-column table nobody can read.
 */
const META_LABEL = "text-xs text-muted-foreground";
const META_VALUE = "mt-1 text-sm text-foreground tabular-nums";

export function Colophon({ hue = 265, className }: ColophonProps) {
  const [licenceOpen, setLicenceOpen] = useState(false);

  return (
    <footer
      className={`relative bg-background text-foreground ${className ?? ""}`}
      style={{ "--fl-hue": hue } as React.CSSProperties}
    >
      <div className="mx-auto w-full max-w-6xl px-6 pt-20 pb-10 sm:px-8 sm:pt-28">
        {/*
          Closing statement. The last line written on the page, and the only
          place the product speaks in the first person. It ends in a full
          stop rather than trailing off into the link columns.
        */}
        <p className="max-w-2xl text-3xl tracking-tight text-balance sm:text-4xl">
          Every build states what it was made from.
        </p>

        {/*
          The index. Each column opens with a quiet label and a larger title in
          the same family: a scale jump, not a change of style, so the block
          reads as a contents page instead of four lists of links.

          The negative margin on the <ul> butts the rows together; each row
          carries matching top and bottom padding, so the group is flush but
          the links are still comfortably tappable.
        */}
        <nav
          aria-label="Footer"
          className="mt-20 grid grid-cols-2 gap-x-6 gap-y-14 border-t border-border pt-12 sm:grid-cols-4 sm:gap-x-8"
        >
          {COLUMNS.map((column) => (
            <div key={column.label}>
              <p className="text-sm text-muted-foreground">{column.label}</p>
              <p className="mt-2 text-2xl leading-tight tracking-tight">{column.title}</p>
              <ul className="-my-1 mt-6 flex flex-col">
                {column.links.map((link) => (
                  <li key={link} className="flex">
                    <a
                      href="#"
                      className="-ml-2 inline-flex self-start rounded-sm bg-transparent px-2 py-1.5 text-base text-foreground transition-colors duration-150 ease-out hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background focus-visible:outline-none"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/*
          The colophon proper: what this thing is made of, stated as data.

          The label and the value are stacked so the four facts stay readable
          at 320px. Tabular figures on the values because the version and the
          runtime are numbers, and they sit under each other in a column where
          they should not jitter when they change.
        */}
        <div className="mt-14 border-t border-border pt-10">
          <h2 className="sr-only">About this build</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-8">
            <div>
              <dt className={META_LABEL}>Version</dt>
              <dd className={META_VALUE}>4.2.0</dd>
            </div>
            <div>
              <dt className={META_LABEL}>Runtime</dt>
              <dd className={META_VALUE}>Node 24</dd>
            </div>
            <div>
              <dt className={META_LABEL}>Set in</dt>
              <dd className="mt-1 text-sm text-foreground">Your system sans</dd>
            </div>
            <div>
              <dt className={META_LABEL}>Licence</dt>
              <dd className="mt-1 text-sm">
                <button
                  type="button"
                  onClick={() => setLicenceOpen((open) => !open)}
                  aria-expanded={licenceOpen}
                  className="rounded-sm text-left text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-[oklch(0.72_0.16_var(--fl-hue,265))] focus-visible:ring-2 focus-visible:ring-[oklch(0.72_0.16_var(--fl-hue,265))] focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
                >
                  MIT License · 2026
                </button>
              </dd>
            </div>
          </dl>

          {/*
            The licence's first line. A real paragraph, not a tooltip: it stays
            in the document flow so it cannot cover the links above it, and it
            is readable without script because without script it is simply
            never opened — the footer is complete either way.
          */}
          {licenceOpen ? (
            <p className="mt-8 max-w-2xl border-l-2 border-border pl-4 text-pretty text-sm text-muted-foreground">
              {LICENCE_BODY}
            </p>
          ) : null}
        </div>

        <p className="mt-12 text-base text-muted-foreground">
          © 2026 Plinth. Free and open source.
        </p>
      </div>
    </footer>
  );
}

export default Colophon;
