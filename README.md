# 🗺️ Atlas: The Next-Gen Markdown Workspace

Atlas is a professional, high-fidelity Markdown editor and document preparation workspace. Built using **Next.js 15**, **React 19**, and **shadcn/ui**, Atlas is designed for writers, researchers, developers, and educators who demand a clean editing environment combined with powerful formatting, diagramming, math rendering, and enterprise-grade PDF/document export tools.

---

## 🌟 Core Features

- **⚡ Live Synchronized Split-Pane**: Edit and preview in real-time. The split-pane layout supports a drag-to-resize divider and toggleable scroll synchronization.
- **📝 CodeMirror Markdown Editor**: A polished writing interface equipped with syntax highlighting, dynamic font resizing, line wrapping, and toolbar formatting shortcuts.
- **📐 Mathematical & Chemical Typesetting**: Full support for KaTeX math equations (both inline `$...$` and block `$$...$$`) and chemistry formulas using `$\ce{...}$` via `mhchem`.
- **📊 Interactive Mermaid.js Diagrams**: Render block diagrams, flowcharts, sequence diagrams, and gantt charts directly from your markdown source.
- **📄 PDF Export Configuration Desk**:
  - **Cover Page Engine**: Automatically prepend custom cover pages using four design layouts: *Minimalist*, *Modern Stripe*, *Editorial*, and *Academic*.
  - **Dynamic Watermarks**: Add customizable, diagonal, blended text overlays with adjustable opacity and colors.
  - **Page Numbering**: Automated headers and footers with page numbering.
- **🏛️ High-Fidelity Export Formats**:
  - **Vector PDF / Print**: Generate selectable, searchable, lightweight vector documents.
  - **Raster PDF**: Perform high-fidelity image-based layout exports.
  - **Word Document (.docx)**: Export formatted rich text directly to Microsoft Word.
  - **HTML & Raw Markdown**: Download styled standalone HTML or pure Markdown files.
- **🎭 Presentation Mode (Slides)**: Split your document into slides using horizontal rules (`---`, `***`, or `___`) and launch an immersive presentation view with customizable themes (*Modern*, *Dark*, *Warm*, and *Glassmorphism*).
- **🗂️ Local File Cabinet**: Manage multiple documents locally with file creation, renaming, deletion, import functionality, and persistent storage via `localStorage`.
- **🌳 Table of Contents Outline**: Toggle a live structural outline to navigate complex documents effortlessly.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives & Lucide Icons)
- **Editor**: [@uiw/react-codemirror](https://github.com/uiwjs/react-codemirror)
- **Parsers & Rendering**:
  - [react-markdown](https://github.com/remarkjs/react-markdown)
  - [remark-gfm](https://github.com/remarkjs/remark-gfm) (GitHub Flavored Markdown)
  - [remark-math](https://github.com/remarkjs/remark-math) & [rehype-katex](https://github.com/remarkjs/remark-math/tree/main/packages/rehype-katex)
  - [mermaid.js](https://mermaid.js.org/)
- **Document Generators**:
  - [docx](https://github.com/dolanmiu/docx)
  - [jspdf](https://github.com/parallax/jsPDF) & [html2canvas-pro](https://github.com/eKoopmans/html2canvas)

---

## 🚀 Getting Started & Local Development

### Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v18.x or later)
- **pnpm** (v8.x or later)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/crine-in/atlas.git
   cd atlas
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

---

## 📖 Feature Guides

### 🎭 Building Presentations / Slideshows

To turn your document into a presentation slideshow:
1. Divide your slides using standard Markdown horizontal rules (`---`, `***`, or `___`) on a newline.
2. Click the **Slides** button in the header toolbar.
3. Use the following keyboard controls to navigate:
   - **Next Slide**: `ArrowRight` or `Space`
   - **Previous Slide**: `ArrowLeft` or `Backspace`
   - **Exit Slideshow**: `Escape`
4. Toggle between multiple visual themes in the slide header (*Modern*, *Dark*, *Warm*, or *Glassmorphism*).

Example:
```markdown
# Slide 1 Title
This is the content of the first slide.
- Key point A
- Key point B

---

# Slide 2 Title
This is the second slide, rendering math:
$$e^{i\pi} + 1 = 0$$
```

---

## 🧪 Development & Verification

Before committing changes, please run the verification scripts:

- **Format Code**: `pnpm format`
- **Lint Code**: `pnpm lint`
- **Type Check**: `pnpm typecheck`
- **Build App**: `pnpm build`

---

## 🤝 Contributing

We welcome contributions! Please review our **[Contributing Guidelines](CONTRIBUTING.md)** and our **[Code of Conduct](CODE_OF_CONDUCT.md)** before submitting a pull request.

---

## ⚖️ License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See the [LICENSE](LICENSE) file for the full text.

Under the AGPL-3.0, if you modify this software and run it over a network (e.g., as a hosted SaaS web application), you must make the complete source code of the modified version available to the users of that service.

---

Copyright (C) 2026 CRINE.
