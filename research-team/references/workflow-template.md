# The engine — canonical `Workflow` program

This is the multi-agent engine for steps 4–6 (research → fact-check → advisors → synthesis). Copy it into a
`Workflow` call's `script` field and fill the three tables (`STREAMS`, `CANON`, `ADVISORS`) + the `CONTEXT` /
`DAY_ONE` strings from your framing. It is generalized from a real multi-agent feasibility run.

Rules the engine obeys (don't break these):
- `meta` must be a **pure literal** — no variables, calls, or interpolation.
- Scripts are **plain JS**, not TS. No `Date.now()` / `Math.random()` / argless `new Date()` (they throw).
- All workers are `agentType: 'general-purpose'`; role = prompt.
- Use `pipeline()` by default; the barrier (`parallel`) here is deliberate — fact-check needs ALL findings' claims
  pooled and deduped before it fans out, and synthesis needs everything.

```js
export const meta = {
  name: 'research-team',
  description: 'Fan-out research, adversarial fact-check, advisor panel, synthesis — McKinsey-style.',
  phases: [
    { title: 'Research',   detail: 'parallel research streams, web-sourced, cite URLs' },
    { title: 'Fact-check', detail: 'independent skeptic voters try to refute each load-bearing claim' },
    { title: 'Advisors',   detail: 'multi-lens expert verdicts on the verified dossier' },
    { title: 'Synthesis',  detail: 'pyramid + verdict + tailored recommendation' },
  ],
}

// ===== FILL THESE FROM YOUR FRAMING =====
const CONTEXT = `{{2-4 sentences: the real question; the AUDIENCE (default = the user — read their ~/.claude/CLAUDE.md
for role, level, how they like answers, and primary language; or the external audience named); the scope; the report
language. Audience tunes presentation only (level, tone, language) — do NOT over-fit: findings stay objective
regardless of the reader.}}`
const DAY_ONE = `{{the Day-One Answer — your best guess before research}}`
const PROFILE_NAME = 'feasibility' // 'learning-kit' | 'feasibility' | 'landscape' | 'how-to-build' — the router's pick
const PROFILE = { researchers: 6, votersPerClaim: 2, advisors: 4, factCheck: true, verdict: true } // from workflow-profiles.md

// Right-fit model per role, AUTO-SELECTED from the chosen profile (scale to demand x stakes x volume, never
// blanket-high / blanket-low). Keys: research / factcheck / advisor / synth. The Material Ingestor runs inline in
// the main loop, so it has no engine model key — it inherits the session model (like Router/Framing/Builder/QC).
const MODELS_BY_PROFILE = {
  'learning-kit': { research: 'sonnet', factcheck: 'sonnet', advisor: 'sonnet', synth: 'opus' }, // research:'haiku' if pure lookups
  'feasibility':  { research: 'sonnet', factcheck: 'sonnet', advisor: 'opus',   synth: 'opus' },
  'landscape':    { research: 'sonnet', factcheck: 'sonnet', advisor: 'sonnet', synth: 'opus' },
  'how-to-build': { research: 'sonnet', factcheck: 'sonnet', advisor: 'opus',   synth: 'opus' },
}
const MODEL = MODELS_BY_PROFILE[PROFILE_NAME] || MODELS_BY_PROFILE['feasibility']
// Override per request after selection: "quick/cheap" -> MODEL.research = MODEL.factcheck = 'haiku';
// "thorough/ultracode" -> MODEL.factcheck = MODEL.advisor = 'opus'.

const STREAMS = [
  // one entry per surviving branch of the issue tree / DT arc
  { key: 'mechanics',     prompt: 'Research stream: ... sub-questions: ...' },
  { key: 'economics',     prompt: 'Research stream: ... sub-questions: ...' },
  // ...
]
const CANON = [
  // must-test claims: the loudest claims from the material + the highest-stakes claims of the topic
  'the headline claim everyone repeats that, if false, kills the thesis',
  // ...
]
const ADVISORS = [
  { lens: 'McKinsey strategist',     persona: 'a McKinsey strategist judging market attractiveness x ability-to-win' },
  { lens: 'Skeptical CFO',           persona: 'a skeptical CFO scrutinizing unit economics, payback, and downside risk' },
  { lens: 'On-the-ground practitioner', persona: 'a veteran practitioner who has actually done this from zero' },
  { lens: 'AI-automation engineer',  persona: 'an AI-automation engineer judging what a non-dev can really build with Claude' },
].slice(0, PROFILE.advisors)

// ===== SHARED PROMPT BLOCKS =====
const WEB = `\n\nYou have web access: load tools with ToolSearch "select:WebSearch,WebFetch", then use them to find
CURRENT, real facts and cite real URLs. If a fact cannot be verified online, say so — never invent a number or source.
Likewise never invent facts about the OPERATOR's own situation (their capital, assets, audience size, location,
experience, or existing projects) that are not in the dossier — if such a detail matters and is unknown, name it as
an explicit assumption or open question, do not assert it as known.`
const PRE = `Context for this engagement: ${CONTEXT}${WEB}`

// ===== SCHEMAS =====
const FINDING_SCHEMA = { type: 'object', properties: {
  branch: { type: 'string' },
  summary: { type: 'string' },
  key_facts: { type: 'array', items: { type: 'object', properties: {
    fact: { type: 'string' }, source_url: { type: 'string' }, implication: { type: 'string' } },
    required: ['fact', 'source_url'] } },
  data_points: { type: 'array', items: { type: 'object', properties: {
    label: { type: 'string' }, value: { type: 'string' }, source_url: { type: 'string' } } } },
  sources: { type: 'array', items: { type: 'object', properties: {
    title: { type: 'string' }, url: { type: 'string' } }, required: ['url'] } },
  claims_to_verify: { type: 'array', items: { type: 'string' } },
  confidence: { enum: ['high', 'medium', 'low'] },
}, required: ['branch', 'summary', 'sources', 'claims_to_verify'] }

const VERDICT_SCHEMA = { type: 'object', properties: {
  verdict: { enum: ['supported', 'refuted', 'partially_true', 'unverifiable'] },
  confidence: { enum: ['high', 'medium', 'low'] },
  reasoning: { type: 'string' },
  corrected_statement: { type: 'string' },
  source_urls: { type: 'array', items: { type: 'string' } },
}, required: ['verdict', 'confidence', 'reasoning'] }

const ADVISOR_SCHEMA = { type: 'object', properties: {
  lens: { type: 'string' }, verdict: { type: 'string' }, score: { type: 'number' },
  top_worry: { type: 'string' }, first_move: { type: 'string' }, rationale: { type: 'string' },
}, required: ['lens', 'verdict', 'top_worry', 'first_move'] }

const SYNTH_SCHEMA = { type: 'object', properties: {
  governing_thought: { type: 'string' },
  key_line: { type: 'array', items: { type: 'object', properties: {
    argument: { type: 'string' }, evidence: { type: 'string' }, sources: { type: 'array', items: { type: 'string' } } } } },
  verdict: { type: 'string' }, verdict_why: { type: 'string' },
  recommendation: { type: 'string' },
  plan_30_60_90: { type: 'array', items: { type: 'string' } },
  headline_insight: { type: 'string', description: 'the gap between Day-One and final answer' },
  open_questions: { type: 'array', items: { type: 'string' } },
}, required: ['governing_thought', 'key_line', 'verdict_why', 'recommendation'] }

// Learning-kit deliverable = a TEACHING arc, not a verdict (see references/design-thinking.md). Used when PROFILE_NAME==='learning-kit'.
const TEACH_SCHEMA = { type: 'object', properties: {
  mental_model: { type: 'string', description: 'what it IS in plain language + an analogy/picture' },
  structure: { type: 'array', items: { type: 'object', properties: {
    part: { type: 'string' }, in_one_sentence: { type: 'string' } } } },
  worked_example: { type: 'string', description: "MANDATORY — a worked example grounded in the LEARNER's own world" },
  common_traps: { type: 'array', items: { type: 'string' } },
  do_this_next: { type: 'string', description: 'one small exercise to apply it now' },
  sources: { type: 'array', items: { type: 'string' } },
}, required: ['mental_model', 'structure', 'worked_example', 'do_this_next'] }

// ===== PHASE 1: RESEARCH (parallel) =====
phase('Research')
const findings = (await parallel(STREAMS.slice(0, PROFILE.researchers).map(s => () =>
  agent(`${PRE}\n\nYou are a research associate. ${s.prompt}\nReturn findings in the schema, including 2-3
