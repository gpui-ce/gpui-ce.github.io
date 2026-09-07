const spec = [
  {
    term: "Origin",
    detail:
      "Forked from the gpui crate built by Zed Industries for the Zed editor.",
  },
  {
    term: "Release cadence",
    detail: "Decoupled from Zed's editor release schedule.",
  },
  {
    term: "Governance",
    detail:
      "Public RFCs and a maintainer team drawn from active contributors.",
  },
  {
    term: "Scope",
    detail: "UI framework only — no editor-specific APIs or dependencies.",
  },
  {
    term: "License",
    detail: "MIT OR Apache-2.0, unchanged from upstream.",
  },
  {
    term: "Affiliation",
    detail: "Independent project, not affiliated with or endorsed by Zed Industries.",
  },
];

export function WhySection() {
  return (
    <section id="why" className="border-b border-line-soft bg-surface py-24">
      <div className="container-page grid gap-16 lg:grid-cols-2">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-widest2 text-muted">
            03 — Why a community edition
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-medium tracking-tightest text-paper sm:text-4xl">
            The framework, kept moving on its own terms.
          </h2>
          <p className="mt-6 max-w-md text-balance leading-relaxed text-muted">
            GPUI was built to serve one editor&apos;s roadmap. GPUI-CE exists so
            the framework itself can grow independently — its own versioning,
            its own review process, and a contribution path open to anyone
            building with it, not only those building Zed.
          </p>
        </div>

        <dl className="divide-y divide-line border-y border-line">
          {spec.map(({ term, detail }) => (
            <div
              key={term}
              className="grid grid-cols-[minmax(0,140px)_1fr] gap-6 py-5"
            >
              <dt className="font-mono text-[13px] uppercase tracking-wide text-muted">
                {term}
              </dt>
              <dd className="text-[15px] leading-relaxed text-paper">
                {detail}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
