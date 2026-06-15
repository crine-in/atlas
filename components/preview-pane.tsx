"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Copy, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import MermaidDiagram from "./mermaid-diagram";
import { slugifyHeading } from "./outline-sidebar";

import "katex/dist/contrib/mhchem.min.js";

interface PreviewPaneProps {
  markdown: string;
  isDark: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

// Custom Syntax Highlighted Code block with Copy button
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function PreviewPane({ markdown, isDark, previewRef, onScroll }: PreviewPaneProps) {
  // Custom code component mapping
  const CodeBlockComponent = ({ className, children }: { className?: string; children: React.ReactNode }) => {
    const match = /language-(\w+)/.exec(className || "");
    const isInline = !match;
    const value = String(children).replace(/\n$/, "");
    const language = match ? match[1] : "";
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    };

    if (language === "mermaid") {
      return <MermaidDiagram code={value} isDark={isDark} />;
    }

    if (isInline) {
      return <code>{children}</code>;
    }

    return (
      <div className="code-block-wrapper group no-print">
        <div className="code-block-header">
          <span className="flex items-center gap-1 font-semibold uppercase">
            <FileText size={12} />
            {language}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 px-2 text-xs flex items-center gap-1 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <div className="code-block-content">
          <pre className="m-0 font-mono text-sm leading-relaxed overflow-x-auto">
            <code className={className}>{children}</code>
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={previewRef}
      onScroll={onScroll}
      className="h-full w-full overflow-y-auto bg-background p-6 md:p-8 border-none outline-none"
    >
      <div className="prose-atlas max-w-none print-full-width">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            // Heading overrides for Outline anchor jumps
            h1: ({ children }) => {
              const text = React.Children.toArray(children)
                .map((child) => (typeof child === "string" ? child : ""))
                .join("");
              return <h1 id={slugifyHeading(text)}>{children}</h1>;
            },
            h2: ({ children }) => {
              const text = React.Children.toArray(children)
                .map((child) => (typeof child === "string" ? child : ""))
                .join("");
              return <h2 id={slugifyHeading(text)}>{children}</h2>;
            },
            h3: ({ children }) => {
              const text = React.Children.toArray(children)
                .map((child) => (typeof child === "string" ? child : ""))
                .join("");
              return <h3 id={slugifyHeading(text)}>{children}</h3>;
            },
            // Direct Code mapping
            code({ className, children }) {
              return <CodeBlockComponent className={className}>{children}</CodeBlockComponent>;
            }
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
