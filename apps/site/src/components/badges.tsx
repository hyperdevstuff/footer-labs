const TIER_LABEL: Record<string, string> = {
  css: "CSS",
  motion: "Motion",
  webgl: "WebGL",
};

export function TierBadge({ tier }: { tier: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
      {TIER_LABEL[tier] ?? tier}
    </span>
  );
}

export function ExperimentalBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
      <span aria-hidden className="size-1.5 rounded-full bg-foreground" />
      experimental
    </span>
  );
}
