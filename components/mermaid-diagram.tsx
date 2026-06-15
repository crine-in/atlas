"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { AlertCircle, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MermaidDiagramProps {
  code: string;
  isDark?: boolean;
}

export default function MermaidDiagram({ code, isDark = false }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Initialize mermaid configuration on theme changes
  useEffect(() => {
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "default",
        securityLevel: "loose",
        fontFamily: "var(--font-sans)",
        themeVariables: {
          background: isDark ? "#1f2937" : "#f3f4f6",
          primaryColor: isDark ? "#3b82f6" : "#2563eb"
        }
      });
    } catch (e) {
      console.error("Failed to initialize mermaid:", e);
    }
  }, [isDark]);

  // Render diagram on code or theme changes
  useEffect(() => {
    let isMounted = true;
    const renderId = `mermaid-render-${Math.random().toString(36).substring(2, 9)}`;

    const renderDiagram = async () => {
      if (!code.trim()) return;

      try {
        setError(null);
        // Clear previous output
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        // Validate the code syntax first
        try {
          await mermaid.parse(code);
        } catch (parseErr: any) {
          if (isMounted) {
            setError(parseErr.message || "Invalid Mermaid syntax");
          }
          return;
        }

        // Render the diagram to an SVG string
        const { svg: renderedSvg } = await mermaid.render(renderId, code);
        
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (renderErr: any) {
        console.error("Mermaid render error:", renderErr);
        if (isMounted) {
          setError(renderErr.message || "Failed to render diagram");
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [code, isDark]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.4));
  const handleResetZoom = () => setZoom(1);

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-destructive/20 bg-destructive/10 p-4 font-sans no-print">
        <div className="flex items-center gap-2 text-destructive font-medium">
          <AlertCircle size={16} />
          <span>Mermaid Rendering Error</span>
        </div>
        <pre className="mt-2 overflow-x-auto text-xs bg-black/5 dark:bg-black/20 p-2.5 rounded font-mono text-muted-foreground whitespace-pre-wrap">
          {error}
        </pre>
      </div>
    );
  }

  return (
    <div
      className={`relative my-4 group border border-border rounded-lg bg-muted/30 overflow-hidden transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 bg-background/95 p-6 flex flex-col justify-center items-center" : "w-full"
      }`}
    >
      {/* Controls toolbar */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-background/80 dark:bg-card/85 backdrop-blur border border-border rounded-md p-1 shadow-sm z-20 no-print">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomIn} title="Zoom In">
          <ZoomIn size={14} />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomOut} title="Zoom Out">
          <ZoomOut size={14} />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-1.5 text-xs" onClick={handleResetZoom} title="Reset">
          100%
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </Button>
      </div>

      {/* Mermaid Diagram SVG Output Container */}
      <div
        className={`flex justify-center items-center p-6 select-none overflow-auto max-w-full ${
          isFullscreen ? "flex-1 w-full max-h-[85vh]" : "max-h-[500px]"
        }`}
        style={{ transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 0.15s ease-out" }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
