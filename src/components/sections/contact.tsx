"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { Github, Linkedin } from "../icons";
import { useState } from "react";
import { SITE } from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";

type Status = "idle" | "sending" | "success" | "error";

export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
        }),
      });

      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="06"
          label="CONTACT"
          title="Open a channel."
          sub="Have a role, a research collaboration, or a system that needs building? Messages go straight to my inbox."
        />

        <div className="mx-auto max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-xl border border-white/10 bg-black/50"
          >
            <div className="border-b border-white/10 bg-white/[0.03] px-5 py-3">
              <p className="font-mono text-xs text-zinc-500">
                <span className="text-emerald-400">$</span> ./send-message
                <span className="animate-pulse text-emerald-400">▊</span>
              </p>
            </div>

            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center py-10 text-center"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 size={28} />
                    </div>
                    <h3 className="font-mono text-lg text-zinc-100">
                      message delivered_
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                      Thanks for reaching out — I&apos;ll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                    onSubmit={handleSubmit}
                  >
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-name"
                        className="font-mono text-xs tracking-wider text-zinc-500"
                      >
                        --name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Ada Lovelace"
                        className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-email"
                        className="font-mono text-xs tracking-wider text-zinc-500"
                      >
                        --email
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        required
                        type="email"
                        autoComplete="email"
                        placeholder="ada@analytical.engine"
                        className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-message"
                        className="font-mono text-xs tracking-wider text-zinc-500"
                      >
                        --message
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={4}
                        placeholder="Let's build something that thinks & scales…"
                        className="w-full resize-none rounded-lg border border-white/10 bg-black/60 px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>

                    {status === "error" && (
                      <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <button
                      disabled={status === "sending"}
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 font-mono text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:opacity-50"
                    >
                      {status === "sending" ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-950/30 border-t-emerald-950" />
                      ) : (
                        <>
                          <Send size={16} />
                          transmit
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-6">
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-xs text-zinc-400 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                >
                  <Mail size={14} />
                  {SITE.email}
                </a>
                <a
                  href={SITE.resumePath}
                  download
                  className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-xs text-zinc-400 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                >
                  <Download size={14} />
                  resume.pdf
                </a>
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="rounded-full border border-white/10 p-2.5 text-zinc-500 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                >
                  <Github width={16} height={16} />
                </a>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="rounded-full border border-white/10 p-2.5 text-zinc-500 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                >
                  <Linkedin width={16} height={16} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
