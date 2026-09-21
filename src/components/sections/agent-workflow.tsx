"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Bot,
  Brain,
  CalendarCheck,
  Database,
  ExternalLink,
  LifeBuoy,
  Lock,
  MessageSquare,
  Play,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";
import { SITE } from "@/lib/site";

/**
 * Agent workflow playground — public reference implementation.
 *
 * A deterministic, front-end simulation of the bounded LangGraph ReAct loop
 * that powers Aagam's production agents: retrieve context → call model →
 * await input / call tools → validate → compose reply, with deterministic
 * safety guards between every model call. The scenario data mirrors the
 * patterns used across the portfolio's agent systems.
 */

type FinalStatus = "ok" | "rejected" | "output";
type Status = "wait" | "run" | FinalStatus;
type StepKind = "receive" | "ground" | "model" | "await" | "tool" | "gate" | "policy" | "execute" | "reply";

interface Turn {
  from: "user" | "agent";
  text: string;
}

interface TraceStep {
  label: string;
  kind: StepKind;
  final: FinalStatus;
  detail?: string;
  note?: string;
  emit?: Turn[];
}

interface Scenario {
  index: string;
  title: string;
  subtitle: string;
  useCase: string;
  control: string;
  steps: TraceStep[];
}

interface Agent {
  id: string;
  name: string;
  role: string;
  runtime: string;
  blurb: string;
  icon: typeof Bot;
  scenarios: Scenario[];
}

