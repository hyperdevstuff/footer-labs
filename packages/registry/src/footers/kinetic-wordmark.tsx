/**
 * kinetic-wordmark — a footer whose centre of gravity is a full-bleed
 * statement wordmark, with one of four pure-CSS hover gestures selected by
 * the `variant` prop. Zero dependencies; the entrance is CSS keyframes and
 * every gesture is a hover transition gated behind (hover: hover).
 *
 * Provenance: ported from the author's own wordmark component
 * (hyperdevstuff/Aggre-gator, client/src/components/landing/wordmark.tsx).
 * Same author, so no third-party credit is owed.
 *
 * Two costs, stated rather than hidden:
 * - The entrance runs on load, so a footer mounted below the fold has
 *   already animated before the visitor scrolls to it (no IntersectionObserver
 *   without JS; Tier stays `css`).
 * - The per-letter stagger is nth-child CSS, capped at 16 letters. Longer
 *   words render whole — the `n+17` rule zeroes the delay — they just lose
 *   the stagger.
 */

const STAGGER_MS = 26;

const css = `
[data-kinetic-wordmark] {
  --fl-ink: var(--foreground, oklch(0.985 0 0));
  --fl-accent: oklch(0.78 0.14 var(--fl-hue, 265));
  --fl-image: none;
}

[data-kinetic-wordmark] [data-utility] a {
  transition: color 0.25s ease;
}
[data-kinetic-wordmark] [data-utility] a:hover {
  color: var(--fl-accent);
}

[data-kinetic-wordmark] [data-wordmark] {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  line-height: 0.95;
  white-space: pre;
}
[data-kinetic-wordmark][data-align="left"] [data-wordmark] { justify-content: flex-start; }
[data-kinetic-wordmark][data-align="center"] [data-wordmark] { justify-content: center; }
[data-kinetic-wordmark][data-align="right"] [data-wordmark] { justify-content: flex-end; }

[data-kinetic-wordmark] [data-letter] {
  display: inline-block;
  --split-delay: 0ms;
  --tilt: 0deg;
}
[data-kinetic-wordmark] [data-letter]:nth-child(2) { --split-delay: ${1 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(3) { --split-delay: ${2 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(4) { --split-delay: ${3 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(5) { --split-delay: ${4 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(6) { --split-delay: ${5 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(7) { --split-delay: ${6 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(8) { --split-delay: ${7 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(9) { --split-delay: ${8 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(10) { --split-delay: ${9 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(11) { --split-delay: ${10 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(12) { --split-delay: ${11 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(13) { --split-delay: ${12 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(14) { --split-delay: ${13 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(15) { --split-delay: ${14 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(16) { --split-delay: ${15 * STAGGER_MS}ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(n+17) { --split-delay: 0ms; }
[data-kinetic-wordmark] [data-letter]:nth-child(odd) { --tilt: -2deg; }
[data-kinetic-wordmark] [data-letter]:nth-child(even) { --tilt: 1.5deg; }

@media (prefers-reduced-motion: no-preference) {
  [data-kinetic-wordmark] [data-letter] {
    animation: kw-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: var(--split-delay);
  }
  @keyframes kw-enter {
    from { opacity: 0; transform: translateY(0.35em); }
    to { opacity: 1; transform: translateY(0); }
  }
}

/*
 * reveal — a straight horizontal cut. Each letter shows its top half at
 * rest; hovering the wordmark opens every clip, staggered per letter.
 */
[data-kinetic-wordmark][data-variant="reveal"] [data-letter] {
  clip-path: inset(0 0 50% 0);
  transition: clip-path 0.45s cubic-bezier(0.65, 0, 0.35, 1), color 0.3s ease;
  transition-delay: var(--split-delay), 0ms;
}
@media (hover: hover) and (pointer: fine) {
  [data-kinetic-wordmark][data-variant="reveal"]:hover [data-letter] {
    clip-path: inset(-0.05em -0.05em -0.1em -0.05em);
    color: var(--fl-accent);
  }
}

/*
 * wipe — arrives as a hairline outline and fills left to right. One element
 * per glyph carries both the stroke and the fill (clipped to its own text),
 * so the outline and the fill cannot drift across two stacked copies.
 */
[data-kinetic-wordmark][data-variant="wipe"] [data-letter] {
  color: transparent;
  -webkit-text-stroke: 0.022em var(--fl-accent);
  background-image: var(--fl-image, linear-gradient(var(--fl-accent), var(--fl-accent)));
  background-repeat: no-repeat;
  background-size: 0% 100%;
  background-position: left bottom;
  -webkit-background-clip: text;
  background-clip: text;
  transition: background-size 0.6s cubic-bezier(0.65, 0, 0.35, 1);
  transition-delay: var(--split-delay);
}
@media (hover: hover) and (pointer: fine) {
  [data-kinetic-wordmark][data-variant="wipe"]:hover [data-letter] {
    background-size: 100% 100%;
  }
}

/*
 * riffle — the word sits as a hand of cards, each letter tipped off the
 * shared baseline by --tilt. Hover stands one letter up and squares it.
 */
[data-kinetic-wordmark][data-variant="riffle"] [data-letter] {
  transform: translateY(0.06em) rotate(var(--tilt));
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@media (hover: hover) and (pointer: fine) {
  [data-kinetic-wordmark][data-variant="riffle"] [data-letter]:hover {
    transform: translateY(0) rotate(0deg);
  }
}

/*
 * focus — every letter knocked back to a ghost tone; hover brings one to
 * full ink and the rest recede further. Retrieval rather than reveal.
 */
[data-kinetic-wordmark][data-variant="focus"] [data-letter] {
  opacity: 0.32;
  transition: opacity 0.3s ease;
}
@media (hover: hover) and (pointer: fine) {
  [data-kinetic-wordmark][data-variant="focus"]:hover [data-letter] {
    opacity: 0.14;
  }
  [data-kinetic-wordmark][data-variant="focus"] [data-letter]:hover {
    opacity: 1;
    color: var(--fl-accent);
  }
}

/*
 * Touch and other hoverless devices always get the complete, open word —
 * on every variant, not just wipe. reveal would otherwise strand a
 * permanently half-cut word with no way to open it.
 */
@media (hover: none) {
  [data-kinetic-wordmark][data-variant="reveal"] [data-letter] { clip-path: none; }
  [data-kinetic-wordmark][data-variant="wipe"] [data-letter] { background-size: 100% 100%; }
  [data-kinetic-wordmark][data-variant="riffle"] [data-letter] { transform: none; }
  [data-kinetic-wordmark][data-variant="focus"] [data-letter] { opacity: 1; }
}

/*
 * Reduced motion degrades to a complete, static, correct wordmark: entrance
 * animation off, nothing clipped, nothing half-filled, nothing tipped,
 * nothing ghosted. It is the same footer without the kinetics.
 */
@media (prefers-reduced-motion: reduce) {
  [data-kinetic-wordmark] [data-letter] {
    animation: none;
    transition: none;
  }
  [data-kinetic-wordmark][data-variant="reveal"] [data-letter] { clip-path: none; }
  [data-kinetic-wordmark][data-variant="wipe"] [data-letter] { background-size: 100% 100%; }
  [data-kinetic-wordmark][data-variant="riffle"] [data-letter] { transform: none; }
  [data-kinetic-wordmark][data-variant="focus"] [data-letter] { opacity: 1; }
}
`;

