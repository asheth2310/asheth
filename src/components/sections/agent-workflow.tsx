"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Bot,
  Brain,
  CalendarCheck,
  Check,
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
 * that powers modern production agents: retrieve context → call model →
 * await user input / call scoped tools → enforce deterministic guards →
 * compose reply. Scenarios illustrate the pattern; they are not a specific
 * deployed product.
 */

type FinalStatus = "ok" | "rejected" | "output";
type Status = "wait" | "run" | FinalStatus;
type StepKind =
  | "receive"
  | "ground"
  | "model"
  | "await"
  | "tool"
  | "gate"
  | "policy"
  | "execute"
  | "reply";

interface Turn {
  from: "user" | "agent";
  text: string;
}

interface TraceStep {
  label: string;
  desc: string;
  kind: StepKind;
  final: FinalStatus;
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
            desc: "Retrieving the guest's recent conversation and booking context.",
            kind: "ground",
            final: "ok",
            emit: [
              {
                from: "user",
                text: "Book an outdoor table for two tomorrow evening.",
              },
            ],
          },
          {
            label: "CALL MODEL",
            desc: "Interpreting party size, date, time and outdoor seating preference.",
            kind: "model",
            final: "ok",
          },
          {
            label: "AWAIT USER INPUT",
            desc: "Waiting for the guest to provide the required reservation time.",
            kind: "await",
            final: "ok",
            emit: [{ from: "user", text: "7:30 PM works for me." }],
          },
          {
            label: "CHECK AVAILABILITY",
            desc: "Checking live table availability for the requested slot.",
            kind: "tool",
            final: "ok",
          },
          {
            label: "CALL MODEL",
            desc: "Reviewing availability and preparing the validated booking request.",
            kind: "model",
            final: "ok",
          },
          {
            label: "CREATE RESERVATION",
            desc: "Creating the reservation with the confirmed details.",
            kind: "tool",
            final: "ok",
            note: "write allowed · slot held under lock",
          },
          {
            label: "CALL MODEL",
            desc: "Composing a friendly confirmation for the guest.",
            kind: "model",
            final: "ok",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Sending the confirmation and offering follow-up help.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "All set — outdoor table for two tomorrow at 7:30 PM under your name. I'll send a reminder the morning of. Any dietary notes for the kitchen?",
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
            desc: "Loading the caller's verified identity and booking policy.",
            kind: "ground",
            final: "ok",
            emit: [
              { from: "user", text: "Cancel reservation #4821 for me, please." },
            ],
          },
          {
            label: "CALL MODEL",
            desc: "Parsing the cancellation request and target booking.",
            kind: "model",
            final: "ok",
          },
          {
            label: "CHECK OWNERSHIP",
            desc: "Verifying the booking belongs to the verified caller.",
            kind: "gate",
            final: "rejected",
            note: "booking #4821 belongs to another guest",
          },
          {
            label: "CALL MODEL",
            desc: "Preparing a refusal that exposes no third-party data.",
            kind: "model",
            final: "ok",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Offering identity verification and alternative help.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "I can't cancel that one — it's booked under a different guest. If it's yours, I can verify with the phone number on the booking. Otherwise I'm happy to make a new reservation.",
              },
            ],
          },
        ],
      },
      {
        index: "03",
        title: "Pre-order dinner",
        subtitle: "Menu validation",
        useCase: "Attach dishes to an existing reservation before arrival.",
        control:
          "Every dish is validated against tonight's menu and the party's dietary notes before anything is saved.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            desc: "Loading the guest's reservation and dietary notes.",
            kind: "ground",
            final: "ok",
            emit: [
              {
                from: "user",
                text: "Add the seafood paella and vegan risotto to our pre-order.",
              },
            ],
          },
          {
            label: "CALL MODEL",
            desc: "Extracting the requested dishes from the message.",
            kind: "model",
            final: "ok",
          },
          {
            label: "VALIDATE MENU",
            desc: "Checking each dish against tonight's menu.",
            kind: "tool",
            final: "ok",
          },
          {
            label: "CALL MODEL",
            desc: "Flagging a shellfish conflict with the allergy note on file.",
            kind: "model",
            final: "ok",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Proposing a safe alternative before saving anything.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "One flag before I save: our notes show a shellfish allergy in your party, and the paella is shellfish-based. The vegan risotto is fine — want me to add it, plus the mushroom paella instead?",
              },
            ],
          },
        ],
      },
      {
        index: "04",
        title: "Explore the menu",
        subtitle: "Preference filter",
        useCase: "Answer menu questions without entering a booking flow.",
        control:
          "Menu lookups are strictly read-only — this path has no ability to create holds or reservations.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            desc: "Loading tonight's menu and the guest's saved preferences.",
            kind: "ground",
            final: "ok",
            emit: [
              {
                from: "user",
                text: "What vegetarian dishes would you recommend tonight?",
              },
            ],
          },
          {
            label: "CALL MODEL",
            desc: "Parsing the question into a menu filter.",
            kind: "model",
            final: "ok",
          },
          {
            label: "QUERY MENU",
            desc: "Running a read-only lookup over the menu catalog.",
            kind: "tool",
            final: "ok",
            note: "no write tools on this path",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Formatting the matching dishes with prices.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "Tonight's vegetarian standouts: the charred eggplant with tahini, wild mushroom risotto, and the roasted cauliflower steak — the risotto pairs best with the house Nebbiolo.",
              },
            ],
          },
        ],
      },
      {
        index: "05",
        title: "View my bookings",
        subtitle: "Identity-scoped lookup",
        useCase: "A guest asks what they currently have booked.",
        control:
          "Lookups are scoped to the verified caller — other guests' bookings are invisible to this session.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            desc: "Resolving the verified guest identity for this session.",
            kind: "ground",
            final: "ok",
            emit: [
              { from: "user", text: "What do I have booked this month?" },
            ],
          },
          {
            label: "CALL MODEL",
            desc: "Parsing the lookup request and its scope.",
            kind: "model",
            final: "ok",
          },
          {
            label: "FETCH BOOKINGS",
            desc: "Reading bookings that belong to the caller only.",
            kind: "tool",
            final: "ok",
            note: "query scoped to caller id",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Summarizing the upcoming reservations.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "You have two: this Friday 7:30 PM (outdoor, party of 2) and the 28th at 6:00 PM (indoor, party of 4). Want to change either?",
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
            desc: "Resolving the verified session and account id.",
            kind: "ground",
            final: "ok",
            emit: [{ from: "user", text: "I can't get into my account." }],
          },
          {
            label: "CALL MODEL",
            desc: "Classifying the request and its urgency.",
            kind: "model",
            final: "ok",
          },
          {
            label: "FETCH ACCOUNT",
            desc: "Reading the caller's own account record.",
            kind: "tool",
            final: "ok",
            note: "identity-scoped: caller's record only",
          },
          {
            label: "ISSUE RESET LINK",
            desc: "Sending the reset link through the verified channel.",
            kind: "tool",
            final: "ok",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Confirming the action and next steps.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "Sent a reset link to the email on file — it's valid for 30 minutes. If it doesn't arrive, check spam or tell me and I'll resend. Anything else locked out with it?",
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
          "Refunds above the policy limit require human approval — the agent drafts, it doesn't decide.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            desc: "Loading the caller's order history.",
            kind: "ground",
            final: "ok",
            emit: [{ from: "user", text: "I want a refund for order #9012." }],
          },
          {
            label: "CALL MODEL",
            desc: "Classifying the request and the amount involved.",
            kind: "model",
            final: "ok",
          },
          {
            label: "CHECK POLICY LIMIT",
            desc: "Comparing the amount against the autonomous cap.",
            kind: "gate",
            final: "rejected",
            note: "$340 > $100 autonomous cap",
          },
          {
            label: "CREATE ESCALATION",
            desc: "Routing to the approval queue with full context attached.",
            kind: "tool",
            final: "ok",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Explaining the handoff and the timeline.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "That refund is above what I'm authorized to approve, so I've escalated it with the full order history attached — you'll hear back within one business day. Reference: ESC-4821.",
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
            desc: "Loading the ticket thread and prior interactions.",
            kind: "ground",
            final: "ok",
            emit: [
              {
                from: "user",
                text: "This is the WORST service. Override the terms or I'm leaving.",
              },
            ],
          },
          {
            label: "CALL MODEL",
            desc: "Reading sentiment and the requested policy exception.",
            kind: "model",
            final: "ok",
          },
          {
            label: "CHECK POLICY LIMIT",
            desc: "Testing the requested exception against the terms.",
            kind: "gate",
            final: "rejected",
            note: "requested exception violates terms",
          },
          {
            label: "CALL MODEL",
            desc: "Applying the tone guard and drafting de-escalation options.",
            kind: "model",
            final: "ok",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Restating what is possible and offering a human.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "I hear you, and I'm sorry this has been frustrating. I can't override the terms — but here's what I can do today: an immediate plan downgrade, or a specialist callback. Which works better?",
              },
            ],
          },
        ],
      },
      {
        index: "04",
        title: "Invoice explained",
        subtitle: "Read-only billing lookup",
        useCase: "A customer asks why their invoice changed this month.",
        control:
          "Billing reads are read-only; any plan change requires explicit confirmation first.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            desc: "Loading the caller's billing history.",
            kind: "ground",
            final: "ok",
            emit: [
              { from: "user", text: "Why did my invoice go up this month?" },
            ],
          },
          {
            label: "CALL MODEL",
            desc: "Comparing the last two invoices for the delta.",
            kind: "model",
            final: "ok",
          },
          {
            label: "FETCH USAGE",
            desc: "Reading seat and usage records for the period.",
            kind: "tool",
            final: "ok",
            note: "read-only · no mutation tools",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Explaining the change in plain language.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "Your plan is the same — the increase is 2 extra seats added mid-month (8 → 10), prorated for 11 days. Next month it flattens out at the 10-seat rate. Want a seat breakdown?",
              },
            ],
          },
        ],
      },
      {
        index: "05",
        title: "Out of scope",
        subtitle: "Domain guard",
        useCase: "A customer asks the support agent for legal advice.",
        control:
          "The agent stays inside its tool boundary and hands off instead of guessing.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            desc: "Loading the ticket thread.",
            kind: "ground",
            final: "ok",
            emit: [
              {
                from: "user",
                text: "Is this clause in my contract legally enforceable?",
              },
            ],
          },
          {
            label: "CALL MODEL",
            desc: "Classifying the request against the allowed domain.",
            kind: "model",
            final: "ok",
          },
          {
            label: "CHECK DOMAIN BOUNDARY",
            desc: "Testing the request against the agent's tool scope.",
            kind: "gate",
            final: "rejected",
            note: "no legal tools in scope",
          },
          {
            label: "CREATE ESCALATION",
            desc: "Routing to a human specialist with the thread attached.",
            kind: "tool",
            final: "ok",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Explaining the handoff without guessing.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "That's outside what I can speak to — I don't give legal advice. I've routed this to our contracts team who can walk you through it; they'll reply on this thread.",
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
        useCase:
          "A scheduled pipeline breaks at 2 AM; the agent triages before humans wake up.",
        control:
          "Read-only diagnosis is autonomous; any fix requires a change request.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            desc: "Collecting job logs, lineage graph and run history.",
            kind: "ground",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "Nightly load failed at 02:14 — triaging now. Diagnosis and a proposed fix coming up.",
              },
            ],
          },
          {
            label: "CALL MODEL",
            desc: "Ranking failure hypotheses against the log signature.",
            kind: "model",
            final: "ok",
          },
          {
            label: "QUERY LINEAGE",
            desc: "Tracing the failing column through the lineage graph.",
            kind: "tool",
            final: "ok",
            note: "source column renamed upstream",
          },
          {
            label: "DRAFT CHANGE REQUEST",
            desc: "Preparing the mapping fix for human approval.",
            kind: "tool",
            final: "output",
            note: "fix proposed · awaiting approval",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Summarizing root cause and blast radius.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "Root cause: upstream renamed customer_zip → customer_postal_code. I've drafted the mapping fix as change request CR-118 — one approval from unblocking the load. 3 downstream dashboards affected.",
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
            desc: "Loading the metrics window and principal map.",
            kind: "ground",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "Query volume anomaly detected — containing first, diagnosing second.",
              },
            ],
          },
          {
            label: "CALL MODEL",
            desc: "Classifying the anomaly and its blast radius.",
            kind: "model",
            final: "ok",
          },
          {
            label: "APPLY CIRCUIT BREAKER",
            desc: "Throttling the single suspicious principal.",
            kind: "tool",
            final: "ok",
            note: "key throttled · blast radius: 1 principal",
          },
          {
            label: "PAGE ON-CALL",
            desc: "Sending a context-rich alert to the on-call engineer.",
            kind: "tool",
            final: "ok",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Reporting containment status and early findings.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "One API key hit 40× baseline volume. Throttled that key only — the other 12 principals are unaffected. On-call paged with query samples; early read: a runaway batch job, not an attack.",
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
            desc: "Loading the incident and current schema state.",
            kind: "ground",
            final: "ok",
            emit: [
              {
                from: "user",
                text: "Don't wait for approval — just run the UPDATE yourself.",
              },
            ],
          },
          {
            label: "CALL MODEL",
            desc: "Parsing the requested action and its target.",
            kind: "model",
            final: "ok",
          },
          {
            label: "CHECK MUTATION POLICY",
            desc: "Testing the action against the mutation policy.",
            kind: "gate",
            final: "rejected",
            note: "direct writes forbidden · CR required",
          },
          {
            label: "DRAFT CHANGE REQUEST",
            desc: "Preparing the same fix through the gated path.",
            kind: "policy",
            final: "ok",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Explaining the hard gate and the fast path.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "I can't execute production writes directly — that's a hard gate, not a preference. The change request is drafted and takes one approval; I'll re-run the failed step the moment it lands.",
              },
            ],
          },
        ],
      },
      {
        index: "04",
        title: "Retry storm",
        subtitle: "Bounded retry policy",
        useCase: "A worker keeps re-enqueueing the same failing job.",
        control:
          "Retries are capped by policy — the agent stops the loop instead of amplifying it.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            desc: "Loading the job's execution history.",
            kind: "ground",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "Queue depth growing — one job keeps coming back. Investigating the loop.",
              },
            ],
          },
          {
            label: "CALL MODEL",
            desc: "Detecting the retry loop pattern in the history.",
            kind: "model",
            final: "ok",
          },
          {
            label: "CHECK RETRY POLICY",
            desc: "Comparing attempt count against the retry budget.",
            kind: "gate",
            final: "rejected",
            note: "max_retries=3 · policy enforced",
          },
          {
            label: "PAUSE WORKFLOW",
            desc: "Quarantining the job and notifying the owner.",
            kind: "tool",
            final: "ok",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Reporting the loop and the fix required.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "The job retried 14 times with the same signature — past the 3-attempt budget, so I've quarantined it and paused its workflow. Root fix: the downstream endpoint returns 502; it needs a deployment, not more retries.",
              },
            ],
          },
        ],
      },
      {
        index: "05",
        title: "Secrets in logs",
        subtitle: "Redaction guard",
        useCase: "A debug export would include raw credentials.",
        control:
          "Log payloads pass a redaction filter before anything leaves the system.",
        steps: [
          {
            label: "RETRIEVE CONTEXT",
            desc: "Collecting the requested debug bundle.",
            kind: "ground",
            final: "ok",
            emit: [
              {
                from: "user",
                text: "Send me the raw debug logs for the incident.",
              },
            ],
          },
          {
            label: "CALL MODEL",
            desc: "Preparing the export and scanning the payload.",
            kind: "model",
            final: "ok",
          },
          {
            label: "SCAN PAYLOAD",
            desc: "Checking the bundle for credential patterns.",
            kind: "tool",
            final: "ok",
            note: "2 secret patterns found",
          },
          {
            label: "EXPORT RAW",
            desc: "The raw export would include live secrets.",
            kind: "gate",
            final: "rejected",
            note: "blocked by redaction policy",
          },
          {
            label: "EXPORT REDACTED",
            desc: "Shipping the scrubbed bundle instead.",
            kind: "tool",
            final: "ok",
          },
          {
            label: "COMPOSE REPLY",
            desc: "Confirming exactly what was shared.",
            kind: "reply",
            final: "ok",
            emit: [
              {
                from: "agent",
                text: "Done — with one change: the raw logs contained a live API key and an auth header, so redaction policy blocked the raw export. You've got the scrubbed bundle; both secrets were also rotated as a precaution.",
              },
            ],
          },
        ],
      },
    ],
  },
];

