# Check profiles — target detection, lenses, and gates

The router reads what's being checked, picks the lenses, and writes the binary gate. Scale the critic count to the
target: tiny change → 2–3 inline critics; whole project → full Workflow fan-out + adversarial verify.

## How to detect the target
Read the request + what's on disk / in the diff:
- A diff, changed files, "this PR", a function → **code / diff**
- A plan file, a design doc, "should I build it this way", an approach → **plan / design**
- A built skill, a report/HTML, an app feature, "the project I just finished" → **artifact / project**
- Mixed (a project = code + plan + docs) → run the artifact profile and add the code/plan lenses for its parts.

If the target type is genuinely ambiguous, ask **one** question. Otherwise state it in one line and proceed.

## Writing the gate (the keystone — do this FIRST)
The gate is a short list of **binary, stranger-checkable** pass criteria. Bad: "is it good?". Good: "every test
passes · no incorrect output on the 3 edge cases · no dead code · the README example runs." If the user stated success
criteria, use them. If not, infer from the type using the templates below and show them in one line so he can veto.
Rule of thumb: if a criterion can't be answered yes/no by someone who didn't build the thing, sharpen it.

## Profiles

### code / diff
- **Lenses:** code-review (correctness bugs), scrutinize (is there a simpler/more elegant path; does it do what it
  claims — trace the real code path, not just the diff), debug-mantra (the moment a real bug is found: reproduce →
  trace the fail path → falsify the hypothesis → cross-reference, before proposing the fix).
- **Gate template:** tests/build pass · no correctness or data-loss bug · no needless complexity vs the simplest
  approach · edge cases handled · no secret/footgun introduced.
- **Models:** code-review + consistency `sonnet`; the verify + "is it simpler" judgment `opus`.

### plan / design
- **Lenses:** grill-me (interrogate the decision tree — every branch resolved, every assumption named), scrutinize
  (question intent: is this even the right problem; is there a simpler way to the same goal).
- **Gate template:** the real problem is named · no unresolved decision branch · the simplest approach that meets
  the goal is chosen · key assumptions are explicit, not hidden · success is measurable.
- **Models:** `opus` (this is judgment-heavy, low-volume).

### artifact / project (skill, report, HTML, app feature)
- **Lenses (this is the loop this project's own QA ran):**
  - **fix-verify** — every claimed change/feature is actually present and correct (regression check).
  - **cross-file consistency** — no internal contradiction; all refs/paths resolve.
  - **scenario-sim** — role-play the artifact on its real use-cases; does behavior match the spec (not just the
    routing/structure)?
  - **outcome-standard** — compare against an exemplar/standard bar; would real output hit it?
  - **fact-check** — verify the factual claims the artifact makes (numbers, paths, that named things exist).
- **Gate template:** behaves as specified on its core use-cases · no internal contradiction · all paths/refs resolve
  · factual claims hold · output reaches the agreed standard bar.
- **Models:** fix-verify / consistency / fact-check `sonnet`; scenario-sim + outcome-standard + all verify `opus`.

## The round cap (so it can't spin)
Default **3 rounds**. Stop early when: the gate fully passes, OR two consecutive rounds are **dry** — define dry
reproducibly: key each confirmed issue by `criterion + first 40 chars of evidence`, and a round is dry if it adds
**zero new keys** versus the prior round; two dry rounds in a row → stop. On cap without pass: STOP, ship-best, and
list exactly what still fails — never loop silently.

**Within a round, the adversarial verify is capped at the first 24 pooled candidate issues** (the engine's `CAP`).
If more are flagged, the engine `log()`s the overflow and returns `capped_issues > 0`; the verdict MUST surface that
in its "Capped/sampled" line — silent truncation reads as "all clear" when it isn't. A full artifact run (5–6
critics × several criteria, more under `--deep`) can exceed 24, so raise `CAP` or split the target when it does.

## Depth knobs
- Default: 1 critic per lens, 1 skeptic per finding.
- `--deep` / "be thorough": 2–3 skeptics per finding (perspective-diverse), add a standards/advisor panel, raise
  the cap. `--quick`: drop mechanical lenses to `sonnet`/inline and 1 round.
