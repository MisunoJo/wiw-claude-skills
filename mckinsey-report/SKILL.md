---
name: mckinsey-report
description: Research a topic and write a McKinsey-style report end to end — from framing the problem through to a finished, data-rich, well-designed deliverable. Use this whenever Wiw wants to LEARN about or INVESTIGATE a topic deeply and get back a structured report rather than a quick answer: "research X for me", "I want a report on X", "go deep on X", "help me understand the mega-trends in X", "build me a briefing on X", "do a proper writeup on X", "how do I build X" where the answer needs evidence and structure. Also trigger when he wants to improve the rigor or look of something he's drafting (issue tree, executive summary, exhibits, action titles). This is the DEFAULT for any self-education research task that should end in a document. SKIP for shop marketing content (use aood), marketing strategy diagnosis (use marketing-playbook), or a one-line factual answer that needs no structure.
---

# McKinsey-Style Research & Report

This skill turns a learning question into a finished report the way McKinsey does it. The whole method rests on one inversion: **think bottom-up, present top-down.** You commit to a tentative answer on day one, structure the problem so it has no overlaps and no gaps, prove every claim with a specific number and a single-message chart, and build the document so a busy reader gets the full argument from the section titles alone.

This is NOT a "write in a fancy consulting voice" skill. The voice is a side effect. The substance is the discipline underneath: define the real question, decompose it cleanly, kill the branches that don't matter, prove what's left, and lead with the answer at every level.

## When you're invoked, figure out where Wiw is

Most of the time he wants the **full run**: a topic → a finished report. Sometimes he only wants one piece (fix my issue tree, rewrite these titles, design this exhibit, critique my draft). Read the request and either run the whole workflow below or jump to the relevant step. Don't run a 40-hour process when he asked you to sharpen three titles.

If the topic is genuinely ambiguous (could go in wildly different directions and the direction changes everything), ask **one** sharp scoping question first. Otherwise pick a sensible default scope, state it in one line, and proceed — Wiw prefers a real recommendation over hedging.

## The non-negotiable mental model (read this every time)

Five ideas do almost all the work. Internalize them before touching the workflow.

1. **Day-One Answer.** Before researching, write down your best guess at the answer in 2-3 sentences. A good hypothesis is testable, debatable, and points at an action. Apply the reversibility test: *if the opposite were true, would Wiw actually do anything differently?* If no, the hypothesis is trivial — sharpen it. You then spend the research trying to prove yourself wrong. Killed hypotheses are wins; they prune the work.

2. **MECE** (Mutually Exclusive, Collectively Exhaustive). Every time you split something into parts — an issue tree, a list of reasons, the sections of the report — the parts must not overlap (ME) and must together cover the whole (CE). "Grow revenue / cut costs" is MECE. "Grow revenue / acquire competitors / cut costs" is not (acquiring is a way of growing). The fastest test: can you name the single plural noun that ties the siblings together ("three *drivers*", "four *risks*")? If the siblings are different *kinds* of thing, the split is broken.

3. **Issue tree / hypothesis tree.** Decompose the question into 3-5 MECE branches, each into ~3 sub-branches, 2-3 levels deep, until every leaf is something a specific piece of evidence can answer. Prefer hypothesis trees (each node is a claim that must be true) over pure issue trees (each node is an open question) — they focus the work.

4. **The "so what?" test.** Every finding must point at an implication. A fact with no "therefore" doesn't earn its place. Synthesize, don't summarize. When you state a finding, finish the thought: *...which means Wiw should...* / *...so the constraint is actually...*.

5. **Answer first / lead with the takeaway.** At every level — the report, the executive summary, each section, each chart title — state the conclusion before the support. The reader should know your answer in the first 100 words and be able to reconstruct the whole argument by reading only the section titles.

## The workflow

Adjust depth to the task — Conn & McLean call the 7-step process "an accordion": compress it when the topic is familiar, expand it when it's novel. For a typical self-education report, budget the phases roughly as marked.

### Phase 1 — Frame (do this before any searching)

**Define the real question.** Write it as one SMART question: Specific, Measurable, Action-oriented, Relevant, Time-bound. The killer test: *if we answered this, would the decision-maker act differently?* If no, you're solving the wrong problem — go up a level. Weak: "How do I build a team of AI agents?" Strong: "What is the minimum-viable agent architecture that lets me, solo, produce a 20-page strategy report on an unfamiliar topic in under 8 hours of my own time and under $50 of compute?"

**Write the Day-One Answer.** 2-3 sentences, before research. This is your hypothesis to attack.

**Build the issue/hypothesis tree.** 3-5 MECE level-1 branches, ~3 sub-branches each. Test every pair for overlap; brainstorm "what's missing?" for gaps. Each leaf should become a specific thing to go find out.

**Prune 80/20.** Rate each branch on *decision-relevance × can-I-actually-find-this-out*. Kill 30-50% of branches. Don't boil the ocean. For any analysis you're tempted to do, "dummy the chart" first: sketch the chart with fake numbers and ask whether the real version would change the answer. If not, skip it.

