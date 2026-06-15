"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { DocFile, DEFAULT_DOCS } from "@/lib/default-docs";
import { exportToDocx } from "@/lib/docx-export";
import { exportToPdf } from "@/lib/pdf-export";
import DocumentSidebar from "./document-sidebar";
import EditorPane from "./editor-pane";
import PreviewPane from "./preview-pane";
import OutlineSidebar from "./outline-sidebar";
import PresentationView from "./presentation-view";
import {
  Sidebar,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Download,
  Printer,
  FileText,
  FileCode,
  FileImage,
  Link,
  Table,
  Check,
  RefreshCw,
  Eye,
  Columns,
  Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "atlas-markdown-files";
const LAST_ACTIVE_KEY = "atlas-last-active-file";

export default function MarkdownEditor() {
  const { resolvedTheme, setTheme } = useTheme();
  const [files, setFiles] = useState<DocFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>("");
  
  // Settings & UI state
  const [showSidebar, setShowSidebar] = useState(true);
  const [showOutline, setShowOutline] = useState(true);
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const [scrollSync, setScrollSync] = useState(true);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Resize State
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);

  // Refs for Scroll Sync and resize containers
  const containerRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const scrollingPaneRef = useRef<"editor" | "preview" | null>(null);

  // 1. Initial Data Loading
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let loadedFiles: DocFile[] = [];

    if (saved) {
      try {
        loadedFiles = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse stored markdown files:", e);
      }
    }

    if (loadedFiles.length === 0) {
      loadedFiles = [...DEFAULT_DOCS];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedFiles));
    }

    setFiles(loadedFiles);

    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
    if (lastActive && loadedFiles.some((f) => f.id === lastActive)) {
      setActiveFileId(lastActive);
    } else if (loadedFiles.length > 0) {
      setActiveFileId(loadedFiles[0].id);
    }
  }, []);

  // Get active file
  const activeFile = files.find((f) => f.id === activeFileId);

  // 2. Save file content changes
  const handleContentChange = (newContent: string) => {
    if (!activeFileId) return;
    const updated = files.map((f) => {
      if (f.id === activeFileId) {
        return { ...f, content: newContent, updatedAt: new Date().toISOString() };
      }
      return f;
    });
    setFiles(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // 3. Scroll Synchronization
  // Listen to CodeMirror scroller panel scroll
  useEffect(() => {
    if (!scrollSync || viewMode !== "split" || isPresentationMode) return;

    const editorScroller = editorContainerRef.current?.querySelector(".cm-scroller");
    if (!editorScroller) return;

    const handleEditorScroll = (e: Event) => {
      if (scrollingPaneRef.current === "preview") return;
      scrollingPaneRef.current = "editor";
      
      const editor = e.currentTarget as HTMLElement;
      const preview = previewRef.current;
      if (editor && preview) {
        const maxEditorScroll = editor.scrollHeight - editor.clientHeight;
        const percentage = maxEditorScroll > 0 ? editor.scrollTop / maxEditorScroll : 0;
        preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
      }

      // Reset scroll source locking
      setTimeout(() => {
        if (scrollingPaneRef.current === "editor") scrollingPaneRef.current = null;
      }, 60);
    };

    editorScroller.addEventListener("scroll", handleEditorScroll);
    return () => editorScroller.removeEventListener("scroll", handleEditorScroll);
  }, [scrollSync, activeFileId, viewMode, isPresentationMode]);

  // Handle Preview Panel scroll
  const handlePreviewScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!scrollSync || viewMode !== "split" || scrollingPaneRef.current === "editor" || isPresentationMode) return;
    scrollingPaneRef.current = "preview";

    const preview = e.currentTarget;
    const editorScroller = editorContainerRef.current?.querySelector(".cm-scroller");
    if (preview && editorScroller) {
      const maxPreviewScroll = preview.scrollHeight - preview.clientHeight;
      const percentage = maxPreviewScroll > 0 ? preview.scrollTop / maxPreviewScroll : 0;
      editorScroller.scrollTop = percentage * (editorScroller.scrollHeight - editorScroller.clientHeight);
    }

    setTimeout(() => {
      if (scrollingPaneRef.current === "preview") scrollingPaneRef.current = null;
    }, 60);
  };

  // 4. Split Pane Drag-Resize Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - containerRect.left;
      const percentage = (relativeX / containerRect.width) * 100;
      setEditorWidth(Math.max(15, Math.min(percentage, 85)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // 5. File Operations (Select, Create, Rename, Delete, Presets, Import)
  const handleSelectFile = (id: string) => {
    setActiveFileId(id);
    localStorage.setItem(LAST_ACTIVE_KEY, id);
  };

  const handleCreateFile = () => {
    const fileId = `doc-${Math.random().toString(36).substring(2, 9)}`;
    const newFile: DocFile = {
      id: fileId,
      name: `Untitled Document ${files.length + 1}.md`,
      content: `# Untitled Document\n\nStart editing here...`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newFile, ...files];
    setFiles(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    handleSelectFile(fileId);
  };

  const handleRenameFile = (id: string, newName: string) => {
    const updated = files.map((f) => {
      if (f.id === id) {
        return { ...f, name: newName, updatedAt: new Date().toISOString() };
      }
      return f;
    });
    setFiles(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleDeleteFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (activeFileId === id) {
      if (updated.length > 0) {
        handleSelectFile(updated[0].id);
      } else {
        setActiveFileId("");
      }
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset to default preset documents? This will overwrite your current list.")) {
      setFiles(DEFAULT_DOCS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DOCS));
      if (DEFAULT_DOCS.length > 0) {
        handleSelectFile(DEFAULT_DOCS[0].id);
      }
    }
  };

  const handleImportFile = (name: string, content: string) => {
    const fileId = `doc-${Math.random().toString(36).substring(2, 9)}`;
    const newFile: DocFile = {
      id: fileId,
      name: name.endsWith(".md") ? name : `${name}.md`,
      content: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newFile, ...files];
    setFiles(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    handleSelectFile(fileId);
  };

  // 6. Export Feature Methods
  const handlePrintPDF = () => {
    if (!activeFile) return;
    setExportOpen(false);
    
    // Temporarily disable dark mode for printing if active
    const wasDark = document.documentElement.classList.contains("dark");
    if (wasDark) {
      document.documentElement.classList.remove("dark");
    }

    // Trigger standard browser print window
    window.print();

    // Re-enable dark mode if it was active
    if (wasDark) {
      document.documentElement.classList.add("dark");
    }
  };

  const handleExportPDF = async () => {
    if (!activeFile || !previewRef.current) return;
    setExportOpen(false);
    try {
      await exportToPdf(previewRef.current, activeFile.name);
    } catch (err) {
      console.error("Failed to export to PDF:", err);
      alert("Error exporting to PDF. Check console logs.");
    }
  };

  const handleExportDOCX = async () => {
    if (!activeFile) return;
    setExportOpen(false);
    try {
      const blob = await exportToDocx(activeFile.name, activeFile.content);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = activeFile.name.replace(/\.md$/, "") + ".docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate Word document:", err);
      alert("Error exporting to Word. Check console logs.");
    }
  };

  const handleExportHTML = () => {
    if (!activeFile) return;
    setExportOpen(false);
    
    const previewContent = previewRef.current?.innerHTML || "";
    const htmlOutput = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${activeFile.name.replace(/\.md$/, "")}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #333; }
    h1, h2, h3 { border-bottom: 1px solid #eee; padding-bottom: 8px; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; font-family: monospace; }
    code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; font-family: monospace; font-size: 0.9em; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f4f4f4; }
    blockquote { border-left: 4px solid #0066cc; padding-left: 15px; color: #555; margin: 20px 0; }
  </style>
</head>
<body>
  ${previewContent}
</body>
</html>`;

    const blob = new Blob([htmlOutput], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name.replace(/\.md$/, "") + ".html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (!activeFile) return;
    setExportOpen(false);

    const blob = new Blob([activeFile.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Launch Fullscreen presentation mode
  const launchPresentation = () => {
    if (activeFile) {
      setIsPresentationMode(true);
    }
  };

  if (isPresentationMode && activeFile) {
    return (
      <PresentationView
        markdown={activeFile.content}
        isDark={resolvedTheme === "dark"}
        onClose={() => setIsPresentationMode(false)}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans select-none print-full-width">
      
      {/* 1. Collapsible Document Sidebar */}
      {showSidebar && (
        <DocumentSidebar
          files={files}
          activeFileId={activeFileId}
          onSelectFile={handleSelectFile}
          onCreateFile={handleCreateFile}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
          onResetDefaults={handleResetDefaults}
          onImportFile={handleImportFile}
        />
      )}

      {/* 2. Main Work Area Container */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0 print-full-width">
        
        {/* Workspace Toolbar/Header */}
        <header className="flex items-center justify-between border-b border-border bg-card/50 px-4 py-2.5 no-print shrink-0">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted"
              onClick={() => setShowSidebar(!showSidebar)}
              title={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
            >
              {showSidebar ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </Button>

            {/* Title / Info */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm select-text truncate max-w-[150px] md:max-w-[300px]">
                {activeFile ? activeFile.name : "No file open"}
              </span>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 md:gap-2">
            
            {/* Split screen layouts */}
            <div className="flex border border-border rounded-md p-0.5 bg-background/50">
              <Button
                variant={viewMode === "editor" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7 rounded-sm"
                onClick={() => setViewMode("editor")}
                title="Editor Mode"
              >
                <FileCode size={13} />
              </Button>
              <Button
                variant={viewMode === "split" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7 rounded-sm"
                onClick={() => setViewMode("split")}
                title="Split View"
              >
                <Columns size={13} />
              </Button>
              <Button
                variant={viewMode === "preview" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7 rounded-sm"
                onClick={() => setViewMode("preview")}
                title="Preview Mode"
              >
                <Eye size={13} />
              </Button>
            </div>

            {/* Scroll Synchronization */}
            {viewMode === "split" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScrollSync(!scrollSync)}
                className={`h-8 px-2 text-xs font-semibold ${
                  scrollSync ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20" : "text-muted-foreground"
                }`}
                title="Sync editor and preview scrolls"
              >
                Sync
              </Button>
            )}

            {/* Presentation View */}
            <Button
              variant="outline"
              size="sm"
              onClick={launchPresentation}
              disabled={!activeFile}
              className="h-8 text-xs font-semibold flex items-center gap-1.5"
              title="Launch presentation slideshow"
            >
              <Maximize2 size={13} />
              <span className="hidden md:inline">Slides</span>
            </Button>

            {/* Document Exporting dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                disabled={!activeFile}
                onClick={() => setExportOpen(!exportOpen)}
                className="h-8 text-xs font-semibold flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>Export</span>
              </Button>

              {exportOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setExportOpen(false)}></div>
                  <div className="absolute right-0 mt-1.5 w-48 rounded-md border border-border bg-popover text-popover-foreground shadow-lg z-40 p-1 font-sans animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      onClick={handlePrintPDF}
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground text-left cursor-pointer"
                      title="Prints a searchable, selectable, vector-text PDF"
                    >
                      <Printer size={13} />
                      Print / Save PDF (Vector)
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground text-left cursor-pointer text-muted-foreground"
                      title="Alternative high-fidelity rasterized PDF layout"
                    >
                      <FileImage size={13} />
                      Export PDF (Image Layout)
                    </button>
                    <button
                      onClick={handleExportDOCX}
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground text-left cursor-pointer"
                    >
                      <FileText size={13} />
                      Export to Word (.docx)
                    </button>
                    <button
                      onClick={handleExportHTML}
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground text-left cursor-pointer"
                    >
                      <FileCode size={13} />
                      Export to HTML
                    </button>
                    <button
                      onClick={handleExportMarkdown}
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground text-left cursor-pointer"
                    >
                      <Link size={13} />
                      Download Raw (.md)
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              title="Toggle Dark Mode (D hotkey)"
            >
              {resolvedTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </Button>
          </div>
        </header>

        {/* Dynamic Panels */}
        {activeFile ? (
          <div ref={containerRef} className="flex-1 flex overflow-hidden min-w-0 print-full-width">
            {/* Left/Main workspace (Editor + Preview split) */}
            <div className="flex-1 flex overflow-hidden min-w-0 print-full-width">
              {/* Editor panel */}
              {(viewMode === "editor" || viewMode === "split") && (
                <div
                  ref={editorContainerRef}
                  style={{ width: viewMode === "split" ? `${editorWidth}%` : "100%" }}
                  className="h-full overflow-hidden shrink-0 no-print"
                >
                  <EditorPane
                    value={activeFile.content}
                    onChange={handleContentChange}
                    isDark={resolvedTheme === "dark"}
                    fontSize={fontSize}
                    wordWrap={wordWrap}
                    onFontSizeChange={setFontSize}
                    onWordWrapToggle={() => setWordWrap(!wordWrap)}
                  />
                </div>
              )}

              {/* Drag resizing divider handle */}
              {viewMode === "split" && (
                <div
                  onMouseDown={handleMouseDown}
                  className={`split-pane-divider no-print ${isDragging ? "active" : ""}`}
                />
              )}

              {/* HTML Preview panel */}
              {(viewMode === "preview" || viewMode === "split") && (
                <div
                  style={{ width: viewMode === "split" ? `${100 - editorWidth}%` : "100%" }}
                  className="h-full overflow-hidden shrink-0 print-full-width"
                >
                  <PreviewPane
                    markdown={activeFile.content}
                    isDark={resolvedTheme === "dark"}
                    previewRef={previewRef}
                    onScroll={handlePreviewScroll}
                  />
                </div>
              )}
            </div>

            {/* Right outline Table of Contents sidebar */}
            {showOutline && <OutlineSidebar markdown={activeFile.content} />}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/10">
            <FileText size={48} className="text-muted-foreground/50 mb-3" />
            <h3 className="font-semibold text-lg">No Document Active</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Select an existing document from the sidebar, or create a brand new one to start writing.
            </p>
            <Button onClick={handleCreateFile} className="mt-4">
              Create Document
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
