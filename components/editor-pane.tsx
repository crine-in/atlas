"use client";

import React, { useRef, useState } from "react";
import CodeMirror, { ReactCodeMirrorRef, EditorView } from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import {
  Bold,
  Italic,
  Code,
  Link,
  Table,
  Plus,
  HelpCircle,
  Settings,
  AlignLeft,
  ChevronDown,
  Moon,
  Sun,
  Eye,
  FileCode,
  FlaskConical,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorPaneProps {
  value: string;
  onChange: (val: string) => void;
  isDark: boolean;
  fontSize: number;
  wordWrap: boolean;
  onFontSizeChange: (size: number) => void;
  onWordWrapToggle: () => void;
}

export default function EditorPane({
  value,
  onChange,
  isDark,
  fontSize,
  wordWrap,
  onFontSizeChange,
  onWordWrapToggle
}: EditorPaneProps) {
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const viewRef = useRef<EditorView | null>(null);

  // Handle Editor creation to grab the CodeMirror EditorView instance
  const handleEditorCreate = (view: EditorView) => {
    viewRef.current = view;
  };

  // Helper to insert formatting strings at selection
  const insertFormatting = (before: string, after: string = "") => {
    const view = viewRef.current;
    if (!view) return;

    const { state, dispatch } = view;
    const selection = state.selection.main;
    const selectedText = state.sliceDoc(selection.from, selection.to);
    const replacement = before + selectedText + after;

    dispatch({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: replacement
      },
      selection: {
        anchor: selection.from + before.length + selectedText.length
      }
    });

    view.focus();
  };

  // Editor Extensions
  const extensions = [
    markdown(),
    wordWrap ? EditorView.lineWrapping : []
  ];

  const toolbarActions = [
    { icon: <Bold size={14} />, label: "Bold", onClick: () => insertFormatting("**", "**") },
    { icon: <Italic size={14} />, label: "Italic", onClick: () => insertFormatting("*", "*") },
    { icon: <Code size={14} />, label: "Code Inline", onClick: () => insertFormatting("`", "`") },
    {
      icon: <FileCode size={14} />,
      label: "Code Block",
      onClick: () => insertFormatting("```javascript\n", "\n```")
    },
    { icon: <Link size={14} />, label: "Link", onClick: () => insertFormatting("[", "](https://)") },
    {
      icon: <Table size={14} />,
      label: "Table",
      onClick: () =>
        insertFormatting(
          "\n| Header 1 | Header 2 |\n| :--- | :--- |\n| Cell 1 | Cell 2 |\n"
        )
    },
    { icon: <Plus size={14} />, label: "Math (Inline)", onClick: () => insertFormatting("$", "$") },
    {
      icon: <Plus size={14} className="rotate-45" />,
      label: "Math (Block)",
      onClick: () => insertFormatting("$$\n", "\n$$")
    },
    {
      icon: <FlaskConical size={14} />,
      label: "Chemistry (mhchem)",
      onClick: () => insertFormatting("$\\ce{", "}$")
    },
    {
      icon: <Activity size={14} />,
      label: "Mermaid Flow",
      onClick: () =>
        insertFormatting(
          "```mermaid\nflowchart TD\n    A[Start] --> B{Decision}\n    B -- Yes --> C[Result 1]\n    B -- No --> D[Result 2]\n```\n"
        )
    }
  ];

  return (
    <div className="flex h-full flex-col bg-background font-sans">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card/40 px-3 py-2 no-print shrink-0">
        {/* Formatting Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          {toolbarActions.map((btn, idx) => (
            <Button
              key={idx}
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={btn.onClick}
              title={btn.label}
            >
              {btn.icon}
            </Button>
          ))}
        </div>

        {/* Editor Settings (Font Size & Line Wrapping) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-border rounded-md px-1.5 py-0.5 bg-background/50">
            <span className="text-[10px] uppercase text-muted-foreground font-semibold px-1 select-none">
              Font
            </span>
            <button
              onClick={() => onFontSizeChange(Math.max(fontSize - 1, 10))}
              className="text-xs hover:bg-muted px-1.5 py-0.5 rounded cursor-pointer select-none font-bold"
            >
              -
            </button>
            <span className="text-xs font-mono w-4 text-center select-none">{fontSize}</span>
            <button
              onClick={() => onFontSizeChange(Math.min(fontSize + 1, 24))}
              className="text-xs hover:bg-muted px-1.5 py-0.5 rounded cursor-pointer select-none font-bold"
            >
              +
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onWordWrapToggle}
            className={`h-7 px-2 text-xs font-medium cursor-pointer ${
              wordWrap ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20" : "text-muted-foreground"
            }`}
          >
            Wrap
          </Button>
        </div>
      </div>

      {/* Editor CodeMirror Wrapper */}
      <div
        className="flex-1 overflow-auto bg-card/25"
        style={{ fontSize: `${fontSize}px` }}
      >
        <CodeMirror
          ref={editorRef}
          value={value}
          onChange={onChange}
          onCreateEditor={handleEditorCreate}
          extensions={extensions}
          theme={isDark ? "dark" : "light"}
          height="100%"
          className="h-full focus-within:outline-none"
          placeholder="Start writing markdown here..."
        />
      </div>
    </div>
  );
}
