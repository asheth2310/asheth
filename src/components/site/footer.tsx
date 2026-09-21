"use client";

import { ArrowUp } from "lucide-react";
import { Github, Linkedin } from "@/components/icons";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#040506]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="font-mono text-xs leading-relaxed text-zinc-500">
          <p>
            <span className="text-zinc-300">{SITE.handle}</span>
            <span className="animate-pulse text-emerald-400">▊</span>
          </p>
          <p className="mt-1">
            © 2026 {SITE.name} · built with next.js ·{" "}
            <span className="text-zinc-600">v2.0 // terminal edition</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="rounded-md p-2 text-zinc-500 hover:text-zinc-100 transition-colors"
          >
            <Github width={18} height={18} />
          </a>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="rounded-md p-2 text-zinc-500 hover:text-zinc-100 transition-colors"
          >
            <Linkedin width={18} height={18} />
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="ml-2 flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 font-mono text-xs text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
          >
            <ArrowUp size={13} />
            top
          </button>
        </div>
      </div>
    </footer>
  );
}
