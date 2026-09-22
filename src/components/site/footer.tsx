"use client";

import { ArrowUp } from "lucide-react";
import { Github, Linkedin } from "@/components/icons";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-page">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="font-mono text-xs leading-relaxed text-ink-hi0">
          <p>
            <span className="text-ink">{SITE.handle}</span>
            <span className="animate-pulse text-emerald-400">▊</span>
          </p>
          <p className="mt-1">© 2026 {SITE.name}</p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="rounded-md p-2 text-ink-hi0 hover:text-ink-hi transition-colors"
          >
            <Github width={18} height={18} />
          </a>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="rounded-md p-2 text-ink-hi0 hover:text-ink-hi transition-colors"
          >
            <Linkedin width={18} height={18} />
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="ml-2 flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-xs text-ink-mid hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
          >
            <ArrowUp size={13} />
            top
          </button>
        </div>
      </div>
    </footer>
  );
}
