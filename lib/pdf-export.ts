import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

/**
 * Exports the rendered preview pane to a professional, paginated PDF.
 *
 * Architecture:
 *   1. Clone the rendered markdown into an off-screen container sized to A4 proportions.
 *   2. Force light-mode and disable cross-origin stylesheets to avoid CORS/color errors.
 *   3. Render the clone to a canvas using html2canvas-pro (supports modern CSS colors).
 *   4. Slice the canvas into per-page chunks and draw each into jsPDF with uniform margins.
 *
 * We intentionally avoid jsPDF.html() because it bundles its own copy of the
 * old html2canvas v1 which crashes on Tailwind v4's lab()/oklch() colors.
 */
export interface PdfExportOptions {
  watermarkText?: string;
  watermarkOpacity?: number; // 0.0 to 1.0
  watermarkColor?: string;
  showPageNumbers?: boolean;
  coverPage?: {
    enabled: boolean;
    template: "minimal" | "modern" | "editorial" | "academic";
    title: string;
    subtitle?: string;
    author?: string;
    date?: string;
    accentColor?: string;
  };
}

export async function exportToPdf(
  element: HTMLElement,
  filename: string,
  options: PdfExportOptions = {}
): Promise<void> {
  // ── Constants ──────────────────────────────────────────────────────────
  const A4_W_MM = 210;
  const A4_H_MM = 297;
  const MARGIN_MM = 15; // uniform margin on every side
  const CONTENT_W_MM = A4_W_MM - 2 * MARGIN_MM; // 180 mm
  const CONTENT_H_MM = A4_H_MM - 2 * MARGIN_MM; // 267 mm
  const RENDER_WIDTH_PX = 680; // ≈ 180 mm at 96 dpi
  const CANVAS_SCALE = 2; // 2× for retina-quality output

  const showPageNumbers = options.showPageNumbers !== false;
  const FOOTER_HEIGHT_PX = showPageNumbers ? 40 : 0;
  const PAGE_HEIGHT_PX = Math.floor((CONTENT_H_MM / CONTENT_W_MM) * RENDER_WIDTH_PX); // ~1008 px
  const PAGE_CONTENT_HEIGHT_PX = PAGE_HEIGHT_PX - FOOTER_HEIGHT_PX;

  // ── Phase 1 — Environment prep ─────────────────────────────────────────
  const wasDark = document.documentElement.classList.contains("dark");
  if (wasDark) document.documentElement.classList.remove("dark");

  // Disable cross-origin stylesheets that throw SecurityError on .cssRules
  const disabledSheets: HTMLLinkElement[] = [];
  document.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet']").forEach((el) => {
    try {
      el.sheet?.cssRules; // throws if cross-origin
    } catch {
      el.disabled = true;
      disabledSheets.push(el);
    }
  });

  // ── Phase 2 — Build off-screen print clone ─────────────────────────────
  const targetElement =
    (element.querySelector(".prose-atlas") as HTMLElement) || element;

  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    width: `${RENDER_WIDTH_PX}px`,
    background: "#ffffff",
    color: "#111827",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    lineHeight: "1.7",
    fontSize: "15px",
    boxSizing: "border-box",
    padding: "0",
  });

  const clone = targetElement.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    width: "100%",
    maxWidth: "100%",
    margin: "0",
    padding: "0",
  });

  // Strip interactive UI elements that should not appear on paper
  clone.querySelectorAll("button, .no-print").forEach((el) => el.remove());

  // Prepend cover page if enabled
  if (options.coverPage && options.coverPage.enabled) {
    const coverDiv = createCoverPageElement(options.coverPage, PAGE_HEIGHT_PX);
    clone.insertBefore(coverDiv, clone.firstChild);
  }

  container.appendChild(clone);
  document.body.appendChild(container);

  // Give the browser a tick to reflow / load fonts
  await new Promise((r) => setTimeout(r, 300));

  // ── Phase 2.5 — Dynamic Page Breaking & Spacing ────────────────────────
  const getRelativeOffset = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();
    return {
      top: rect.top - parentRect.top,
      bottom: rect.bottom - parentRect.top,
      height: rect.height
    };
  };

  const children = Array.from(clone.children) as HTMLElement[];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    
    if (child.id === "pdf-cover-page") {
      continue;
    }

    if (child.classList.contains("page-break") || child.tagName === "HR") {
      const offset = getRelativeOffset(child);
      const remainingSpace = PAGE_HEIGHT_PX - (offset.top % PAGE_HEIGHT_PX);
      if (remainingSpace < PAGE_HEIGHT_PX - 10) {
        const spacer = document.createElement("div");
        spacer.style.height = `${remainingSpace}px`;
        child.parentNode?.insertBefore(spacer, child);
      }
      continue;
    }

    const offset = getRelativeOffset(child);
    const pageNumStart = Math.floor(offset.top / PAGE_HEIGHT_PX);
    const pageContentBottom = pageNumStart * PAGE_HEIGHT_PX + PAGE_CONTENT_HEIGHT_PX;

    if (offset.bottom > pageContentBottom) {
      const shouldAvoidBreak = 
        child.tagName.startsWith("H") || 
        child.tagName === "TABLE" || 
        child.tagName === "PRE" || 
        child.tagName === "BLOCKQUOTE" || 
        child.classList.contains("callout-block") || 
        child.tagName === "UL" || 
        child.tagName === "OL" ||
        child.classList.contains("mermaid-wrapper");

      const isShortParagraph = child.tagName === "P" && offset.height < 120;

      if (shouldAvoidBreak || isShortParagraph) {
        const remainingSpace = PAGE_HEIGHT_PX - (offset.top % PAGE_HEIGHT_PX);
        if (remainingSpace < PAGE_HEIGHT_PX) {
          const spacer = document.createElement("div");
          spacer.style.height = `${remainingSpace}px`;
          child.parentNode?.insertBefore(spacer, child);
        }
      }
    }
  }

  try {
    // ── Phase 3 — Render to canvas ─────────────────────────────────────
    const canvas = await html2canvas(container, {
      scale: CANVAS_SCALE,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // ── Phase 4 — Paginate into PDF ────────────────────────────────────
    const pageHeightPx = Math.floor(
      (CONTENT_H_MM / CONTENT_W_MM) * canvas.width
    );
    const totalPages = Math.ceil(canvas.height / pageHeightPx);
    const footerHeightPx = showPageNumbers ? Math.floor((FOOTER_HEIGHT_PX / RENDER_WIDTH_PX) * canvas.width) : 0;

    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) pdf.addPage();

      const sourceY = i * pageHeightPx;
      const sourceH = Math.min(pageHeightPx, canvas.height - sourceY);

      // Create a clean page-sized canvas for this slice
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageHeightPx;
      const ctx = pageCanvas.getContext("2d")!;

      // Fill with white so the last (partial) page doesn't have a transparent band
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

      // Draw the relevant vertical slice of the full render
      ctx.drawImage(
        canvas,
        0, sourceY, canvas.width, sourceH, // source rect
        0, 0, canvas.width, sourceH // dest rect
      );

      const isCoverPage = (i === 0 && options.coverPage?.enabled);

      // Clear footer area with white if page numbers are enabled
      if (showPageNumbers && footerHeightPx > 0 && !isCoverPage) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, pageCanvas.height - footerHeightPx, pageCanvas.width, footerHeightPx);
      }

      // Draw blended custom watermark
      if (options.watermarkText && !isCoverPage) {
        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        ctx.globalAlpha = options.watermarkOpacity ?? 0.15;
        
        const wmFontSize = Math.floor(pageCanvas.width / 10);
        ctx.font = `bold ${wmFontSize}px sans-serif`;
        ctx.fillStyle = options.watermarkColor || "#6b7280";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.translate(pageCanvas.width / 2, pageCanvas.height / 2);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(options.watermarkText, 0, 0);
        ctx.restore();
      }

      // Draw page number
      if (showPageNumbers && !isCoverPage) {
        ctx.save();
        const numFontSize = Math.floor(pageCanvas.width / 50);
        ctx.font = `${numFontSize}px sans-serif`;
        ctx.fillStyle = "#6b7280";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        const displayPageNum = options.coverPage?.enabled ? i : i + 1;
        const displayTotalPages = options.coverPage?.enabled ? totalPages - 1 : totalPages;
        const text = `Page ${displayPageNum} of ${displayTotalPages}`;
        
        ctx.fillText(
          text, 
          pageCanvas.width / 2, 
          pageCanvas.height - Math.floor(footerHeightPx / 2)
        );
        ctx.restore();
      }

      pdf.addImage(
        pageCanvas.toDataURL("image/png"),
        "PNG",
        MARGIN_MM,
        MARGIN_MM,
        CONTENT_W_MM,
        CONTENT_H_MM,
        `page-${i}`,
        "FAST"
      );
    }

    pdf.save(filename.replace(/\.md$/, "") + ".pdf");
  } catch (err) {
    console.error("PDF generation failed:", err);
    throw err;
  } finally {
    // ── Phase 5 — Restore environment ──────────────────────────────────
    document.body.removeChild(container);
    disabledSheets.forEach((s) => (s.disabled = false));
    if (wasDark) document.documentElement.classList.add("dark");
  }
}

