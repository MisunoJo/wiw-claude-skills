---
name: research-team
description: An on-call multi-agent research team. Give it any topic — with material or without — and it runs a disciplined McKinsey-style process end to end: a router reads what you actually want, a framing lead builds the issue tree (or a Design-Thinking arc), parallel researchers go deep and cite sources, an adversarial fact-check cell tries to REFUTE every load-bearing claim, a multi-lens advisor panel weighs in, then it synthesizes and ships the deliverable (markdown or an interactive HTML report you can click through). Use whenever the user says "research team", "ใช้ทีมวิจัย", "run the team on X", "go deep on X with fact-checking", "build me a feasibility study / learning kit / landscape on X", or hands over a folder of materials and asks "can I do this / is this worth it / help me start this project". The DEFAULT for any deep, fact-checked, multi-source research that should end in a real deliverable. SKIP for a one-line factual answer (just answer), domain-specific content drafting (use the relevant content skill), or a quick single-pass writeup with no fact-check needed (use mckinsey-report).
---

# Research Team — a standing multi-agent research crew, McKinsey-style

This skill is your research department on call. It exists for three recurring needs:

1. **"I don't know this topic well enough."** → the team must *teach*, not just dump findings.
2. **"I want depth."** → it fans out parallel researchers, not one shallow pass.
3. **"Do the research the way I want — but fact-check it."** → a router reads the user's real intent, and an adversarial fact-check cell is a non-negotiable gate on what survives into the deliverable.

