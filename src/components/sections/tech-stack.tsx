"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";

const TECHNOLOGIES = [
    "Python", "Java", "JavaScript", "TypeScript", "C++", "SQL", "Go",
    "React", "Node.js", "FastAPI", "Spring Boot", "GraphQL",
    "LLM Agents", "NLP", "OpenAI API", "PyTorch", "Machine Learning",
    "AWS", "Docker", "Kubernetes", "Kafka", "PostgreSQL", "Redis", "MongoDB"
];

export function TechStackSection() {
    return (
        <section id="tech" className="py-24 container mx-auto px-4 relative z-10 min-h-[60vh] flex flex-col items-center justify-center">
            <div className="flex flex-col items-center mb-16">
                <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-lg mb-4">
                    <Layers size={24} />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 to-neutral-500 dark:from-neutral-50 dark:to-neutral-500 light:from-neutral-950 light:to-neutral-600 text-center">
                    Tech Stack
                </h2>
                <p className="mt-4 text-neutral-400 text-center max-w-2xl">
                    Tools and frameworks I use to bring ideas to production.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {TECHNOLOGIES.map((tech, i) => (
                    <motion.div
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.4,
                            delay: i * 0.05,
                            type: "spring",
                            stiffness: 200
                        }}
                        whileHover={{ y: -5, scale: 1.05 }}
                        className="px-6 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-300 font-medium hover:border-blue-500/50 hover:text-blue-400 transition-colors shadow-lg cursor-default"
                    >
                        {tech}
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
