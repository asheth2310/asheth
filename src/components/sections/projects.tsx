"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { ProjectCard } from "../ui/project-card";

const PROJECTS = [
    {
        title: "Tax Intake Validator",
        description: "Automated validation and processing system for tax documents, increasing throughput and minimizing human error during document ingestion.",
        repoName: "tax-intake-validator",
        stars: 12,
        tags: ["Python", "Automation", "OCR"]
    },
    {
        title: "CodeReview AI",
        description: "AI-powered code review assistant that automates quality checks and linting directly inside CI/CD pipelines.",
        repoName: "codereview-ai",
        stars: 45,
        tags: ["JavaScript", "Node.js", "AI", "GitHub API"]
    },
    {
        title: "Scalable Reconciliation Engine",
        description: "A high-performance data reconciliation engine for distributed systems capable of handling large transaction volumes seamlessly.",
        repoName: "scalable-reconciliation-engine",
        stars: 34,
        tags: ["Python", "Distributed Systems", "PostgreSQL", "Kafka"]
    },
    {
        title: "Semantic Document Platform",
        description: "High-accuracy (84%) field-level extraction platform for processing 5,000+ unstructured documents using NLP embeddings.",
        repoName: "nlp-document-platform",
        stars: 56,
        tags: ["Python", "Transformers", "NLP", "Machine Learning"]
    },
    {
        title: "Internal Workflow Automation Tool",
        description: "Full-stack internal tool to automate document workflows with intake forms, status tracking, and audit trails for non-technical stakeholders.",
        repoName: "workflow-automation-tool",
        stars: 28,
        tags: ["Python", "FastAPI", "React", "PostgreSQL", "Docker"]
    },
    {
        title: "E-Commerce Microservices Platform",
        description: "Scalable distributed system with 5 microservices for user management, inventory, orders, and payments deployed on AWS EC2 with Kafka event-driven architecture.",
        repoName: "ecommerce-microservices-platform",
        stars: 41,
        tags: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Docker"]
    },
    {
        title: "Real-Time Analytics Platform",
        description: "Serverless data processing pipeline using AWS Lambda and DynamoDB with a live React dashboard over WebSockets. Sub-500ms latency.",
        repoName: "realtime-analytics-platform",
        stars: 37,
        tags: ["Python", "AWS Lambda", "DynamoDB", "React", "WebSockets"]
    }
];

export function ProjectsSection() {
    return (
        <section id="projects" className="min-h-screen py-24 container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center mb-16">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg mb-4">
                    <Code2 size={24} />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 to-neutral-500 dark:from-neutral-50 dark:to-neutral-500 light:from-neutral-950 light:to-neutral-600 text-center">
                    Featured Projects
                </h2>
                <p className="mt-4 text-neutral-400 text-center max-w-2xl">
                    A selection of my recent technical work. Hover over the Source button to peek into the repository structure.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {PROJECTS.map((project, idx) => (
                    <ProjectCard
                        key={project.repoName}
                        {...project}
                        delay={idx * 0.15}
                    />
                ))}
            </div>
        </section>
    );
}
