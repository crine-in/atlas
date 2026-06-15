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
export async function exportToPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  // ── Constants ──────────────────────────────────────────────────────────
  // A4 at 96 CSS-dpi is ~794 × 1123 px.  We render into the content area
  // width (A4 minus margins) so that margins are handled purely by jsPDF
  // placement offsets — no padding tricks or double-margins.
  const A4_W_MM = 210;
  const A4_H_MM = 297;
  const MARGIN_MM = 15; // uniform margin on every side
  const CONTENT_W_MM = A4_W_MM - 2 * MARGIN_MM; // 180 mm
  const CONTENT_H_MM = A4_H_MM - 2 * MARGIN_MM; // 267 mm
  const RENDER_WIDTH_PX = 680; // ≈ 180 mm at 96 dpi
  const CANVAS_SCALE = 2; // 2× for retina-quality output

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

  container.appendChild(clone);
  document.body.appendChild(container);

  // Give the browser a tick to reflow / load fonts
  await new Promise((r) => setTimeout(r, 300));

  try {
    // ── Phase 3 — Render to canvas ─────────────────────────────────────
    const canvas = await html2canvas(container, {
      scale: CANVAS_SCALE,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // ── Phase 4 — Paginate into PDF ────────────────────────────────────
    // How many scaled-canvas-pixels correspond to one page of content height?
    //   canvas.width  px  ↔  CONTENT_W_MM  mm
    //   pageHeight px  ↔  CONTENT_H_MM  mm
    //   → pageHeight  = (CONTENT_H_MM / CONTENT_W_MM) × canvas.width
    const pageHeightPx = Math.floor(
      (CONTENT_H_MM / CONTENT_W_MM) * canvas.width
    );
    const totalPages = Math.ceil(canvas.height / pageHeightPx);

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
