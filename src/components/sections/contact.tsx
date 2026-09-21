"use client";

import { motion } from "framer-motion";
import { ChevronRight, Mail, ShieldCheck } from "lucide-react";
import { Github, Linkedin } from "../icons";
import { SITE } from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";

export function ContactSection() {
  const links = [
    {
      label: "Email",
      href: `mailto:${SITE.email}`,
      icon: <Mail size={16} className="text-emerald-400" />,
      external: false,
    },
    {
      label: "GitHub",
      href: SITE.github,
      icon: <Github width={16} height={16} className="text-zinc-300" />,
      external: true,
    },
    {
      label: "LinkedIn",
      href: SITE.linkedin,
      icon: <Linkedin width={16} height={16} className="text-sky-400" />,
      external: true,
    },
  ];

  return (
    <section id="contact" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="06"
          label="CONTACT"
          title="Open a channel."
          sub="Have a role, a research collaboration, or a system that needs building? Reach me on any of these channels."
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-xl border border-white/10 bg-black/50"
        >
          {/* Chrome bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3">
            <p className="flex items-center gap-2 font-mono text-xs text-zinc-500">
              <ShieldCheck size={14} className="text-emerald-400" />
              secure-channel://contact
            </p>
            <p className="font-mono text-[10px] tracking-[0.2em] text-emerald-300">
              READY
            </p>
          </div>

          <div className="grid gap-8 p-6 md:grid-cols-2 md:gap-10 md:p-8">
            {/* Left: pitch */}
            <div>
              <p className="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-cyan-400/90">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                START A CONVERSATION
              </p>
              <h3 className="text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">
                Have a hard AI problem?
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                I&apos;m open to AI Engineering, Agentic AI and LLM Systems
                opportunities.
              </p>
            </div>

            {/* Right: link rows */}
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-4 transition-colors hover:border-emerald-500/40 hover:bg-white/[0.04]"
                >
                  {link.icon}
                  <span className="font-mono text-base text-zinc-200 transition-colors group-hover:text-emerald-300">
                    {link.label}
                  </span>
                  <ChevronRight
                    size={16}
                    className="ml-auto shrink-0 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-300"
                  />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
