import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { InstallCommand } from "./InstallCommand";
import { IconArrowRight, IconGithub } from "./icons";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-line-soft bg-dotgrid">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />

      <div className="container-page relative grid gap-16 py-24 md:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-8 inline-flex items-center gap-2 border border-line px-3 py-1.5 font-mono text-[12px] uppercase tracking-widest2 text-muted">
            <span className="h-1.5 w-1.5 bg-yellow" />
            Community-maintained · MIT OR Apache-2.0
          </div>

          <h1 className="text-balance font-display text-5xl font-medium leading-[1.05] tracking-tightest text-paper sm:text-6xl">
            A GPU-accelerated
            <br />
            UI framework
            <br />
            for <span className="text-yellow">Rust</span>.
          </h1>

          <p className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-muted">
            GPUI-CE keeps the hybrid immediate/retained UI framework behind Zed&apos;s
            interface moving on its own schedule — independently maintained,
            openly governed, and built for anyone shipping fast, native UI in
            Rust.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href={siteConfig.githubRepo}
              className="inline-flex items-center justify-center gap-2 border-2 border-black bg-yellow px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-black shadow-hard transition-transform hover:-translate-y-0.5"
            >
              Read the docs
              <IconArrowRight className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.githubRepo}
              className="inline-flex items-center justify-center gap-2 border border-line px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-paper transition-colors hover:border-paper"
            >
              <IconGithub className="h-4 w-4" />
              View source
            </a>
          </div>

          <div className="mt-8">
            <InstallCommand />
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-sm lg:block">
          <div className="absolute -inset-x-6 -inset-y-6 border border-line-soft" />
          <div className="relative border-2 border-black bg-yellow p-10 shadow-hard">
            <Image
              src="/logo.png"
              alt="GPUI-CE logo"
              width={240}
              height={240}
              className="h-auto w-full"
              priority
            />
          </div>
          <div className="absolute -bottom-6 -right-6 border-2 border-black bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-widest2 text-paper shadow-hard-yellow">
            Community Edition
          </div>
        </div>
      </div>
    </section>
  );
}
