"use client";

import { useState } from "react";

/**
 * PROTOTYPE — code panel.
 *
 * Placeholder for `@reui/code-block`, which is the real answer. Reproduced here
 * so the layout can be judged without adding a dependency: line numbers are CSS
 * counters so they never enter a text selection, and the lines a consumer
 * actually edits are marked.
 */
export function CodePanel({
  source,
  filename = "components/footer-quiet-minimal.tsx",
  maxHeight = "max-h-code",
}: {
  source: string;
  filename?: string;
  maxHeight?: string;
}) {
  const lines = source.split("\n");

  /** The lines a footer consumer is expected to change. */
  const isEditable = (line: string) =>
    line.includes("hue") || line.includes("--fl-hue") || line.includes("className={");

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-muted/40">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="truncate font-mono text-xs text-muted-foreground">{filename}</span>
        <CopyButton text={source} />
      </div>
      <pre className={`${maxHeight} overflow-auto px-0 py-3 text-xs leading-relaxed`}>
        <code className="grid" data-line-numbers="">
          {lines.map((line, i) => (
            <span
              key={i}
              data-line=""
              data-highlighted={isEditable(line) ? "true" : undefined}
              className={`px-4 ${isEditable(line) ? "bg-primary/10" : ""}`}
            >
              {line}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="ml-auto shrink-0 rounded border border-border px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}