const AGENTS: Agent[] = [
  {
    id: "reception",
    name: "RECEPTION_AGENT",
    role: "Restaurant booking assistant",
    runtime: "runtime://langgraph/trace",
    blurb:
      "Books tables from natural-language requests. Verifies availability and collects required details before any write — guests never navigate forms.",
    icon: CalendarCheck,
    scenarios: [
      {
        index: "01",
        title: "Reserve a table",
        subtitle: "Availability check",
        useCase: "Create a restaurant reservation from a natural-language request.",
        control:
          "Guests should not need to navigate forms, but the agent must verify availability and collect required booking details before writing data.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            kind: "ground",
            final: "ok",
            note: "floor plan · tonight's seat map · booking policy",
          },
          {
            label: "CALL MODEL",
            kind: "model",
            final: "ok",
            detail: "intent=book · party=2 · day=tomorrow · seating=outdoor",
            note: "slots extracted from the message",
          },
          {
            label: "AWAIT USER INPUT",
            kind: "await",
            final: "ok",
            note: "time slot confirmed: 7:30 PM",
          },
          {
            label: "CHECK AVAILABILITY",
            kind: "tool",
            final: "ok",
            note: "table 14 · outdoor · 2 seats open",
          },
          {
            label: "CALL MODEL",
            kind: "model",
            final: "ok",
            detail: "confirm(message, slot) → complete",
            note: "all required fields present",
          },
          {
            label: "CREATE RESERVATION",
            kind: "tool",
            final: "ok",
            note: "write allowed · availability held under lock",
          },
          {
            label: "CALL MODEL",
            kind: "model",
            final: "ok",
            detail: "compose confirmation",
            note: "tone: friendly · no jargon",
          },
          {
            label: "COMPOSE REPLY",
            kind: "reply",
            final: "ok",
            emit: [
              { from: "user", text: "Book an outdoor table for two tomorrow evening." },
              {
                from: "agent",
                text: "Done — outdoor table for two tomorrow at 7:30 PM, under your name. I'll send a reminder the morning of. Want me to note any dietary preferences for the kitchen?",
              },
            ],
          },
        ],
      },
      {
        index: "02",
        title: "Protected removal",
        subtitle: "Ownership guard",
        useCase: "A caller asks to cancel a reservation that isn't theirs.",
        control:
          "The cancellation tool verifies booking ownership before mutating anything.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            kind: "ground",
            final: "ok",
            note: "caller identity resolved from session",
          },
          {
            label: "CALL MODEL",
            kind: "model",
            final: "ok",
            detail: "intent=cancel · booking=#4821",
            note: "slots extracted",
          },
          {
            label: "CHECK OWNERSHIP",
            kind: "gate",
            final: "rejected",
            note: "booking #4821 belongs to another guest",
          },
          {
            label: "CALL MODEL",
            kind: "model",
            final: "ok",
            detail: "refuse politely · offer alternatives",
            note: "no data exposed about the other booking",
          },
          {
            label: "COMPOSE REPLY",
            kind: "reply",
            final: "ok",
            emit: [
              { from: "user", text: "Cancel reservation #4821 for me, please." },
              {
                from: "agent",
                text: "I can't cancel that one — it's booked under a different guest. If it's your booking, I can verify with the phone number on it. Otherwise I'm happy to help you make a new reservation.",
              },
            ],
          },
        ],
      },
      {
        index: "03",
        title: "Fully booked",
        subtitle: "Graceful fallback",
        useCase: "The requested slot doesn't exist; the agent proposes alternatives.",
        control: "No hold is written until the user accepts one of the offered slots.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            kind: "ground",
            final: "ok",
            note: "seat map loaded",
          },
          {
            label: "CALL MODEL",
            kind: "model",
            final: "ok",
            detail: "intent=book · party=6 · day=saturday · seating=outdoor",
            note: "slots extracted",
          },
          {
            label: "CHECK AVAILABILITY",
            kind: "tool",
            final: "rejected",
            note: "no outdoor table seats 6 on saturday",
          },
          {
            label: "CALL MODEL",
            kind: "model",
            final: "ok",
            detail: "propose: indoor 6pm · indoor 8:30pm · split tables",
            note: "bounded to 3 options",
          },
          {
            label: "AWAIT USER INPUT",
            kind: "await",
            final: "output",
            note: "human chooses — agent never books unrequested slots",
          },
          {
            label: "COMPOSE REPLY",
            kind: "reply",
            final: "ok",
            emit: [
              { from: "user", text: "Table for six, outdoor, this Saturday?" },
              {
                from: "agent",
                text: "Saturday outdoor is fully booked. I can do indoor at 6:00 or 8:30 PM — or two adjacent tables outside at 5:00. Nothing is held yet; tell me which you'd like.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "support",
    name: "SUPPORT_AGENT",
    role: "SaaS tier-1 support triage",
    runtime: "runtime://langgraph/trace",
    blurb:
      "Triages tickets, reads account state, and drafts resolutions. Escalates with full context when confidence drops — never guesses.",
    icon: LifeBuoy,
    scenarios: [
      {
        index: "01",
        title: "Password reset",
        subtitle: "Identity-scoped lookup",
        useCase: "Resolve a routine account request end-to-end.",
        control: "Every lookup is scoped to the verified caller's account.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            kind: "ground",
            final: "ok",
            note: "verified session · account_id resolved",
          },
          {
            label: "CALL MODEL",
            kind: "model",
            final: "ok",
            detail: "intent=password_reset · urgency=low",
            note: "classification",
          },
          {
            label: "FETCH ACCOUNT",
            kind: "tool",
            final: "ok",
            note: "identity-scoped: caller's own record only",
          },
          {
            label: "ISSUE RESET LINK",
            kind: "tool",
            final: "ok",
            note: "action allowed by policy",
          },
          {
            label: "COMPOSE REPLY",
            kind: "reply",
            final: "ok",
            emit: [
              { from: "user", text: "I can't get into my account." },
              {
                from: "agent",
                text: "Sent a reset link to the email on file — it's valid for 30 minutes. If it doesn't arrive, check spam or tell me and I'll try again. Anything else locked out with it?",
              },
            ],
          },
        ],
      },
      {
        index: "02",
        title: "Refund request",
        subtitle: "Bounded spend guard",
        useCase: "A refund that exceeds the agent's autonomous limit.",
        control:
          "Refunds above the policy limit require a human approval step — the agent drafts, it doesn't decide.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            kind: "ground",
            final: "ok",
            note: "order history fetched (caller-scoped)",
          },
          {
            label: "CALL MODEL",
            kind: "model",
            final: "ok",
            detail: "intent=refund · amount=$340 · order=#9012",
            note: "classification",
          },
          {
            label: "CHECK POLICY LIMIT",
            kind: "gate",
            final: "rejected",
            note: "$340 > $100 autonomous cap",
          },
          {
            label: "CREATE ESCALATION",
            kind: "tool",
            final: "ok",
            note: "full context attached · human approval queue",
          },
          {
            label: "AWAIT USER INPUT",
            kind: "await",
            final: "ok",
            note: "customer informed of the handoff",
          },
          {
            label: "COMPOSE REPLY",
            kind: "reply",
            final: "ok",
            emit: [
              { from: "user", text: "I want a refund for order #9012." },
              {
                from: "agent",
                text: "That refund is above what I'm authorized to approve, so I've escalated it to a teammate with the full order history attached — you'll hear back within one business day. Reference: ESC-4821.",
              },
            ],
          },
        ],
      },
      {
        index: "03",
        title: "Angry customer",
        subtitle: "Composure guard",
        useCase: "An abusive message tests the agent's tone boundaries.",
        control:
          "The agent never mirrors abuse and never bends policy to end a conflict.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            kind: "ground",
            final: "ok",
            note: "ticket history loaded",
          },
          {
            label: "CALL MODEL",
            kind: "model",
            final: "ok",
            detail: "sentiment=hostile · policy requests=2",
            note: "classification",
          },
          {
            label: "CHECK POLICY LIMIT",
            kind: "gate",
            final: "rejected",
            note: "requested exception violates terms",
          },
          {
            label: "CALL MODEL",
            kind: "model",
            final: "ok",
            detail: "de-escalate · restate options · offer human",
            note: "tone guard applied",
          },
          {
            label: "COMPOSE REPLY",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "user",
                text: "This is the WORST service. Override the terms or I'm leaving.",
              },
              {
                from: "agent",
                text: "I hear you, and I'm sorry this has been frustrating. I can't override the terms — but here's what I can do today: a plan downgrade effective immediately, or a human specialist callback. Which works better?",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ops",
    name: "OPS_AGENT",
    role: "Data pipeline incident responder",
    runtime: "runtime://langgraph/trace",
    blurb:
      "Watches pipeline health, diagnoses failures, and proposes fixes. Mutates production state only through a change-request gate.",
    icon: Wrench,
    scenarios: [
      {
        index: "01",
        title: "Nightly job failed",
        subtitle: "Diagnose & report",
        useCase: "A scheduled pipeline breaks at 2 AM; the agent triages before humans wake up.",
        control: "Read-only diagnosis is autonomous; any fix requires a change request.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            kind: "ground",
            final: "ok",
            note: "job logs · lineage graph · run history",
          },
          {
            label: "CALL MODEL",
            kind: "model",
            final: "ok",
            detail: "failure=upstream schema drift · table=dim_customer",
            note: "hypothesis ranked #1",
          },
          {
            label: "QUERY LINEAGE",
            kind: "tool",
            final: "ok",
            note: "source column renamed upstream",
          },
          {
            label: "DRAFT CHANGE REQUEST",
            kind: "tool",
            final: "output",
            note: "fix proposed · awaiting human approval",
          },
          {
            label: "COMPOSE REPLY",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "Nightly load failed at 02:14. Root cause: upstream renamed customer_zip → customer_postal_code. I've drafted a mapping fix as change request CR-118 — one approval away from unblocking the load. Downstream dashboards affected: 3.",
              },
            ],
          },
        ],
      },
      {
        index: "02",
        title: "Suspicious query spike",
        subtitle: "Anomaly containment",
        useCase: "Query volume jumps 40×; the agent contains before diagnosing.",
        control:
          "The circuit breaker acts on rate limits, not guesses — and only on the suspicious principal.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            kind: "ground",
            final: "ok",
            note: "metrics window: last 15 minutes",
          },
          {
            label: "CALL MODEL",
            kind: "model",
            final: "ok",
            detail: "40× baseline · single api_key principal",
            note: "anomaly classification",
          },
          {
            label: "APPLY CIRCUIT BREAKER",
            kind: "tool",
            final: "ok",
            note: "key throttled · blast radius: 1 principal",
          },
          {
            label: "PAGE ON-CALL",
            kind: "tool",
            final: "ok",
            note: "context-rich alert sent",
          },
          {
            label: "COMPOSE REPLY",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "Query volume from one API key hit 40× baseline. Throttled that key only — the other 12 principals are unaffected. On-call paged with the query samples; early read: a runaway batch job, not an attack.",
              },
            ],
          },
        ],
      },
      {
        index: "03",
        title: "Direct production write",
        subtitle: "Change-request gate",
        useCase: "Someone asks the agent to 'just fix it' directly in production.",
        control:
          "Production mutations are never autonomous — fail-closed through the CR gate.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            kind: "ground",
            final: "ok",
            note: "incident + schema state loaded",
          },
          {
            label: "CALL MODEL",
            kind: "model",
            final: "ok",
            detail: "request=direct UPDATE in prod",
            note: "intent parsed",
          },
          {
            label: "CHECK MUTATION POLICY",
            kind: "gate",
            final: "rejected",
            note: "direct writes forbidden · CR required",
          },
          {
            label: "DRAFT CHANGE REQUEST",
            kind: "policy",
            final: "ok",
            note: "same fix, gated path",
          },
          {
            label: "COMPOSE REPLY",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "user",
                text: "Don't wait for approval — just run the UPDATE yourself.",
              },
              {
                from: "agent",
                text: "I can't execute production writes directly — that's a hard gate, not a preference. The change request is drafted and takes one approval; I'll re-run the failed step the moment it lands.",
              },
            ],
          },
        ],
      },
    ],
  },
];

