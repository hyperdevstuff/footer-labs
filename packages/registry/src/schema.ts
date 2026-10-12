/**
 * Registry types.
 *
 * These mirror shadcn's `registry-item` shape so that every footer installs
 * with `npx shadcn add @footer-labs/<name>`. Our own fields live under `meta`
 * so we stay interoperable forever.
 *
 * This file has zero dependencies on purpose: it is the contract that every
 * copied footer depends on, and it ships as plain source.
 */

export type Tier = "css" | "motion" | "webgl";

export type Category =
  | "minimal"
  | "editorial"
  | "kinetic"
  | "generative"
  | "photographic"
  | "terminal"
  | "data"
  | "isometric";

export type Status = "stable" | "experimental";

/**
 * A technique study credits the source of a *technique* — the easing curve,
 * the masking approach, the type scale. Never the design, layout or copy.
 */
export type Credit =
  | { readonly original: true }
  | { readonly url: string; readonly technique: string; readonly note?: string };

/** A prop a footer accepts, published so the gallery can document it. */
export type FooterProp = {
  readonly name: string;
  readonly type: string;
  readonly default?: string;
  readonly description: string;
};

export type FooterMeta = {
  readonly category: Category;
  readonly tags: readonly string[];
  readonly tier: Tier;
  readonly status: Status;
  readonly contributor: string;
  readonly dateAdded: string;
  readonly credit: Credit;
  /** Props the footer accepts. Rendered on its page instead of a metadata dump. */
  readonly props?: readonly FooterProp[];
  /** What `prefers-reduced-motion` does to this footer. */
  readonly reducedMotion: string;
  /** Honest statement of known accessibility limits. */
  readonly a11y: string;
  /** Rules this footer deliberately breaks. Only allowed on `experimental`. */
  readonly deviations?: readonly string[];
  /** Remote assets the *preview* uses. Never required by the copied code. */
  readonly previewAssets?: readonly string[];
};

export type RegistryFile = {
  readonly path: string;
  readonly type: "registry:component";
  readonly content: string;
};

export type RegistryItem = {
  readonly $schema: "https://ui.shadcn.com/schema/registry-item.json";
  readonly name: string;
  readonly type: "registry:block";
  readonly title: string;
  readonly description: string;
  readonly dependencies: readonly string[];
  readonly registryDependencies: readonly string[];
  readonly files: readonly RegistryFile[];
  readonly meta: FooterMeta;
};

export const CATEGORIES: readonly Category[] = [
  "minimal",
  "editorial",
  "kinetic",
  "generative",
  "photographic",
  "terminal",
  "data",
  "isometric",
];

export const TIERS: readonly Tier[] = ["css", "motion", "webgl"];

/** Rules a footer may only break when `status` is `experimental`. */
export const BREAKABLE_RULES: readonly string[] = [
  "works-without-js",
  "reduced-motion",
  "requires-gpu",
  "contrast",
  "self-contained",
];

/**
 * Validates a registry item. Returns a list of human-readable problems;
 * an empty array means the item is well-formed.
 *
 * Hand-rolled rather than pulled from a schema library: the registry package
 * ships as plain source, and its entire job is to have no dependencies.
 */
