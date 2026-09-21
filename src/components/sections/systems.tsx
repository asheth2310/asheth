"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProjectModal } from "@/components/ui/project-modal";
import { SYSTEMS } from "@/lib/content";
import { PROJECT_DETAILS } from "@/lib/project-details";
import { SITE } from "@/lib/site";

const STAT_COLORS = ["text-cyan-300", "text-emerald-300", "text-violet-300"];

export function SystemsSection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section id="systems" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 md:mb-12">
          <p className="mb-4 font-mono text-xs tracking-[0.25em] text-cyan-400/90">
            ● CORE PRODUCTION SYSTEMS
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-xl text-3xl font-bold tracking-tight text-zinc-50 md:text-5xl">
              Architecture, control and measurable impact.
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
              Selected systems across agentic AI, data platforms, document
              intelligence and stream processing — every claim traceable to the
              repository behind it.
            </p>
          </div>
        </div>

        <div className="grid auto-rows-fr items-stretch gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
          {SYSTEMS.map((sys, i) => {
            const production = sys.badge === "PRODUCTION";
            const statColor = STAT_COLORS[i % STAT_COLORS.length];
            const firstSentence = sys.description
              .split(". ")[0]
              .replace(/\.$/, "");
            return (
              <motion.article
                key={sys.repoName}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
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
                aria-label={`${sys.title} — open case study`}
                className="group flex h-full cursor-pointer flex-col rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-cyan-500/30 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400/60 md:p-5"
              >
                {/* Top row: index / category · badge · code icon */}
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-[10px] font-semibold tracking-[0.18em] text-zinc-400">
                    <span className="text-zinc-600">{sys.index} / </span>
                    {sys.category}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[9px] font-semibold tracking-[0.18em] ${
                        production
                          ? "border border-emerald-400/50 bg-emerald-950/50 text-emerald-300"
                          : "border border-zinc-700 text-zinc-400"
                      }`}
                    >
                      {sys.badge}
                    </span>
                    <a
                      href={`${SITE.github}/${sys.repoName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${sys.title} source on GitHub`}
                      className="font-mono text-xs text-zinc-600 transition-colors hover:text-cyan-300"
                    >
                      {"</>"}
                    </a>
                  </span>
                </div>

                {/* Title + description */}
                <h3 className="text-base font-bold leading-snug tracking-tight text-zinc-50 md:text-lg">
                  {sys.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                  {sys.tagline}. {firstSentence}.
                </p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sys.tags.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="rounded border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[10px] text-zinc-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Bottom row: big stat + open case study */}
                <div className="mt-auto pt-4">
                  <div className="flex items-end justify-between gap-3 border-t border-white/10 pt-3">
                    {sys.stat ? (
                      <p className="flex items-baseline gap-2 leading-none">
                        <span
                          className={`font-mono text-xl font-bold tracking-tight md:text-2xl ${statColor}`}
                        >
                          {sys.stat.value}
                        </span>
                        <span className="font-mono text-[10px] leading-tight text-zinc-500">
                          {sys.stat.label}
                        </span>
                      </p>
                    ) : (
                      <span className="font-mono text-[10px] text-zinc-600">
                        {"// stats in case study"}
                      </span>
                    )}
                    <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[0.18em] text-zinc-500 transition-colors group-hover:text-cyan-300">
                      OPEN CASE STUDY
                      <ArrowRight
                        size={12}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-8 text-center font-mono text-xs text-zinc-600">
          + {41 - SYSTEMS.length} more experiments on{" "}
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 underline decoration-zinc-700 underline-offset-4 hover:text-cyan-300"
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
