"use client";

import { ArrowUpRight, Check, ChevronDown, Copy, Sparkles } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

/**
 * "Open in…" menu over the preview.
 *
 * ChatGPT, Claude and v0 get a real deep link. Cursor and Windsurf have no
 * public chat deep link, so they copy the prompt instead of pretending — a
 * button that silently does the wrong thing is worse than no button.
 */
export type OpenTarget = { label: string; href: string };

export function OpenInMenu({
  targets,
  prompt,
  align = "right",
}: {
  targets: readonly OpenTarget[];
  prompt: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function copyFor(label: string) {
    void navigator.clipboard.writeText(prompt);
    setCopied(label);
    setTimeout(() => setCopied(null), 1600);
    setOpen(false);
  }

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Sparkles aria-hidden className="size-3.5" />
        Open in
        <ChevronDown aria-hidden className="size-3 opacity-60" />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className={`absolute z-30 mt-1.5 w-48 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {targets.map((target) => (
            <a
              key={target.label}
              role="menuitem"
              href={target.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-8 items-center justify-between rounded-sm px-2.5 text-xs transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none"
            >
              {target.label}
              <ArrowUpRight aria-hidden className="size-3 opacity-50" />
            </a>
          ))}

          <div className="my-1 h-px bg-border" />

          <p className="px-2.5 py-1 text-xs leading-snug text-muted-foreground">
            No chat deep link
          </p>
          {["Cursor", "Windsurf"].map((label) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              onClick={() => copyFor(label)}
              className="flex h-8 w-full items-center justify-between rounded-sm px-2.5 text-xs transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none"
            >
              {label}
              {copied === label ? (
                <Check aria-hidden className="size-3" />
              ) : (
                <Copy aria-hidden className="size-3 opacity-50" />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
