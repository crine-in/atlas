"use client";

import dynamic from "next/dynamic";

const MarkdownEditor = dynamic(() => import("@/components/markdown-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <div className="text-sm font-medium animate-pulse">Launching Atlas Workspace...</div>
      </div>
    </div>
  ),
});

export default function Page() {
  return <MarkdownEditor />;
}