load-bearing claims_to_verify.`, { schema: FINDING_SCHEMA, phase: 'Research', label: 'research:' + s.key, model: MODEL.research })
))).filter(Boolean)

// ===== PHASE 2: FACT-CHECK (barrier: pool+dedup, then fan out skeptics) =====
// Non-negotiable: empirical claims (numbers / % / causal / superlative words) ALWAYS get >=1 skeptic, even when
// factCheck is "off". The skip is never silent for a claim that carries a checkable assertion.
let verifiedClaims = []
{
  const pooled = findings.flatMap(f => (f.claims_to_verify || []).slice(0, 3)).concat(CANON)
  const seen = {}, toVerify = []
  pooled.forEach(c => { const k = (c || '').trim().toLowerCase().replace(/\s+/g, ' '); if (k && !seen[k]) { seen[k] = 1; toVerify.push(c) } }) // full-string dedup, not a 55-char prefix
  const isEmpirical = c => /\d|%|percent|cause|caus|increase|reduc|prove|guarantee|best|most|always|never|fastest|cheapest/i.test(c)
  const claims = (PROFILE.factCheck ? toVerify : toVerify.filter(isEmpirical)).slice(0, 18)
  const V = PROFILE.factCheck ? PROFILE.votersPerClaim : 1
  if (claims.length) {
    phase('Fact-check')
    const votes = (await parallel(claims.flatMap((claim, i) => Array.from({ length: V }, (_, v) => () =>
      agent(`${PRE}\n\nYou are an adversarial fact-checker. Try HARD to REFUTE this claim using current web sources;