export function createCoverPageElement(
  options: NonNullable<PdfExportOptions["coverPage"]>,
  pageHeightPx: number
): HTMLElement {
  const cover = document.createElement("div");
  cover.id = "pdf-cover-page";
  
  Object.assign(cover.style, {
    width: "100%",
    height: `${pageHeightPx}px`,
    boxSizing: "border-box",
    margin: "0",
    padding: "80px 60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    backgroundColor: "#ffffff",
    color: "#111827",
    overflow: "hidden"
  });

  const accentColor = options.accentColor || "#3b82f6";

  if (options.template === "modern") {
    cover.style.paddingLeft = "90px";
    
    const stripe = document.createElement("div");
    Object.assign(stripe.style, {
      position: "absolute",
      left: "0",
      top: "0",
      bottom: "0",
      width: "18px",
      backgroundColor: accentColor
    });
    cover.appendChild(stripe);

    const topSec = document.createElement("div");
    const category = document.createElement("div");
    category.innerText = "DOCUMENT EXPORT";
    Object.assign(category.style, {
      fontSize: "13px",
      fontWeight: "700",
      letterSpacing: "2px",
      color: accentColor,
      marginBottom: "20px"
    });
    topSec.appendChild(category);

    const title = document.createElement("h1");
    title.innerText = options.title;
    Object.assign(title.style, {
      fontSize: "42px",
      fontWeight: "800",
      lineHeight: "1.15",
      color: "#111827",
      margin: "0",
      border: "none",
      padding: "0"
    });
    topSec.appendChild(title);

    if (options.subtitle) {
      const subtitle = document.createElement("p");
      subtitle.innerText = options.subtitle;
      Object.assign(subtitle.style, {
        fontSize: "20px",
        color: "#4b5563",
        marginTop: "16px",
        lineHeight: "1.4"
      });
      topSec.appendChild(subtitle);
    }
    cover.appendChild(topSec);

    const bottomSec = document.createElement("div");
    Object.assign(bottomSec.style, {
      borderTop: "2px solid #e5e7eb",
      paddingTop: "24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end"
    });

    if (options.author) {
      const authorBox = document.createElement("div");
      const authLabel = document.createElement("div");
      authLabel.innerText = "PREPARED BY";
      Object.assign(authLabel.style, {
        fontSize: "11px",
        fontWeight: "600",
        letterSpacing: "1px",
        color: "#9ca3af"
      });
      const authVal = document.createElement("div");
      authVal.innerText = options.author;
      Object.assign(authVal.style, {
        fontSize: "15px",
        fontWeight: "600",
        color: "#374151",
        marginTop: "4px"
      });
      authorBox.appendChild(authLabel);
      authorBox.appendChild(authVal);
      bottomSec.appendChild(authorBox);
    }

    if (options.date) {
      const dateBox = document.createElement("div");
      const dateLabel = document.createElement("div");
      dateLabel.innerText = "DATE";
      Object.assign(dateLabel.style, {
        fontSize: "11px",
        fontWeight: "600",
        letterSpacing: "1px",
        color: "#9ca3af",
        textAlign: "right"
      });
      const dateVal = document.createElement("div");
      dateVal.innerText = options.date;
      Object.assign(dateVal.style, {
        fontSize: "15px",
        fontWeight: "600",
        color: "#374151",
        marginTop: "4px",
        textAlign: "right"
      });
      dateBox.appendChild(dateLabel);
      dateBox.appendChild(dateVal);
      bottomSec.appendChild(dateBox);
    }
    cover.appendChild(bottomSec);

  } else if (options.template === "editorial") {
    cover.style.padding = "100px 80px";
    
    const border = document.createElement("div");
    Object.assign(border.style, {
      position: "absolute",
      left: "30px",
      right: "30px",
      top: "30px",
      bottom: "30px",
      border: "1px solid #d1d5db",
      pointerEvents: "none"
    });
    const innerBorder = document.createElement("div");
    Object.assign(innerBorder.style, {
      position: "absolute",
      left: "34px",
      right: "34px",
      top: "34px",
      bottom: "34px",
      border: "1px solid #e5e7eb",
      pointerEvents: "none"
    });
    cover.appendChild(border);
    cover.appendChild(innerBorder);

    const topSec = document.createElement("div");
    Object.assign(topSec.style, {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center"
    });

    const ornament = document.createElement("div");
    ornament.innerText = "❖";
    Object.assign(ornament.style, {
      fontSize: "24px",
      color: accentColor,
      marginBottom: "30px"
    });
    topSec.appendChild(ornament);

    const title = document.createElement("h1");
    title.innerText = options.title;
    Object.assign(title.style, {
      fontFamily: "Georgia, serif",
      fontSize: "36px",
      fontWeight: "400",
      lineHeight: "1.3",
      color: "#111827",
      margin: "0",
      border: "none",
      padding: "0",
      letterSpacing: "1px"
    });
    topSec.appendChild(title);

    if (options.subtitle) {
      const subtitle = document.createElement("p");
      subtitle.innerText = options.subtitle;
      Object.assign(subtitle.style, {
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontSize: "18px",
        color: "#6b7280",
        marginTop: "20px"
      });
      topSec.appendChild(subtitle);
    }
    cover.appendChild(topSec);

    const bottomSec = document.createElement("div");
    Object.assign(bottomSec.style, {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      textAlign: "center"
    });

    if (options.author) {
      const authVal = document.createElement("div");
      authVal.innerText = options.author;
      Object.assign(authVal.style, {
        fontFamily: "Georgia, serif",
        fontSize: "16px",
        color: "#374151"
      });
      bottomSec.appendChild(authVal);
    }

    if (options.date) {
      const divider = document.createElement("div");
      divider.style.width = "40px";
      divider.style.height = "1px";
      divider.style.backgroundColor = "#d1d5db";
      divider.style.margin = "4px 0";
      bottomSec.appendChild(divider);

      const dateVal = document.createElement("div");
      dateVal.innerText = options.date;
      Object.assign(dateVal.style, {
        fontSize: "13px",
        color: "#9ca3af",
        textTransform: "uppercase",
        letterSpacing: "1px"
      });
      bottomSec.appendChild(dateVal);
    }
    cover.appendChild(bottomSec);

  } else if (options.template === "academic") {
    const header = document.createElement("div");
    header.innerText = "TECHNICAL REPORT / STUDY FINDINGS";
    Object.assign(header.style, {
      fontSize: "11px",
      fontWeight: "600",
      letterSpacing: "1.5px",
      color: "#6b7280",
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "10px",
      marginBottom: "40px"
    });
    
    const topSec = document.createElement("div");
    topSec.appendChild(header);

    const title = document.createElement("h1");
    title.innerText = options.title;
    Object.assign(title.style, {
      fontFamily: "Times New Roman, Georgia, serif",
      fontSize: "36px",
      fontWeight: "700",
      lineHeight: "1.2",
      color: "#1f2937",
      margin: "0",
      border: "none",
      padding: "0"
    });
    topSec.appendChild(title);

    if (options.subtitle) {
      const subtitle = document.createElement("p");
      subtitle.innerText = options.subtitle;
      Object.assign(subtitle.style, {
        fontSize: "16px",
        color: "#4b5563",
        marginTop: "16px",
        lineHeight: "1.5"
      });
      topSec.appendChild(subtitle);
    }

    const rule = document.createElement("div");
    Object.assign(rule.style, {
      height: "4px",
      width: "120px",
      backgroundColor: accentColor,
      marginTop: "24px"
    });
    topSec.appendChild(rule);
    cover.appendChild(topSec);

    const bottomSec = document.createElement("div");
    Object.assign(bottomSec.style, {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      borderTop: "1px solid #e5e7eb",
      paddingTop: "30px"
    });

    if (options.author) {
      const authBox = document.createElement("div");
      const authLabel = document.createElement("div");
      authLabel.innerText = "INVESTIGATOR / AUTHOR";
      Object.assign(authLabel.style, {
        fontSize: "10px",
        fontWeight: "700",
        color: "#9ca3af",
        letterSpacing: "0.5px"
      });
      const authVal = document.createElement("div");
      authVal.innerText = options.author;
      Object.assign(authVal.style, {
        fontSize: "14px",
        color: "#374151",
        marginTop: "6px"
      });
      authBox.appendChild(authLabel);
      authBox.appendChild(authVal);
      bottomSec.appendChild(authBox);
    }

    if (options.date) {
      const dateBox = document.createElement("div");
      const dateLabel = document.createElement("div");
      dateLabel.innerText = "DATE OF PUBLICATION";
      Object.assign(dateLabel.style, {
        fontSize: "10px",
        fontWeight: "700",
        color: "#9ca3af",
        letterSpacing: "0.5px"
      });
      const dateVal = document.createElement("div");
      dateVal.innerText = options.date;
      Object.assign(dateVal.style, {
        fontSize: "14px",
        color: "#374151",
        marginTop: "6px"
      });
      dateBox.appendChild(dateLabel);
      dateBox.appendChild(dateVal);
      bottomSec.appendChild(dateBox);
    }
    cover.appendChild(bottomSec);

  } else {
    // Minimal / Clean template (Default)
    const topSec = document.createElement("div");
    Object.assign(topSec.style, {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      marginTop: "100px"
    });

    const title = document.createElement("h1");
    title.innerText = options.title;
    Object.assign(title.style, {
      fontSize: "40px",
      fontWeight: "700",
      lineHeight: "1.2",
      color: "#111827",
      margin: "0",
      border: "none",
      padding: "0"
    });
    topSec.appendChild(title);

    const line = document.createElement("div");
    Object.assign(line.style, {
      width: "60px",
      height: "3px",
      backgroundColor: accentColor,
      margin: "24px auto"
    });
    topSec.appendChild(line);

    if (options.subtitle) {
      const subtitle = document.createElement("p");
      subtitle.innerText = options.subtitle;
      Object.assign(subtitle.style, {
        fontSize: "18px",
        color: "#4b5563",
        margin: "0"
      });
      topSec.appendChild(subtitle);
    }
    cover.appendChild(topSec);

    const bottomSec = document.createElement("div");
    Object.assign(bottomSec.style, {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "6px",
      textAlign: "center"
    });

    if (options.author) {
      const authVal = document.createElement("div");
      authVal.innerText = options.author;
      Object.assign(authVal.style, {
        fontSize: "15px",
        fontWeight: "500",
        color: "#374151"
      });
      bottomSec.appendChild(authVal);
    }

    if (options.date) {
      const dateVal = document.createElement("div");
      dateVal.innerText = options.date;
      Object.assign(dateVal.style, {
        fontSize: "13px",
        color: "#6b7280"
      });
      bottomSec.appendChild(dateVal);
    }
    cover.appendChild(bottomSec);
  }

  return cover;
}
