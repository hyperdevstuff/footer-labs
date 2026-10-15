"use client";

import { useState } from "react";

import {
  CommandLine,
  PmTabs,
  installCommand,
  registryCommand,
  type Pm,
} from "@/components/showcase/install-command";

/**
 * Landing-page install block.
 *
 * Two steps, not one, and the order matters: `registry add` tells the CLI that
 * `@footer-labs` exists at all, and only then can `add` resolve a name inside
 * it. Showing just the second command — which is what every gallery does —
 * leaves people with a namespace error and no explanation.
 *
 * One shared package-manager value drives both, so switching to `bun` rewrites
 * every command on the page at once.
 */
export function RegistrySetup() {
  const [pm, setPm] = useState<Pm>("pnpm");

  return (
    <div>
      <div className="flex items-center justify-end">
        <PmTabs value={pm} onChange={setPm} />
      </div>

      <ol className="mt-3 flex flex-col gap-3">
        <li>
          <CommandLine command={registryCommand(pm)} />
        </li>
        <li>
          <CommandLine command={installCommand(pm, "quiet-minimal")} />
        </li>
      </ol>

      <p className="mt-3 text-xs text-pretty text-muted-foreground">
        One-time setup. After it, every footer installs as{" "}
        <code className="font-mono">@footer-labs/&lt;name&gt;</code>.
      </p>
    </div>
  );
}
