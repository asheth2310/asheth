/**
 * Central content for the portfolio.
 *
 * Every claim on this site should be traceable to one of:
 *  - the GitHub API (live stars, repo names, descriptions)
 *  - a project README in asheth2310/<repo>
 *  - Aagam's own experience/education history
 *
 * Do not invent metrics, repos, or affiliations here.
 */

export interface SystemProject {
  index: string;
  title: string;
  repoName: string;
  category: string;
  badge: "PRODUCTION" | "POC";
  stat: { value: string; label: string } | null;
  liveUrl?: string;
  tagline: string;
  description: string;
  highlights: string[];
  tags: string[];
}

export const SYSTEMS: SystemProject[] = [
  {
    index: "01",
    title: "Project Sentinel",
    repoName: "project-sentinel",
    category: "AGENTIC AI · OBSERVABILITY",
    badge: "POC",
    stat: { value: "P99 <15MS", label: "telemetry ingestion latency" },
    tagline: "Observability & governance for multi-agent AI deployments",
    description:
      "Enterprise-grade platform that watches fleets of AI agents in real time — tracking tokens, auditing latency, and detecting anomalies before they become runaway costs or recursive prompt loops.",
    highlights: [
      "Ingestion gateway (FastAPI) authenticates, validates, and rate-limits telemetry onto a Kafka event bus",
      "Flink anomaly engine over sliding windows feeds a governance engine with Redis circuit breakers",
      "Slack / PagerDuty alerting with a governance dashboard backed by TimescaleDB",
    ],
    tags: ["Python", "FastAPI", "Kafka", "Flink", "TimescaleDB", "Redis"],
  },
  {
    index: "02",
    title: "Iodine",
    repoName: "iodine",
    category: "DEVELOPER TOOLS · AI MENTOR",
    badge: "POC",
    stat: { value: "3", label: "AI providers behind one assistant" },
    tagline: "AI codebase mentor — the next-generation IDE",
    description:
      "A mentor for unfamiliar code: guided walkthroughs that open the relevant file, highlight the lines worth studying, and explain what you're seeing — plus an interactive System View graph generated from the code actually on disk.",
    highlights: [
      "Mentor Mode walks a repository one file at a time, grounded in the real workspace",
      "System View generates an editable architecture graph whose nodes link back to source locations",
      "One assistant interface across Anthropic, OpenAI, and Gemini providers",
    ],
    tags: ["React 18", "TypeScript", "Monaco", "xterm.js", "Node.js", "Express"],
  },
  {
    index: "03",
    title: "NatSQL",
    repoName: "NatSQL",
    category: "DATABASE · NL-TO-SQL",
    badge: "POC",
    stat: { value: "0", label: "writes possible — read-only role" },
    tagline: "Natural-language interface for databases",
    description:
      "Ask a MySQL database a question in plain English — NatSQL turns it into a validated, safe SQL query, executes it, and shows the results alongside the SQL it generated, so you never have to trust it blindly.",
    highlights: [
      "Fully local MVP: uses Ollama when available, falls back to a deterministic rule-based engine",
      "Hard SQL validator (sqlglot) rejects writes, unknown tables/columns, and injections, and clamps LIMIT",
      "Executes against a read-only MySQL role — the model can never mutate data",
    ],
    tags: ["Python", "LLM", "sqlglot", "MySQL", "Docker"],
  },
  {
    index: "04",
    title: "WildcatIQ",
    repoName: "WildcatIQ",
    category: "DATA PLATFORM · GOVERNANCE",
    badge: "POC",
    stat: { value: "19", label: "automated quality rules" },
    tagline: "Institutional data intelligence, governance & reliability",
    description:
      "Production-style analytics platform showing how fragmented university operational data becomes governed, reliable business intelligence — dimensional warehousing, automated quality validation, lineage, and BI reporting on synthetic data.",
    highlights: [
      "Raw → staging → dimensional warehouse pipeline unifying student, course, and enrollment systems",
      "Automated data-quality engine with metadata, lineage, and incident-driven troubleshooting",
      "Built entirely on synthetic data — no real institutional records involved",
    ],
    tags: ["Python", "Data Warehousing", "Data Quality", "BI"],
  },
  {
    index: "05",
    title: "Stream-Table OLAP Engine",
    repoName: "stream-table-olap-engine",
    category: "STREAMING · DATA PLANE",
    badge: "POC",
    stat: { value: "100K+", label: "events/sec · sub-50ms queries" },
    tagline: "Real-time stream-table joins at analytics speed",
    description:
      "Sub-second stream-table join and OLAP engine: ingests 100K+ events/sec, joins streams with dimension tables on SIMD-accelerated Apache Arrow, and serves sub-50ms analytical queries to an interactive dashboard.",
    highlights: [
      "SIMD-accelerated Apache Arrow joins between event streams and dimension tables",
      "Redpanda-backed ingestion with graceful degraded mode when the broker is absent",
      "Interactive dashboard serving sub-50ms analytical queries",
    ],
    tags: ["Python", "Apache Arrow", "Redpanda", "OLAP", "FastAPI"],
  },
  {
    index: "06",
    title: "Data Quality & Observability",
    repoName: "data-quality-observability-engine",
    category: "DATA QUALITY · OBSERVABILITY",
    badge: "PRODUCTION",
    stat: { value: "LIVE", label: "deployed dashboard · auto-healing flows" },
    liveUrl: "https://dashboard-iota-tan-86.vercel.app",
    tagline: "Schema drift detection, auto-healing & freshness SLAs",
    description:
      "Production-grade data quality and observability engine with a live dashboard: schema drift detection and auto-healing, statistical anomaly detection, freshness SLA monitoring, and lineage-driven impact analysis.",
    highlights: [
      "Schema drift detection with automated healing flows",
      "Statistical anomaly detection and freshness SLA monitoring",
      "Lineage-based impact analysis with a deployed live dashboard",
    ],
    tags: ["Python", "Data Quality", "Lineage", "Anomaly Detection", "Dashboard"],
  },
  {
    index: "07",
    title: "Tax Intake Validator",
    repoName: "tax-intake-validator",
    category: "AUTOMATION · TRIAGE",
    badge: "POC",
    stat: { value: "5", label: "classes of intake incidents detected" },
    tagline: "Automated validation for tax document intake",
    description:
      "Automated validation and processing system for tax documents, increasing throughput and minimizing human error during document ingestion.",
    highlights: [
      "Rule-based validation pipeline for document intake",
      "Reduces manual review burden on high-volume ingestion",
    ],
    tags: ["Python", "Automation", "OCR"],
  },
  {
    index: "08",
    title: "CodeReview AI",
    repoName: "codereview-ai",
    category: "CI/CD · AI REVIEW",
    badge: "POC",
    stat: { value: "PRE-MERGE", label: "checks inside the pipeline" },
    tagline: "AI code review inside CI/CD",
    description:
      "AI-powered code review assistant that automates quality checks and linting directly inside CI/CD pipelines.",
    highlights: [
      "Hooks into pull-request flow to flag issues before merge",
      "Automates repetitive review toil for engineering teams",
    ],
    tags: ["JavaScript", "Node.js", "AI", "GitHub API"],
  },
  {
    index: "09",
    title: "Semantic Document Platform",
    repoName: "nlp-document-platform",
    category: "NLP · EXTRACTION",
    badge: "POC",
    stat: { value: "5,000+", label: "unstructured documents processed" },
    tagline: "NLP field extraction at scale",
    description:
      "High-accuracy field-level extraction platform for processing 5,000+ unstructured documents using NLP embeddings.",
    highlights: [
      "Transformer embeddings for semantic field extraction",
      "Built to scale across thousands of unstructured documents",
    ],
    tags: ["Python", "Transformers", "NLP"],
  },
];

