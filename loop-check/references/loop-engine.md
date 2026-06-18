# The loop engine — `Workflow` program for one Check → Verify → Gate round

One run of this program = **one round** of the loop (Check → adversarial Verify → Gate). The **main loop** owns the
rest: write the gate, run this, then (default) report + ask, or (`--fix`) apply the confirmed fixes itself and
re-run for the next round, up to the cap in `check-profiles.md`. Fixes are file edits, so the main agent does them —
not a subagent. It uses the same adversarial-verify *pattern* as `research-team` (implemented independently — a
finding-level `holds:boolean` here vs research-team's claim-level verdict enum; no shared code).

Engine rules (same as research-team): `meta` is a pure literal; plain JS, no nondeterministic time/random calls; all
workers `general-purpose`; the barrier (`parallel`) is deliberate — Verify needs ALL findings pooled first.

```js
export const meta = {
  name: 'loop-check-round',
  description: 'One round: independent critics check a finished artifact, skeptics verify each finding, then gate.',
  phases: [
    { title: 'Check',  detail: 'independent critic agents, one per lens, judge against the binary gate' },
    { title: 'Verify', detail: 'a skeptic tries to refute each finding — only confirmed issues survive', model: 'opus' },
  ],
}

// ===== FILL FROM YOUR FRAMING (router + check-profiles.md) =====
const TARGET = `{{what is being checked: type + the paths/diff/plan, 2-4 sentences}}`
const GATE = [
  // binary, stranger-checkable pass criteria — the keystone
  'every test / build passes',
  'no correctness or data-loss bug',
  'no needless complexity vs the simplest approach',
]
const PATHS = `{{the files / diff / artifact the critics must read}}`
const ROUND = (typeof args === 'object' && args && args.round) ? args.round : 1 // main loop passes the round number

// Critics for THIS target type (from check-profiles.md). model: sonnet = mechanical, opus = judgment.
// Swap this block to match the target the router detected — these are CODE-target critics; ready-to-uncomment
// plan and artifact sets follow below. Pull the full lens prompts from lenses.md.
const CRITICS = [
  { key: 'correctness', model: 'sonnet', lens: 'You are a correctness reviewer (/code-review discipline). Hunt real bugs: wrong output, edge cases, data loss, security footguns, broken contracts; note needless complexity. Ignore style.' },
  { key: 'scrutinize',  model: 'opus',   lens: 'You are an outside reviewer (/scrutinize). Question the intent and whether a simpler path reaches the same goal; trace the ACTUAL path/behavior (not just the claim) and verify it does what it says.' },
  // debug-mantra critic too if a real bug is found (see lenses.md).
]
// PLAN/DESIGN target — uncomment instead:
// const CRITICS = [
//   { key: 'grill',      model: 'opus', lens: 'You interrogate a plan (/grill-me). Walk the decision tree: every branch resolved? every assumption named? Is this the REAL problem and the simplest approach? List each unresolved branch as a gate failure.' },
//   { key: 'scrutinize', model: 'opus', lens: 'You are an outside reviewer (/scrutinize). Question the intent and whether a simpler path reaches the same goal.' },
// ]
// ARTIFACT/PROJECT target (skill, report, app) — uncomment instead:
// const CRITICS = [
//   { key: 'fix-verify',       model: 'sonnet', lens: 'Confirm each claimed change/feature is present AND correct; quote lines; half-applied = warn.' },
//   { key: 'consistency',      model: 'sonnet', lens: 'Find contradictions across files; confirm all refs/paths resolve or degrade gracefully.' },
//   { key: 'scenario-sim',     model: 'opus',   lens: 'Role-play the artifact on its real use-cases; does behavior match the spec, not just the structure?' },
//   { key: 'outcome-standard', model: 'opus',   lens: 'Judge against an exemplar/standard bar; name concrete gaps vs what the exemplar contains.' },
//   { key: 'fact-check',       model: 'sonnet', lens: 'Verify the factual claims (numbers, that named paths/tools exist); try HARD to refute; mark supported/refuted/unverifiable.' },
// ]

const FINDING_SCHEMA = { type: 'object', properties: {
  lens: { type: 'string' },
  checks: { type: 'array', items: { type: 'object', properties: {
    criterion: { type: 'string', description: 'which gate criterion (or a new issue) this is about' },
    status: { enum: ['pass', 'warn', 'fail'] },
    evidence: { type: 'string', description: 'quoted line / behavior proving it' },
    severity: { enum: ['nit', 'minor', 'major', 'blocker'] },
    fix: { type: 'string' } }, required: ['criterion', 'status', 'evidence'] } },
  summary: { type: 'string' },
}, required: ['lens', 'checks', 'summary'] }

const VERIFY_SCHEMA = { type: 'object', properties: {
  holds: { type: 'boolean' }, reasoning: { type: 'string' }, correction: { type: 'string' },
}, required: ['holds', 'reasoning'] }

const PRE = `You are checking a FINISHED artifact against a binary gate. Be skeptical and specific; judge as if a
stranger built it. Target: ${TARGET}\nRead: ${PATHS}\nBinary gate (judge every criterion):\n- ${GATE.join('\n- ')}
\nDo not invent facts you cannot see; flag unknowns as open questions.`

// ===== CHECK (parallel critics) =====
phase('Check')
const findings = (await parallel(CRITICS.map(c => () =>
  agent(`${PRE}\n\n${c.lens}\nReturn a check per gate criterion (and any extra issue) with status, quoted evidence, severity, and a concrete fix.`,
    { schema: FINDING_SCHEMA, phase: 'Check', label: 'check:' + c.key, model: c.model })
))).filter(Boolean)

// Pool every warn/fail into a flat issue list to adversarially verify.
const raw = findings.flatMap(f => (f.checks || []).filter(c => c.status !== 'pass')
  .map(c => ({ lens: f.lens, criterion: c.criterion, status: c.status, severity: c.severity || 'minor', evidence: c.evidence || '', fix: c.fix || '' })))
log(`Check: ${findings.length} critics, ${raw.length} candidate issues`)

// ===== VERIFY (adversarial — kill false positives) =====
phase('Verify')
const CAP = 24
if (raw.length > CAP) log(`Verify: capped at ${CAP} of ${raw.length} candidate issues — ${raw.length - CAP} NOT verified this round; surface this in the verdict's Capped line (the artifact profile can exceed 24, raise the cap or split if so)`)
const verified = (await parallel(raw.slice(0, CAP).map((it, i) => () =>
  agent(`A critic flagged this issue with the artifact (read it to judge — Target: ${TARGET}; Files: ${PATHS}). Try HARD to determine if it is REAL; default to skepticism about the CRITIC, who may be over-strict or wrong. Issue [${it.criterion}, ${it.status}/${it.severity}]: ${it.evidence}\nProposed fix: ${it.fix}\nDecide whether it genuinely holds.`,
    { schema: VERIFY_SCHEMA, phase: 'Verify', label: 'verify:' + i, model: 'opus' })
    .then(v => v ? { ...it, holds: v.holds, why: v.reasoning, correction: v.correction || it.fix } : null)
))).filter(Boolean)
const confirmed = verified.filter(v => v.holds)
log(`Verify: ${confirmed.length} of ${verified.length} issues confirmed real`)

// ===== GATE =====
const blockers = confirmed.filter(c => c.severity === 'blocker' || c.severity === 'major')
const pass = confirmed.length === 0
const verdict = pass ? 'READY' : (blockers.length ? 'NOT-READY' : 'READY-WITH-FIXES')

return { round: ROUND, verdict, pass, gate: GATE, confirmed, dismissed: verified.filter(v => !v.holds).length,
  capped_issues: Math.max(0, raw.length - CAP) } // capped_issues > 0 => verdict MUST flag unverified issues in its Capped line
```

## How the main loop uses it
1. Detect target + write `GATE` + `CRITICS` (router, `check-profiles.md`).
2. Run this program (pass `args:{round:N}`). For a tiny target, run the critics inline as parallel `Agent` calls
   instead — same Check→Verify→Gate discipline, no Workflow overhead.
3. **Default:** deliver the verdict + `confirmed` issues (manager-talk format in `lenses.md`); **ask** before fixing.
   **`--fix`:** apply each `confirmed.correction` (main-loop file edits, touch nothing that passed), then re-run with
   `round+1` and re-gate. **Stop** when `verdict==='READY'`, or the round cap (3) hits, or two rounds add no new
   confirmed issue (dry) — then ship-best and list what still fails. Never loop silently.
