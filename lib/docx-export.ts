import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  WidthType,
  ShadingType
} from "docx";

// Parse inline styles like **bold**, *italic*, `code`, and $math$
function parseInlineStyles(text: string): TextRun[] {
  const runs: TextRun[] = [];
  let index = 0;

  // Simple token regex for bold, italic, inline code, and inline math
  // We match:
  // - Bold: \*\*(.*?)\*\*
  // - Italic: \*(.*?)\* or _(.*?)_
  // - Code: `(.*?)`
  // - Math: \$(.*?)\$
  const tokenRegex = /(\*\*.*?\*\*|\*.*?\*|_.*?_|`.*?`|\$.*?\$)/g;
  const parts = text.split(tokenRegex);

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(
        new TextRun({
          text: part.slice(2, -2),
          bold: true
        })
      );
    } else if ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("_") && part.endsWith("_"))) {
      runs.push(
        new TextRun({
          text: part.slice(1, -1),
          italics: true
        })
      );
    } else if (part.startsWith("`") && part.endsWith("`")) {
      runs.push(
        new TextRun({
          text: part.slice(1, -1),
          font: "Courier New",
          size: 20,
          shading: {
            type: ShadingType.CLEAR,
            fill: "F3F4F6",
            color: "auto"
          }
        })
      );
    } else if (part.startsWith("$") && part.endsWith("$")) {
      runs.push(
        new TextRun({
          text: part.slice(1, -1),
          italics: true,
          font: "Cambria Math",
          color: "1A5276"
        })
      );
    } else {
      runs.push(
        new TextRun({
          text: part
        })
      );
    }
  }

  if (runs.length === 0) {
    runs.push(new TextRun({ text }));
  }

  return runs;
}

export async function exportToDocx(title: string, markdown: string): Promise<Blob> {
  const children: any[] = [];

  // Add Document Title
  children.push(
    new Paragraph({
      text: title.replace(/\.md$/, ""),
      heading: HeadingLevel.TITLE,
      spacing: { after: 300 }
    })
  );

  const lines = markdown.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      children.push(new Paragraph({ spacing: { after: 100 } }));
      i++;
      continue;
    }

    // 1. Code Blocks
    if (line.trim().startsWith("```")) {
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing backticks

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: codeLines.join("\n"),
              font: "Courier New",
              size: 19
            })
          ],
          indent: { left: 400 },
          spacing: { before: 120, after: 120 },
          shading: {
            type: ShadingType.CLEAR,
            fill: "F3F4F6",
            color: "auto"
          }
        })
      );
      continue;
    }

    // 2. Tables
    if (line.trim().startsWith("|")) {
      const tableRows: TableRow[] = [];
      const cells: string[][] = [];

      // Read consecutive table lines
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const rowLine = lines[i].trim();
        // Check if it's the divider row e.g. |---|:---:|
        if (rowLine.includes("-") && !rowLine.match(/[a-zA-Z0-9]/)) {
          i++;
          continue;
        }

        // Split by '|' and clean empty parts
        const rowCells = rowLine
          .split("|")
          .map((c) => c.trim())
          .slice(1, -1);
        cells.push(rowCells);
        i++;
      }

      // Construct docx table
      for (let rIdx = 0; rIdx < cells.length; rIdx++) {
        const rowCells = cells[rIdx];
        const tableCells = rowCells.map((cellText) => {
          const isHeader = rIdx === 0;
          return new TableCell({
            children: [
              new Paragraph({
                children: parseInlineStyles(cellText),
                alignment: AlignmentType.LEFT
              })
            ],
            shading: isHeader
              ? {
                  type: ShadingType.CLEAR,
                  fill: "E5E7EB",
                  color: "auto"
                }
              : undefined,
            width: {
              size: 100 / rowCells.length,
              type: WidthType.PERCENTAGE
            },
            margins: {
              top: 120,
              bottom: 120,
              left: 150,
              right: 150
            }
          });
        });

        tableRows.push(
          new TableRow({
            children: tableCells
          })
        );
      }

      if (tableRows.length > 0) {
        children.push(
          new Table({
            rows: tableRows,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: "CCCCCC" },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: "CCCCCC" },
              left: { style: BorderStyle.SINGLE, size: 8, color: "CCCCCC" },
              right: { style: BorderStyle.SINGLE, size: 8, color: "CCCCCC" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" },
              insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" }
            }
          })
        );
      }
      continue;
    }

    // 3. Headings
    if (line.startsWith("# ")) {
      children.push(
        new Paragraph({
          children: parseInlineStyles(line.slice(2)),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 }
        })
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      children.push(
        new Paragraph({
          children: parseInlineStyles(line.slice(3)),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      children.push(
        new Paragraph({
          children: parseInlineStyles(line.slice(4)),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 160, after: 80 }
        })
      );
      i++;
      continue;
    }
    if (line.startsWith("#### ")) {
      children.push(
        new Paragraph({
          children: parseInlineStyles(line.slice(5)),
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 140, after: 60 }
        })
      );
      i++;
      continue;
    }

    // 4. Blockquotes
    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quoteLines.push(lines[i].slice(1).trim());
        i++;
      }

      children.push(
        new Paragraph({
          children: parseInlineStyles(quoteLines.join(" ")),
          indent: { left: 500 },
          border: {
            left: {
              style: BorderStyle.SINGLE,
              size: 24, // 3pt border
              color: "1A5276",
              space: 10
            }
          },
          spacing: { before: 100, after: 100 }
        })
      );
      continue;
    }

    // 5. Horizontal Rule
    if (line.trim() === "---" || line.trim() === "***" || line.trim() === "___") {
      children.push(
        new Paragraph({
          spacing: { before: 200, after: 200 },
          border: {
            bottom: {
              style: BorderStyle.SINGLE,
              size: 8,
              color: "E5E7EB"
            }
          }
        })
      );
      i++;
      continue;
    }

    // 6. Block Math ($$)
    if (line.trim().startsWith("$$")) {
      i++;
      const mathLines: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith("$$")) {
        mathLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing $$

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: mathLines.join("\n"),
              italics: true,
              font: "Cambria Math",
              size: 24,
              color: "1A5276"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 150, after: 150 }
        })
      );
      continue;
    }

    // 7. Bullet Lists (*, -, +)
    const bulletMatch = line.match(/^(\s*)([*+-])\s+(.*)/);
    if (bulletMatch) {
      const indentLevel = bulletMatch[1].length;
      children.push(
        new Paragraph({
          children: parseInlineStyles(bulletMatch[3]),
          bullet: {
            level: Math.floor(indentLevel / 2)
          },
          spacing: { after: 60 }
        })
      );
      i++;
      continue;
    }

    // 8. Numbered Lists (1., 2. etc.)
    const numberMatch = line.match(/^(\s*)(\d+)\.\s+(.*)/);
    if (numberMatch) {
      const indentLevel = numberMatch[1].length;
      children.push(
        new Paragraph({
          children: parseInlineStyles(numberMatch[3]),
          indent: { left: 400 + indentLevel * 200 },
          spacing: { after: 60 }
        })
      );
      i++;
      continue;
    }

    // 9. Standard Paragraphs
    children.push(
      new Paragraph({
        children: parseInlineStyles(line),
        spacing: { after: 120 }
      })
    );
    i++;
  }

  // Create Document and Packer
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children
      }
    ]
  });

  return await Packer.toBlob(doc);
}
