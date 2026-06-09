# Design spec — the data & visual craft

Load this in Phase 4 (Write & design), during the design pass and whenever building exhibits. McKinsey's whole visual identity expresses one idea: **high contrast = clarity of thought.** White paper, deep blue ink, lots of air.

## Contents
- Anatomy of an exhibit
- Action titles on charts
- One message per chart (Zelazny's comparison types)
- Chart-type conventions
- Color palette (with hex + free substitutes)
- Typography (with free font substitutes)
- Report layout
- Data-narrative integration
- Sourcing for credibility
- The spec-sheet table

---

## Anatomy of an exhibit

Every exhibit, stacked top to bottom:
1. **Exhibit number** — small, quiet, top-left ("Exhibit 1"; MGI summaries use "E1, E2…").
2. **Action title** — full-sentence finding, large, dark, left-aligned.
3. **Unit-of-measure subtitle** — small italic gray, states what's measured ("Organizations that have adopted AI in ≥1 function, % of respondents").
4. **Chart body** — surrounded by white space.
5. **Footnotes** — superscripted, small gray.
6. **Source line** — last, small italic gray, "Source:" prefix; firm signature bottom-right.

Zelazny's structural rule: **title-top, source-bottom, one chart in the middle. No exceptions.**

---

## Action titles on charts

The title is the *finding*; the chart is the *proof*.
- **Bad:** "AI adoption by industry."
- **Good (real):** "Survey findings suggest organizations are using AI in more business functions now than in previous years."

One complete declarative sentence; falsifiable; passes the skim test (read only the titles, in order → you get the whole argument).

---

## One message per chart — Zelazny's iron law

If there are two findings, build two exhibits. Workflow: (1) write the message as a sentence; (2) identify the **comparison type**; (3) pick the chart form to fit the comparison — never the reverse.

| Comparison type | The message sounds like | Chart form |
|---|---|---|
| Component | "X is the largest share of Y" | 100% pie or stacked bar |
| Item | "A > B > C" | Bar |
| Time series | "X changed over time" | Column or line |
| Frequency distribution | "Most fall in range X" | Histogram |
| Correlation | "X varies with Y" | Scatter |

---

## Chart-type conventions

**Heavily used:** horizontal/vertical bars with direct data labels (the workhorse); 100% stacked bars for composition; **waterfall / cascade** (the "McKinsey bridge" — any "explain the delta" story); **Marimekko / Mekko** (the signature chart — variable-width stacked bars where both height *and* width carry meaning, for market sizing and value pools); bubble/scatter; slope graphs for two time points; clean line charts; heatmaps for matrices; **range bars** with low/high estimates (e.g., "$2.6T-$4.4T"), which signal analytical honesty.

**Avoided:** 3-D anything; pies beyond a simple share; dual y-axes; chartjunk; drop shadows; gradients; more than ~5 colors.

---

## Color palette

- **Deep blue (primary)** ≈ `#051C2C` — backgrounds, primary type, key bars.
- **Vivid blue accent** ≈ `#2251FF` — highlights the one data point that proves the title.
- Historic logo blue `#24477F`.
- Blue ramp: `#AFC3E0` → `#6E8BB8` → `#34528B` → `#051C2C`.
- **Purple accent** ≈ `#7E2DA4` — for AI/QuantumBlack materials.
- Neutral data gray ≈ `#C0C5C9`; secondary text gray ≈ `#6E7B85`.
- White `#FFFFFF` dominant.
- **No greens, oranges, or yellows** in the default palette.

**Rule:** one accent color highlights the single key data point; everything else is gray or pale blue. Color carries meaning, never decoration.

---

## Typography

- **Bower** (bespoke serif) for titles, exhibit numbers, big numbers, covers.
- **McKinsey Sans** for body and captions.

**Free substitutes for a solo user:**
- For Bower → **Source Serif Pro** or **Crimson Pro** (PowerPoint fallback: Georgia).
- For McKinsey Sans → **Inter** or **IBM Plex Sans** (PowerPoint fallback: Arial).

Two fonts maximum. Serif for headings, sans for body.

---

## Report layout (MGI house style)

US Letter / A4 portrait; single-column body at 60-70 characters per line; 0.75-1" margins. **Exhibits get their own page or full width** — the chart isn't crammed into a text column. Section dividers are full deep-blue panels with serif titles. Oversized pull quotes (24-36 pt) in deep blue, inset in text. Small page numbers; tiny-caps gray running header with the report title. Density: roughly one exhibit every 4-6 pages, plus a methodology appendix and bibliography.

---

## Data-narrative integration

Strictest possible coupling between text and exhibits:
- **Every exhibit is named in the running text**, formula "(Exhibit N)" at the end of the sentence stating the finding: "…amounts to $6.1 trillion to $7.9 trillion annually (Exhibit 2)."
- The finding is stated in prose first as a complete claim; the chart proves it; the chart's action title *echoes* (doesn't duplicate) the sentence.
- **Every number in prose is traceable** to an exhibit and a source.
- Ranges reported as ranges, both ends, never midpoints.

**Two stand-alone tests:**
- *Exhibits-only:* flip through reading only action titles → full argument reconstructable (horizontal logic).
- *Text-only:* read only the prose → full argument also there; exhibits are evidence, not load-bearing narrative.

This redundancy is intentional — it serves the skimmer, the deep reader, and best of all the reader who does both.

---

## Sourcing for credibility

Source-line order: external sources first (semicolon-separated), then proprietary databases, then "McKinsey analysis" — signaling "public + proprietary + our own work." A single exhibit often cites 4-7 named sources. Methodology appendices (5-15 pp) explain sample, definitions, assumptions. For a solo report, always include a short "About this research" note: what you used, the date range, and the limitations.

---

## Spec-sheet table (for imitation)

| Element | Specification |
|---|---|
| Page size | US Letter (8.5×11") or A4, portrait |
| Margins | 0.75-1" all sides |
| Body grid | Single column, ~6" text block, optional sidebar |
| Body font | McKinsey Sans → **Inter** / Arial, 10-11 pt |
| Heading font | Bower → **Source Serif Pro** / Georgia |
| H1 (chapter) | 32-40 pt serif, deep blue, often own page |
| H2 (section) | 20-24 pt serif, deep blue |
| H3 (subsection) | 14-16 pt sans bold, deep blue |
| Pull quote | 24-32 pt serif italic, deep blue, set in margin |
| Caption / source | 8-9 pt sans italic, gray `#6E7B85` |
| Exhibit action title | 14-18 pt bold, left-aligned |
| Exhibit unit subtitle | 9-10 pt italic gray |
| Primary blue | `#051C2C` |
| Highlight blue | `#2251FF` |
| Neutral gray (data) | `#C0C5C9` |
| Background | White (default) or `#051C2C` (dividers/covers) |
| Chart grid / border | Off |
| Data labels | On, end-of-bar; legend off (direct-label inline) |
| Source line | Bottom of exhibit, "Source:" prefix |

Underneath all of it sits Tufte's principle: maximize the data-ink ratio. Every pixel that isn't data should justify itself or be deleted.
