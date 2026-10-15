"use client";

import { useEffect, useRef } from "react";

/**
 * Fit a footer into a slot, whole.
 *
 * A footer is a wide, short object — about 3.5:1 — and only at desktop width.
 * Dropped into a narrow slot it re-flows to two link columns and becomes nearly
 * twice as tall, so cropping it loses half the link index. Scaling instead
 * shows the whole component at thumbnail size.
 *
 * A bare `transform: scale()` is not enough on its own: a transform does not
 * change layout, so the wrapper keeps the unscaled size and the slot fills with
 * empty space. The inner box is therefore given the footer's natural width and
 * measured, and the scale is derived from both axes of the actual slot.
 *
 * `children` arrives already rendered from the server. A footer component is a
 * function and cannot cross the client boundary as a prop, but the DOM it
 * produces can — which is why this is a wrapper rather than a renderer.
 */
export function FooterThumb({
  children,
  className,
  alt,
}: {
  children: React.ReactNode;
  className?: string;
  /** Accessible description, since the footer itself carries no label. */
  alt: string;
}) {
  const slot = useRef<HTMLDivElement>(null);
  const natural = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = slot.current;
    const inner = natural.current;
    if (!outer || !inner) return;

    const measure = () => {
      const w = outer.clientWidth;
      const h = outer.clientHeight;
      if (!w || !h) return;
      const next = Math.min(w / inner.offsetWidth, h / inner.offsetHeight);
      if (next > 0) inner.style.setProperty("--fl-scale", String(next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={slot} className={`fl-thumb overflow-hidden ${className ?? ""}`}>
      <div ref={natural} role="img" aria-label={alt} className="fl-thumb-inner">
        {children}
      </div>
    </div>
  );
}
