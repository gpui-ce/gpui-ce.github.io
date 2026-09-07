import Image from "next/image";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    heading: "Project",
    links: [
      { label: "Documentation", href: siteConfig.githubRepo },
      { label: "Source", href: siteConfig.githubRepo },
      { label: "Releases", href: siteConfig.releases },
      { label: "License", href: siteConfig.license },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Discussions", href: siteConfig.discussions },
      { label: "Contributing", href: siteConfig.contributing },
      { label: "Issues", href: `${siteConfig.githubRepo}/issues` },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line-soft">
      <div className="container-page grid gap-12 py-16 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="GPUI-CE"
              width={28}
              height={28}
              className="border border-black"
            />
            <span className="font-mono text-sm font-medium tracking-widest2 text-paper">
              GPUI<span className="text-yellow">-CE</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            A community-maintained, GPU-accelerated UI framework for Rust.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.heading}>
            <h4 className="font-mono text-[12px] uppercase tracking-widest2 text-muted">
              {column.heading}
            </h4>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[15px] text-paper/90 transition-colors hover:text-yellow"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line-soft">
        <div className="container-page flex flex-col gap-2 py-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} GPUI-CE contributors. MIT OR Apache-2.0.</p>
          <p>Not affiliated with or endorsed by Zed Industries.</p>
        </div>
      </div>
    </footer>
  );
}