It reuses the rigor and house style of the `mckinsey-report` skill (don't reinvent them — point at its reference files), and drives them with a multi-agent `Workflow` engine modeled on the `deep-research` pattern: parallel fan-out, schema-coerced fan-in, 2-voter adversarial fact-check, advisor panel, synthesis.

**The whole skill rests on one move: the router scales the team to the ask.** A "teach me X" request gets a small team and Design-Thinking framing. A "can I make money doing X" request gets the full fan-out + fact-check + advisor panel + a GO/NO-GO verdict. Never run a 44-agent workflow when the ask needs four agents — and never run a single shallow pass when the user is about to bet real money on the answer.

## How the team works (the 9 components)

The team is nine roles. They are not nine agent *types* — every worker is a `general-purpose` agent; the role is the prompt. The router decides which roles fire and how many.

1. **Engagement Router (intake — "understand me").** The front door. Read the request and scan for material (a named folder, pasted refs, screenshots). Classify five things: **has-material?** · **intent** (learning-kit / feasibility-decision / landscape-scan / how-to-build) · **audience** (see below) · **output** (markdown vs interactive HTML) · **language** (the user's primary language / EN). Then pick a **profile** (see `references/workflow-profiles.md`). Ask **at most 2 sharp scoping questions** via AskUserQuestion *only* when a wrong guess would waste the whole run (e.g. "serious bet or quick test?", "which option should I lean toward?"); otherwise state the scope in one line and proceed — the user prefers a real recommendation over hedging.

   **Audience = the user, by default — but keep it light.** A report needs a reader, and unless told otherwise the reader is the user themselves (researching to learn and decide, not to publish). Two things only: **who they are** and **why they want this research**. Don't over-fit. The user's operator profile in their **`~/.claude/CLAUDE.md`** (usually already in context) is enough for "who" — their role, expertise level, how they like answers, and their primary language. The "why" comes from the request itself (the three drivers: doesn't know the topic / wants depth / wants it fact-checked). Use this to set the right *level* (don't over-explain basics they know, don't assume expertise they lack) and language — **not** to bend every finding toward their existing projects. Only dig into per-project memory or a session log if the topic is clearly tied to one of their projects and that history actually changes the answer; otherwise skip it. **Re-target only if they say it's for someone else** ("for my clients / readers / a public post / my team") — then ask who they are and write for them. State the chosen audience in the one-line scope.

2. **Framing Lead.** Turn the ask into the plan that drives fan-out. Default to the McKinsey path — SMART question → Day-One Answer → MECE issue/hypothesis tree → 80/20 prune (see `..\mckinsey-report\references\frameworks.md`). For learning-kit / product / UX asks, frame with **Design Thinking** instead (see `references/design-thinking.md`). The tree's surviving branches become the research streams.

3. **Material Ingestor** (only when material exists). Read the folder/refs FIRST, before any web search. Extract what's already known as Tier-0 evidence and seed the `claims_to_verify` pool — the loud claims in the material are exactly what the fact-check cell must attack (e.g. decode the case-study claims a source repeats and test them).

4. **Research Associates (parallel fan-out).** One agent per surviving branch. Each hunts evidence in materials + web, cites real URLs, and returns structured findings plus 2–3 `claims_to_verify`. Count scales by profile (2–4 light → 5–7 full). Source-tiering and the finding schema live in `references/team-roster.md`.

5. **Fact-Check Cell (adversarial — the honesty gate).** For each load-bearing claim, spawn **2–3 independent skeptic voters** prompted to *try HARD to refute it, default to skepticism*. Plurality vote. Refuted/partial claims surface **corrected**, never silently asserted; unverifiable claims are flagged ("ยังพิสูจน์ไม่ได้ — unverified"). This is the non-negotiable honesty component; it is light-or-skipped only for pure learning kits where there are no empirical claims to test.

6. **Advisor Panel (multi-lens).** Distinct expert lenses each give a short verdict + the one thing they'd worry about most. Lenses adapt to the topic (strategist / skeptical CFO / on-the-ground practitioner / domain or automation engineer). They surface as a panel in the deliverable so the reader sees where experts agree and disagree.

7. **Synthesizer. The output arc switches by profile.** For decision / landscape / how-to-build, reconcile findings + fact-check verdicts + advisor verdicts into the Minto pyramid (Governing Thought → Key Line → support; see `..\mckinsey-report\references\writing-architecture.md`), update the Day-One Answer — **the gap between the guess and the final answer is where the insight lives** — and respect the fact-check (assert nothing refuted). For the **learning-kit** profile, the synthesizer instead produces a **teaching arc** (mental model → structure → *mandatory* worked example → traps → do-this-next), using `TEACH_SCHEMA` and reading `references/design-thinking.md` — a teaching kit, not a verdict. The engine selects the schema from `PROFILE_NAME` automatically.

8. **Report Builder / Designer.** Render the deliverable. Markdown artifact by default; **self-contained interactive HTML** (verdict banner, tabbed sections, live calculator, inline charts, McKinsey 2×2) when it's a decision/feasibility ask or the user asks for HTML — see `references/html-report-spec.md`. Apply the house style in `..\mckinsey-report\references\style-patterns.md` and `..\mckinsey-report\references\design-spec.md`.

9. **QC / Red-team Editor.** Before shipping, run the 12-point smell test in `..\mckinsey-report\references\checklists.md`. The three to never skip: read only the action titles in order (do they tell the story?), trace three random numbers to a source, and confirm the exec summary ends with what to actually do.

## The flow

```
Router → Framing Lead → [Material Ingestor] → Research Associates (parallel)
       → Fact-Check Cell (parallel) → Advisor Panel (parallel) → Synthesizer → Builder → QC
```

Steps 4–6 are the multi-agent engine — run them as ONE `Workflow` program, pipelined, schema-coerced. Steps 1–3 you do yourself in the main loop (read material, ask scoping questions, build the tree) before launching the engine; steps 8–9 you do in the main loop after it returns.

## How to launch the engine

The fan-out runs through the **`Workflow` tool** — a single self-contained JS program that fans out `agent()` calls. Invoking this skill IS the user opt-in that Workflow requires.

1. Do steps 1–3 inline (route, frame the tree, ingest any material).
2. Open `references/workflow-template.md`. It holds the canonical program: the `meta` block, the schemas (`FINDING_SCHEMA`, `VERDICT_SCHEMA`, `ADVISOR_SCHEMA`, `SYNTH_SCHEMA`, and `TEACH_SCHEMA` for the learning-kit arc), and the `STREAMS` / `CANON` / `ADVISORS` tables.
3. Fill those three tables from your framing (one `STREAMS` entry per surviving branch, `CANON` = the must-test claims from the material/topic, `ADVISORS` = the lenses that fit). Set the profile knobs (researcher count, voters-per-claim, advisor count, fact-check on/off) AND the per-role `MODEL` map from `references/workflow-profiles.md`. **Right-fit each agent's model** — `sonnet` is the workhorse for the high-volume researchers and fact-checkers; `opus` for the few high-stakes calls (advisors and the synthesizer); `haiku` only for cheap lookup-style runs. Don't run everything on the top tier (wasteful) or everything cheap (misses nuance where it counts).
4. Run it. For a big feasibility job, run it in the background and build the report when it returns. For a small learning kit, run it inline.
5. Build the deliverable from the returned JSON (step 8), then QC (step 9).

If `Workflow` is unavailable in the session, degrade gracefully: run the same phases with parallel `Agent` (Task) calls — research associates in one batch, fact-checkers in the next — and adjudicate in the main loop. Slower, same discipline.

## Output format

Default to a **Markdown artifact**. Switch to **interactive HTML** for feasibility/decision deliverables or on request (spec in `references/html-report-spec.md`). For feasibility runs, also write a `research-notes.md` beside it with every source + raw finding, so any number traces back. Use the reader's primary language; keep English technical terms. Always end with the "About this research" methodology note (sources, the fact-check verdicts, limitations) — that note is the credibility signal that separates a report from an essay.

## Reference files (load the one you need, don't dump them all)

This skill's own:
- `references/workflow-profiles.md` — the 4 profiles, their exact team knobs, and the routing decision rules.
- `references/team-roster.md` — each role's charter + its agent prompt template (incl. the verbatim adversarial fact-checker prompt, the advisor lenses, source tiers, the finding schema).
- `references/workflow-template.md` — the canonical `Workflow` JS engine to fill in and run.
- `references/design-thinking.md` — the Design-Thinking method (the one method mckinsey-report lacks) + how a learning kit maps onto it.
- `references/html-report-spec.md` — the interactive-HTML deliverable spec.

Borrowed from `mckinsey-report` (full path `..\mckinsey-report\references\`), do not duplicate:
- `frameworks.md` — problem definition, MECE, issue/hypothesis trees, 80/20 pruning, the 7-step process.
- `writing-architecture.md` — Minto pyramid, SCQA, governing thought / key line, action titles.
- `style-patterns.md` — the McKinsey voice, finding-sentence formula, number rules, titling.
- `design-spec.md` — exhibit anatomy, chart-type guide, color/typography, layout.
- `checklists.md` — the 12-point pre-publish smell test.
