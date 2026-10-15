"use client";

import { useCallback, useMemo, useState } from "react";

import type { KnobDef } from "@footer-labs/registry";

/**
 * One `Record<string, unknown>` of prop values, seeded from each knob's
 * declared default, driving both the inline preview and the copied code —
 * the slider and the snippet are the same variable by construction.
 */
export function useKnobState(knobs: readonly KnobDef[]) {
  const initial = useMemo(
    () => Object.fromEntries(knobs.map((knob) => [knob.prop, knob.default])),
    [knobs],
  );
  const [values, setValues] = useState<Record<string, unknown>>(initial);

  const set = useCallback((prop: string, value: unknown) => {
    setValues((previous) => ({ ...previous, [prop]: value }));
  }, []);

  const reset = useCallback(() => setValues(initial), [initial]);

  return { values, set, reset };
}