export interface Experience {
  period: string;
  role: string;
  company: string;
  points: string[];
}

export const EXPERIENCE: Experience[] = [
  {
    period: "May 2025 — Oct 2025",
    role: "Software Development Engineer Intern",
    company: "Zummit Infolab",
    points: [
      "Engineered data pipelines that cleaned, normalized, and structured raw client data into model-ready datasets for downstream AI workflows",
      "Built and integrated AI features — LLM-driven insights and intelligent search — into production web applications",
      "Developed full-stack functionality across React frontends and Python backends, owning features from schema design to deployment",
      "Worked in Agile sprints with code reviews and CI, shipping incremental releases every cycle",
    ],
  },
  {
    period: "Aug 2024 — May 2026",
    role: "Academic Tutor",
    company: "Arizona State University",
    points: [
      "Tutoring 50+ students in CS, Math, and Statistics using Python and Java",
      "Developing complex problem sets for algorithms and DSA",
    ],
  },
  {
    period: "Mar 2024 — Aug 2024",
    role: "Software Development Intern",
    company: "Kintu Designs Pvt. Ltd.",
    points: [
      "Full-stack development (Java, Python, React); built scalable microservices",
      "Implemented AI-driven log analysis for CI/CD",
      "Reduced incident detection time by ~40% using ML observability",
    ],
  },
  {
    period: "May 2023 — Jul 2023",
    role: "Software Engineer Intern",
    company: "Uniqual Itech",
    points: [
      "Developed 17+ reusable React components",
      "Integrated AI-powered data transformation pipelines for automated structured data extraction",
    ],
  },
  {
    period: "May 2021 — Jan 2022",
    role: "Undergraduate Research Assistant",
    company: "Gujarat Technological University",
    points: [
      "Processed and cleaned 50K+ multilingual raw text records in Python",
      "Compared three classification models with scikit-learn; selected the best via confusion-matrix analysis",
      "Maintained version-controlled experiment logs so any prior run was reproducible",
    ],
  },
];

