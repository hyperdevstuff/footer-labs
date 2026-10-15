/**
 * Preview context.
 *
 * Deliberately tiny: a fragment of CTA, then the footer. An earlier version
 * built a whole fake page — nav, hero, feature grid — and it made the footer
 * look like an afterthought in a specimen box. A footer sits below a CTA, so
 * that is all it needs to sit below.
 */
export function DemoContext({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 pt-20 pb-6 sm:px-8">
        <div className="max-w-md">
          <h2 className="font-display text-2xl tracking-tight">Ready when you are.</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start free, keep your work, upgrade only when you outgrow it.
          </p>
          <span className="mt-6 inline-flex h-10 items-center rounded-md bg-foreground px-5 text-sm font-medium text-background">
            Get started
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
