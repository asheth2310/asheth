"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/site/section-heading";
import { AgentConsole } from "./agent-console";
import { AgentWorkflow } from "./agent-workflow";

export function PlaygroundSection() {
  return (
    <section
      id="playground"
      className="scroll-mt-20 border-y border-white/10 bg-white/[0.015] py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="02"
          label="PLAYGROUND"
          title="Talk to the agent."
          sub="A live agent wired to a language model, briefed on Aagam's actual work. Ask it anything — if the API is unreachable it falls back to a local knowledge base instead of going silent."
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl"
        >
          <AgentConsole />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <AgentWorkflow />
        </motion.div>
      </div>
    </section>
  );
}