export interface StackGroup {
  index: string;
  title: string;
  items: { name: string; blurb: string }[];
}

export const STACK_GROUPS: StackGroup[] = [
  {
    index: "01",
    title: "AI & Intelligent Systems",
    items: [
      { name: "LLM Agents", blurb: "Tool-using agents with bounded execution and human-in-the-loop approval." },
      { name: "NLP", blurb: "Embeddings, transformers, and extraction over unstructured text." },
      { name: "OpenAI API", blurb: "Model integration for reasoning and structured-output workflows." },
      { name: "PyTorch", blurb: "Training and experimentation for ML models." },
      { name: "Machine Learning", blurb: "Classical ML — classification, evaluation, and iteration." },
    ],
  },
  {
    index: "02",
    title: "Languages",
    items: [
      { name: "Python", blurb: "Primary language — APIs, pipelines, agents, and ML." },
      { name: "Java", blurb: "Microservices and backend systems (Spring Boot)." },
      { name: "JavaScript", blurb: "Full-stack web development and tooling." },
      { name: "TypeScript", blurb: "Type-safe frontend and backend (this site)." },
      { name: "C++", blurb: "Systems programming fundamentals." },
      { name: "SQL", blurb: "Schema design, analytics, and validation." },
      { name: "Go", blurb: "Concurrent services and CLIs." },
    ],
  },
  {
    index: "03",
    title: "Backend & Data",
    items: [
      { name: "Node.js", blurb: "APIs and real-time services." },
      { name: "FastAPI", blurb: "High-performance Python APIs." },
      { name: "Spring Boot", blurb: "Enterprise Java microservices." },
      { name: "GraphQL", blurb: "Typed API design and federation." },
      { name: "PostgreSQL", blurb: "Primary relational store." },
      { name: "MongoDB", blurb: "Document workloads." },
      { name: "Redis", blurb: "Caching, queues, and circuit breakers." },
      { name: "Kafka", blurb: "Event-driven architectures." },
    ],
  },
  {
    index: "04",
    title: "Cloud, DevOps & Frontend",
    items: [
      { name: "AWS", blurb: "EC2, Lambda, and serverless data pipelines." },
      { name: "Docker", blurb: "Reproducible builds and local dev." },
      { name: "Kubernetes", blurb: "Orchestrating distributed workloads." },
      { name: "React", blurb: "Interactive interfaces (Next.js App Router)." },
    ],
  },
];

export const PRINCIPLES: { index: string; title: string; body: string }[] = [
  {
    index: "P.01",
    title: "Observe everything.",
    body: "You can't govern what you can't see. Token tracking, latency audits, and anomaly detection are table stakes for production AI systems.",
  },
  {
    index: "P.02",
    title: "Never trust the model blindly.",
    body: "Generated SQL is validated, sandboxed, and read-only before it touches real data. Verification is part of the pipeline, not an afterthought.",
  },
  {
    index: "P.03",
    title: "Untrusted data is a liability.",
    body: "A dashboard is worthless on bad data. Quality checks, lineage, and governance come before the chart — every time.",
  },
  {
    index: "P.04",
    title: "Automate the toil.",
    body: "If a human does it twice, a pipeline should do it forever. Reviews, intake, reconciliation — toil is a bug.",
  },
  {
    index: "P.05",
    title: "Boring infra, ambitious systems.",
    body: "Queues, Postgres, and Kubernetes are solved problems. Spend the novelty budget on the actual system, not the plumbing.",
  },
  {
    index: "P.06",
    title: "Demo or it didn't happen.",
    body: "Local-first MVPs that run anywhere beat slideware. If it can't be demoed in five minutes, it isn't done.",
  },
];

