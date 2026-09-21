"use client";

import { useEffect, useState } from "react";
import { Menu, X, FileText } from "lucide-react";
import { Github } from "@/components/icons";
import { SITE } from "@/lib/site";

const LINKS = [
  { id: "systems", label: "Systems" },
  { id: "playground", label: "Playground" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const { id } of LINKS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-white/10 bg-[#060809]/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-mono text-sm font-semibold tracking-tight text-zinc-100 hover:text-emerald-300 transition-colors"
          aria-label="Back to top"
        >
          {SITE.handle}
          <span className="animate-pulse text-emerald-400">▊</span>
          <span className="ml-2 hidden text-xs font-normal text-zinc-500 sm:inline">
            {"//"} ai_eng
          </span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`rounded-md px-3 py-2 font-mono text-[13px] transition-colors ${
                active === id
                  ? "text-emerald-300"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <span className="mr-1 text-zinc-600">/</span>
              {label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="rounded-md p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <Github width={18} height={18} />
          </a>
          <a
            href={SITE.resumePath}
            download
            className="flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 font-mono text-[13px] text-emerald-300 hover:bg-emerald-500/20 transition-colors"
          >
            <FileText size={14} />
            resume.pdf
          </a>
        </div>

        <button
          className="rounded-md p-2 text-zinc-300 hover:text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-[#060809]/95 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`py-3 text-left font-mono text-sm ${
                  active === id ? "text-emerald-300" : "text-zinc-300"
                }`}
              >
                <span className="mr-2 text-zinc-600">/</span>
                {label}
              </button>
            ))}
            <a
              href={SITE.resumePath}
              download
              className="mb-3 mt-1 flex items-center justify-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5 font-mono text-sm text-emerald-300"
            >
              <FileText size={14} />
              resume.pdf
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
