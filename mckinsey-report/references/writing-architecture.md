# Writing architecture — Pyramid Principle, applied

Load this in Phase 3 (Synthesize) and Phase 4 (Write), or whenever Wiw asks to structure a document, write an executive summary, or fix titles.

## Contents
- The pyramid: governing thought, key line, support
- SCQA — the introduction engine (+ variations)
- Governing thought & key line — tests before you build
- Inductive vs deductive grouping
- Executive summary construction
- Action titles — the single most important convention
- Answer-first communication
- Horizontal & vertical logic

---

## The pyramid

Minto's core rule: **ideas at any level must be a summary of the ideas grouped below them.** The mind sorts information into pyramids to comprehend it, so write that way deliberately.

Three layers:
- **Governing Thought** — one sentence answering the reader's single most important question.
- **Key Line** — the supporting arguments, usually three (the Rule of Three).
- **Support** — data, exhibits, quotes, findings.

Each Key Line point is itself the apex of a sub-pyramid, recursively, down to raw evidence.

```
                GOVERNING THOUGHT
   "Acquire Company X for $15M; it generates $4M
    annual savings within 18 months"
                       │
        ┌──────────────┼──────────────┐
       KEY 1          KEY 2          KEY 3
   "Eliminates     "X owns tech    "Deal economics
    our largest    we'd need 2     favorable at
    cost center"   yrs to build"   this price"
       │              │              │
   evidence       evidence        evidence
```

**Vertical relationship** = a Q&A dialogue: each parent raises a question ("Why?" "How?") the children answer. **Horizontal relationship** = logical grouping: siblings either inductively support, or deductively chain into, the parent.

---

## SCQA — the introduction engine

Opens documents and frames executive summaries.

- **Situation** — a factual statement the reader already accepts (non-contentious).
- **Complication** — the change, threat, or opportunity that destabilizes it.
- **Question** — what the complication forces (often left implicit).
- **Answer** — your Governing Thought.

**Worked example (Dell):** "For two decades Dell led computer systems with a configurable, direct-to-consumer model [S]. While Dell focused on tailored solutions, Asian manufacturers emerged with far lower-cost alternatives, eroding margins below 5% [C]. How can Dell regain advantage [Q]? Dell should double down on services, ceding lowest-cost hardware to Asian manufacturers [A]."

**Variations:**
- **SCR** (Situation–Complication–Resolution) — collapses Q and A; the standard for decks where the question is obvious.
- **SCQAH** — adds H = How (implementation).
- Reorderings by urgency: *direct* (S→C→Q→A), *indirect* (S→C→A), *concerned* (C→S→A), *aggressive* (Q→S→C→A — open with the question when you need to grab attention fast).

---

## Governing thought & key line — test before you build

**Governing Thought** is not a topic announcement; it's a defensible, action-oriented claim summarizing everything beneath. Tests:
- Complete subject-verb-object sentence?
- Passes the **Elevator Test** — could you say it in 30 seconds with no supporting facts?
- Could a reasonable person disagree? (If not, it's not a thesis.)
- Answers one of Minto's four canonical reader-questions: *what should we do? / how do we implement it? / should we do it this way? / why did it happen?*

**Key Line** — the row of (usually three) sub-statements that fully support it. **Substitution test:** replace the Governing Thought with the conjunction of the Key Line points — does it logically hold?

Avoid "intellectually blank" statements — *"He did it for three reasons"* or *"There are several problems with the system"* promise structure but state nothing. Replace with the *specific* content: *"He did it because they share the same incentives."*

---

## Inductive vs deductive grouping

**Deductive** (chained by "therefore"): "Our largest customers are migrating to subscription pricing. We lack a subscription billing platform. Therefore we must build or buy one within 12 months."

**Inductive** (a group of similar ideas summarized by what they share): "X owns proprietary tech. X has the customer base we lack. X is undervalued. → Acquiring X is attractive on technology, market, and price."

Minto's rule: deductive is fine at the paragraph level, but **inductive is easier to absorb at higher levels** and is more resilient — if one branch is debunked, the others still hold. Deductive forces the reader to carry each step in working memory.

**Default: inductive at the Governing Thought and Key Line levels; deductive only for sub-arguments where the conclusion would otherwise feel like it came from nowhere.**

MECE applies to the grouping: children must not overlap and must cover the parent. "Increase profit" → "grow revenue / cut costs" (MECE). Adding "acquire competitors" breaks ME; dropping the revenue side breaks CE.

---

## Executive summary construction

The exec summary *is* the report, compressed.

- **Position:** first content after the title (McKinsey calls it "At a Glance" / "In Brief").
- **Length:** ~300 words, one page; roughly 2-5% of the report.
- **Structure:** SCR, with the **Resolution taking 60-70%** of the space.
- **Format:** bold-bullet — bold sentences are claims, indented bullets are evidence.
- **Coherence test:** read only the bold lines in sequence — they must tell a complete story.
- **"If they only read this..." test:** does the reader come away knowing what you recommend, why, and what to do next? It must end with explicit recommended actions.

---

## Action titles — the single most important convention

The title is the *finding*; the body is the *proof*.

- **Descriptive (bad):** "Revenue by Region." A label.
- **Action (good):** "North America drives 65% of revenue growth, while EMEA stagnates." A finding.

**Rules:** complete sentence (subject + verb + object); passes the so-what test (point at it and ask "so what?" — if there's no further insight, rewrite); specific not generic; quantified where possible; active voice, action verb; ≤ two lines / ~15 words; falsifiable (a reader could disagree).

**The horizontal-logic test:** strip everything but the titles, read them in order. They must read as a coherent persuasive essay. If they don't, fix structure before formatting.

**Before / after:**

| Bad (descriptive) | Good (action) |
|---|---|
| Revenue by Region | North America drives 65% of revenue growth, while EMEA stagnates |
| Customer Survey Results | Customer interviews reveal onboarding takes 3× longer than competitors |
| Cost-Reduction Levers | 8 high-impact cost levers identified, worth $42M annually |
| Background on the Industry | Industry consolidation accelerated 3× post-2022, leaving 4 dominant players |

**Sentence templates:**
- *Diagnostic:* "[Metric] [moved] [magnitude] over [period], driven by [cause]."
- *Comparative:* "[A] outperforms [B] by [magnitude] on [criterion]."
- *Causal:* "[Outcome] is constrained by [root cause], not [common assumption]."
- *Recommendation:* "[Actor] should [verb] [object] to [outcome] within [timeframe]."
- *Implication:* "If [trend] continues, [consequence] by [date], requiring [action]."

---

## Answer-first communication

Minto's central inversion: **"You think from the bottom up, but you present from the top down."** Gather data → analyze → conclude; then deliver in reverse: conclusion → arguments → evidence. Same logic as a journalist's inverted pyramid — lede first, detail after. Executives have minutes; leading with the answer lets them decide whether to keep reading, and a non-obvious answer raises their question and pulls them into the support.

---

## Horizontal & vertical logic

- **Vertical (parent-child):** each level summarizes the one below. Test by asking "Why?"/"How?" going down and "So what?" going up.
- **Horizontal (sibling-sibling):** ideas in a grouping form a logical sequence — inductive (joined by a plural noun) or deductive (chained by "therefore"). If you can't name the plural noun tying the siblings, the grouping is mixed — fix it.

Standard report arc options: *Context → Key insight → Implications → Recommendations*; *Current state → Root causes → Options → Recommendation → Roadmap*; *Where we are → Where we need to be → The gap → How to close it.*