default to skepticism. Claim: "${claim}"\nReturn verdict, confidence, reasoning, the corrected statement if wrong or
partial, and source URLs.`, { schema: VERDICT_SCHEMA, phase: 'Fact-check', label: 'verify:' + i + '.' + v, model: MODEL.factcheck })
        .then(r => r ? { claim, ...r } : null)
    )))).filter(Boolean)
    const byClaim = {}; votes.forEach(r => (byClaim[r.claim] ||= []).push(r))
    verifiedClaims = Object.keys(byClaim).map(claim => {
      const vs = byClaim[claim]
      const sup = vs.filter(x => x.verdict === 'supported').length
      const ref = vs.filter(x => x.verdict === 'refuted').length
      const part = vs.filter(x => x.verdict === 'partially_true').length
      // Conservative adjudication: a refutation outweighs; ANY 'partially_true' vote caps the claim at
      // partially_true (a lone 'supported' can NEVER promote a partial to fully supported).
      let status = 'unverifiable'
      if (ref > sup && ref >= part) status = 'refuted'
      else if (part > 0) status = 'partially_true'
      else if (sup > ref) status = 'supported'
      const corrected = (vs.find(x => x.corrected_statement) || {}).corrected_statement || ''
      // A refuted/partial claim must never surface with a silent empty correction.
      const flagged = (status === 'refuted' || status === 'partially_true') && !corrected
      return { claim, status,
        corrected: flagged ? 'correction not supplied — treat as unverified' : corrected,
        notes: vs.map(x => x.reasoning).join(' || ').slice(0, 600),
        sources: vs.flatMap(x => x.source_urls || []).slice(0, 4) }
    })
  }
}

// ===== PHASE 2b: ADVISORS (parallel) =====
phase('Advisors')
const dossier = JSON.stringify({ findings, verifiedClaims }).slice(0, 12000)
const advisorVerdicts = (await parallel(ADVISORS.map(a => () =>
  agent(`${PRE}\n\nYou are ${a.persona}. Here is the verified dossier (fact-checked — respect the verdicts, do not
relitigate refuted claims). Give your verdict on the central question from YOUR lens only, a 0-10 score, the single
thing you'd worry about most, and the first move you'd make. Be direct.\n\nDossier:\n${dossier}`,
    { schema: ADVISOR_SCHEMA, phase: 'Advisors', label: 'advisor:' + a.lens, model: MODEL.advisor })
))).filter(Boolean)

// ===== PHASE 3: SYNTHESIS (arc switches by profile) =====
phase('Synthesis')
const ev = `\n\nFindings:${JSON.stringify(findings).slice(0, 9000)}\n\nFact-check:${JSON.stringify(verifiedClaims).slice(0, 4000)}\n\nAdvisors:${JSON.stringify(advisorVerdicts).slice(0, 4000)}`
const isLearning = PROFILE_NAME === 'learning-kit'
const report = await agent(
  isLearning
    ? `${PRE}\n\nYou are the synthesizer for a LEARNING KIT — the reader does not know this topic, so TEACH, don't dump a verdict. Follow the teaching arc from references/design-thinking.md: a plain-language mental model + analogy; the structure part-by-part; a MANDATORY worked example grounded in the LEARNER's own world; common traps; one do-this-next exercise. RESPECT THE FACT-CHECK: never assert a refuted claim; present corrected versions; flag unverifiable items.${ev}`
    : `${PRE}\n\nYou are the engagement synthesizer. Build the report content in the schema. RESPECT THE FACT-CHECK: never assert a refuted claim; present corrected versions; flag unverifiable items. Name the headline insight = the gap between the Day-One Answer ("${DAY_ONE}") and your final answer.${ev}`,
  { schema: isLearning ? TEACH_SCHEMA : SYNTH_SCHEMA, phase: 'Synthesis', label: 'synthesize', model: MODEL.synth })

return { report, findings, verifiedClaims, advisorVerdicts, profile: PROFILE_NAME }
```

