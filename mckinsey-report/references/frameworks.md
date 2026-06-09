# Frameworks — the research & problem-solving mindset

Load this in Phase 1 (Frame) and whenever Wiw asks to build or fix an issue tree, sharpen a problem statement, or pressure-test a hypothesis.

## Contents
- Hypothesis-driven problem solving (the Day-One Answer)
- MECE in depth
- Issue trees vs hypothesis trees + worked examples
- The "so what?" test and the question behind the question
- 80/20 and "dummy the chart"
- The 7-element problem-definition worksheet
- The 7-step process
- Six problem-solving mindsets + the obligation to dissent
- Ghost decks

---

## Hypothesis-driven problem solving (the Day-One Answer)

The defining McKinsey move: articulate a tentative answer as soon as you understand the problem — the "Day-1" or "Week-1" answer — *before* assembling all the data. Then spend the project trying to prove it wrong. A "blank slate" (refusing to commit until research is done) is the enemy: it produces aimless, boil-the-ocean research with no spine.

A good hypothesis is **testable, debatable, reversible, action-pointing, and non-obvious.**

**Reversibility test:** if the opposite of your hypothesis were true, would the decision-maker do anything differently? If no, it's trivial.

Weak Day-One answer: "AI agent teams will be useful."
Strong: "A 4-agent team (Scoper, Researcher, Synthesizer, Critic) coordinated through a shared outline artifact will beat a single generalist agent on blind quality and on operator-time by ≥3×." — falsifiable, points at an action, would change the decision if disproved.

The workflow inverts the academic instinct. Data-first assembles everything and hunts for patterns. McKinsey guesses first, then *purposefully* seeks data to confirm or refute. The cycle: hypothesize → seek confirming/refuting data → the "so what" reveals which branches are dead ends → fold back into the tree → adjust → repeat.

---

## MECE in depth

**Mutually Exclusive, Collectively Exhaustive** (pronounced "MEE-see"). Coined by Barbara Minto at McKinsey in the late 1960s. No overlap; no gaps.

**Good:** Profit = Revenue − Cost. Population by age band (0-17, 18-34, 35-54, 55+).
**Bad:** Customers split "young / employed / urban" (overlap *and* gaps). People by nationality (dual citizens overlap; stateless people are a gap).

MECE applies everywhere structure appears: tree branches, slide bullets, executive-summary segments, the children of every node in the Minto pyramid.

**Failure modes to watch for:**
- Mixing *kinds* of idea at one level (functions + time periods + geographies jammed into one split).
- "Buckets of mush" — a catch-all "Other" that hides thinking you haven't done.
- Optimizing for MECE elegance over insight. Minto's own warning: a tidy structure that says nothing is worse than a slightly messy one that reveals something. Insight first, then tidy it.

**Fast check:** name the single plural noun tying the siblings ("three *drivers*," "four *risks*," "five *steps*"). If you can't, the grouping is mixed.

---

## Issue trees vs hypothesis trees

Three related forms:
- **Issue tree** — each node is an open question ("why?" / "how?"). Surfaces all possible causes. Good when you don't yet have a point of view.
- **Hypothesis tree** — each node is a *claim* that must be true for the parent to hold. More focused; McKinsey's default once you have a Day-One Answer.
- **Decision tree** — models choices with probabilities and payoffs. Use for explicit go/no-go decisions under uncertainty.

**Four rules for any tree:** (1) nodes consistently answer "why?" or "how?"; (2) it reads left-to-right from key question to specific analyses; (3) branches at each level are MECE; (4) it's revised as data arrives.

**Construction (recursive):** SMART problem at the root → pick a decomposition logic (a math identity like Profit=Rev−Cost; a process/sequence; a segmentation; or a stakeholder map) → generate 2-4 MECE branches → recurse 2-3 levels until each leaf is answerable by one specific analysis or data point → prune via 80/20.

### Worked example — "Should I build a team of AI agents?"

```
Should I build a team of AI agents to produce McKinsey-style reports?
├── Will it produce better outputs than a single agent? (Quality)
│   ├── Decomposition gains — does parallel sub-task work cut errors?
│   ├── Specialization gains — do role-specific prompts beat a generalist?
│   └── Critique gains — does a dissenter/critic agent catch mistakes?
├── Will it be faster / cheaper? (Efficiency)
│   ├── Wall-clock latency
│   ├── Token cost
│   └── Operator time (orchestration overhead)
└── Can I actually operate it? (Operability)
    ├── Tooling (frameworks, memory)
    ├── Coordination / handoff protocol
    └── Evaluation — how will I know it's working?
```

