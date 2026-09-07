import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { IconGithub } from "./icons";

const links = [
  { href: "#features", label: "Features" },
  { href: "#example", label: "Example" },
  { href: "#why", label: "Why CE" },
  { href: siteConfig.discussions, label: "Community" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line-soft bg-ink/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="#top" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="GPUI-CE"
            width={32}
            height={32}
            className="border border-black"
            priority
          />
          <span className="font-mono text-sm font-medium tracking-widest2 text-paper">
            GPUI<span className="text-yellow">-CE</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-[13px] uppercase tracking-wide text-muted transition-colors hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={siteConfig.githubRepo}
            className="hidden h-9 w-9 items-center justify-center border border-line text-muted transition-colors hover:border-paper hover:text-paper sm:flex"
            aria-label="View source on GitHub"
          >
            <IconGithub className="h-4 w-4" />
          </a>
          <a
            href={siteConfig.githubRepo}
            className="hidden border-2 border-black bg-yellow px-4 py-2 font-mono text-[13px] font-medium uppercase tracking-wide text-black shadow-hard-sm transition-transform hover:-translate-y-0.5 hover:shadow-hard sm:inline-block"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
