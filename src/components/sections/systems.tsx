"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { ProjectModal } from "@/components/ui/project-modal";
import { SYSTEMS } from "@/lib/content";
import { PROJECT_DETAILS } from "@/lib/project-details";
import { SITE } from "@/lib/site";

export function SystemsSection() {
  const [liveStats, setLiveStats] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github")
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { repos?: Record<string, { stars: number }> } | null) => {
        if (cancelled || !json?.repos) return;
        const stars: Record<string, number> = {};
        for (const [name, v] of Object.entries(json.repos)) stars[name] = v.stars;
        setLiveStats(stars);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="systems" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="01"
          label="SYSTEMS"
          title="Systems that ship."
          sub="Production-grade builds with real architecture behind them — every source link points at the actual repository, and star counts are pulled live from GitHub."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {SYSTEMS.map((sys, i) => (
            <motion.article
              key={sys.repoName}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              onClick={() => setSelected(sys.repoName)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(sys.repoName);
                }
              }}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-label={`${sys.title} — open details`}
              className="group flex cursor-pointer flex-col rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-cyan-500/30 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400/60 md:p-7"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-600">
                  {sys.index}
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-zinc-400">
                  <Star size={11} className="text-amber-400" />
                  {liveStats[sys.repoName] ?? "–"}
                  <span className="text-zinc-600">live</span>
                </span>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-zinc-50">
                {sys.title}
              </h3>
              <p className="mt-1 font-mono text-xs text-emerald-400/90">
                {sys.tagline}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {sys.description}
              </p>

              <ul className="mt-4 space-y-2">
                {sys.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-2 text-[13px] leading-relaxed text-zinc-500"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-emerald-500">
                      ▸
                    </span>
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {sys.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[11px] text-zinc-500"
                  >
                    {t}
                  </span>
                ))}
              </div>              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="inline-flex items-center gap-1.5 font-mono text-sm text-zinc-500 transition-colors group-hover:text-cyan-300">
                  <span className="text-zinc-600">$</span> view details
                </span>
                <a
                  href={`${SITE.github}/${sys.repoName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${sys.title} source on GitHub`}
                  className="inline-flex items-center gap-1.5 font-mono text-sm text-zinc-300 transition-colors hover:text-emerald-300"
                >
                  <span className="text-zinc-600">$</span> open source
                  <ArrowUpRight
                    size={14}
                    className="text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-400"
                  />
                </a>
              </div>
            </motion.article>
          ))
        }
        </div>

        <p className="mt-8 text-center font-mono text-xs text-zinc-600">
          + {41 - SYSTEMS.length} more experiments on{" "}
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 underline decoration-zinc-700 underline-offset-4 hover:text-emerald-300"
          >
            github.com/{SITE.githubUser}
          </a>
        </p>
      </div>

      {selected && PROJECT_DETAILS[selected] && (
        <ProjectModal
          title={SYSTEMS.find((s) => s.repoName === selected)?.title ?? selected}
          detail={PROJECT_DETAILS[selected]}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
