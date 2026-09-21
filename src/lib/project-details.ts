/**
 * Deep-dive content for the project detail modals.
 *
 * Every claim here is traceable to one of:
 *  - the project's own README (github.com/asheth2310/<repo>)
 *  - the NatSQL source in the local workspace (backend/app/validator.py)
 *  - copy already published in this portfolio (src/lib/content.ts)
 *
 * Optional sections (stat, keyDecisions, tradeoffs, outcomes) are omitted
 * entirely when there is nothing real to say — never invented.
 */

export interface ProjectDetail {
  /** Path shown in the modal chrome bar */
  path: string;
  /** Small chip before the title (matches card index) */
  kind: string;
  period: string;
  role: string;
  /** One-line summary under PERIOD/ROLE */
  summary: string;
  /** Big metric line — only when a real, sourced number exists */
  stat?: { value: string; label: string };
  project: string;
  architecture: string[];
  keyDecisions?: string[];
  decisions: string[];
  tradeoffs?: string[];
  outcomes?: string[];
  stack: string[];
}

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  "project-sentinel": {
    path: "~/asheth2310/project-sentinel",
    kind: "PLATFORM",
    period: "JUL 2026",
    role: "Solo engineer — end-to-end",
    summary:
      "Real-time telemetry pipeline that watches fleets of AI agents — ingestion, anomaly detection, and governance with circuit breakers.",
    stat: {
      value: "P99 < 15MS",
      label: "telemetry ingestion latency (README)",
    },
    project:
      "Agent fleets fail in expensive ways: recursive prompt loops, token spikes, runaway costs. Sentinel ingests telemetry from agent SDKs through an async gateway onto a Kafka event bus, where a Flink anomaly engine maintains sliding windows and detects infinite-loop, prompt-cascade, and token-spike signatures. A governance engine evaluates findings against per-organization policies and trips Redis-backed circuit breakers, with alerts delivered to Slack and PagerDuty.",
    architecture: [
      "Ingestion Gateway",
      "Kafka Event Bus",
      "Anomaly Engine (Flink)",
      "Governance Engine",
      "Circuit Breaker",
      "TimescaleDB Storage",
      "Notifications",
    ],
    keyDecisions: [
      "Decoupled ingestion from detection through Kafka, so telemetry bursts never back-pressure the gateway.",
      "Implemented circuit breakers on Redis state with TTL auto-deactivation and fail-open behavior — availability over strict enforcement.",
      "Used Flink sliding windows for Z-score anomaly detection, including infinite-loop and prompt-cascade signatures.",
      "Modeled governance as configurable soft (80%) and hard (100%) thresholds per organization.",
    ],
    decisions: [
      "Separate anomaly and governance engines so detection logic stays testable independently of policy enforcement.",
      "Idempotent, atomic batch production from the gateway prevents duplicate telemetry on client retries.",
      "Multi-channel notifications with exponential backoff retry guarantee alerts reach on-call.",
    ],
    tradeoffs: [
      "Circuit breakers fail open by design — a broken breaker degrades to alerting, never to a fleet-wide outage.",
      "Sliding windows trade a small detection delay for tolerance against noisy single-request spikes.",
    ],
    outcomes: [
      "Runaway loops and token spikes are caught and contained before they compound into cost incidents.",
      "Every enforcement decision is auditable through stored telemetry and health endpoints.",
    ],
    stack: [
      "Python",
      "FastAPI",
      "Uvicorn",
      "Pydantic v2",
      "Kafka",
      "Flink",
      "Redis",
      "TimescaleDB",
      "Slack API",
      "PagerDuty",
    ],
  },

  iodine: {
    path: "~/asheth2310/iodine",
    kind: "DEVELOPER TOOL",
    period: "AUG 2026",
    role: "Solo engineer — end-to-end",
    summary:
      "An AI codebase mentor: guided walkthroughs of unfamiliar repositories, an integrated dev workspace, and architecture graphs generated from the code on disk.",
    stat: {
      value: "3 PROVIDERS",
      label: "Claude, GPT & Gemini behind one assistant interface (README)",
    },
    project:
      "Opening a new repository can feel like arriving in a city without a map — and AI-generated code makes it worse. Iodine is a workspace-shaped IDE that mentors you through it: Mentor Mode builds a guided walkthrough that opens each relevant file, highlights the lines worth studying, and explains them in context before moving on. Beyond mentoring it ships a full workspace — Monaco editor, integrated terminal, Git workflows, previews — plus System View, an interactive architecture graph generated from the code actually on disk, with nodes linking back to source locations.",
    architecture: [
      "Mentor Mode",
      "Coding Assistant",
      "Monaco Editor",
      "Integrated Terminal",
      "System View",
      "Git Workflows",
      "Build Runner",
    ],
    keyDecisions: [
      "Ground every explanation in the workspace itself — context comes from the user's code, not generic examples.",
      "Build System View from discovered reality: components, pages, APIs, and databases found in the workspace, reconcilable with manual edits.",
      "Abstract AI providers behind one assistant interface so Claude, GPT, and Gemini are interchangeable.",
      "Keep mentoring human-in-control: Iodine explains and suggests, the developer acts.",
    ],
    decisions: [
      "Persist system graphs outside the repository (~/.iodine) so generated docs never pollute the user's tree.",
      "Wire the terminal through node-pty and xterm.js for a real shell, not a simulated one.",
      "Structure as an npm-workspaces monorepo with Vite HMR and tsx watch for fast iteration.",
    ],
    tradeoffs: [
      "Workspace-grounded answers mean the AI re-reads context often — slower than cached generic replies, far more accurate.",
      "Generated architecture graphs reflect what the explorer finds; undocumented patterns can be missed until re-generated.",
    ],
    outcomes: [
      "From first question to first confident contribution inside one guided workspace.",
      "Doubles as a readable reference for building AI-assisted developer tools (Monaco + xterm.js + multi-provider agents).",
    ],
    stack: [
      "React 18",
      "TypeScript",
      "Vite",
      "Monaco Editor",
      "xterm.js",
      "node-pty",
      "Node.js",
      "Express",
      "WebSocket",
      "Claude API",
      "OpenAI API",
      "Gemini API",
    ],
  },

  NatSQL: {
    path: "~/asheth2310/NatSQL",
    kind: "DATABASE",
    period: "AUG 2026",
    role: "Solo engineer — end-to-end",
    summary:
      "Natural-language interface for databases — plain English in, validated read-only SQL out, with the generated query always shown.",
    stat: {
      value: "LIMIT 100",
      label: "hard row clamp on every query (validator.py)",
    },
    project:
      "NatSQL answers questions against a relational database: the model drafts SQL from a schema summary, a sqlglot AST validator rejects anything that isn't a single whitelisted SELECT, LIMIT is clamped, and execution happens under a read-only role. The generated SQL is displayed next to the results, so answers are never trusted blindly.",
    architecture: [
      "Terminal UI",
      "Schema Loader",
      "LLM Client",
      "Rule-Based Fallback",
      "SQL Validator",
      "Read-Only Executor",
    ],
    keyDecisions: [
      "Validate at the AST level with sqlglot — writes, DDL, unknown tables and columns are rejected structurally, not by string matching.",
      "Execute under a read-only database role so even a validator bypass cannot mutate data (defense in depth).",
      "Run fully local: Ollama when available, deterministic rule-based engine otherwise — zero API keys.",
      "Clamp LIMIT to max_rows on every query, including ones the model already limited.",
    ],
    decisions: [
      "Fail closed: multiple statements, UNION/INTERSECT/EXCEPT, and dangerous functions are all rejected at the parse gate.",
      "Feed validator errors back to the model as a bounded repair loop instead of failing the request outright.",
      "Show the generated SQL beside every result — the interface never hides what ran.",
    ],
    tradeoffs: [
      "The conservative validator rejects some syntactically valid queries — false positives are preferred over unsafe writes.",
      "Local-first models trade some answer quality for privacy and zero operating cost.",
    ],
    outcomes: [
      "The model can never mutate data — writes are structurally impossible, not politely discouraged.",
      "Runs anywhere Docker runs, with no external services required.",
    ],
    stack: [
      "Python",
      "Ollama",
      "sqlglot",
      "MySQL",
      "Docker",
      "Rich TUI",
    ],
  },

  WildcatIQ: {
    path: "~/asheth2310/WildcatIQ",
    kind: "DATA PLATFORM",
    period: "AUG 2026",
    role: "Solo engineer — end-to-end",
    summary:
      "Production-style institutional analytics platform: fragmented university data becomes governed, quality-checked, lineage-traced BI.",
    stat: {
      value: "19 RULES",
      label: "automated quality checks across 7 categories (README)",
    },
    project:
      "Universities run student, course, enrollment, admissions, and graduation systems that never agree on schemas or definitions. WildcatIQ demonstrates the full reliability path: ingestion into raw, standardization through staging, a dimensional warehouse with conformed metrics, an automated quality engine, metadata catalog and lineage graph, and an incident center that turns failed validations into actionable tickets — all on entirely synthetic data.",
    architecture: [
      "Ingestion",
      "Raw Layer",
      "Staging",
      "Dimensional Warehouse",
      "Quality Engine",
      "Semantic Layer",
      "FastAPI API",
      "Next.js Frontend",
      "Lineage Graph",
      "Incident Center",
    ],
    keyDecisions: [
      "Build entirely on synthetic data — realistic shape, zero real institutional records.",
      "Model slowly changing dimensions (SCD Type 2) on dim_student so historical enrollments stay accurate.",
      "Compute quality scores from stored validation results, not ephemeral checks, so trends are queryable.",
      "Auto-generate incidents from quality failures with evidence and downstream impact attached.",
    ],
    decisions: [
      "Trace enrollment metrics end-to-end through a recursive lineage graph — source systems to dashboard.",
      "Expose a Data Trust Center where VERIFIED/DEGRADED status is derived from active incidents and scores.",
      "Include an incident simulator with seven injection scenarios and reset-to-baseline for reliability drills.",
    ],
    tradeoffs: [
      "Synthetic data proves the pipeline mechanics without proving real-world scale.",
      "SCD Type 2 complicates every historical query in exchange for correct as-of-date reporting.",
    ],
    outcomes: [
      "Dashboards carry trust indicators backed by the quality engine — a chart is only shown when its data earns it.",
      "Broken data becomes a triaged incident with evidence, not a silent wrong number.",
    ],
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Dimensional Modeling",
      "SCD Type 2",
      "Data Quality",
      "Next.js",
      "BI",
    ],
  },

  "stream-table-olap-engine": {
    path: "~/asheth2310/stream-table-olap-engine",
    kind: "STREAMING",
    period: "JUL 2026",
    role: "Solo engineer — end-to-end",
    summary:
      "Sub-second stream-table join and OLAP engine — high-volume ingestion, SIMD-accelerated joins, and interactive analytical queries.",
    stat: {
      value: "100K+/SEC",
      label: "event ingestion with sub-50ms analytical queries (README)",
    },
    project:
      "Real-time analytics usually forces a choice: fast ingestion or fast queries. This engine refuses the trade-off. It ingests 100K+ events per second from a Redpanda stream, joins the stream against dimension tables using SIMD-accelerated Apache Arrow, and serves sub-50ms analytical queries to an interactive dashboard — one pipeline from event to insight.",
    architecture: [
      "Redpanda Ingestion",
      "Stream Pipeline",
      "Arrow Join Engine",
      "OLAP Query Layer",
      "API Server",
      "Dashboard",
    ],
    keyDecisions: [
      "Join streams to dimension tables in memory on Apache Arrow — SIMD columnar ops instead of row-by-row lookups.",
      "Run in degraded mode without the broker: the engine works locally with zero infrastructure.",
      "Serve queries from the same process that ingests, keeping p50 latency in milliseconds.",
    ],
    decisions: [
      "Pair the pipeline with an interactive dashboard so every metric is one click from its query.",
      "Keep the whole stack Python — one language from kernel to UI.",
    ],
    tradeoffs: [
      "In-memory joins trade bounded memory use for predictable latency.",
      "A single-node design favors simplicity and demo-ability over horizontal scale.",
    ],
    outcomes: [
      "Events become queryable in milliseconds — dashboards reflect reality, not the last batch job.",
      "The architecture maps directly to production stream-processing patterns (Kafka/Flink-style) at MVP scale.",
    ],
    stack: [
      "Python",
      "Apache Arrow",
      "Redpanda",
      "OLAP",
      "FastAPI",
      "Dashboard",
    ],
  },

  "data-quality-observability-engine": {
    path: "~/asheth2310/data-quality-observability-engine",
    kind: "DATA QUALITY",
    period: "JUL 2026",
    role: "Solo engineer — end-to-end",
    summary:
      "Production-grade quality and observability engine with a live dashboard — drift detection, auto-healing, anomalies, and lineage-driven impact analysis.",
    stat: {
      value: "LIVE",
      label: "deployed dashboard (vercel) · four auto-healing flows",
    },
    project:
      "Pipelines break silently: a source renames a column, a feed arrives stale, a distribution shifts. This engine watches for all of it — schema drift detection with auto-healing flows, statistical anomaly detection, freshness SLA monitoring, and lineage-based impact analysis — and exposes everything through a live deployed dashboard with an interactive lineage graph.",
    architecture: [
      "Drift Detector",
      "Auto-Healing Flows",
      "Anomaly Engine",
      "Freshness SLA Monitor",
      "Lineage Graph",
      "Live Dashboard",
    ],
    keyDecisions: [
      "Detect schema drift and heal automatically — the pipeline adapts to renames instead of paging a human for them.",
      "Base anomaly detection on statistics, not thresholds, so subtle distribution shifts surface early.",
      "Build impact analysis on lineage: when data breaks, know exactly which dashboards are affected.",
    ],
    decisions: [
      "Deploy the dashboard publicly — observability tooling you can't open in a meeting is tooling you don't use.",
      "Monitor freshness as an SLA, not a heuristic, so staleness is measurable.",
    ],
    tradeoffs: [
      "Automated healing covers safe transforms; ambiguous drift still escalates rather than guessing.",
    ],
    outcomes: [
      "Broken data becomes a detected, diagnosed, and often self-healed event — before stakeholders notice.",
      "The live dashboard turns data trust from a vibe into a homepage.",
    ],
    stack: [
      "Python",
      "Data Quality",
      "Anomaly Detection",
      "Lineage",
      "SLA Monitoring",
      "Dashboard",
    ],
  },

  "codereview-ai": {
    path: "~/asheth2310/codereview-ai",
    kind: "CI/CD",
    period: "FEB 2026 — SEP 2026",
    role: "Solo engineer — end-to-end",
    summary:
      "AI code review assistant that runs quality checks directly inside CI/CD pipelines, before a merge ships.",
    project:
      "Repetitive review toil — lint-level issues, obvious bug patterns, missing checks — slows down pull-request flow. codereview-ai hooks into the pull-request process through the GitHub API and automates those first-pass checks inside CI, so human reviewers see flagged issues before merge instead of after.",
    architecture: [
      "Pull-Request Hook",
      "GitHub API",
      "Review Rules",
      "CI/CD Integration",
    ],
    decisions: [
      "Run in the CI pipeline rather than as a separate service — findings land where reviewers already look.",
      "Integrate through the GitHub API so comments and checks appear on the PR itself.",
    ],
    stack: [
      "JavaScript",
      "Node.js",
      "GitHub API",
      "CI/CD",
      "AI",
    ],
  },

  "tax-intake-validator": {
    path: "~/asheth2310/tax-intake-validator",
    kind: "AUTOMATION",
    period: "JAN 2026",
    role: "Solo engineer — end-to-end",
    summary:
      "Automated validation and triage for tax-season document intake — missing forms and parsing failures become structured incidents.",
    stat: {
      value: "5 CLASSES",
      label: "of intake incidents detected (README)",
    },
    project:
      "During tax season, intake quality problems — missing W-2s, invalid AGI values, duplicate returns, stuck processing — surface one client at a time. This tool reads incoming return data from CSV, validates required fields, detects missing documents, scans application logs for parsing and disk errors, and emits a structured incident report with severity and remediation steps.",
    architecture: [
      "CSV Reader",
      "Field Validator",
      "Document Checker",
      "Log Scanner",
      "Incident Reporter",
      "JSON Export",
    ],
    keyDecisions: [
      "Join return-data checks with application-log scanning so client-side and system-side failures surface together.",
      "Generate a structured incident_report.json — machine-readable for downstream ticketing and alerting.",
      "Keep it a single runnable script: python validate.py prints the summary and writes the report.",
    ],
    decisions: [
      "Classify findings with severity levels so operations triages before engineering engages.",
      "Detect duplicate return IDs and stuck-in-processing states, not just missing fields.",
    ],
    tradeoffs: [
      "CSV-only intake keeps the tool lightweight but defers richer file formats.",
      "Simulates the intake pipeline rather than binding to a live tax platform.",
    ],
    outcomes: [
      "Intake failures become clean, reproducible incidents instead of support guesswork.",
      "Operational triage happens in minutes during peak season, not in a backlog.",
    ],
    stack: [
      "Python",
      "CSV Processing",
      "Log Analysis",
      "JSON",
      "OCR",
    ],
  },

  "nlp-document-platform": {
    path: "~/asheth2310/nlp-document-platform",
    kind: "NLP",
    period: "MAR 2026",
    role: "Solo engineer — end-to-end",
    summary:
      "Field-level extraction over unstructured documents using transformer embeddings — built to scale across thousands of files.",
    stat: {
      value: "5,000+",
      label: "unstructured documents processed (site copy)",
    },
    project:
      "Unstructured documents hide the same handful of fields in a thousand different layouts. This platform extracts field-level data with transformer embeddings rather than document-level classification, so values are matched semantically instead of by position — accurate across messy, inconsistent inputs and designed to run over thousands of documents.",
    architecture: [
      "Document Ingestion",
      "Embedding Pipeline",
      "Field Extraction",
      "Batch Processing",
    ],
    decisions: [
      "Extract at field level with transformer embeddings — semantic matching beats positional parsing on real-world layouts.",
      "Process in batches so throughput scales across large document sets.",
    ],
    tradeoffs: [
      "Embedding similarity can miss exact-match edge cases that rule-based parsing would catch.",
    ],
    outcomes: [
      "High-accuracy field extraction across thousands of unstructured documents.",
      "The pipeline shape generalizes: swap the embedding model without touching the extraction flow.",
    ],
    stack: [
      "Python",
      "Transformers",
      "NLP",
      "Embeddings",
      "Batch Processing",
    ],
  },
};