export const PROOF_STATS: { value: string; label: string }[] = [
  { value: "41", label: "public repositories" },
  { value: "09", label: "systems featured" },
  { value: "24", label: "technologies in rotation" },
  { value: "05", label: "engineering roles" },
];

export const HERO = {
  label: "SOFTWARE & AI SYSTEMS ENGINEER",
  titleA: "Building systems",
  titleB: "that think & scale.",
  bio: "I'm Aagam Sheth, a Software & AI Systems Engineer pursuing my MS in Information Technology at Arizona State University (2024–2026). I build intelligent applications where models, agents, and deterministic software work together — from natural-language database interfaces to governance platforms for agent fleets.",
  tags: ["Agentic AI", "LLM Systems", "Backend Engineering", "Data Platforms", "MLOps"],
} as const;

export const PLAYGROUND_PROMPTS = [
  "What did you build for AI observability?",
  "How does NatSQL keep generated SQL safe?",
  "Walk me through your experience.",
  "Why should I hire you?",
] as const;

/** Keyword-based answers used when the chat API is unreachable. Honest, no invented facts. */
const FALLBACK_ANSWERS: Record<string, string> = {
  projects: [
    "Here's what Aagam has actually shipped (all on github.com/asheth2310):",
    "",
    "• Project Sentinel — observability & governance platform for multi-agent AI deployments (token tracking, anomaly detection, circuit breakers).",
    "• Iodine — an AI codebase mentor IDE: guided walkthroughs of unfamiliar repos, Monaco editor, integrated terminal, and System View architecture graphs generated from the workspace.",
    "• Stream-Table OLAP Engine — 100K+ events/sec stream-table joins on Apache Arrow with sub-50ms analytical queries.",
    "• Data Quality & Observability Engine — schema drift auto-healing, anomaly detection, freshness SLAs, with a live dashboard.",
    "• NatSQL — ask a MySQL database questions in plain English; generates validated, read-only SQL (local-first, no API keys needed).",
    "• WildcatIQ — institutional data intelligence & governance platform with dimensional warehousing and automated quality checks.",
    "• Tax Intake Validator, CodeReview AI, and an NLP document extraction platform round out the systems section.",
  ].join("\n"),
  skills: [
    "Aagam's stack, grouped:",
    "• AI & Intelligent Systems: LLM Agents, NLP, OpenAI API, PyTorch, Machine Learning",
    "• Languages: Python, Java, JavaScript, TypeScript, C++, SQL, Go",
    "• Backend & Data: Node.js, FastAPI, Spring Boot, GraphQL, PostgreSQL, MongoDB, Redis, Kafka",
    "• Cloud, DevOps & Frontend: AWS, Docker, Kubernetes, React",
  ].join("\n"),
  contact: [
    "The fastest way to reach Aagam is the contact form at the bottom of this page —",
    "messages go straight to his inbox. His GitHub (asheth2310) and LinkedIn are linked there too.",
  ].join("\n"),
  who: "Aagam Sheth is a Software & AI Systems Engineer pursuing his MS in Information Technology at Arizona State University (2024–2026). He builds intelligent applications where models, agents, and deterministic software work together.",
  experience: [
    "• SDE Intern, Zummit Infolab (May 2025 — Oct 2025): data pipelines feeding AI workflows, LLM feature integration, full-stack development.",
    "• Academic Tutor, Arizona State University (Aug 2024 — May 2026): tutoring 50+ students in CS, Math, Statistics.",
    "• Software Development Intern, Kintu Designs (Mar 2024 — Aug 2024): microservices, AI-driven log analysis for CI/CD, ~40% faster incident detection.",
    "• Software Engineer Intern, Uniqual Itech (May 2023 — Jul 2023): 17+ React components, AI data-transformation pipelines.",
    "• Undergraduate Research Assistant, Gujarat Technological University (2021 — 2022): cleaned 50K+ multilingual records, compared classifiers with scikit-learn.",
  ].join("\n"),
  hire: "Hire Aagam if you need someone who ships AI systems, not demos: agent observability, safe NL-to-SQL, data governance platforms — plus full-stack and distributed-systems fundamentals. Use the contact form below to start the conversation.",
  default:
    "I can tell you about Aagam's systems, technical skills, experience, or how to contact him — try one of the suggested prompts.",
};

