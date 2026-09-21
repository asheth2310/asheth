"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Zap } from "lucide-react";
import { EXPERIENCE } from "@/lib/content";

const ROLES = EXPERIENCE.length;

function RoleRow({
  exp,
  num,
  isLatest,
  isStart,
}: {
  exp: (typeof EXPERIENCE)[number];
  num: string;
  isLatest: boolean;
  isStart: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className={`group border-t border-white/10 transition-colors first:border-t-0 hover:bg-cyan-500/[0.04] ${
        isStart ? "bg-emerald-500/[0.05]" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-6 text-left sm:gap-6 sm:px-6"
      >
        <span className="font-mono text-xs text-cyan-400/80">{num}</span>
        <span className="min-w-0">
          <span className="block font-mono text-[11px] tracking-wider text-zinc-500">
            {exp.period}
          </span>
          <span className="mt-1 block truncate text-base font-bold text-zinc-50 transition-colors group-hover:text-cyan-300 sm:text-lg">
            {exp.role}
          </span>
          <span className="mt-0.5 block font-mono text-xs text-emerald-400/90">
            {exp.company}
          </span>
        </span>
        <span
          className={`border px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] transition-colors ${
            isLatest
              ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-300"
              : "border-white/15 text-zinc-400 group-hover:border-cyan-400/50 group-hover:text-cyan-300"
          }`}
        >
          {isLatest ? "LATEST" : open ? "CLOSE" : "VIEW ROLE"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 px-4 pb-6 pl-[4.5rem] pr-6 sm:px-6 sm:pl-[5.5rem]">
              {exp.points.map((pt) => (
                <li
                  key={pt}
                  className="flex gap-2 text-sm leading-relaxed text-zinc-400"
                >
                  <span className="mt-0.5 shrink-0 font-mono text-emerald-500">
                    ▸
                  </span>
                  {pt}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-20 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header — telemetry style */}
        <div className="mb-8 md:mb-10">
          <p className="mb-4 flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-cyan-400/90">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            CAREER TELEMETRY
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-xl text-3xl font-bold tracking-tight text-zinc-50 md:text-5xl">
              Progression through production AI.
            </h2>
            <p className="shrink-0 font-mono text-xs text-zinc-500">
              GTU → ASU · May 2021 to May 2026
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Left ascent panel */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col rounded-xl border border-white/10 bg-white/[0.02] p-8"
          >
            <Zap className="h-6 w-6 text-cyan-400" fill="currentColor" />
            <h3 className="mt-8 text-2xl font-bold leading-snug text-zinc-50">
              {ROLES} roles.
              <br />
              One continuous ascent.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Progressed from research engineering to production AI systems —
              across data pipelines, full-stack development, and academic
              instruction.
            </p>
          </motion.div>

          {/* Role rows */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.01]">
            {EXPERIENCE.map((exp, i) => (
              <RoleRow
                key={exp.company}
                exp={exp}
                num={String(ROLES - i).padStart(2, "0")}
                isLatest={i === 0}
                isStart={i === ROLES - 1}
              />
            ))}
          </div>
        </div>

        {/* Education strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-6 flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500">
              EDUCATION
            </p>
            <p className="mt-1 font-bold text-zinc-50">
              M.S. Information Technology
            </p>
            <p className="font-mono text-xs text-cyan-400/90">
              Arizona State University
            </p>
          </div>
          <div className="flex gap-10">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500">
                GRADUATED
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-zinc-50">
                2026
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500">
                PERIOD
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-zinc-50">
                2024 — 26
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-4 flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500">
              EDUCATION
            </p>
            <p className="mt-1 font-bold text-zinc-50">B.Tech Computer Science</p>
            <p className="font-mono text-xs text-cyan-400/90">
              Gujarat Technological University
            </p>
          </div>
          <div className="flex gap-10">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500">
                GRADUATED
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-zinc-50">
                2024
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500">
                PERIOD
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-zinc-50">
                2020 — 24
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