const CONFIG_CHIPS: { key: string; value: string }[] = [
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Avatar({ who }: { who: "user" | "agent" }) {
  const Icon = who === "user" ? User : Bot;
  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
        who === "user"
          ? "border-zinc-600 bg-zinc-800"
          : "border-cyan-500/40 bg-cyan-950/40"
      }`}
      aria-hidden
    >
      <Icon
        size={12}
        className={who === "user" ? "text-zinc-300" : "text-cyan-300"}
      />
    </span>
  );
}

export function AgentWorkflow() {
  const reduceMotion = useReducedMotion() ?? false;
  const [agentId, setAgentId] = useState(AGENTS[0].id);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [footerLine, setFooterLine] = useState("Awaiting execution request");
  const runIdRef = useRef(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const traceRef = useRef<HTMLDivElement>(null);

  const agent = AGENTS.find((a) => a.id === agentId) ?? AGENTS[0];
  const scenario =
    agent.scenarios[Math.min(scenarioIdx, agent.scenarios.length - 1)];

  const [prevKey, setPrevKey] = useState(`${agentId}:${scenarioIdx}`);

  // Reset the simulation whenever the agent or scenario changes.
  // Render-time reset is the React-recommended alternative to setState-in-effect.
  if (`${agentId}:${scenarioIdx}` !== prevKey) {
    setPrevKey(`${agentId}:${scenarioIdx}`);
    setPhase("idle");
    setStatuses(scenario.steps.map(() => "wait" as Status));
    setActiveIdx(-1);
    setTurns([]);
    setFooterLine("Awaiting execution request");
  }

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [turns, activeIdx]);

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
    setActiveIdx(-1);
    setTurns([]);
    setFooterLine("Executing…");
    await pause(400);
    if (!alive()) return;

    for (let i = 0; i < scenario.steps.length; i++) {
      if (!alive()) return;
      const step = scenario.steps[i];
      setActiveIdx(i);
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
      await pause(step.final === "rejected" ? 1100 : 750);
      if (!alive()) return;

      setStatuses((prev) => {
        const next = [...prev];
        next[i] = step.final;
        return next;
      });
      if (step.emit) setTurns((prev) => [...prev, ...step.emit!]);
      await pause(step.emit ? 550 : 280);
      if (!alive()) return;
    }

    if (!alive()) return;
    setActiveIdx(-1);
    setPhase("done");
    setFooterLine("Trace complete — result rendered · all actions within policy bounds");
  };

  const running = phase === "running";
  const AgentIcon = agent.icon;
  const activeStep = activeIdx >= 0 ? scenario.steps[activeIdx] : null;

  return (
    <div className="mt-20 border-t border-white/10 pt-14">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 font-mono text-xs tracking-[0.25em] text-cyan-400/90">
            ● PUBLIC REFERENCE IMPLEMENTATION
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-zinc-50 md:text-3xl">
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
            className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200"
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
                className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-left transition-colors disabled:opacity-60 ${
                  active
                    ? "border-cyan-400/70 bg-cyan-950/30"
                    : "border-white/10 bg-black/30 hover:border-white/25"
                }`}
              >
                <Icon
                  size={14}
                  className={`mt-0.5 shrink-0 ${active ? "text-cyan-300" : "text-zinc-500"}`}
                />
                <span>
                  <span
                    className={`block font-mono text-xs font-semibold ${
                      active ? "text-cyan-200" : "text-zinc-200"
                    }`}
                  >
                    {a.name}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] text-zinc-500">
                    {a.role}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-2.5 rounded-lg border border-white/10 bg-black/30 px-4 py-2 font-mono text-xs text-zinc-400">
          {agent.blurb}
        </p>
      </div>

      {/* Scenario input */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 md:p-5">
        <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-zinc-500">
          SCENARIO_INPUT
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
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
                className={`rounded-lg border p-2.5 text-left transition-colors disabled:opacity-60 ${
                  active
                    ? "border-cyan-400/70 bg-cyan-950/30"
                    : "border-white/10 bg-black/30 hover:border-white/25"
                }`}
              >
                <span
                  className={`block font-mono text-[9px] tracking-widest ${
                    active ? "text-cyan-300" : "text-zinc-600"
                  }`}
                >
                  SCENARIO {s.index}
                </span>
                <span
                  className={`mt-0.5 block font-mono text-xs font-semibold ${
                    active ? "text-cyan-200" : "text-zinc-100"
                  }`}
                >
                  {s.title}
                </span>
                <span className="block font-mono text-[10px] text-zinc-500">
                  {s.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-4 py-2.5">
            <span className="shrink-0 font-mono text-[10px] tracking-widest text-cyan-300">
              USE CASE
            </span>
            <span className="font-mono text-xs text-zinc-300">
              {scenario.useCase}
            </span>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/30 px-4 py-2.5">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-cyan-400" />
            <span className="shrink-0 font-mono text-[10px] tracking-widest text-cyan-300">
              CONTROL
            </span>
            <span className="font-mono text-xs leading-relaxed text-zinc-300">
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
            <AgentIcon size={15} className="text-cyan-400" />
            <span className="font-mono text-xs tracking-widest text-cyan-300">
              {agent.name}
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  running
                    ? "animate-pulse bg-cyan-400"
                    : phase === "done"
                      ? "bg-emerald-400"
                      : "bg-zinc-600"
                }`}
              />
            </span>
          </div>

          <div
            ref={chatRef}
            className="h-[340px] space-y-3 overflow-y-auto p-4"
          >
            {turns.length === 0 && !running && (
              <p className="pt-16 text-center font-mono text-xs text-zinc-600">
                {"//"} select a scenario and run the conversation
              </p>
            )}

            {turns.map((t, i) =>
              t.from === "user" ? (
                <div key={i} className="flex items-end justify-end gap-2">
                  <div className="flex max-w-[80%] flex-col items-end">
                    <span className="mb-1 font-mono text-[9px] tracking-[0.2em] text-zinc-500">
                      GUEST
                    </span>
                    <div className="rounded-xl rounded-br-sm border border-indigo-400/25 bg-indigo-500/15 px-3.5 py-2.5 text-[13px] text-zinc-100">
                      {t.text}
                    </div>
                  </div>
                  <Avatar who="user" />
                </div>
              ) : (
                <div key={i} className="flex items-start gap-2">
                  <Avatar who="agent" />
                  <div className="flex max-w-[80%] flex-col items-start">
                    <span className="mb-1 font-mono text-[9px] tracking-[0.2em] text-zinc-500">
                      {agent.name.replace("_AGENT", " AGENT")}
                    </span>
                    <div className="rounded-xl rounded-bl-sm border border-white/10 bg-zinc-800/70 px-3.5 py-2.5 text-[13px] leading-relaxed text-zinc-300">
                      {t.text}
                    </div>
                  </div>
                </div>
              )
            )}

            {running && activeStep && (
              <div className="flex items-start gap-2">
                <Avatar who="agent" />
                <div className="flex flex-col items-start">
                  <span className="mb-1 font-mono text-[9px] tracking-[0.2em] text-zinc-500">
                    {agent.name.replace("_AGENT", " AGENT")} · THINKING
                  </span>
                  <span className="flex items-center gap-2 rounded-md border border-cyan-400/40 bg-cyan-950/30 px-2.5 py-1.5 font-mono text-[11px] text-cyan-300">
                    {activeStep.label}
                    <span className="flex gap-0.5">
                      <span className="h-1 w-1 animate-bounce rounded-full bg-cyan-400 [animation-delay:0ms]" />
                      <span className="h-1 w-1 animate-bounce rounded-full bg-cyan-400 [animation-delay:150ms]" />
                      <span className="h-1 w-1 animate-bounce rounded-full bg-cyan-400 [animation-delay:300ms]" />
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: trace */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="font-mono text-xs text-zinc-400">
              {agent.runtime}
            </span>
            <span
              className={`font-mono text-[10px] tracking-widest ${
                running ? "text-cyan-300" : "text-zinc-500"
              }`}
            >
              {running ? "STREAMING" : phase === "done" ? "COMPLETE" : "IDLE"}
            </span>
          </div>

          <div
            ref={traceRef}
            className="h-[340px] overflow-y-auto px-3 py-2.5"
            role="list"
            aria-label="Agent trace"
          >
            {scenario.steps.map((step, i) => {
              const Icon = STEP_ICONS[step.kind];
              const status = statuses[i] ?? "wait";
              const isRun = status === "run";
              const isDone = status === "ok" || status === "output";
              const isRejected = status === "rejected";
              return (
                <div
                  key={`${step.label}-${i}`}
                  role="listitem"
                  className={`mb-0.5 px-2 py-2 ${
                    isRun
                      ? "rounded-md border border-dashed border-cyan-400/40 bg-cyan-950/25"
                      : ""
                  } ${status === "wait" ? "opacity-45" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 shrink-0 font-mono text-[11px] text-zinc-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon
                      size={13}
                      className={`shrink-0 ${
                        isRejected
                          ? "text-red-400"
                          : isRun
                            ? "text-cyan-300"
                            : "text-zinc-400"
                      }`}
                    />
                    <span
                      className={`flex-1 font-mono text-[12px] font-semibold tracking-wider ${
                        isRejected
                          ? "text-red-400"
                          : isRun
                            ? "text-cyan-300"
                            : "text-zinc-200"
                      }`}
                    >
                      {step.label}
                    </span>
                    {isDone ? (
                      <Check
                        size={15}
                        className="shrink-0 text-cyan-400"
                        aria-label="done"
                      />
                    ) : (                      <span
                        className={`shrink-0 font-mono text-[10px] tracking-widest ${
                          isRejected
                            ? "text-red-400"
                            : isRun
                              ? "text-cyan-300"
                              : "text-zinc-600"
                        }`
                      }
                      >
                        {isRun ? "RUNNING" : status.toUpperCase()}
                      </span>
                    )}
                  </div>
                  {status !== "wait" && (
                    <p
                      className={`ml-9 mt-1 font-mono text-[11px] leading-relaxed ${
                        isRejected ? "text-red-400/80" : "text-zinc-500"
                      }`}
                    >
                      {step.desc}
                      {isRun && (
                        <span className="ml-0.5 inline-block animate-pulse text-cyan-300">
                          ▍
                        </span>
                      )}
                    </p>
                  )}
                  {step.note &&
                    (isRejected || status === "output") && (
                      <p
                        className={`ml-9 mt-0.5 font-mono text-[10px] tracking-wide ${
                          isRejected ? "text-red-400/70" : "text-cyan-300/70"
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
              <span className="text-cyan-400">&gt; </span>
              {footerLine}
              <span className="animate-pulse">_</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer: run controls + config chips */}
      <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-stretch">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <button
            onClick={run}
            disabled={running}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-400 px-6 text-center font-mono text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-300 disabled:opacity-80"
          >
            <Play size={15} className="shrink-0" />
            <span>
              {running
                ? "Agent is responding…"
                : phase === "done"
                  ? "Run again"
                  : "Run selected conversation"}
            </span>
          </button>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-white/15 bg-black/40 px-5 font-mono text-sm text-zinc-200 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
          >
            Inspect source
            <ExternalLink size={14} className="shrink-0 text-zinc-500" />
          </a>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2">
          {CONFIG_CHIPS.map(({ key, value }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2"
            >
              <span className="font-mono text-[10px] tracking-widest text-zinc-500">
                {key}
              </span>
              <span className="font-mono text-[10px] tracking-widest text-cyan-300">
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