const AGENT_CHIPS: { key: string; value: string }[] = [
  { key: "IDENTITY", value: "SERVER-INJECTED" },
  { key: "CHECKPOINTS", value: "SQLITE" },
  { key: "STREAM", value: "PRIVACY-SAFE SSE" },
  { key: "ACTION LIMIT", value: "BOUNDED" },
];

const STEP_ICONS: Record<StepKind, typeof Bot> = {
  receive: User,
  ground: Database,
  model: Brain,
  await: User,
  tool: Wrench,
  gate: ShieldCheck,
  policy: Lock,
  execute: Database,
  reply: MessageSquare,
};

const STATUS_STYLES: Record<Status, string> = {
  wait: "text-zinc-600",
  run: "text-amber-300 animate-pulse",
  ok: "text-emerald-300",
  rejected: "text-red-400",
  output: "text-cyan-300",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function AgentWorkflow() {
  const reduceMotion = useReducedMotion() ?? false;
  const [agentId, setAgentId] = useState(AGENTS[0].id);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [footerLine, setFooterLine] = useState("Awaiting execution request");
  const runIdRef = useRef(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const traceRef = useRef<HTMLDivElement>(null);

  const agent = AGENTS.find((a) => a.id === agentId) ?? AGENTS[0];
  const scenario = agent.scenarios[Math.min(scenarioIdx, agent.scenarios.length - 1)];

  const [prevKey, setPrevKey] = useState(`${agentId}:${scenarioIdx}`);

  // Reset the simulation whenever the agent or scenario changes.
  // Render-time reset is the React-recommended alternative to setState-in-effect.
  if (`${agentId}:${scenarioIdx}` !== prevKey) {
    setPrevKey(`${agentId}:${scenarioIdx}`);
    setPhase("idle");
    setStatuses(scenario.steps.map(() => "wait" as Status));
    setTurns([]);
    setFooterLine("Awaiting execution request");
  }

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [turns]);

  useEffect(() => {
    traceRef.current?.scrollTo({ top: traceRef.current.scrollHeight });
  }, [statuses]);

  useEffect(() => {
    return () => {
      runIdRef.current += 1; // stop timers on unmount
    };
  }, []);

  const invalidate = () => {
    runIdRef.current += 1;
  };

  const run = async () => {
    const runId = ++runIdRef.current;
    const alive = () => runIdRef.current === runId;
    const pause = (ms: number) => sleep(reduceMotion ? 0 : ms);

    setPhase("running");
    setStatuses(scenario.steps.map(() => "wait" as Status));
    setTurns([]);
    setFooterLine("Executing…");
    await pause(350);
    if (!alive()) return;

    for (let i = 0; i < scenario.steps.length; i++) {
      if (!alive()) return;
      const step = scenario.steps[i];
      setStatuses((prev) => {
        const next = [...prev];
        next[i] = "run";
        return next;
      });
      setFooterLine(
        step.kind === "gate"
          ? "Deterministic guard checking…"
          : step.kind === "tool"
            ? "Calling scoped tool…"
            : step.kind === "model"
              ? "Calling model…"
              : "Executing…"
      );
      await pause(step.final === "rejected" ? 950 : 620);
      if (!alive()) return;

      setStatuses((prev) => {
        const next = [...prev];
        next[i] = step.final;
        return next;
      });
      if (step.emit) setTurns((prev) => [...prev, ...step.emit!]);
      await pause(step.emit ? 520 : 260);
      if (!alive()) return;
    }

    if (!alive()) return;
    setPhase("done");
    setFooterLine("Trace complete — result rendered · all actions within policy bounds");
  };

  const running = phase === "running";
  const AgentIcon = agent.icon;

  return (
    <div className="mt-24 border-t border-white/10 pt-16">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 font-mono text-xs tracking-[0.25em] text-emerald-400/90">
            ● PUBLIC REFERENCE IMPLEMENTATION
          </p>
          <h3 className="text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">
            Agent workflow playground
          </h3>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
          A source-aligned simulation of the bounded LangGraph ReAct loop,
          customer-scoped tools and deterministic safety guards — the same
          patterns behind the agent systems in{" "}
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-300 underline decoration-emerald-500/40 underline-offset-4 hover:text-emerald-200"
          >
            Aagam&apos;s repos
          </a>
          .
        </p>
      </div>

      {/* Agent picker */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 md:p-5">
        <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-zinc-500">
          AGENT_SELECT
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {AGENTS.map((a) => {
            const active = a.id === agentId;
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                onClick={() => {
                  if (running) return;
                  invalidate();
                  setAgentId(a.id);
                  setScenarioIdx(0);
                }}
                disabled={running}
                aria-pressed={active}
                className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors disabled:opacity-60 ${
                  active
                    ? "border-emerald-400/70 bg-emerald-500/10"
                    : "border-white/10 bg-black/30 hover:border-white/25"
                }`}
              >
                <Icon
                  size={16}
                  className={`mt-0.5 shrink-0 ${active ? "text-emerald-300" : "text-zinc-500"}`}
                />
                <span>
                  <span
                    className={`block font-mono text-sm font-semibold ${
                      active ? "text-emerald-200" : "text-zinc-200"
                    }`}
                  >
                    {a.name}
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px] text-zinc-500">
                    {a.role}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-3 rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 font-mono text-xs text-zinc-400">
          {agent.blurb}
        </p>
      </div>

      {/* Scenario input */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 md:p-5">
        <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-zinc-500">
          SCENARIO_INPUT
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {agent.scenarios.map((s, i) => {
            const active = i === scenarioIdx;
            return (
              <button
                key={s.index}
                onClick={() => {
                  if (running) return;
                  invalidate();
                  setScenarioIdx(i);
                }}
                disabled={running}
                aria-pressed={active}
                className={`rounded-lg border p-3 text-left transition-colors disabled:opacity-60 ${
                  active
                    ? "border-emerald-400/70 bg-emerald-500/10"
                    : "border-white/10 bg-black/30 hover:border-white/25"
                }`}
              >
                <span
                  className={`block font-mono text-[10px] tracking-widest ${
                    active ? "text-emerald-300" : "text-zinc-600"
                  }`}
                >
                  SCENARIO {s.index}
                </span>
                <span className="mt-1 block font-mono text-sm font-semibold text-zinc-100">
                  {s.title}
                </span>
                <span className="mt-0.5 block font-mono text-[11px] text-zinc-500">
                  {s.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-4 py-3">
            <span className="shrink-0 font-mono text-[10px] tracking-widest text-emerald-300">
              USE CASE
            </span>
            <span className="font-mono text-xs text-zinc-300">
              {scenario.useCase}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-4 py-3">
            <ShieldCheck size={14} className="shrink-0 text-emerald-400" />
            <span className="shrink-0 font-mono text-[10px] tracking-widest text-emerald-300">
              CONTROL
            </span>
            <span className="font-mono text-xs text-zinc-300">
              {scenario.control}
            </span>
          </div>
        </div>
      </div>

      {/* Conversation + trace */}
      <div className="mt-3 grid overflow-hidden rounded-xl border border-white/10 lg:grid-cols-2">
        {/* Left: conversation */}
        <div className="border-b border-white/10 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <AgentIcon size={15} className="text-emerald-400" />
            <span className="font-mono text-xs tracking-widest text-emerald-300">
              {agent.name}
            </span>
            <span
              className={`ml-auto flex items-center gap-1.5 font-mono text-[10px] tracking-widest ${
                running
                  ? "text-amber-300"
                  : phase === "done"
                    ? "text-emerald-300"
                    : "text-zinc-500"
              }`}
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  running
                    ? "animate-pulse bg-amber-400"
                    : phase === "done"
                      ? "bg-emerald-400"
                      : "bg-zinc-600"
                }`}
              />
              {running ? "RUNNING" : phase === "done" ? "COMPLETE" : "IDLE"}
            </span>
          </div>
          <div
            ref={chatRef}
            className="h-[380px] space-y-4 overflow-y-auto p-5 font-mono text-[13px] leading-relaxed"
          >
            {turns.length === 0 && (
              <p className="text-zinc-600">
                {"//"} select a scenario and run the conversation
              </p>
            )}
            {turns.map((t, i) =>
              t.from === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-zinc-100">
                    {t.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="whitespace-pre-wrap break-words">
                  <span className="text-emerald-400">› </span>
                  <span className="text-zinc-400">{t.text}</span>
                </div>
              )
            )}
            {running && (
              <p className="text-zinc-600">
                <span className="text-emerald-400">› </span>
                <span className="animate-pulse">▊</span>
              </p>
            )}
          </div>
        </div>

        {/* Right: trace */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="font-mono text-xs text-zinc-400">
              {agent.runtime}
            </span>
            <span className="font-mono text-[10px] tracking-widest text-zinc-500">
              {phase === "running" ? "RUNNING" : phase === "done" ? "DONE" : "IDLE"}
            </span>
          </div>
          <div
            ref={traceRef}
            className="h-[380px] overflow-y-auto px-4 py-3"
            role="list"
            aria-label="Agent trace"
          >
            {scenario.steps.map((step, i) => {
              const Icon = STEP_ICONS[step.kind];
              const status = statuses[i] ?? "wait";
              return (
                <div
                  key={`${step.label}-${i}`}
                  role="listitem"
                  className={`border-b border-white/5 py-2.5 last:border-b-0 ${
                    status === "wait" ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 shrink-0 font-mono text-[11px] text-zinc-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon
                      size={13}
                      className={`shrink-0 ${
                        status === "rejected"
                          ? "text-red-400"
                          : status === "wait"
                            ? "text-zinc-600"
                            : "text-zinc-400"
                      }`}
                    />
                    <span className="flex-1 font-mono text-[12px] tracking-wider text-zinc-300">
                      {step.label}
                    </span>
                    <span
                      className={`font-mono text-[10px] tracking-widest ${STATUS_STYLES[status]}`}
                    >
                      {status.toUpperCase()}
                    </span>
                  </div>
                  {step.detail && status !== "wait" && (
                    <p className="ml-10 mt-1 truncate font-mono text-[11px] text-zinc-500">
                      {step.detail}
                    </p>
                  )}
                  {step.note && status !== "wait" && status !== "run" && (
                    <p
                      className={`ml-10 mt-0.5 font-mono text-[11px] ${
                        status === "rejected" ? "text-red-400/80" : "text-zinc-600"
                      }`}
                    >
                      {step.note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="border-t border-white/10 bg-black/40 px-4 py-2.5">
            <p className="font-mono text-xs text-zinc-500">
              <span className="text-emerald-400">&gt; </span>
              {footerLine}
              <span className="animate-pulse">▊</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer: run controls + config chips */}
      <div className="mt-3 flex flex-col gap-2 lg:flex-row">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <button
            onClick={run}
            disabled={running}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-4 font-mono text-sm font-semibold text-black transition-colors hover:bg-emerald-400 disabled:opacity-60"
          >
            <Play size={15} />
            {running
              ? "Running trace…"
              : phase === "done"
                ? "Run again"
                : "Run selected conversation"}
          </button>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-black/40 px-5 py-4 font-mono text-sm text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
          >
            Inspect source
            <ExternalLink size={14} className="text-zinc-500" />
          </a>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2">
          {AGENT_CHIPS.map(({ key, value }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2"
            >
              <span className="font-mono text-[10px] tracking-widest text-zinc-500">
                {key}
              </span>
              <span className="font-mono text-[10px] tracking-widest text-emerald-300">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 font-mono text-[11px] text-zinc-600">
        {"//"} deterministic front-end simulation — scenarios illustrate the
        bounded-agent pattern, not a specific deployed product
      </p>
    </div>
  );
}
