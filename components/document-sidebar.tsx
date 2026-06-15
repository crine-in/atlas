"use client";

import React, { useState, useRef } from "react";
import { DocFile } from "@/lib/default-docs";
import { FileText, Plus, Trash2, Edit3, Search, Upload, RefreshCw, FileCode, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentSidebarProps {
  files: DocFile[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
  onCreateFile: () => void;
  onRenameFile: (id: string, newName: string) => void;
  onDeleteFile: (id: string) => void;
  onResetDefaults: () => void;
  onImportFile: (name: string, content: string) => void;
}

export default function DocumentSidebar({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
  onResetDefaults,
  onImportFile
}: DocumentSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (e: React.MouseEvent, file: DocFile) => {
    e.stopPropagation();
    setEditingId(file.id);
    setEditName(file.name);
  };

  const saveRename = (id: string) => {
    if (editName.trim()) {
      let finalName = editName.trim();
      if (!finalName.endsWith(".md")) {
        finalName += ".md";
      }
      onRenameFile(id, finalName);
    }
    setEditingId(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      saveRename(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this document?")) {
      onDeleteFile(id);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onImportFile(file.name, content);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card/60 backdrop-blur-md font-sans no-print">
      {/* Header section with brand info */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <FileCode className="text-primary h-5 w-5" />
        <span className="font-bold tracking-tight text-foreground text-base">Atlas Markdown</span>
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">v1.2</span>
      </div>

      {/* Action panel (Create, Import, Reset) */}
      <div className="p-3 border-b border-border flex flex-col gap-2">
        <Button onClick={onCreateFile} className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 h-8">
          <Plus size={14} />
          Create New Document
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportClick}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-1 h-7.5 px-2"
            title="Import Markdown (.md) file"
          >
            <Upload size={13} />
            Import
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".md,.txt"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={onResetDefaults}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-1 h-7.5 px-2 text-muted-foreground hover:text-foreground"
            title="Reset preset files"
          >
            <RefreshCw size={13} />
            Presets
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-background/50 pl-8 pr-3 py-1 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredFiles.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-center text-xs text-muted-foreground p-4">
            <p>No documents found.</p>
            {searchQuery && <p className="mt-1">Try clearing your search query.</p>}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {filteredFiles.map((file) => {
              const isActive = file.id === activeFileId;
              const isEditing = file.id === editingId;

              return (
                <div
                  key={file.id}
                  onClick={() => !isEditing && onSelectFile(file.id)}
                  className={`group relative flex flex-col gap-0.5 rounded-md p-2 cursor-pointer transition-all border ${
                    isActive
                      ? "bg-accent/80 border-primary/20 text-accent-foreground"
                      : "bg-transparent border-transparent hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    {isEditing ? (
                      <div className="flex items-center gap-1 w-full mr-6">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => saveRename(file.id)}
                          onKeyDown={(e) => handleKeyPress(e, file.id)}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          className="w-full rounded border border-primary bg-background px-1 py-0.5 text-xs outline-none text-foreground"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            saveRename(file.id);
                          }}
                          className="text-primary hover:bg-primary/10 p-0.5 rounded shrink-0"
                        >
                          <Check size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 min-w-0 pr-8">
                        <FileText
                          size={13}
                          className={isActive ? "text-primary shrink-0" : "text-muted-foreground shrink-0"}
                        />
                        <span className="truncate text-xs font-medium tracking-tight">
                          {file.name}
                        </span>
                      </div>
                    )}

                    {/* Rename/Delete Hover Actions */}
                    {!isEditing && (
                      <div className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-gradient-to-l from-muted pl-4 rounded-md">
                        <button
                          onClick={(e) => startRename(e, file)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          title="Rename file"
                        >
                          <Edit3 size={11} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, file.id)}
                          className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete file"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Edited Date indicator */}
                  {!isEditing && (
                    <span className="text-[10px] text-muted-foreground pl-5 select-none font-mono">
                      {formatTimestamp(file.updatedAt)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
