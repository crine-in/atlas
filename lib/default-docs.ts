export interface DocFile {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_DOCS: DocFile[] = [
  {
    id: "quantum-mechanics",
    name: "Quantum Mechanics & Chemistry.md",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `**Step 1: Quantum Mechanics Basics**

*(Note: While the syllabus topics and the previous year questions are directly from your sources, the detailed explanations and step-by-step solutions provided below draw on fundamental chemistry knowledge outside of the provided text.)*

### **1. Core Concepts: The Schrödinger Wave Equation**
The Schrödinger wave equation is the fundamental equation of quantum mechanics. It describes the wave-like behavior of a particle (like an electron) in three-dimensional space. 

*   **The 3D Time-Independent Schrödinger Equation:** 
    $$\\nabla^2\\Psi + \\frac{8\\pi^2m}{h^2}(E - V)\\Psi = 0$$
    *   **$\\Psi$ (Psi):** The wave function, representing the amplitude of the electron wave.
    *   **$\\nabla^2$ (Del squared):** The Laplacian operator ($\\frac{\\partial^2}{\\partial x^2} + \\frac{\\partial^2}{\\partial y^2} + \\frac{\\partial^2}{\\partial z^2}$).
    *   **$m$:** Mass of the particle.
    *   **$h$:** Planck’s constant.
    *   **$E$:** Total energy of the particle.
    *   **$V$:** Potential energy of the particle.
*   **Conditions for an Acceptable Wave Function ($\\Psi$):** For a wave function to physically make sense, it must be:
    1.  **Single-valued:** It can only have one value at any given point in space.
    2.  **Continuous:** There can be no sudden breaks in the wave.
    3.  **Finite:** It cannot go to infinity.
    4.  **Normalized:** The total probability of finding the particle somewhere in space must equal 1.

### **2. Chemistry Notation & Reactions**
We can use standard chemistry notations (using \\ce) to write chemical equations:
*   Water formation: $\\ce{2H2 + O2 -> 2H2O}$
*   Acid-Base reaction: $\\ce{HCl + NaOH -> NaCl + H2O}$
*   Nuclear reaction: $\\ce{^{238}_{92}U -> ^{234}_{90}Th + \\alpha}$
*   Photosynthesis: $\\ce{6CO2 + 6H2O ->[light][chlorophyll] C6H12O6 + 6O2}$
*   Coordination complex equilibrium: $\\ce{[Co(H2O)6]^2+ + 4Cl- <=> [CoCl4]^2- + 6H2O}$

### **3. Application: Particle in a 1D Box**
This model imagines a particle (like an electron) trapped in a perfectly rigid, one-dimensional box of length $L$. Inside the box, the potential energy ($V$) is zero. Outside the box, the potential energy is infinite, meaning the particle cannot escape.

*   **Energy Levels:** Solving the Schrödinger equation for this system gives quantized energy levels:
    $$E_n = \\frac{n^2h^2}{8mL^2}$$
    (where $n = 1, 2, 3...$ representing the principal quantum number).
*   **Zero-Point Energy:** The lowest possible energy state is when $n = 1$. The energy is never zero ($E_1 = \\frac{h^2}{8mL^2}$). This is called the Zero-Point Energy.
*   **Application to Polyenes:** This simple 1D box model is incredibly useful for approximating the energy spectra of conjugated polyenes (molecules with alternating single and double bonds, like butadiene). The delocalized $\\pi$-electrons are treated as "particles" moving freely along the 1D "box" created by the carbon chain.

***

### **Previous Year Questions & Solutions (PYQs)**

**Q1. Which of the following is the expression of Schrodinger wave equation?**
(a) $\\nabla^2\\Psi + (h^2/8\\pi^2m)(E - V)\\Psi = 0$
(b) $\\nabla^2\\Psi + (8\\pi^2m/h^2)(E - V)\\Psi = 0$
(c) $(-\\hbar^2/2m\\nabla^2 + E)\\Psi - V\\Psi = 0$
(d) $(-2m/\\hbar^2\\nabla^2 + V)\\Psi - E\\Psi = 0$
> **Solution:** **(b)** is the correct standard mathematical expression for the time-independent Schrödinger wave equation.

**Q2. Write down the time independent 1D Schrodinger's wave equation and mention the terms involved.**
> **Solution:**
> For a 1D system (along the x-axis), the equation simplifies to:
> $$\\frac{d^2\\Psi}{dx^2} + \\frac{8\\pi^2m}{h^2}(E - V)\\Psi = 0$$
> *Terms:* $\\Psi$ is the wave function, $x$ is the position coordinate, $m$ is the mass of the particle, $h$ is Planck's constant, $E$ is the total energy, and $V$ is the potential energy.

**Q3. Prove that $(V - \\frac{h^2}{8\\pi^2m}\\nabla^2)\\Psi = E\\Psi$.**
> **Solution:**
> 1. Start with the standard time-independent Schrödinger equation: 
>    $\\nabla^2\\Psi + \\frac{8\\pi^2m}{h^2}(E - V)\\Psi = 0$
> 2. Multiply the entire equation by $-\\frac{h^2}{8\\pi^2m}$:
>    $-\\frac{h^2}{8\\pi^2m}\\nabla^2\\Psi - (E - V)\\Psi = 0$
> 3. Expand the terms:
>    $-\\frac{h^2}{8\\pi^2m}\\nabla^2\\Psi - E\\Psi + V\\Psi = 0$
> 4. Rearrange to group the operators acting on $\\Psi$ on one side:
>    $V\\Psi - \\frac{h^2}{8\\pi^2m}\\nabla^2\\Psi = E\\Psi$
> 5. Factor out $\\Psi$:
>    $(V - \\frac{h^2}{8\\pi^2m}\\nabla^2)\\Psi = E\\Psi$ *(Hence Proved)*
`
  },
  {
    id: "mermaid-guide",
    name: "Mermaid Diagrams.md",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `# Mermaid Diagramming Guide

Mermaid lets you create diagrams and visualizations using text and code. Here are the core diagram types you can write in Atlas.

## 1. Flowcharts
\`\`\`mermaid
flowchart TD
    A[Start Node] --> B{Is it working?}
    B -- Yes --> C[Great! Keep going]
    B -- No --> D[Check documentation]
    D --> B
    C --> E[Finish]
\`\`\`

## 2. Sequence Diagrams
\`\`\`mermaid
sequenceDiagram
    autonumber
    Client->>Server: HTTP POST /api/document
    activate Server
    Server->>Database: Save document content
    Database-->>Server: Return document ID
    Server-->>Client: HTTP 201 Created (ID)
    deactivate Server
\`\`\`

## 3. Gantt Chart
\`\`\`mermaid
gantt
    title Development Project Timeline
    dateFormat  YYYY-MM-DD
    section Setup Phase
    Install Packages      :active, a1, 2026-06-15, 2d
    Core Architecture     :a2, after a1, 3d
    section Implementation
    UI Layout & Sidebars  :a3, after a2, 4d
    LaTeX & Chemistry     :a4, after a2, 3d
    Mermaid Integration   :a5, after a4, 2d
    section Testing
    Cross-browser Testing :2026-06-25, 4d
\`\`\`

## 4. State Diagram
\`\`\`mermaid
stateDiagram-v2
    [*] --> Off
    Off --> On : Power Button Press
    On --> Active : Open Document
    Active --> Idle : No User Activity (5m)
    Idle --> Active : Keypress / Mouse Movement
    Active --> On : Close Document
    On --> Off : Power Button Press
\`\`\`

## 5. Pie Chart
\`\`\`mermaid
pie title Markdown Editor File Types Used
    "Markdown" : 45
    "LaTeX Math" : 25
    "Mermaid Diagrams" : 15
    "Chemistry formulas" : 15
\`\`\`
`
  },
  {
    id: "markdown-reference",
    name: "Markdown Cheat Sheet.md",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `# Markdown Reference & Rich Styles

Welcome to **Atlas**, your highly-supportive Markdown workspace. This cheat sheet demonstrates the extensive styling options at your disposal.

## Headings
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Emphasis
*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

~~This text will be strikethrough~~

## Lists
### Unordered List
* Item 1
* Item 2
  * Sub-item 2.1
  * Sub-item 2.2
* Item 3

### Ordered List
1. First item
2. Second item
3. Third item
   1. Sub-item 3.1
   2. Sub-item 3.2

### Task Lists / Checklists
- [x] Integrate KaTeX for mathematical rendering
- [x] Configure chemistry formula rendering via mhchem
- [x] Integrate CodeMirror 6 text editor
- [/] Set up file storage and sidebar navigation
- [ ] Implement export features (DOCX, PDF)

## Blockquotes
> Blockquotes are very useful for calling out highlights, notes, or quotes.
> 
> You can even nested blockquotes:
> > Nested blockquotes look like this.

## Code Blocks & Inline Code
This is an example of \`inline code\`.

Here is a syntax-highlighted code block:
\`\`\`typescript
interface User {
  id: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

function greet(user: User): string {
  return \`Welcome, \${user.name}! Your role is \${user.role}.\`;
}

console.log(greet({ id: '1', name: 'Antigravity', role: 'admin' }));
\`\`\`

## Tables
| Feature | Supported | Rendering Engine |
| :--- | :---: | :--- |
| **LaTeX Math** | Yes | KaTeX |
| **Chemistry** | Yes | KaTeX + mhchem |
| **Diagrams** | Yes | MermaidJS |
| **Tables** | Yes | ReactMarkdown GFM |
| **Checklists** | Yes | Custom CSS |

## Links and Images
[Google](https://www.google.com)  
![Atlas Logo](https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=100&auto=format&fit=crop&q=60)
`
  },
  {
    id: "project-plan",
    name: "Project Plan.md",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `# Atlas Development Project Plan

This document outlines the tasks and timeline to construct the **Atlas** Markdown Editor.

---

## Phase 1: Core Setup
- [x] Create project workspace repository
- [x] Set up base Next.js layout configuration
- [x] Install external libraries (CodeMirror, ReactMarkdown, KaTeX, Mermaid, DOCX)

---

## Phase 2: Components Implementation
- [x] **File Manager**: Design the collapsible sidebar for loading, adding, deleting, and renaming files.
- [x] **Layout Workspace**: Build the split-pane viewer with draggable width handles.
- [x] **Markdown Preview**: Configure LaTeX parsing, Chemistry notations, and code block formatting.
- [x] **Mermaid Renderer**: Implement dynamic graph SVG generations.

---

## Phase 3: Advanced Features
- [ ] **Scroll Sync**: Implement dual scrolling between CodeMirror and the Preview elements.
- [ ] **Table of Contents**: Parse header trees to offer anchor-jumping shortcuts.
- [ ] **Presentation Slide View**: Split files by horizontal rules and render them in a slideshow.
- [ ] **DOCX/PDF Exporter**: Construct MS Word layouts and print format pages.

---

## Project Status Overview
| Milestone | Target Date | Status |
| :--- | :--- | :--- |
| Base Layout & Packages | June 15, 2026 | Completed |
| Core Rendering Engine | June 18, 2026 | In Progress |
| Exporters & Slideware | June 22, 2026 | Pending |
| Build Optimizations | June 25, 2026 | Pending |
`
  }
];
