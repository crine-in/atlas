"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { ChevronLeft, ChevronRight, Eye, Monitor, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MermaidDiagram from "@/components/mermaid-diagram";
import "katex/dist/contrib/mhchem.min.js";

interface PresentationViewProps {
  markdown: string;
  isDark: boolean;
  onClose: () => void;
}

type SlideTheme = "modern" | "dark" | "warm" | "glass";

export default function PresentationView({ markdown, isDark, onClose }: PresentationViewProps) {
  const [slides, setSlides] = useState<string[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [theme, setTheme] = useState<SlideTheme>(isDark ? "dark" : "modern");

  // Parse markdown into slides split by horizontal rule (--- or *** or ___)
  useEffect(() => {
    // Split by horizontal rules
    // Match line containing only three or more dashes, asterisks, or underscores (with optional space)
    const lines = markdown.split(/\n/);
    const slideAccumulator: string[][] = [[]];
    let currentSlide = 0;
    let inCodeBlock = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip slide boundaries if we're in a code block
      if (trimmed.startsWith("```")) {
        inCodeBlock = !inCodeBlock;
      }

      if (!inCodeBlock && (trimmed === "---" || trimmed === "***" || trimmed === "___")) {
        currentSlide++;
        slideAccumulator.push([]);
      } else {
        slideAccumulator[currentSlide].push(line);
      }
    }

    const filteredSlides = slideAccumulator
      .map((slideLines) => slideLines.join("\n").trim())
      .filter((content) => content.length > 0);

    setSlides(filteredSlides.length > 0 ? filteredSlides : ["# Welcome\nNo slide content found."]);
    setCurrentSlideIndex(0);
  }, [markdown]);

  // Key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length, onClose]);

  const nextSlide = () => setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));

  // Determine theme styles
  const getThemeClass = () => {
    switch (theme) {
      case "dark":
        return "bg-slate-900 text-slate-100";
      case "warm":
        return "bg-amber-50 text-slate-800 border-amber-200";
      case "glass":
        return "bg-gradient-to-br from-indigo-900/90 to-purple-900/90 text-indigo-50";
      case "modern":
      default:
        return "bg-background text-foreground";
    }
  };

  const currentSlideContent = slides[currentSlideIndex] || "";

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-between select-none ${getThemeClass()} font-sans`}>
      {/* Top Header Control bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/15 backdrop-blur-md border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <Monitor size={18} className="text-primary-foreground/70" />
          <span className="text-sm font-semibold tracking-wide uppercase opacity-80">Atlas Presentation Slide</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme selector */}
          <div className="flex bg-black/20 p-0.5 rounded-md border border-white/10 text-xs text-white">
            {(["modern", "dark", "warm", "glass"] as SlideTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-2.5 py-1 rounded capitalize cursor-pointer ${theme === t ? "bg-white/20 font-semibold" : "opacity-60 hover:opacity-100"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={onClose} title="Exit (Esc)">
            <X size={18} />
          </Button>
        </div>
      </div>

      {/* Main Slide Card Container */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div
          className={`w-full max-w-4xl p-10 rounded-2xl transition-all duration-300 ${
            theme === "glass"
              ? "bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md"
              : theme === "warm"
                ? "bg-amber-100/50 shadow-lg border border-amber-200"
                : theme === "dark"
                  ? "bg-slate-800/60 shadow-xl border border-slate-700"
                  : "bg-card shadow-lg border border-border"
          }`}
        >
          <div className="slide-content-prose prose-atlas max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match;
                  const value = String(children).replace(/\n$/, "");

                  if (!isInline && match[1] === "mermaid") {
                    return <MermaidDiagram code={value} isDark={theme === "dark" || theme === "glass"} />;
                  }

                  return isInline ? (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-black/20 dark:bg-black/40 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4 border border-white/5">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                }
              }}
            >
              {currentSlideContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Navigation Controls footer */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/15 backdrop-blur-md border-t border-white/10 z-10 text-white/90">
        <div className="text-xs opacity-75 font-mono select-none">
          Use Left/Right arrows, Spacebar to navigate, Esc to Exit
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-white/10 text-white disabled:opacity-40"
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
          >
            <ChevronLeft size={20} />
          </Button>
          <span className="text-xs font-mono select-none">
            Slide {currentSlideIndex + 1} of {slides.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-white/10 text-white disabled:opacity-40"
            onClick={nextSlide}
            disabled={currentSlideIndex === slides.length - 1}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
