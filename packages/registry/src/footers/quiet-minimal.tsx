/**
 * quiet-minimal
 *
 * The taste bar. Everything else in the library is measured against this one.
 *
 * The strongest thing a footer can do is get out of the way, so this one makes
 * a deliberate choice: no newsletter capture, no social row, no motion, and no
 * client-side JavaScript at all. It is a pure server component. Everything it
 * does is done with proportion, a hairline, and restrained type.
 *
 * Tier: css. Zero dependencies.
 *
 * ── Theming ──────────────────────────────────────────────────────────────
 *
 * Structural colour comes from shadcn's semantic tokens, so this footer
 * re-themes for free inside a themed project.
 *
 * The accent comes from `--fl-hue`, and this component never *declares* that
 * property — it only reads it, through var() with a fallback. That is what
 * lets a value set on any ancestor inherit cleanly, and what lets the site's
 * live knobs drive it. Declaring `--fl-hue` on this element would shadow both.
 *
 * Three ways to set it, in order of precedence:
 *
 *   <QuietMinimal hue={200} />              // explicit prop
 *   :root { --fl-hue: 200 }                 // theme snippet on an ancestor
 *   nothing — the fallback below             // the default is already tasteful
 */

export type QuietMinimalProps = {
  /** Accent hue, 0–360. The only knob this footer has. */
  hue?: number;
  className?: string;
};

const COLUMNS = [
  { label: "Product", links: ["Overview", "Pricing", "Changelog", "Roadmap"] },
  { label: "Company", links: ["About", "Careers", "Press"] },
  { label: "Resources", links: ["Documentation", "Guides", "Status"] },
  { label: "Legal", links: ["Privacy", "Terms", "Security"] },
] as const;

export function QuietMinimal({ hue = 24, className }: QuietMinimalProps) {
  return (
    <footer
      className={`relative bg-background text-foreground ${className ?? ""}`}
      style={{ "--fl-hue": hue } as React.CSSProperties}
    >
      {/*
        One short accent rule at the top edge. It is the only ornament, and it
        exists so the footer has a visible relationship to whatever accent the
        surrounding page uses.
      */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 mx-auto h-px w-16 bg-[oklch(0.72_0.16_var(--fl-hue,24))]"
      />

      <div className="mx-auto w-full max-w-6xl px-6 pt-24 pb-10 sm:px-8 sm:pt-32">
        {/* Statement */}
        <div className="max-w-xl">
          <p className="text-2xl tracking-tight text-balance sm:text-3xl">Northbound</p>
          <p className="mt-4 text-pretty text-muted-foreground">
            A short, honest closing line goes here — or nothing at all, which is sometimes the
            better choice.
          </p>
        </div>

        {/* Link index */}
        <nav
          aria-label="Footer"
          className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-border pt-12 sm:grid-cols-4"
        >
          {COLUMNS.map((column) => (
            <div key={column.label}>
              <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                {column.label}
              </h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline hover:decoration-[oklch(0.72_0.16_var(--fl-hue,24))] focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[oklch(0.72_0.16_var(--fl-hue,24))] focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Legal */}
        <div className="mt-20 flex flex-col gap-3 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Northbound. All rights reserved.</p>
          <p>Set in Inter and Paper Mono.</p>
        </div>
      </div>
    </footer>
  );
}

export default QuietMinimal;
