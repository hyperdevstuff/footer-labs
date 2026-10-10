"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sandboxed, lazily-mounted preview.
 *
 * Two reasons this is an iframe rather than an inline render:
 *
 *  1. Isolation. A footer with an infinite rAF loop or a WebGL canvas must not
 *     be able to take down the gallery — and eventually one will.
 *  2. Cost. Thirty previews, some of them WebGL, mounted at once will pin the
 *     frame budget for everything. We only mount what is on screen.
 *
 * Sandboxed with allow-scripts only: no same-origin, so preview code cannot
 * reach the gallery.
 */
export function PreviewFrame({ src, title }: { src: string; title: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = container.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container} className="relative h-full w-full overflow-hidden bg-background">
      {loaded ? null : (
        <div className="absolute inset-0 grid place-items-center">
          <span className="size-4 animate-spin rounded-full border border-border border-t-foreground motion-reduce:hidden" />
        </div>
      )}

      {visible ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          sandbox="allow-scripts"
          onLoad={() => setLoaded(true)}
          className="size-full border-0"
        />
      ) : null}
    </div>
  );
}
