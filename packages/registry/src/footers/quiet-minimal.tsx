"use client";

/**
 * quiet-minimal
 *
 * The taste bar. Everything else in the library is measured against this one.
 * A footer that does its job with proportion and whitespace instead of tricks.
 *
 * THEMING — read this before editing.
 *
 * Two different jobs, two different mechanisms:
 *
 *   Structural colour  ->  shadcn semantic tokens (bg-background, text-muted-foreground,
 *                          border-border). These re-theme for free in any shadcn project.
 *
 *   Accent colour      ->  the `--fl-hue` custom property, read through `var()` with a
 *                          fallback. This footer never *declares* `--fl-hue`; it only reads
 *                          it, so a value set on any ancestor inherits cleanly and the
 *                          fallback covers the zero-config case.
 *
 * The inline `style` below is sanctioned. It is how a knob writes a custom
 * property, and it is the only inline style a footer-labs component may use.
 */

import { useState } from "react";

export type QuietMinimalProps = {
  /** Accent hue, 0–360. The only knob this footer has. */
  hue?: number;
  className?: string;
};

const COLUMNS = [
  {
    label: "Product",
    links: ["Overview", "Pricing", "Changelog", "Roadmap"],
  },
  {
    label: "Company",
    links: ["About", "Careers", "Press kit", "Contact"],
  },
  {
    label: "Resources",
    links: ["Documentation", "Guides", "Community", "Status"],
  },
  {
    label: "Legal",
    links: ["Privacy", "Terms", "Security", "Cookies"],
  },
] as const;

export function QuietMinimal({ hue = 24, className }: QuietMinimalProps) {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer
      className={`bg-background text-foreground ${className ?? ""}`}
      style={{ "--fl-hue": hue } as React.CSSProperties}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:py-24">
        {/* Statement + newsletter */}
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-sm text-balance text-2xl leading-snug tracking-tight sm:text-3xl">
            Ship the thing, then tell people how to reach you.
          </p>

          <form
            className="flex w-full max-w-sm items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setSubscribed(true);
            }}
          >
            <label htmlFor="quiet-minimal-email" className="sr-only">
              Email address
            </label>
            <input
              id="quiet-minimal-email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              className="h-10 w-full rounded-md border border-border bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-[oklch(0.72_0.16_var(--fl-hue,24))] focus-visible:ring-2 focus-visible:ring-[oklch(0.72_0.16_var(--fl-hue,24))]/40"
            />
            <button
              type="submit"
              className="h-10 shrink-0 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[oklch(0.72_0.16_var(--fl-hue,24))] focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            >
              {subscribed ? "Thanks" : "Subscribe"}
            </button>
          </form>
        </div>

        {/* Link columns */}
        <nav
          aria-label="Footer"
          className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-12 sm:grid-cols-4"
        >
          {COLUMNS.map((column) => (
            <div key={column.label}>
              <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                {column.label}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[oklch(0.72_0.16_var(--fl-hue,24))] focus-visible:outline-none"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Legal bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Northbound. All rights reserved.</p>
          <p>
            Built with{" "}
            <a
              href="#"
              className="font-medium text-[oklch(0.72_0.16_var(--fl-hue,24))] underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[oklch(0.72_0.16_var(--fl-hue,24))] focus-visible:outline-none"
            >
              footer-labs
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default QuietMinimal;
