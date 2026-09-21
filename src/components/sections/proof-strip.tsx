"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PROOF_STATS } from "@/lib/content";

function Stat({ value, label, start }: { value: string; label: string; start: boolean }) {
  const numeric = /^\d+$/.test(value);
  const target = numeric ? parseInt(value, 10) : 0;
  const [display, setDisplay] = useState(numeric ? 0 : value);

  useEffect(() => {
    if (!start || !numeric) return;
    const duration = 900;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setDisplay(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, numeric, target]);

  return (
    <div className="flex flex-col items-center gap-1 px-6 py-6 text-center sm:py-8">
      <span className="font-mono text-3xl font-bold text-zinc-50 md:text-4xl">
        {numeric ? String(display).padStart(2, "0") : display}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </span>
    </div>
  );
}

export function ProofStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section aria-label="By the numbers" className="border-y border-white/10 bg-white/[0.02]">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/10 px-4 sm:px-6 md:grid-cols-4"
      >
        {PROOF_STATS.map((s) => (
          <Stat key={s.label} value={s.value} label={s.label} start={inView} />
        ))}
      </motion.div>
    </section>
  );
}
