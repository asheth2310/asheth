"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { AgentTerminal } from "./agent-terminal";
import { HERO } from "@/lib/content";
import { SITE } from "@/lib/site";
import { Github, Linkedin } from "@/components/icons";

export function HeroSection() {
  const scrollToSystems = () => {
    document.getElementById("systems")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* grid now painted page-wide via body::before */}
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] tracking-[0.2em] text-emerald-300">
              AVAILABLE FOR NEW OPPORTUNITIES
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mb-4 font-mono text-xs tracking-[0.3em] text-ink-hi0"
          >
            {HERO.label}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-5xl font-bold leading-[1.05] tracking-tight text-ink-hi md:text-7xl"
          >
            {HERO.titleA}
            <br />
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              {HERO.titleB}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-xl leading-relaxed text-ink-mid"
          >
            {HERO.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {HERO.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-line bg-surface-raised px-2.5 py-1 font-mono text-xs text-ink-mid"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={scrollToSystems}
              className="group flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 font-mono text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              Explore the systems
              <ArrowDown
                size={16}
                className="transition-transform group-hover:translate-y-0.5"
              />
            </button>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="rounded-lg border border-line p-3 text-ink-mid transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              <Github width={18} height={18} />
            </a>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="flex items-center gap-2 rounded-lg border border-line px-4 py-3 font-mono text-sm text-ink transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              <Linkedin width={16} height={16} />
              LinkedIn
              <ArrowUpRight size={14} className="text-ink-hi0" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <AgentTerminal />
        </motion.div>
      </div>
    </section>
  );
}
