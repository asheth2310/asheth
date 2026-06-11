"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Github } from "../icons";
import { Badge } from "./badge";
import { GithubPreview } from "./github-preview";

interface ProjectCardProps {
    title: string;
    description: string;
    repoName: string;
    tags: string[];
    stars: number;
    delay: number;
}

export function ProjectCard({ title, description, repoName, tags, stars, delay }: ProjectCardProps) {
    const [isHoveringGithub, setIsHoveringGithub] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay }}
            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-neutral-900 dark:bg-neutral-900 light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 hover:bg-neutral-800/80 dark:hover:bg-neutral-800/80 light:hover:bg-neutral-50 transition-colors h-full overflow-hidden"
        >
            {/* Hover Gradient Effect inside Card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="z-10 relative">
                <h3 className="text-xl font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 mb-2">{title}</h3>
                <p className="text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mb-6 line-clamp-3">{description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-neutral-800 dark:bg-neutral-800 light:bg-neutral-100 text-neutral-300 dark:text-neutral-300 light:text-neutral-700 hover:bg-neutral-700 dark:hover:bg-neutral-700 light:hover:bg-neutral-200">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="z-10 relative flex items-center gap-4 mt-auto">
                <div 
                    className="relative"
                    onMouseEnter={() => setIsHoveringGithub(true)}
                    onMouseLeave={() => setIsHoveringGithub(false)}
                >
                    <a className="flex items-center gap-2 text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700 hover:text-blue-400 transition-colors cursor-pointer py-2 pr-2">
                        <Github size={18} />
                        <span>Source</span>
                    </a>
                    
                    <GithubPreview 
                        isVisible={isHoveringGithub}
                        repoName={repoName}
                        description={description}
                        stars={stars}
                    />
                </div>

                <a className="flex items-center gap-2 text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700 hover:text-emerald-400 dark:hover:text-emerald-400 light:hover:text-emerald-600 transition-colors cursor-pointer py-2 px-2">
                    <ExternalLink size={18} />
                    <span>Live Demo</span>
                </a>
            </div>
        </motion.div>
    );
}
