"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const EXPERIENCES = [
    {
        role: "Undergraduate Research Assistant",
        company: "Gujarat Technological University",
        period: "May 2021 - Jan 2022",
        desc: "• Processed and cleaned 50K+ multilingual raw text records using Python, independently defining the cleaning strategy for an ambiguously scoped research task with loosely defined initial requirements.\n• Executed object-oriented experiments comparing three classification models, analyzed results via confusion matrices using Scikit-learn, and identified the highest-performing model for the target task.\n• Maintained structured version-controlled experiment logs using Git, enabling the research supervisor to reproduce any prior run and trace how model performance evolved across iterations."
    },
    {
        role: "Academic Tutor",
        company: "Arizona State University (ASU)",
        period: "Aug 2024 - Present",
        desc: "Tutoring 50+ students in CS, Math, and Statistics using Python and Java; developing complex problem sets for algorithms and DSA."
    },
    {
        role: "Software Development Intern",
        company: "Kintu Designs Pvt. Ltd.",
        period: "Mar 2024 - Aug 2024",
        desc: "Full-stack developer (Java, Python, React). Built scalable microservices, implemented AI-driven log analysis for CI/CD, and reduced incident detection time by ~40% using ML observability."
    },
    {
        role: "Software Engineer Intern",
        company: "Uniqual Itech",
        period: "May 2023 - Jul 2023",
        desc: "Developed 17+ reusable React components and integrated AI-powered data transformation pipelines for automated structured data extraction."
    }
];

export function ExperienceSection() {
    return (
        <section id="experience" className="py-24 container mx-auto px-4 relative z-10 transition-colors duration-500">
            <div className="flex flex-col items-center mb-16">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg mb-4">
                    <Briefcase size={24} />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 to-neutral-500 dark:from-neutral-50 dark:to-neutral-500 light:from-neutral-950 light:to-neutral-600 text-center">
                    Work History
                </h2>
            </div>

            <div className="max-w-3xl mx-auto border-l border-neutral-800 dark:border-neutral-800 light:border-neutral-200 pl-8 ml-4 md:ml-auto space-y-12 relative flex flex-col items-start pr-0 md:pr-12 md:pl-12">
                {EXPERIENCES.map((exp, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: i * 0.2 }}
                        className="relative w-full"
                    >
                        <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-background border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] md:-left-16" />
                        
                        <div className="bg-neutral-900/40 dark:bg-neutral-900/40 light:bg-white/60 border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 p-6 rounded-2xl backdrop-blur-md hover:border-blue-500/50 shadow-xl transition-all duration-300">
                            <span className="text-sm font-mono text-blue-500 mb-2 block">{exp.period}</span>
                            <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                            <h4 className="text-blue-400 dark:text-blue-400 light:text-blue-600 font-medium mb-4">{exp.company}</h4>
                            <p className="text-muted-foreground whitespace-pre-line">{exp.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
