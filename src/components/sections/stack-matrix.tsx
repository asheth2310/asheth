"use client";

import type { ComponentType } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Brain,
  Code2,
  Database,
  MessagesSquare,
} from "lucide-react";
import {
  SiApachekafka,
  SiFastapi,
  SiGo,
  SiGraphql,
  SiJavascript,
  SiMongodb,
  SiNodedotjs,
  SiPostgresql,
  SiPytorch,
  SiReact,
  SiRedis,
  SiScikitlearn,
  SiSpringboot,
  SiTypescript,
  SiKubernetes,
} from "react-icons/si";
import { FaAws, FaDocker, FaJava, FaPython } from "react-icons/fa6";
import { SectionHeading } from "@/components/site/section-heading";
import { STACK_GROUPS } from "@/lib/content";

type IconType = ComponentType<{ size?: number; className?: string }>;

/** Brand + conceptual logos, keyed by tech name from STACK_GROUPS. */
const TECH_ICONS: Record<string, IconType> = {
  // AI & Intelligent Systems
  "LLM Agents": Bot as IconType,
  NLP: MessagesSquare as IconType,
  "OpenAI API": Brain as IconType,
  PyTorch: SiPytorch,
  "Machine Learning": SiScikitlearn,
  // Languages
  Python: FaPython,
  Java: FaJava,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  "C++": Code2 as IconType,
  SQL: Database as IconType,
  Go: SiGo,
  // Backend & Data
  "Node.js": SiNodedotjs,
  FastAPI: SiFastapi,
  "Spring Boot": SiSpringboot,
  GraphQL: SiGraphql,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Redis: SiRedis,
  Kafka: SiApachekafka,
  // Cloud, DevOps & Frontend
  AWS: FaAws,
  Docker: FaDocker,
  Kubernetes: SiKubernetes,
  React: SiReact,
};

const FALLBACK_ICON: IconType = Code2 as IconType;

const GROUP_BADGES = [
  "AI / ML",
  "CORE",
  "SERVICES",
  "PLATFORM",
];

function TechIcon({ name }: { name: string }) {
  const Icon = TECH_ICONS[name] ?? FALLBACK_ICON;
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-950/60">
      <Icon size={12} className="text-cyan-300" />
    </span>
  );
}

export function StackMatrixSection() {
  return (
    <section id="stack" className="scroll-mt-20 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="04"
          label="STACK"
          title="Production tooling."
          sub="The tools I reach for to take AI systems from notebook to production — grouped by where they do their work."
        />

        <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
          {STACK_GROUPS.map((group, gi) => (
            <motion.div
              key={group.index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (gi % 2) * 0.1 }}
              className="flex h-full flex-col rounded-xl border border-line bg-surface-card p-5"
            >
              {/* Header: index · title · badge · count */}
              <div className="mb-4 flex items-center gap-2.5 border-b border-line pb-3">
                <span className="font-mono text-xs text-cyan-400">
                  {group.index}
                </span>
                <h3 className="text-sm font-bold tracking-tight text-ink-hi">
                  {group.title}
                </h3>
                <span className="rounded border border-cyan-400/30 bg-cyan-950/40 px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-[0.15em] text-cyan-300">
                  {GROUP_BADGES[gi]}
                </span>
                <span className="ml-auto font-mono text-[10px] tracking-widest text-ink-hi0">
                  {String(group.items.length).padStart(2, "0")} TOOLS
                </span>
              </div>

              {/* Logo pills */}
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item.name}
                    title={item.blurb}
                    className="flex cursor-default items-center gap-2 rounded-lg border border-line bg-surface-raised px-2.5 py-1.5 transition-colors hover:border-cyan-400/40 hover:bg-cyan-950/20"
                  >
                    <TechIcon name={item.name} />
                    <span className="font-mono text-xs text-ink">
                      {item.name}
                    </span>
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