export function validateRegistryItem(item: unknown): string[] {
  const errors: string[] = [];
  const at = (path: string, message: string) => errors.push(`${path}: ${message}`);

  if (typeof item !== "object" || item === null) {
    return ["item: expected an object"];
  }
  const i = item as Record<string, unknown>;

  if (i.$schema !== "https://ui.shadcn.com/schema/registry-item.json") {
    at("$.schema", "must be the shadcn registry-item schema URL");
  }
  if (typeof i.name !== "string" || i.name.length === 0) {
    at("name", "is required");
  } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(i.name)) {
    at("name", `"${i.name}" must be kebab-case (slug = registry name = filename)`);
  }
  if (typeof i.title !== "string" || i.title.length === 0) at("title", "is required");
  if (typeof i.description !== "string" || i.description.length === 0) {
    at("description", "is required");
  }
  if (i.type !== "registry:block") at("type", 'must be "registry:block"');
  if (!Array.isArray(i.dependencies)) at("dependencies", "must be an array");
  if (!Array.isArray(i.registryDependencies)) {
    at("registryDependencies", "must be an array");
  }

  const files = i.files;
  if (!Array.isArray(files) || files.length === 0) {
    at("files", "must be a non-empty array");
  } else {
    for (const [index, file] of files.entries()) {
      const f = file as Record<string, unknown>;
      if (typeof f.path !== "string" || !f.path.endsWith(".tsx")) {
        at(`files[${index}].path`, "must be a .tsx path");
      }
      if (f.type !== "registry:component") {
        at(`files[${index}].type`, 'must be "registry:component"');
      }
      if (typeof f.content !== "string" || f.content.length === 0) {
        at(`files[${index}].content`, "must contain the source");
      }
    }
  }

  const meta = i.meta as Record<string, unknown> | undefined;
  if (typeof meta !== "object" || meta === null) {
    at("meta", "is required");
    return errors;
  }

  if (!CATEGORIES.includes(meta.category as Category)) {
    at("meta.category", `"${String(meta.category)}" is not one of ${CATEGORIES.join(", ")}`);
  }
  if (!TIERS.includes(meta.tier as Tier)) {
    at("meta.tier", `"${String(meta.tier)}" is not one of ${TIERS.join(", ")}`);
  }
  if (meta.status !== "stable" && meta.status !== "experimental") {
    at("meta.status", 'must be "stable" or "experimental"');
  }
  if (!Array.isArray(meta.tags) || meta.tags.length === 0) {
    at("meta.tags", "must be a non-empty array");
  }
  if (typeof meta.contributor !== "string" || meta.contributor.length === 0) {
    at("meta.contributor", "is required");
  }
  if (typeof meta.dateAdded !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(meta.dateAdded)) {
    at("meta.dateAdded", "must be an ISO date, YYYY-MM-DD");
  }
  if (typeof meta.reducedMotion !== "string" || meta.reducedMotion.length === 0) {
    at("meta.reducedMotion", "is required — describe the fallback honestly");
  }
  if (typeof meta.a11y !== "string" || meta.a11y.length === 0) {
    at("meta.a11y", "is required — state known limits honestly");
  }

  const credit = meta.credit as Record<string, unknown> | undefined;
  if (typeof credit !== "object" || credit === null) {
    at("meta.credit", "is required — either { original: true } or { url, technique }");
  } else if (credit.original !== true) {
    if (typeof credit.url !== "string" || !/^https?:\/\//.test(credit.url)) {
      at("meta.credit.url", "must be an http(s) URL");
    }
    if (typeof credit.technique !== "string" || credit.technique.length === 0) {
      at("meta.credit.technique", "is required — describe the technique, not the design");
    }
  }

  const deviations = meta.deviations;
  const props = meta.props;

  if (props !== undefined) {
    if (!Array.isArray(props) || props.length === 0) {
      at("meta.props", "must be a non-empty array when present");
    } else {
      for (const [index, prop] of props.entries()) {
        const p = prop as Record<string, unknown>;
        const where = `meta.props[${index}]`;
        if (typeof p.name !== "string" || !/^[a-z][A-Za-z0-9]*$/.test(p.name)) {
          at(`${where}.name`, `"${String(p.name)}" must be a camelCase prop name`);
        }
        if (typeof p.type !== "string" || p.type.length === 0) {
          at(`${where}.type`, "is required");
        }
        if (typeof p.description !== "string" || p.description.length === 0) {
          at(`${where}.description`, "is required");
        }
      }
    }
  }

  if (deviations !== undefined) {
    if (meta.status !== "experimental") {
      at(
        "meta.deviations",
        'are only permitted when status is "experimental" — stable footers must pass every rule',
      );
    }
    if (!Array.isArray(deviations)) {
      at("meta.deviations", "must be an array when present");
    } else {
      for (const rule of deviations) {
        if (!BREAKABLE_RULES.includes(rule as string)) {
          at(
            "meta.deviations",
            `"${String(rule)}" is not a known rule. Known rules: ${BREAKABLE_RULES.join(", ")}`,
          );
        }
      }
    }
  }

  return errors;
}