export function getFallbackAnswer(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("sentinel") || q.includes("observab") || q.includes("natsql") || q.includes("wildcat") || q.includes("project"))
    return FALLBACK_ANSWERS.projects;
  if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("language"))
    return FALLBACK_ANSWERS.skills;
  if (q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("reach"))
    return q.includes("hire") ? FALLBACK_ANSWERS.hire : FALLBACK_ANSWERS.contact;
  if (q.includes("who") || q.includes("about") || q.includes("aagam"))
    return FALLBACK_ANSWERS.who;
  if (q.includes("exp") || q.includes("work") || q.includes("job") || q.includes("intern") || q.includes("tutor"))
    return FALLBACK_ANSWERS.experience;
  return FALLBACK_ANSWERS.default;
}

export const CHAT_SYSTEM_PROMPT = `You are Aagam Sheth's AI assistant on his portfolio site. Answer questions about Aagam accurately and concisely.

WHO HE IS
Aagam Sheth is a Software & AI Systems Engineer pursuing his MS in Information Technology at Arizona State University (2024–2026).

REAL PROJECTS (all at github.com/asheth2310 — do not invent others or star counts)
- Project Sentinel: enterprise-grade observability & governance platform for multi-agent AI deployments. Real-time token tracking, latency auditing, anomaly detection; FastAPI ingestion → Kafka → Flink anomaly engine → TimescaleDB; Redis circuit breakers; Slack/PagerDuty alerts.
- Iodine: AI codebase mentor IDE. Mentor Mode gives guided walkthroughs of unfamiliar repositories (opens files, highlights lines, explains in context); System View generates an interactive, editable architecture graph from the workspace and links nodes to source; Monaco editor, integrated terminal (xterm.js/node-pty), Git workflows; multi-provider AI (Anthropic, OpenAI, Gemini) over a React/TypeScript/Vite + Node/Express stack.
- Stream-Table OLAP Engine: sub-second stream-table join and OLAP engine — 100K+ events/sec ingestion, SIMD-accelerated Apache Arrow joins, sub-50ms analytical queries, interactive dashboard; Redpanda-backed with degraded mode.
- Data Quality & Observability Engine: production-grade quality engine with a live deployed dashboard — schema drift detection and auto-healing, statistical anomaly detection, freshness SLA monitoring, lineage-based impact analysis.
- NatSQL: natural-language interface for MySQL. Plain-English questions become validated SQL; fully local MVP (Ollama or deterministic rule-based fallback, no API keys); sqlglot validator rejects writes/injections and clamps LIMIT; executes on a read-only role.
- WildcatIQ: institutional data intelligence & governance platform — dimensional warehousing, automated data-quality validation, lineage, BI reporting on synthetic university data.
- Tax Intake Validator: automated validation/processing for tax documents (Python, OCR).
- CodeReview AI: AI code review assistant inside CI/CD pipelines (Node.js, GitHub API).
- Semantic Document Platform (nlp-document-platform): NLP field-level extraction over 5,000+ unstructured documents.

EXPERIENCE
- SDE Intern, Zummit Infolab (May 2025–Oct 2025): engineered data pipelines into model-ready datasets, integrated LLM-driven AI features into production apps, developed full-stack React/Python functionality.
- Academic Tutor, ASU (Aug 2024–May 2026): 50+ students, CS/Math/Statistics.
- Software Development Intern, Kintu Designs (Mar 2024–Aug 2024): microservices, AI-driven log analysis for CI/CD, ~40% faster incident detection.
- Software Engineer Intern, Uniqual Itech (May–Jul 2023): 17+ React components, AI data-transformation pipelines.
- Undergraduate Research Assistant, GTU (2021–2022): 50K+ multilingual records cleaned; classifier comparison with scikit-learn.

SKILLS
Python, Java, JavaScript, TypeScript, C++, SQL, Go · React, Node.js, FastAPI, Spring Boot, GraphQL · LLM Agents, NLP, OpenAI API, PyTorch, ML · AWS, Docker, Kubernetes, Kafka, PostgreSQL, Redis, MongoDB.

RULES
- Never invent repositories, star counts, metrics, employers, or degrees. If unsure, say so and point to github.com/asheth2310.
- Keep answers short (2–4 sentences) unless asked for detail. Use plain text, no heavy markdown.
- For contact: direct people to the contact form at the bottom of the page.
- Tone: professional, technical, direct.`;
