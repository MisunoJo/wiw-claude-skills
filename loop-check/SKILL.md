---
name: loop-check
description: A final-check gate for any finished or near-finished project — the looping QA pass so you don't have to keep saying "check it again / run agents / cross-check / one more time." Point it at a code change, a plan/design, a built skill, a report, an app feature, or a whole project, and it runs an iterative loop — define a binary "done" gate, fan out INDEPENDENT critic agents (no self-review bias), adversarially verify every finding to kill false positives, then gate: pass → done, out of rounds → ship-best + flag, else → fix and re-check — ending in a bottom-line READY / READY-WITH-FIXES / NOT-READY verdict. Use when the user says "loop-check", "final check", "check this project / build", "is this done / ready to ship", "gate this", "QA this", "run the full check", "ตรวจรอบสุดท้าย", "เช็คให้หน่อยว่าพร้อมยัง", or declares something done and asks if it holds up. Pass `--fix` to auto-apply confirmed fixes and re-loop. SKIP for producing a NEW deliverable (use research-team / mckinsey-report) or a one-pass diff review with no gate/loop (use code-review or scrutinize).
---

# Loop-Check — the final-check gate

This skill automates the loop you otherwise run by hand: *"check it → run agents → cross-check → fix → one more time."* It rests on one principle, proven by the loop-skill research and this project's own QA: **a maker checking its own work is biased to like it.** So every check uses *independent* critic agents, *binary* pass criteria, and an *adversarial verify* step that tries to dismiss each finding — only confirmed issues survive.

It does NOT produce new work (that's `research-team` / `mckinsey-report`). It takes something already made and **gates it to a standard, looping until it passes or a round cap stops it.**

## The loop (Gate first → Check → Verify → Gate → Fix → Verdict)

You already **Produced** the thing. The skill runs the rest (the header above lists the six steps below in order):

1. **Gate first — the keystone.** Write the binary "done = ___" criteria for THIS target *before* checking (e.g. "tests pass · no correctness bug · no needless complexity"). Infer them from the target type (see `references/check-profiles.md`); ask **≤1** question only if the standard is genuinely unclear. A loop with no real gate is just "try again."
2. **Check.** Fan out **independent** critic agents (fresh context = no self-review bias), one per dimension/lens for the target type. Each returns findings with status · evidence · severity. Prompts in `references/lenses.md`.
3. **Verify (adversarial).** Each finding gets ≥1 skeptic prompted to *refute* it against the actual artifact. Plurality/skeptic-wins; **only confirmed issues survive** (this is what caught the false "major" findings in this project's own QA). Right-fit models: `sonnet` for mechanical checks, `opus` for judgment/verify.
4. **Gate.** All criteria pass → **DONE**. Out of rounds (cap, default 3) → **stop, ship-best + flag** what still fails. Otherwise → **Fix**.
5. **Fix** (default OFF — see below). Repair only the *confirmed* issues, touch nothing that passed, then loop back to Check and re-gate. Stop when clean or capped.
6. **Verdict.** Bottom line in plain language (manager-talk discipline): **READY / READY-WITH-FIXES / NOT-READY**, the one-line why, and the few confirmed issues that matter — not a wall of text.

## Default behavior

- **Default:** run Check → Verify → Gate, deliver the **verdict + confirmed-issues list**, then **ASK** before changing anything. The user stays in control.
- **`--fix` (or "and fix it"):** apply confirmed fixes, re-Check, and loop until the gate passes or the round cap hits — then report.
- **Report-only:** if the user says "don't touch files", never offer fixes.

## Adapt to the target (router)

Detect what's being checked, then fire the right lenses + gate. Full table + gate templates in `references/check-profiles.md`.

| Target | Lenses | Binary gate (example) |
|---|---|---|
| code / diff | code-review (correctness) · scrutinize (simpler?) · **debug-mantra** on any bug | tests pass · no real bug · no needless complexity |
| plan / design | **grill-me** (decision-tree gaps) · scrutinize (intent) | no unresolved branch · simplest approach chosen |
| skill / report / app / built artifact | fix-verify · cross-file consistency · scenario-sim · outcome-standard vs an exemplar · fact-check | behaves as specified · meets the standard bar |

Scale the team to the target: a tiny change gets 2–3 inline critics; a whole project gets the full `Workflow` fan-out + adversarial verify. Use `--deep` / "be thorough" to push voters up and add a standards panel.

## How to run it

1. Detect target + write the binary gate (step 1).
2. Open `references/loop-engine.md` — the `Workflow` program that does Check → Verify → Gate (and Fix when `--fix`). Fill the `CRITICS`, `GATE`, and `TARGET` from your framing and run it. It uses the same adversarial-verify *pattern* as `research-team` (implemented independently — finding-level `holds:boolean` here vs research-team's claim-level verdict enum).
3. For a small target, run the critics inline as parallel `Agent` calls instead of a Workflow — same discipline, less overhead.
4. Apply the gate, loop if needed, then deliver the verdict (manager-talk).

## Reference files

- `references/check-profiles.md` — target-type detection, the lenses each fires, and binary gate templates.
- `references/lenses.md` — the critic prompts (scrutinize / code-review / debug-mantra / grill-me / outcome-standard / fact-check) and the manager-talk verdict format. When those skills are installed as siblings (they are, in `~/.claude/skills/`), a critic *may* read `../<skill>/SKILL.md` for depth — treat it as opportunistic, not required. (`code-review` is a plugin command, not a sibling skill, so no `../code-review` path exists — that's expected.)
- `references/loop-engine.md` — the `Workflow` check → verify → gate → fix program (same adversarial-verify *pattern* as `research-team`, implemented independently).
