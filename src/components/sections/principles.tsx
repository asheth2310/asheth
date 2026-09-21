"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/site/section-heading";
import { PRINCIPLES } from "@/lib/content";

export function PrinciplesSection() {
  return (
    <section
      id="principles"
      className="scroll-mt-20 border-y border-white/10 bg-white/[0.015] py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="05"
          label="PRINCIPLES"
          title="How I build."
          sub="Six rules earned from shipping agent platforms, data pipelines, and distributed systems — not borrowed from a poster."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="rounded-xl border border-white/10 bg-black/40 p-6 transition-colors hover:border-emerald-500/30"
            >
              <p className="font-mono text-xs tracking-[0.2em] text-emerald-400/80">
                {p.index}
              </p>
              <h3 className="mt-3 text-lg font-bold tracking-tight text-zinc-50">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
