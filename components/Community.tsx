import { siteConfig } from "@/lib/site";
import { IconArrowRight } from "./icons";

const links = [
  {
    title: "Discussions",
    body: "Ask questions, share what you're building, and follow design conversations.",
    href: siteConfig.discussions,
  },
  {
    title: "Contributing guide",
    body: "Set up the workspace, find a good first issue, and open a pull request.",
    href: siteConfig.contributing,
  },
  {
    title: "Releases",
    body: "Track version history, changelogs, and migration notes.",
    href: siteConfig.releases,
  },
];

export function Community() {
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-widest2 text-muted">
              04 — Get involved
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-medium tracking-tightest text-paper sm:text-4xl">
              Built in the open.
            </h2>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {links.map(({ title, body, href }) => (
            <a
              key={title}
              href={href}
              className="group flex flex-col justify-between border border-line p-8 transition-colors hover:border-paper/40"
            >
              <div>
                <h3 className="font-display text-lg font-medium text-paper">
                  {title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  {body}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 font-mono text-[12px] uppercase tracking-wide text-yellow">
                Open
                <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
