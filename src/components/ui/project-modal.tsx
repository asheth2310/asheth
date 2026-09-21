"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ExternalLink, X } from "lucide-react";
import { SITE } from "@/lib/site";
import type { ProjectDetail } from "@/lib/project-details";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-[10px] tracking-[0.25em] text-ink-hi0">
      {children}
    </p>
  );
}

function Marker({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 text-[13px] leading-relaxed text-ink-mid">
      <span className="mt-0.5 shrink-0 font-mono text-cyan-500">▪</span>
      <span>{children}</span>
    </li>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 text-[13px] leading-relaxed text-ink-mid">
      <Check size={13} className="mt-1 shrink-0 text-cyan-400" />
      <span>{children}</span>
    </li>
  );
}

export function ProjectModal({
  title,
  detail,
  onClose,
}: {
  title: string;
  detail: ProjectDetail;
  onClose: () => void;
}) {
  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-8"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} details`}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="my-8 w-full max-w-2xl overflow-hidden rounded-xl border border-line bg-[#0a0d10] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Chrome bar */}
          <div className="flex items-center justify-between border-b border-line bg-surface-raised px-4 py-2.5">
            <span className="truncate font-mono text-[11px] text-ink-hi0">
              <span className="text-ink-faint">~</span> {detail.path}
            </span>
            <button
              onClick={onClose}
              aria-label="Close details"
              className="ml-3 shrink-0 rounded p-1 text-ink-hi0 transition-colors hover:bg-white/5 hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-7">
            {/* Kind chip + title */}
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded border border-cyan-400/40 bg-cyan-950/40 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.2em] text-cyan-300">
                {detail.kind}
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-ink-faint">
                {"// DETAIL VIEW"}
              </span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-ink-hi sm:text-3xl">
              {title}
            </h3>

            {/* PERIOD / ROLE boxes */}
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-line bg-surface-well px-4 py-3">
                <p className="font-mono text-[9px] tracking-[0.25em] text-ink-faint">
                  PERIOD
                </p>
                <p className="mt-1 font-mono text-xs text-ink">
                  {detail.period}
                </p>
              </div>
              <div className="rounded-lg border border-line bg-surface-well px-4 py-3">
                <p className="font-mono text-[9px] tracking-[0.25em] text-ink-faint">
                  MY ROLE
                </p>
                <p className="mt-1 font-mono text-xs text-ink">
                  {detail.role}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-mid">
              {detail.summary}
            </p>

            {/* Stat band */}
            {detail.stat && (
              <div className="mt-4 rounded-lg border border-line bg-surface-well px-4 py-3">
                <span className="font-mono text-2xl font-bold text-cyan-300">
                  {detail.stat.value}
                </span>
                <span className="ml-3 font-mono text-[11px] text-ink-hi0">
                  {detail.stat.label}
                </span>
              </div>
            )}

            {/* THE PROJECT */}
            <div className="mt-8">
              <SectionLabel>THE PROJECT</SectionLabel>
              <p className="text-sm leading-relaxed text-ink-mid">
                {detail.project}
              </p>
            </div>

            {/* SYSTEM ARCHITECTURE */}
            <div className="mt-8">
              <SectionLabel>SYSTEM ARCHITECTURE</SectionLabel>
              <div className="flex flex-wrap items-center gap-1.5">
                {detail.architecture.map((a, i) => (
                  <span key={a} className="flex items-center gap-1.5">
                    {i > 0 && (
                      <span className="font-mono text-[10px] text-ink-faint">
                        &middot;
                      </span>
                    )}
                    <span className="rounded border border-line bg-surface-well px-2 py-1 font-mono text-[10px] font-semibold tracking-wide text-ink">
                      {a}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* MY ROLE IN THE ARCHITECTURE */}
            {detail.keyDecisions && detail.keyDecisions.length > 0 && (
              <div className="mt-8">
                <SectionLabel>MY ROLE IN THE ARCHITECTURE</SectionLabel>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {detail.keyDecisions.map((d) => (
                    <li
                      key={d}
                      className="flex gap-2.5 rounded-lg border border-line bg-surface-well p-3 text-[12px] leading-relaxed text-ink-mid"
                    >
                      <span className="mt-0.5 shrink-0 font-mono text-cyan-500">
                        ▪
                      </span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ENGINEERING DECISIONS */}
            <div className="mt-8">
              <SectionLabel>ENGINEERING DECISIONS</SectionLabel>
              <ul className="space-y-2">
                {detail.decisions.map((d) => (
                  <Marker key={d}>{d}</Marker>
                ))}
              </ul>
            </div>

            {/* TRADE-OFFS */}
            {detail.tradeoffs && detail.tradeoffs.length > 0 && (
              <div className="mt-8">
                <SectionLabel>TRADE-OFFS</SectionLabel>
                <ul className="space-y-2">
                  {detail.tradeoffs.map((t) => (
                    <CheckItem key={t}>{t}</CheckItem>
                  ))}
                </ul>
              </div>
            )}

            {/* OUTCOMES */}
            {detail.outcomes && detail.outcomes.length > 0 && (
              <div className="mt-8">
                <SectionLabel>OUTCOMES</SectionLabel>
                <div className="grid gap-2 sm:grid-cols-2">
                  {detail.outcomes.map((o) => (
                    <div
                      key={o}
                      className="flex gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3 text-[12px] leading-relaxed text-ink-mid"
                    >
                      <Check size={13} className="mt-0.5 shrink-0 text-emerald-400" />
                      <span>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TECH STACK */}
            <div className="mt-8 border-t border-line pt-5">
              <SectionLabel>TECH STACK</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {detail.stack.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-line bg-surface-well px-2 py-0.5 font-mono text-[10px] text-ink-hi0"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-5">
              <a
                href={`${SITE.github}/${titleHref(detail.path)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 font-mono text-xs font-semibold text-zinc-950 transition-colors hover:bg-cyan-300"
              >
                View source
                <ExternalLink size={13} />
              </a>
              <button
                onClick={onClose}
                className="rounded-lg border border-line px-4 py-2.5 font-mono text-xs text-ink transition-colors hover:border-white/30 hover:text-ink-hi"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/** Extract the repo name from the modal path for the source link. */
function titleHref(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1];
}
