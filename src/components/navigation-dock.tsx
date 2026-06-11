"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User, Briefcase, Code2, Layers, Mail } from "lucide-react";

const NAV_ITEMS = [
    { label: "About", icon: User, href: "#about" },
    { label: "Experience", icon: Briefcase, href: "#experience" },
    { label: "Projects", icon: Code2, href: "#projects" },
    { label: "Tech", icon: Layers, href: "#tech" },
    { label: "Contact", icon: Mail, href: "#contact" },
];

export function NavigationDock() {
    const [activeSection, setActiveSection] = useState("");
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            const sections = NAV_ITEMS.map(item => item.href.substring(1));
            let current = "";
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && window.scrollY >= element.offsetTop - 300) {
                    current = section;
                }
            }
            setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id.substring(1));
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: "smooth"
            });
        }
    };

    return (
        <motion.div 
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8, type: "spring" }}
        >
            <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-white/60 backdrop-blur-xl border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 rounded-full shadow-2xl">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeSection === item.href.substring(1);
                    return (
                        <button
                            key={item.label}
                            onClick={() => scrollTo(item.href)}
                            className={`relative p-2.5 rounded-full transition-all duration-300 ${
                                isActive 
                                ? "text-blue-400 bg-neutral-800/50" 
                                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30"
                            }`}
                        >
                            <item.icon size={18} />
                        </button>
                    )
                })}
                
            </div>
        </motion.div>
    );
}