export type KineticWordmarkVariant = "reveal" | "wipe" | "riffle" | "focus";
export type KineticWordmarkAlign = "left" | "center" | "right";

export type KineticWordmarkProps = {
  /** Which hover gesture the wordmark performs. */
  variant?: KineticWordmarkVariant;
  /** The statement word. Invented default — replace it with yours. */
  word?: string;
  /** Horizontal alignment of the wordmark track. */
  align?: KineticWordmarkAlign;
  /** Accent hue. Written to `--fl-hue` on the root; ancestors may set it instead. */
  hue?: number;
  /**
   * Optional texture used as the wipe fill. Never required — without it the
   * wipe fills with the accent colour. No asset ships with this file.
   */
  imageSrc?: string;
};

export default function KineticWordmark({
  variant = "reveal",
  word = "Meridian",
  align = "center",
  hue,
  imageSrc,
}: KineticWordmarkProps) {
  const letters = Array.from(word);

  const rootStyle: Record<string, string | number> = {};
  if (hue !== undefined) rootStyle["--fl-hue"] = hue;
  if (imageSrc) rootStyle["--fl-image"] = `url("${imageSrc}")`;

  return (
    <footer
      data-kinetic-wordmark=""
      data-variant={variant}
      data-align={align}
      style={rootStyle}
      className="w-full overflow-hidden border-t border-border bg-background text-foreground"
    >
      <style>{css}</style>

      <nav
        aria-label="Footer"
        data-utility=""
        className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-10"
      >
        <span className="text-sm text-muted-foreground">© 2019 Wavelength Press</span>
        <div className="flex flex-wrap gap-6">
          {["Work", "Studio", "Contact"].map((label) => (
            <a
              key={label}
              href={`/${label.toLowerCase()}`}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="px-6 pb-12 sm:px-10 sm:pb-16">
        <h2 className="sr-only">{word}</h2>
        <p
          aria-hidden={letters.length === 0 ? undefined : true}
          data-wordmark=""
          className="m-0 select-none font-sans text-[clamp(3rem,13vw,10rem)] font-bold uppercase tracking-tight text-[color:var(--fl-ink)]"
        >
          {letters.map((letter, index) => (
            <span key={`${letter}-${index}`} data-letter="">
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
