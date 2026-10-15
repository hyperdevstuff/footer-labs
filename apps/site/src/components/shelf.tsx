"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Horizontal shelf.
 *
 * Vertical scroll is captured once the section is pinned and spent moving the
 * shelves sideways; when the last column has passed, scrolling continues into
 * the next section. A footer is a wide object, so a grid either squashes it or
 * sends the reader sideways by accident — this makes the sideways deliberate
 * and puts it where the reader already is.
 *
 * ── The geometry ───────────────────────────────────────────────────────────
 *
 *   slot   = (viewport - padding) / 2.5   → two full columns visible and half
 *                                          of the third, so the edge reads as
 *                                          an invitation rather than a wall
 *   cols   = 6                            → the run is wide enough that the
 *                                          runway feels like a browse
 *   rows   = 2                            → a card is nearly half the viewport
 *                                          tall, the smallest that still shows
 *                                          a footer's wordmark AND its columns
 *
 * Six columns rather than three is deliberate: with a three-column grid the
 * track is only three slots wide no matter how many footers exist, and the
 * extras stack into rows off-screen right where the reader can never reach
 * them.
 *
 * Travel is computed from these nominal values once and never re-measured,
 * because a track whose width depended on the scroll would feed back into
 * itself.
 *
 * With fewer footers than fill a screen the runway collapses to zero and the
 * section simply shows what it has — which is what happens today, with one
 * footer in the library, and it degrades to a single preview rather than an
 * empty scroll trap. The progress hairline is dropped in that state rather than
 * left sitting at zero: a bar that cannot move reads as a broken control, not
 * as a track with nothing left to spend.
 *
 * Every measured value is written to a `--fl-*` custom property and read by
 * `.fl-shelf*` in `globals.css`. Writing them from effects rather than a JSX
 * `style` prop keeps the layout in the stylesheet and keeps `no-inline-styles`
 * meaningful for everything else.
 *
 * Reduced motion gets a different control, not a broken animation: the same row
 * becomes a plain snap-scrolling strip the reader drives.
 */

const COLS = 6;
const GAP = 16;
const VISIBLE_COLS = 2.5;
/** Row heights, out of 1. The inequality is the scatter. */
const ROW_WEIGHTS = [1.12, 1] as const;
const CHROME = 118;

export function HorizontalShelf({ children, count }: { children: ReactNode; count: number }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  const [reduced, setReduced] = useState(false);
  const [hasRunway, setHasRunway] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /** Measure once per resize. Never inside the scroll handler. */
  useEffect(() => {
    const rail = section.current;
    if (!rail) return;

    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pad = vw < 640 ? 24 : 48;

      const slot = Math.max(260, (vw - pad * 2) / VISIBLE_COLS);

      const weight = ROW_WEIGHTS.reduce((a, b) => a + b, 0);
      const unit = Math.max(150, (vh - CHROME - GAP * (ROW_WEIGHTS.length - 1)) / weight);

      const total = COLS * slot + (COLS - 1) * GAP;
      const runway = Math.max(0, total - vw + pad);

      rail.style.setProperty("--fl-slot", `${Math.round(slot)}px`);
      rail.style.setProperty("--fl-row-a", `${Math.round(unit * ROW_WEIGHTS[0])}px`);
      rail.style.setProperty("--fl-row-b", `${Math.round(unit)}px`);
      rail.style.setProperty("--fl-runway", `${Math.round(runway)}px`);

      setHasRunway(runway > 8);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /** Spend vertical scroll on horizontal travel. One property, nothing else. */
  useEffect(() => {
    const rail = section.current;
    const el = track.current;
    if (reduced || !rail || !el) return;

    const runway = () => parseFloat(rail.style.getPropertyValue("--fl-runway")) || 0;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = rail.getBoundingClientRect();
      const runnable = Math.max(rect.height - window.innerHeight, 1);
      const passed = Math.min(Math.max(-rect.top, 0), runnable);
      el.style.setProperty("--fl-x", String((passed / runnable) * runway()));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div className="fl-shelf-scroll overflow-x-auto pb-4">
        <div className="mx-auto mb-4 flex w-full max-w-400 items-baseline justify-between gap-4 px-6 sm:px-8">
          <h2 className="font-mono text-xs tracking-widest uppercase">The library</h2>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {count} {count === 1 ? "footer" : "footers"}
          </span>
        </div>
        <div className="fl-shelf-grid fl-shelf-snap grid w-max gap-4 px-6 sm:px-8">{children}</div>
      </div>
    );
  }

  return (
    <section ref={section} className="fl-shelf relative">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="w-full">
          <div className="mx-auto mb-4 flex w-full max-w-400 items-baseline justify-between gap-4 px-6 sm:px-8">
            <h2 className="font-mono text-xs tracking-widest uppercase">The library</h2>
            <span className="flex items-center gap-4">
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {count} {count === 1 ? "footer" : "footers"}
              </span>
              {hasRunway ? <ShelfProgress /> : null}
            </span>
          </div>

          <div
            ref={track}
            className="fl-shelf-grid fl-shelf-track grid w-max gap-4 px-6 will-change-transform sm:px-8"
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A hairline that fills as the shelf is spent. The reader has given their scroll
 * to a different axis and needs to be told the sideways motion is finite —
 * without it the shelf reads as a carousel that might loop.
 *
 * Rendered only when there is runway to spend; see the note on `HorizontalShelf`.
 */
function ShelfProgress() {
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = bar.current;
    const section = el?.closest("section");
    if (!el || !section) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const runnable = Math.max(rect.height - window.innerHeight, 1);
      const passed = Math.min(Math.max(-rect.top, 0), runnable);
      el.style.setProperty("--fl-p", String(passed / runnable));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span className="relative block h-px w-24 bg-border">
      <span ref={bar} className="fl-shelf-bar absolute inset-0 block origin-left bg-foreground" />
    </span>
  );
}

/**
 * One shelf. No visible title — a footer is identifiable by its own wordmark
 * and column structure, and a caption under every specimen would give the
 * labels the loudest voice on the page. The name survives as an accessible
 * label and a tooltip.
 *
 * Stretched link, not a wrapping anchor. The specimen is a real footer and a
 * real footer contains real links, so making the card itself an anchor nests
 * `<a>` inside `<a>`: invalid HTML, and a screen reader announces one link
 * with eight links inside it. The whole surface stays clickable through an
 * absolutely-positioned overlay, and the footer's own anchors stay real.
 */
export function ShelfCard({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) {
  return (
    <div className="fl-shelf-card group relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card p-1.5 transition-colors duration-150 hover:border-foreground/40">
      <div className="min-h-0 flex-1 overflow-hidden rounded-lg bg-background">{children}</div>
      <a
        href={href}
        title={label}
        className="absolute inset-0 z-10 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span className="sr-only">{label}</span>
      </a>
    </div>
  );
}
