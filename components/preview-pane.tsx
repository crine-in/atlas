"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Copy, Check, FileText, Info, Lightbulb, AlertOctagon, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import MermaidDiagram from "./mermaid-diagram";
import { slugifyHeading } from "./outline-sidebar";

import "katex/dist/contrib/mhchem.min.js";

const calloutMap = {
  note: {
    title: "NOTE",
    borderColor: "border-blue-500 dark:border-blue-400",
    bgColor: "bg-blue-50/50 dark:bg-blue-950/20",
    textColor: "text-blue-800 dark:text-blue-200",
    iconColor: "text-blue-500 dark:text-blue-400",
    icon: (className?: string) => <Info className={className} size={16} />
  },
  tip: {
    title: "TIP",
    borderColor: "border-emerald-500 dark:border-emerald-400",
    bgColor: "bg-emerald-50/50 dark:bg-emerald-950/20",
    textColor: "text-emerald-800 dark:text-emerald-200",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    icon: (className?: string) => <Lightbulb className={className} size={16} />
  },
  important: {
    title: "IMPORTANT",
    borderColor: "border-purple-500 dark:border-purple-400",
    bgColor: "bg-purple-50/50 dark:bg-purple-950/20",
    textColor: "text-purple-800 dark:text-purple-200",
    iconColor: "text-purple-500 dark:text-purple-400",
    icon: (className?: string) => <AlertOctagon className={className} size={16} />
  },
  warning: {
    title: "WARNING",
    borderColor: "border-amber-500 dark:border-amber-400",
    bgColor: "bg-amber-50/50 dark:bg-amber-950/20",
    textColor: "text-amber-800 dark:text-amber-200",
    iconColor: "text-amber-500 dark:text-amber-400",
    icon: (className?: string) => <AlertTriangle className={className} size={16} />
  },
  caution: {
    title: "CAUTION",
    borderColor: "border-red-500 dark:border-red-400",
    bgColor: "bg-red-50/50 dark:bg-red-950/20",
    textColor: "text-red-800 dark:text-red-200",
    iconColor: "text-red-500 dark:text-red-400",
    icon: (className?: string) => <AlertCircle className={className} size={16} />
  }
};

function findCalloutType(node: React.ReactNode): { type: keyof typeof calloutMap; cleanText: string } | null {
  if (!node) return null;
  
  if (typeof node === "string") {
    const match = node.trim().match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*\n|\s+)?([\s\S]*)/i);
    if (match) {
      return {
        type: match[1].toLowerCase() as keyof typeof calloutMap,
        cleanText: match[2]
      };
    }
  }

  if (React.isValidElement(node) && node.props && (node.props as any).children) {
    const subChildren = React.Children.toArray((node.props as any).children);
    if (subChildren.length > 0) {
      return findCalloutType(subChildren[0]);
    }
  }
  
  return null;
}

function removeCalloutPrefix(node: React.ReactNode): React.ReactNode {
  if (!node) return node;

  if (typeof node === "string") {
    return node.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*\n|\s+)?/i, "");
  }

  if (React.isValidElement(node) && node.props && (node.props as any).children) {
    const subChildren = React.Children.toArray((node.props as any).children);
    if (subChildren.length > 0) {
      const newFirstChild = removeCalloutPrefix(subChildren[0]);
      const remainingChildren = subChildren.slice(1);
      const element = node as React.ReactElement<any>;
      return React.cloneElement(element, {
        ...element.props,
        children: [newFirstChild, ...remainingChildren]
      });
    }
  }

  return node;
}

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
            },
            // Custom callout blockquote mapping
            blockquote: ({ children }) => {
              const childrenArray = React.Children.toArray(children);
              if (childrenArray.length === 0) return <blockquote>{children}</blockquote>;

              const firstChild = childrenArray[0];
              const callout = findCalloutType(firstChild);

              if (callout) {
                const config = calloutMap[callout.type];
                const updatedChildren = [removeCalloutPrefix(firstChild), ...childrenArray.slice(1)];

                return (
                  <div className={`callout-block my-4 p-4 border-l-4 rounded-r-md ${config.borderColor} ${config.bgColor} ${config.textColor}`}>
                    <div className="flex items-center gap-2 font-bold mb-2 text-sm select-none tracking-wide">
                      <span className={config.iconColor}>{config.icon()}</span>
                      <span>{config.title}</span>
                    </div>
                    <div className="callout-content">
                      {updatedChildren}
                    </div>
                  </div>
                );
              }

              return <blockquote>{children}</blockquote>;
            }
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
