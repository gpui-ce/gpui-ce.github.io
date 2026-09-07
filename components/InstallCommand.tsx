"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site";
import { IconCopy, IconCheck } from "./icons";

export function InstallCommand() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.install);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex w-full max-w-sm items-center justify-between gap-4 border border-line bg-surface px-4 py-3 text-left transition-colors hover:border-paper/40 sm:w-auto"
    >
      <span className="font-mono text-[13px] text-paper">
        <span className="select-none text-muted">$ </span>
        {siteConfig.install}
      </span>
      <span className="text-muted transition-colors group-hover:text-paper">
        {copied ? <IconCheck className="h-4 w-4 text-yellow" /> : <IconCopy className="h-4 w-4" />}
      </span>
    </button>
  );
}
