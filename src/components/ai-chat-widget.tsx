"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { Input } from "./ui/input";

const INITIAL_MESSAGES = [
    { id: "1", role: "assistant" as const, content: "Hi! I'm Aagam's AI assistant. You can ask me about his projects, experience, or tech stack." }
];

const FALLBACK_ANSWERS: Record<string, string> = {
    "projects": "Aagam has built several impressive projects: \n\n1. **AI Job Auto-Applier**: An autonomous workflow using n8n and Playwright to tailor resumes and apply headlessly.\n2. **Agent Skills Dashboard**: A monitoring suite for tracking AI agent performance and test matrices.\n3. **3D Interactive Portfolio**: This high-performance site built with Three.js and GLSL shaders!",
    "skills": "Aagam specializes in **Software & AI Systems Engineering**. His core tech stack includes:\n- **Frontend**: Next.js, React, Three.js (WebGL)\n- **Backend**: Node.js, Python (FastAPI), PostgreSQL\n- **AI**: Vector Databases, LLM Integration, Agentic Workflows\n- **DevOps**: Docker, CI/CD",
    "contact": "You can reach Aagam via the **Contact Section** at the very bottom of this page. You can also find his **LinkedIn and GitHub** links in the navigation dock below.",
    "who": "Aagam Sheth is a Software & AI Systems Engineer who bridges the gap between high-performance web engineering and complex AI systems.",
    "experience": "Aagam has deep expertise in building scalable distributed microservices, AI-powered automation, and high-fidelity 3D user interfaces.",
    "default": "I'm here to help you navigate Aagam's work! Feel free to ask about his **Technical Skills**, **Portfolio Projects**, or find out the best way to **Contact** him directly."
};

function getFallbackAnswer(input: string): string {
    const query = input.toLowerCase();
    if (query.includes("project")) return FALLBACK_ANSWERS["projects"];
    if (query.includes("skill") || query.includes("stack") || query.includes("tech")) return FALLBACK_ANSWERS["skills"];
    if (query.includes("contact") || query.includes("hire") || query.includes("email") || query.includes("reach")) return FALLBACK_ANSWERS["contact"];
    if (query.includes("who") || query.includes("aagam") || query.includes("about")) return FALLBACK_ANSWERS["who"];
    if (query.includes("exp") || query.includes("work")) return FALLBACK_ANSWERS["experience"];
    return FALLBACK_ANSWERS["default"];
}

export function AiChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [mounted, setMounted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { messages, append, isLoading, error, setMessages } = useChat({
        api: '/api/chat',
        initialMessages: INITIAL_MESSAGES
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSuggestionClick = (text: string) => {
        handleChatSubmission(text);
    };

    const handleChatSubmission = async (text: string) => {
        if (!text.trim() || isLoading) return;
        
        try {
            await append({ role: 'user', content: text });
        } catch (e) {
            const fallbackMsg = { 
                id: (Date.now() + 1).toString(), 
                role: 'assistant' as const, 
                content: getFallbackAnswer(text) 
            };
            setMessages(prev => [...prev, fallbackMsg]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const currentInput = input.trim();
        if (!currentInput) return;
        setInput("");
        handleChatSubmission(currentInput);
    };

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current;
            scrollContainer.scrollTo({
                top: scrollContainer.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isOpen]);

    if (!mounted) return null;

    return (
        <>
            <motion.div 
                className="fixed bottom-6 right-6 z-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
            >
                <AnimatePresence>
                    {!isOpen && (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            onClick={() => setIsOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-colors relative group"
                        >
                            <Bot size={24} />
                            <span className="absolute w-full h-full rounded-full bg-blue-500 opacity-50 animate-ping -z-10 group-hover:hidden" />
                            <div className="absolute -top-10 right-0 whitespace-nowrap px-3 py-1 bg-neutral-800 text-neutral-300 text-xs rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                                Ask AI Assistant
                            </div>
                        </motion.button>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute bottom-0 right-0 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-4 bg-neutral-950 border-b border-neutral-800">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-blue-500" />
                                    <span className="font-semibold text-neutral-100">AI Assistant</span>
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="text-neutral-400 hover:text-neutral-100 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div 
                                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                                ref={scrollRef}
                            >
                                {messages.map((msg) => (
                                    <div 
                                        key={msg.id} 
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div 
                                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                                                msg.role === 'user' 
                                                    ? 'bg-blue-600 text-white rounded-br-none shadow-lg' 
                                                    : 'bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700/50'
                                            }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-neutral-800 text-neutral-200 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0ms]" />
                                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:150ms]" />
                                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:300ms]" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {messages.length <= 1 && (
                                <div className="px-4 py-2 flex flex-wrap gap-2 overflow-x-auto no-scrollbar border-t border-neutral-800">
                                    {["View Top Projects", "Check My Skills", "How to Contact", "About Aagam"].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleSuggestionClick(s)}
                                            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs hover:bg-blue-600/20 transition-colors"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <form 
                                onSubmit={handleSubmit}
                                className="p-4 bg-neutral-950 border-t border-neutral-800 flex gap-2"
                            >
                                <Input 
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Ask about Aagam's skills or projects..."
                                    className="bg-neutral-900 border-neutral-800 focus-visible:ring-blue-500 h-11"
                                />
                                <button 
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-3 rounded-lg transition-all flex items-center justify-center shadow-lg"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
