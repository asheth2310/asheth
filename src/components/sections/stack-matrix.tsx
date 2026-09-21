"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/site/section-heading";
import { STACK_GROUPS } from "@/lib/content";

export function StackMatrixSection() {
  return (
    <section id="stack" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="05"
          label="STACK"
          title="Production tooling."
          sub="The tools I reach for to take AI systems from notebook to production — grouped by where they do their work."
        />

        <div className="grid items-start gap-4 md:grid-cols-2">
          {STACK_GROUPS.map((group, gi) => (
            <motion.div
              key={group.index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (gi % 2) * 0.1 }}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]"
            >
              <div className="border-b border-white/10 bg-black/40 px-5 py-3">
                <p className="font-mono text-[11px] tracking-[0.2em] text-zinc-500">
                  <span className="text-emerald-400">{group.index}</span>
                  {" // "}
                  {group.title.toUpperCase()}
                </p>
              </div>
              <ul className="divide-y divide-white/5">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="group/item flex items-baseline justify-between gap-4 px-5 py-2 transition-colors hover:bg-emerald-500/[0.04]"
                  >
                    <span className="shrink-0 font-mono text-xs font-medium text-zinc-200 transition-colors group-hover/item:text-emerald-300">
                      {item.name}
                    </span>
                    <span className="text-right text-[11px] leading-snug text-zinc-600">
                      {item.blurb}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
