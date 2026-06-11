"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { Github, Linkedin } from "../icons";
import { Input } from "../ui/input";
import { useState } from "react";

export function ContactSection() {
    const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus("success");
        
        // Reset after 3 seconds
        setTimeout(() => setStatus("idle"), 3000);
    };

    return (
        <section id="contact" className="py-24 container mx-auto px-4 relative z-10 pb-48">
            <div className="flex flex-col items-center mb-16">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg mb-4">
                    <Mail size={24} />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 to-neutral-500 dark:from-neutral-50 dark:to-neutral-500 light:from-black light:to-neutral-600 text-center">
                    Get in Touch
                </h2>
                <p className="mt-4 text-neutral-400 dark:text-neutral-400 light:text-neutral-600 text-center max-w-2xl">
                    Open to new software engineering opportunities and AI research collaborations.
                </p>
            </div>

            <div className="max-w-xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="p-8 bg-neutral-900/40 dark:bg-neutral-900/40 light:bg-white/60 border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 rounded-2xl backdrop-blur-xl shadow-2xl"
                >
                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="py-12 flex flex-col items-center justify-center text-center"
                            >
                                <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">Message Sent!</h3>
                                <p className="text-muted-foreground mt-2">Thanks for reaching out, Aagam will get back to you soon.</p>
                            </motion.div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600">Name</label>
                                    <Input 
                                        required
                                        className="bg-neutral-950 dark:bg-neutral-950 light:bg-white border-neutral-800 dark:border-neutral-800 light:border-neutral-200 focus-visible:ring-blue-500 text-foreground" 
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600">Email</label>
                                    <Input 
                                        required
                                        type="email"
                                        className="bg-neutral-950 dark:bg-neutral-950 light:bg-white border-neutral-800 dark:border-neutral-800 light:border-neutral-200 focus-visible:ring-blue-500 text-foreground" 
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600">Message</label>
                                    <textarea 
                                        required
                                        className="flex min-h-[120px] w-full rounded-md border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 bg-neutral-950 dark:bg-neutral-950 light:bg-white px-3 py-2 text-base text-foreground ring-offset-background placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none transition-all"
                                        placeholder="How can we work together?"
                                    />
                                </div>
                                
                                <button 
                                    disabled={status === "sending"}
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg active:scale-95"
                                >
                                    {status === "sending" ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 flex justify-center gap-6 pt-8 border-t border-neutral-800 dark:border-neutral-800 light:border-neutral-200">
                         <a href="https://github.com/asheth2310" target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-950 dark:bg-neutral-950 light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 rounded-full text-neutral-400 dark:text-neutral-400 light:text-neutral-600 hover:text-blue-400 hover:border-blue-500 transition-all shadow-md">
                            <Github size={20} />
                         </a>
                         <a href="#" className="p-3 bg-neutral-950 dark:bg-neutral-950 light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 rounded-full text-neutral-400 dark:text-neutral-400 light:text-neutral-600 hover:text-blue-400 hover:border-blue-500 transition-all shadow-md">
                            <Linkedin size={20} />
                         </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
