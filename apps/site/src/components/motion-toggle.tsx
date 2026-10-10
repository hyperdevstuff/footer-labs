"use client";

import { useEffect, useState } from "react";

/**
 * Site-level reduce-motion override.
 *
 * Sets `data-reduce-motion` on <html>, which globals.css uses to force every
 * animation and transition to effectively zero. This is not an accessibility
 * checkbox — it is a demo. Flipping it shows each footer's reduced-motion
 * fallback, which is otherwise invisible unless you change an OS setting.
 *
 * `reduced` starts `false` so the server render and the first client render
 * agree; the real preference is read after mount.
 */
export function MotionToggle() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(reduced);
  }, [reduced]);

  return (
    <button
      type="button"
      aria-pressed={reduced}
      onClick={() => setReduced((value) => !value)}
      className="inline-flex h-8 items-center gap-2 rounded-full border border-border px-3 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span
        aria-hidden
        className={`size-3 rounded-full transition-colors ${
          reduced ? "bg-foreground" : "bg-muted-foreground"
        }`}
      />
      Reduce motion
    </button>
  );
}