The main loop then builds the deliverable (markdown or HTML) from this returned JSON and runs QC.

## Trimming the engine per profile
Set `PROFILE_NAME` to the router's pick — the synthesis arc and the model map auto-switch from it.
- **Learning kit:** `PROFILE_NAME='learning-kit'` auto-switches the synthesizer to the **teaching arc** (`TEACH_SCHEMA`,
  reads design-thinking.md) and the model map drops advisors to sonnet. Use `advisors: 1-2`, swap one for the
  **Teacher** lens. `factCheck: false` is fine — empirical claims (numbers/causal/superlatives) still get 1 skeptic
  automatically, so a stat never ships unchecked.
- **Landscape:** `PROFILE_NAME='landscape'`, put only the headline numbers in `CANON`, `votersPerClaim: 2`, `advisors: 2`.
- **Thorough / ultracode:** `votersPerClaim: 3`, more `STREAMS`, override `MODEL.factcheck = MODEL.advisor = 'opus'`,
  and add a completeness-critic agent after synthesis ("what modality didn't we run, what claim is still
  unverified?") whose output seeds a second round.

## Right-fit model selection (the `MODEL` map)
Pick the model per role by **cognitive demand × stakes × volume** — never blanket-high (burns tokens) or
blanket-low (misses nuance on the calls that matter):
- `sonnet` is the default workhorse: research associates and fact-checkers run at volume (claims × voters), and the
  task is bounded — Sonnet is smart enough and cheap enough there.
- `opus` for the few high-stakes judgment calls: the advisor verdicts and especially the synthesizer (the whole
  report hinges on that one call).
- `haiku` only for cheap/simple runs where research is plain lookups and there are no contested claims.
- Router, Framing, Builder, QC are NOT agents — they run inline in the main loop and inherit the session model.
Override the whole map per run from the request: "quick/cheap" → push research+factcheck down a tier;
"thorough/ultracode/be rigorous" → push factcheck+advisor up to `opus`.
