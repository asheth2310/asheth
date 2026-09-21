"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/site/section-heading";
import { EXPERIENCE } from "@/lib/content";

export function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="03"
          label="EXPERIENCE"
          title="Where I've worked."
          sub="Engineering roles across research, startups, and academia — from multilingual data pipelines to AI-driven CI/CD."
        />

        <div className="relative mx-auto max-w-3xl">
          <div
            aria-hidden
            className="absolute bottom-0 left-[7px] top-2 w-px bg-gradient-to-b from-emerald-500/50 via-white/10 to-transparent"
          />
          <div className="space-y-8">
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative pl-10"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-emerald-500 bg-[#060809] shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                />
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-emerald-500/30">
                  <p className="font-mono text-xs tracking-wider text-emerald-400/90">
                    {exp.period}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-zinc-50">
                    {exp.role}
                  </h3>
                  <p className="font-mono text-sm text-zinc-500">{exp.company}</p>
                  <ul className="mt-4 space-y-1.5">
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
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
