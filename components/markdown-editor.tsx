"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { DocFile, DEFAULT_DOCS } from "@/lib/default-docs";
import { exportToDocx } from "@/lib/docx-export";
import { exportToPdf, createCoverPageElement } from "@/lib/pdf-export";
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
  Maximize2,
  X
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
  const [pdfSettingsOpen, setPdfSettingsOpen] = useState(false);
  const [pdfSettings, setPdfSettings] = useState({
    watermarkText: "",
    watermarkOpacity: 15,
    watermarkColor: "#6b7280",
    showPageNumbers: true,
    coverEnabled: false,
    coverTemplate: "minimal" as "minimal" | "modern" | "editorial" | "academic",
    coverTitle: "",
    coverSubtitle: "",
    coverAuthor: "",
    coverDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    coverAccentColor: "#3b82f6"
  });

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

  // Load PDF settings on mount
  useEffect(() => {
    const savedPdfSettings = localStorage.getItem("atlas-pdf-export-settings");
    if (savedPdfSettings) {
      try {
        const parsed = JSON.parse(savedPdfSettings);
        setPdfSettings((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse pdf export settings:", e);
      }
    }
  }, []);

  // Update coverTitle when active file changes if coverTitle is empty
  useEffect(() => {
    if (activeFile) {
      setPdfSettings((prev) => {
        if (!prev.coverTitle || prev.coverTitle === "") {
          return { ...prev, coverTitle: activeFile.name.replace(/\.md$/, "") };
        }
        return prev;
      });
    }
  }, [activeFileId]);

  const updateSetting = (key: string, value: any) => {
    setPdfSettings((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem("atlas-pdf-export-settings", JSON.stringify(updated));
      return updated;
    });
  };

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
    setPdfSettingsOpen(false);
    setExportOpen(false);
    
    // Temporarily disable dark mode for printing if active
    const wasDark = document.documentElement.classList.contains("dark");
    if (wasDark) {
      document.documentElement.classList.remove("dark");
    }

    // Dynamic styling/elements for printing
    let coverEl: HTMLDivElement | null = null;
    let styleEl: HTMLStyleElement | null = null;
    let watermarkEl: HTMLDivElement | null = null;

    if (pdfSettings.coverEnabled) {
      // Create cover page element and prepend to preview pane
      coverEl = createCoverPageElement({
        enabled: true,
        template: pdfSettings.coverTemplate,
        title: pdfSettings.coverTitle || activeFile.name.replace(/\.md$/, ""),
        subtitle: pdfSettings.coverSubtitle,
        author: pdfSettings.coverAuthor,
        date: pdfSettings.coverDate,
        accentColor: pdfSettings.coverAccentColor
      }, 1008) as HTMLDivElement;
      
      coverEl.classList.add("print-only-cover");
      Object.assign(coverEl.style, {
        pageBreakAfter: "always",
        breakAfter: "page"
      });

      const previewContainer = previewRef.current?.querySelector(".prose-atlas");
      if (previewContainer) {
        previewContainer.insertBefore(coverEl, previewContainer.firstChild);
      }
    }

    // Watermark block for print
    if (pdfSettings.watermarkText) {
      watermarkEl = document.createElement("div");
      watermarkEl.innerText = pdfSettings.watermarkText;
      watermarkEl.className = "print-watermark";
      document.body.appendChild(watermarkEl);
    }

    // Dynamic style block for print page breaks, watermarks, etc.
    styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @media print {
        .print-only-cover {
          display: flex !important;
          width: 100% !important;
          height: 100vh !important;
          page-break-after: always !important;
          break-after: page !important;
        }
        .print-watermark {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) rotate(-45deg) !important;
          font-size: 80pt !important;
          color: ${pdfSettings.watermarkColor} !important;
          opacity: ${(pdfSettings.watermarkOpacity / 100) * 0.5} !important;
          mix-blend-mode: multiply !important;
          pointer-events: none !important;
          z-index: 99999 !important;
          white-space: nowrap !important;
          font-weight: bold !important;
          display: block !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    // Trigger standard browser print window
    window.print();

    // Re-enable dark mode if it was active
    if (wasDark) {
      document.documentElement.classList.add("dark");
    }

    // Cleanup print elements
    if (coverEl) {
      coverEl.remove();
    }
    if (watermarkEl) {
      watermarkEl.remove();
    }
    if (styleEl) {
      styleEl.remove();
    }
  };

  const handleExportPDF = () => {
    if (!activeFile) return;
    setExportOpen(false);
    setPdfSettingsOpen(true);
  };

  const triggerExportWithSettings = async () => {
    if (!activeFile || !previewRef.current) return;
    setPdfSettingsOpen(false);
    try {
      await exportToPdf(previewRef.current, activeFile.name, {
        watermarkText: pdfSettings.watermarkText,
        watermarkOpacity: pdfSettings.watermarkOpacity / 100,
        watermarkColor: pdfSettings.watermarkColor,
        showPageNumbers: pdfSettings.showPageNumbers,
        coverPage: {
          enabled: pdfSettings.coverEnabled,
          template: pdfSettings.coverTemplate,
          title: pdfSettings.coverTitle || activeFile.name.replace(/\.md$/, ""),
          subtitle: pdfSettings.coverSubtitle,
          author: pdfSettings.coverAuthor,
          date: pdfSettings.coverDate,
          accentColor: pdfSettings.coverAccentColor
        }
      });
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

      {/* PDF Export Settings Modal */}
      {pdfSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-sans text-foreground">
          <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h3 className="text-lg font-bold">PDF Export Configuration</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Customize cover pages, watermarks, and page numbers.</p>
              </div>
              <button 
                onClick={() => setPdfSettingsOpen(false)}
                className="rounded-full p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Cover Page settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="font-semibold text-sm">1. Cover Page Format</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={pdfSettings.coverEnabled}
                      onChange={(e) => updateSetting("coverEnabled", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    <span className="ml-2 text-xs font-semibold">{pdfSettings.coverEnabled ? "Enabled" : "Disabled"}</span>
                  </label>
                </div>

                {pdfSettings.coverEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Template Style</label>
                      <select
                        value={pdfSettings.coverTemplate}
                        onChange={(e) => updateSetting("coverTemplate", e.target.value)}
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="minimal">Minimalist / Clean</option>
                        <option value="modern">Modern Accent Stripe</option>
                        <option value="editorial">Elegant Editorial</option>
                        <option value="academic">Academic / Technical</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Accent Color</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={pdfSettings.coverAccentColor}
                          onChange={(e) => updateSetting("coverAccentColor", e.target.value)}
                          className="w-8 h-8 rounded border border-border bg-transparent cursor-pointer p-0 shrink-0"
                        />
                        <input
                          type="text"
                          value={pdfSettings.coverAccentColor}
                          onChange={(e) => updateSetting("coverAccentColor", e.target.value)}
                          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground">Cover Title</label>
                      <input
                        type="text"
                        value={pdfSettings.coverTitle}
                        onChange={(e) => updateSetting("coverTitle", e.target.value)}
                        placeholder="Document Title"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground">Subtitle</label>
                      <input
                        type="text"
                        value={pdfSettings.coverSubtitle}
                        onChange={(e) => updateSetting("coverSubtitle", e.target.value)}
                        placeholder="e.g. Project Summary & Findings"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Author / Prep By</label>
                      <input
                        type="text"
                        value={pdfSettings.coverAuthor}
                        onChange={(e) => updateSetting("coverAuthor", e.target.value)}
                        placeholder="Author Name"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Date</label>
                      <input
                        type="text"
                        value={pdfSettings.coverDate}
                        onChange={(e) => updateSetting("coverDate", e.target.value)}
                        placeholder="e.g. October 2026"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Watermark settings */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="font-semibold text-sm">2. Blended Text Watermark</span>
                  <div className="text-xs text-muted-foreground italic">Appears diagonally behind page content</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">Watermark Text</label>
                    <input
                      type="text"
                      value={pdfSettings.watermarkText}
                      onChange={(e) => updateSetting("watermarkText", e.target.value)}
                      placeholder="e.g. CONFIDENTIAL, DRAFT, INTERNAL USE"
                      className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Text Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={pdfSettings.watermarkColor}
                        onChange={(e) => updateSetting("watermarkColor", e.target.value)}
                        className="w-8 h-8 rounded border border-border bg-transparent cursor-pointer p-0 shrink-0"
                      />
                      <input
                        type="text"
                        value={pdfSettings.watermarkColor}
                        onChange={(e) => updateSetting("watermarkColor", e.target.value)}
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-3">
                    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                      <span>Opacity / Transparency</span>
                      <span>{pdfSettings.watermarkOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={pdfSettings.watermarkOpacity}
                      onChange={(e) => updateSetting("watermarkOpacity", parseInt(e.target.value))}
                      className="w-full accent-primary bg-muted rounded-lg appearance-none cursor-pointer h-1.5 mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                      <span>Very Faint (5%)</span>
                      <span>Strong (60%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout Settings (Page Numbers) */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sm">3. Page Numbering</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Adds a centered "Page X of Y" footer on each page (excluding cover page).</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={pdfSettings.showPageNumbers}
                      onChange={(e) => updateSetting("showPageNumbers", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    <span className="ml-2 text-xs font-semibold">{pdfSettings.showPageNumbers ? "ON" : "OFF"}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">Settings are saved automatically.</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrintPDF}
                  className="font-semibold"
                  title="Print selectable vector text layout via browser print"
                >
                  Print (Vector)
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={triggerExportWithSettings}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-1.5"
                  title="Generate high-fidelity pixel-perfect rasterized layout"
                >
                  <FileText size={14} />
                  Export (Image)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