Use `references/frameworks.md` for the full problem-definition worksheet, tree-construction rules, worked tree examples, and pruning detail.

### Phase 2 — Research (the bulk of the time)

Work through the surviving branches, hunting evidence to confirm or refute each sub-hypothesis. Tier your sources and capture findings atomically (one finding per note: source, branch, the finding, the number/quote, the implication, a confidence rating). See `references/research-workflow.md` for the full source-tier list (primary consulting research, academic, industry data, expert-substitute podcasts/interviews, AI accelerators), note-taking schema, and time-boxes.

Always verify AI-surfaced facts in the original source. Use Claude/search as a junior associate for triage and synthesis, never as the source of record.

### Phase 3 — Synthesize

**Update the answer.** Mark each sub-hypothesis Supported / Refuted / Refined. Rewrite the Day-One Answer in light of what you found. **The gap between your day-one guess and your final answer is where the insight lives** — that delta is often the most valuable thing in the report.

**Build the pyramid.** Governing Thought (one sentence answering the key question) → Key Line (usually three supporting arguments — the Rule of Three) → support (the evidence). Apply the substitution test: if you replace the Governing Thought with the three Key Line points combined, does the logic hold? Default to *inductive* grouping at the top (three arguments that share a theme); reserve *deductive* chains (X, therefore Y, therefore Z) for sub-arguments.

**Draft the storyline as a ghost outline.** List 10-20 section/exhibit slots, each carrying only an **action title** — a full-sentence finding, not a topic label. Then read the titles in sequence with nothing else. If they tell a coherent, persuasive story start to finish, the structure is sound. If they don't, fix the structure now, before writing a word of body text.

See `references/writing-architecture.md` for the Pyramid Principle in depth, SCQA openings, inductive-vs-deductive rules, executive-summary construction, and the action-title rules with before/after examples.

### Phase 4 — Write & design

**Executive summary first.** One page, ~300 words, SCQA structure (Situation → Complication → Question → Answer), bold-bullet format (bold lines are claims, indented bullets are evidence). Resolution gets 60-70% of the space. Test: reading only the bold lines must tell the whole story, and the summary must end with explicit recommended actions.

**Write the body to the exhibits, not before them.** Per section: action-title claim → 1-3 sentence "so what" → reference the exhibit → 2-3 sentences of evidence → transition. Every exhibit gets named in the prose (e.g., "...worth $42M annually (Exhibit 3)").

**One message per chart, one chart per message.** Match the chart form to what you're comparing (composition → stacked bar; ranking → bar; over time → line/column; correlation → scatter; explaining a delta → waterfall). Put an action title on every chart. Highlight the one data point that proves the title; mute everything else.

**Apply the house style.** First-person plural ("we find"), confident on direction but precise on magnitude (use ranges, not false-precision point estimates, for any forecast), every big number anchored to a comparator, hype adjectives cut. Two fonts, a tight blue-forward palette, lots of white space.

`references/style-patterns.md` has the reverse-engineered voice (opening moves, finding-sentence formulas, hedging vocabulary, titling conventions, anti-style tells). `references/design-spec.md` has the exhibit anatomy, chart-type guide, color/typography spec sheet, and the full report layout table. Read both before the design pass.

### Phase 5 — Quality check

Run the 12-point smell test in `references/checklists.md`. Any "no" sends you back to the step that fixes it. Three quick ones to never skip: (1) read only the action titles in order — do they tell the full story? (2) pick three numbers at random — can you trace each to a source? (3) does the exec summary end with what to actually do?

## Output format

Default to a **Markdown artifact** for the report unless Wiw asks for a Word doc or PDF (then use the docx / pdf skills). For charts inside an artifact, build them properly (a React/HTML artifact with real chart components, or generate image exhibits) rather than describing them. Keep the structure: title with colon-subtitle → executive summary → body sections with action-title headings → recommendations → a short "About this research" note listing sources and limitations. That methodology note is not optional — it's the credibility signal that separates a report from an essay.

## Reference files

Load the one you need for the phase you're in; don't dump them all into context at once.

- `references/frameworks.md` — Problem definition worksheet, MECE detail, issue/hypothesis tree rules + worked examples, 80/20 pruning, the 7-step process, the six problem-solving mindsets, ghost decks.
- `references/writing-architecture.md` — Minto Pyramid Principle, SCQA + variations, governing thought / key line tests, inductive vs deductive, executive summaries, action titles with before/after and sentence templates, horizontal/vertical logic.
- `references/style-patterns.md` — How real McKinsey reports open, standard report architecture, finding-sentence formula, number rules, hedging vocabulary, the confident-verb cluster, titling conventions + templates, the anti-style tells to avoid.
- `references/design-spec.md` — Exhibit anatomy, action titles on charts, one-message rule, chart-type conventions, color palette (with hex), typography (with free font substitutes), MGI report layout, sourcing conventions, the full spec-sheet table.
- `references/checklists.md` — The 12-point pre-publish smell test, common pitfalls with their fixes, and the prioritized reading list for going deeper.