Each leaf becomes a hypothesis and a workplan item.

### Worked example — a hypothesis tree for a recommendation

```
GOVERNING THOUGHT: "Acquire Company X for $15M; it yields $4M/yr savings within 18 months"
├── "Acquisition eliminates our largest cost center"   (must prove)
├── "X owns tech we'd otherwise need 2 years to build" (must prove)
└── "Deal economics are favorable at this price"       (must prove)
```
Each branch must be *true* for the recommendation to stand. Research targets exactly those three.

---

## The "so what?" test and the question behind the question

**"So what?"** — McKinsey partners are famous for asking it over every slide. Every finding must point at an implication. Synthesize, don't summarize.

**Define the real problem before scoping.** Your problem statement constrains the whole solution space, so getting it right is the highest-leverage step. Phrase it as a **SMART** question (Specific, Measurable, Action-oriented, Relevant, Time-bound).

Weak: "How do I build a team of AI agents?"
Strong: "What's the minimum-viable architecture (number of agents, roles, coordination protocol) that lets me, solo, produce a 20-page McKinsey-style report on an unfamiliar topic in under 8 hours of my time and under $50 of compute, by Q3 2026?"

**The question behind the question:** target the highest level at which you can usefully work. Killer test: *"If we solved this, would the decision-maker actually act differently?"* If no, redefine upward.

---

## 80/20 and "dummy the chart"

The 80/20 rule governs prioritization at every stage — 20% of the analysis delivers 80% of the answer. Summary statistics before regressions; rules of thumb before models. Rasiel: don't try to analyze everything, "otherwise we will spend a lot of time and effort for very little return, like boiling the ocean to get a handful of salt."

**Dummy the chart:** before running any analysis, sketch the chart it would produce — with fake numbers. If the imagined chart wouldn't change a decision, don't do the analysis. This sharpens thinking and kills wasted work before it starts.

---

## The 7-element problem-definition worksheet

Fill this on one page before researching (Conn & McLean):

1. **Key question** — the SMART question.
2. **Perspective / context** — situation, who's affected, relevant constraints of the domain.
3. **Success criteria** — what a good answer delivers, quantitative and qualitative.
4. **Scope** — what's in, what's out; time frame; boundaries.
5. **Constraints** — budget, time, legal, brand, ethics; for Wiw: solo-executable, parents have operational authority where the shop's involved.
6. **Stakeholders** — who decides, who can help, who can block.
7. **Key sources of insight** — what you already know; who/what to consult.

(*A faster cousin is TOSCA — Trouble, Owner, Success criteria, Constraints, Actors — which maps almost 1:1.*)

---

## The 7-step process

1. **Define** the problem (worksheet above).
2. **Disaggregate** into issue/hypothesis trees, MECE; try several different cuts.
3. **Prioritize** with impact × ability-to-influence; prune ruthlessly.
4. **Plan the workplan** — per leaf: analyses, dummy chart, sources, deadline.
5. **Analyze** — summary stats first, escalate only when justified.
6. **Synthesize** — pyramid: governing thought → MECE arguments → evidence; state the "so what."
7. **Communicate** — action titles, ghost-deck storyline, lead with the answer.

Treat it like an accordion: compress for familiar problems, expand for novel ones.

---

## Six problem-solving mindsets (Conn & McLean)

1. **Ever-curious** — put a question mark behind your initial answer.
2. **Tolerate ambiguity** — stay humble; don't force false certainty.
3. **Dragonfly-eye view** — look through multiple lenses / framings.
4. **Occurrent behavior** — run small experiments to generate your own data.
5. **Collective intelligence** — pull in other minds (for a solo operator: diverse sources, an explicit critic step, or a critic agent).
6. **Show and tell** — represent the problem so the solution becomes transparent.

**Obligation to dissent** (Marvin Bower's cultural rule): the most junior person can challenge the most senior. Solo translation: always assign a critic — a step, a pass, or an agent — whose only job is to attack the working answer.

---

## Ghost decks

A ghost deck is a ~20%-complete outline built *before* the research is done: every slot has a placeholder **action title** (a full-sentence claim) but a mostly-blank body. It answers four questions early and cheaply: do we want to change the storyline? what content is required? what do we already have? what's missing?

It works because expressing every hypothesis as a declarative title — before any data exists — exposes logic gaps immediately and makes the storyline negotiable while it's still cheap to change. For a report, the equivalent is a list of section/exhibit titles you can read top-to-bottom as a story before writing any body text.
