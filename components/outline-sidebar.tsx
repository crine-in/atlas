"use client";

import React, { useEffect, useState } from "react";
import { AlignLeft, ChevronRight } from "lucide-react";

interface OutlineItem {
  level: number;
  text: string;
  id: string;
}

interface OutlineSidebarProps {
  markdown: string;
}

// Slugify heading text to match HTML ids
export const slugifyHeading = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};

export default function OutlineSidebar({ markdown }: OutlineSidebarProps) {
  const [items, setItems] = useState<OutlineItem[]>([]);

  useEffect(() => {
    const lines = markdown.split(/\n/);
    const headings: OutlineItem[] = [];
    let inCodeBlock = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Track if we are inside a code block
      if (trimmed.startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        continue;
      }

      if (inCodeBlock) continue;

      // Match headings: #, ##, ###
      const match = trimmed.match(/^(#{1,3})\s+(.*)/);
      if (match) {
        const level = match[1].length;
        let text = match[2].trim();
        // Remove formatting from headers (like bold, links, math syntax markers)
        text = text.replace(/[\*_`\$]/g, "");

        const id = slugifyHeading(text);
        headings.push({ level, text, id });
      }
    }

    setItems(headings);
  }, [markdown]);

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex h-full w-64 flex-col border-l border-border bg-card/50 font-sans no-print">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <AlignLeft size={14} />
        <span>Document Outline</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-center text-xs text-muted-foreground">
            <p>No headings found.</p>
            <p className="mt-1">Add headings (#) to generate an outline.</p>
          </div>
        ) : (
          <nav className="flex flex-col gap-1.5">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleScrollToSection(item.id)}
                className={`flex items-start text-left text-xs rounded hover:bg-accent hover:text-accent-foreground py-1 px-2 transition-colors group cursor-pointer ${
                  item.level === 1
                    ? "font-medium text-foreground"
                    : item.level === 2
                      ? "pl-4 text-muted-foreground"
                      : "pl-8 text-muted-foreground/85"
                }`}
              >
                <ChevronRight
                  size={12}
                  className="mr-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                />
                <span className="truncate">{item.text}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
