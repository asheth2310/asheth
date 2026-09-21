"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { SITE } from "@/lib/site";

type Line = { kind: "cmd" | "out" | "ok"; text: string };

const SCRIPT: Line[] = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", text: "aagam_sheth // ai_systems_engineer" },
  { kind: "cmd", text: "./agent-cluster --status" },
  { kind: "ok", text: "sentinel   · token tracking + anomaly detection online" },
  { kind: "ok", text: "natsql     · validator armed — writes rejected by default" },
  { kind: "ok", text: "iodine     · mentor mode online — grounded in workspace" },
  { kind: "ok", text: "wildcatiq  · quality gates passing · lineage fresh" },
  { kind: "cmd", text: "gh stats asheth2310" },
];

const CHAR_MS = 34;
const LINE_PAUSE_MS = 420;
const LOOP_PAUSE_MS = 9000;

function LineView({ line }: { line: Line }) {
  if (line.kind === "cmd") {
    return (
      <div className="whitespace-pre-wrap break-all">
        <span className="text-emerald-400">$ </span>
        <span className="text-ink-hi">{line.text}</span>
      </div>
    );
  }
  if (line.kind === "ok") {
    return (
      <div className="whitespace-pre-wrap break-all">
        <span className="text-emerald-400">[ok] </span>
        <span className="text-ink-mid">{line.text}</span>
      </div>
    );
  }
  return (
    <div className="whitespace-pre-wrap break-all text-ink-hi0">{line.text}</div>
  );
}

export function AgentTerminal() {
  const reduceMotion = useReducedMotion() ?? false;
  const [done, setDone] = useState<Line[]>(() => (reduceMotion ? SCRIPT : []));
  const [typing, setTyping] = useState("");
  const [ghStats, setGhStats] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { repos?: Record<string, unknown> } | null) => {
        if (!j?.repos) return;
        const names = Object.keys(j.repos);
        setGhStats(`${names.length} public repos · live via github api`);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    let cancelled = false;

    const later = (ms: number) =>
      new Promise<void>((res) => {
        const t = setTimeout(res, ms);
        timers.current.push(t);
      });

    async function run() {
      while (!cancelled) {
        setDone([]);
        setTyping("");
        for (const line of SCRIPT) {
          if (cancelled) return;
          if (line.kind === "cmd") {
            for (let i = 1; i <= line.text.length; i++) {
              if (cancelled) return;
              setTyping(line.text.slice(0, i));
              await later(CHAR_MS);
            }
            await later(LINE_PAUSE_MS);
            setDone((d) => [...d, line]);
            setTyping("");
          } else {
            await later(LINE_PAUSE_MS / 2);
            setDone((d) => [...d, line]);
          }
        }
        await later(LOOP_PAUSE_MS);
      }
    }
    run();
    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [reduceMotion]);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface-deep shadow-2xl shadow-emerald-500/5">
      <div className="flex items-center gap-2 border-b border-line bg-surface-raised px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate font-mono text-xs text-ink-hi0">
          {SITE.handle}@sentinel: ~/agent-cluster
        </span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] tracking-widest text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          LIVE
        </span>
      </div>

      <div className="min-h-[280px] space-y-2.5 p-5 font-mono text-[13px] leading-relaxed">
        {done.map((line, i) => (
          <LineView key={`${i}-${line.text}`} line={line} />
        ))}
        {typing && (
          <div className="whitespace-pre-wrap break-all">
            <span className="text-emerald-400">$ </span>
            <span className="text-ink-hi">{typing}</span>
            <span className="animate-pulse text-emerald-400">▊</span>
          </div>
        )}
        {!typing && ghStats && (
          <div className="whitespace-pre-wrap break-all pt-1 text-ink-hi0">
            <span className="text-ink-faint">→ </span>
            {ghStats}
          </div>
        )}
        {!typing && !reduceMotion && (
          <div>
            <span className="text-emerald-400">$ </span>
            <span className="animate-pulse text-emerald-400">▊</span>
          </div>
        )}
      </div>

      <div className="border-t border-line px-4 py-2.5">
        <p className="font-mono text-[10px] tracking-wider text-ink-faint">
          simulated live view · repo stats pulled live from the github api
        </p>
      </div>
    </div>
  );
}
