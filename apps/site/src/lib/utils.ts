import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Conditional classes with conflict resolution.
 *
 * A template-literal ternary produces two full class strings that can quietly
 * disagree about the same property. This collapses them instead, so
 * `cn("p-2", isWide && "p-8")` ends up at `p-8` rather than depending on the
 * order the CSS happens to be emitted in.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
