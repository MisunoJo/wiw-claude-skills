# Workflow profiles & routing rules

The router (component 1) reads the request and picks ONE profile. The profile sets the team knobs. This is the
"scale the team to the ask" rule that keeps a teach-me request from spending like a feasibility study.

## How the router decides

Read the request and answer four questions, in this order:

1. **Is there material?** A named folder, pasted refs, screenshots, a doc to start from. If yes → the Material
   Ingestor runs first and its loud claims seed `CANON` (the must-test claim list).
2. **What is the intent?** Match the verb:
   - *teach / explain / create a learning material / I want to understand the basics of* → **Learning kit**
   - *can I / should I / is it worth it / will this make money / help me decide* → **Feasibility / decision**
   - *research the trends in / map the space / what's happening in / give me the landscape* → **Landscape / scan**
   - *how do I build / what's the stack for / design the system for* → **How-to-build**
3. **Who is the audience?** **Default = the person who invoked it (the user)** — researching to learn and decide,
   not to publish. Keep this LIGHT: know just *who they are* (from their `~/.claude/CLAUDE.md`, usually already in
   context — their role, level, how they like answers, primary language) and *why they want the research* (from the
   request). That's enough to set the right level and language. **Do NOT over-fit.** The audience tunes
   *presentation* — depth, examples, tone, language — and never the *substance*: findings stay objective and
   rigorous regardless of who reads them. Don't trawl per-project memory or a session log unless the topic is
   genuinely tied to a specific project and that history changes the answer. Re-target only if they say it's for
   someone else.
4. **What output?** Interactive HTML for decisions or on request; markdown otherwise.
5. **What language & depth?** Use the user's primary language when they're the reader; ask depth ("quick test vs serious bet") only if it
   changes the recommendation.

When the intent is genuinely ambiguous, or a wrong guess wastes the whole run, ask **≤2** AskUserQuestion scoping
questions (e.g. commitment level, which option to lean toward, starting position, output format).
Otherwise state the chosen profile + scope in one line and go.

**Multi-verb tie-break.** A request can match more than one intent ("how do I build X **and** is it worth it" hits both
How-to-build and Feasibility). Don't silently resolve to whichever verb you read first. Rule: **a decision verb
("is it worth it / should I / can I make money") dominates** — pick the higher-stakes profile and fold the other
intent in as an extra research stream. Precedence when in doubt: **Feasibility > How-to-build > Landscape > Learning
kit** (higher-stakes wins, because under-serving a decision is worse than over-serving a scan). If the blend is
genuinely 50/50 and the teams differ a lot, that counts as "ambiguous" — ask one scoping question.

## The four profiles

| Knob | **Learning kit** | **Feasibility / decision** | **Landscape / scan** | **How-to-build** |
|---|---|---|---|---|
| Framing method | Design Thinking | McKinsey issue tree | McKinsey issue tree | McKinsey issue tree |
| Research associates | 2–4 | 5–7 | 4–6 | 4–6 |
| Fact-check | light (≥1 voter on any empirical claim) or off | **full: 2 voters/claim** | light: 2 voters on key numbers only | medium: 2 voters on the load-bearing build claims |
| Advisor panel | 1–2 (e.g. teacher + skeptic) | **4 lenses** | 2 lenses | 2–3 (practitioner-heavy) |
| Verdict | none (it's a kit, not a decision) | **GO / CONDITIONAL-GO / NO-GO** | none (a map) | feasibility + build plan |
| Default output | structured guide (MD or HTML) | **interactive HTML + research-notes.md** | markdown report | markdown report + plan |
| Run mode | inline | background | inline or background | inline |
| Models (research / factcheck / advisor / synth) | haiku-sonnet / sonnet / sonnet / opus | sonnet / sonnet / opus / opus | sonnet / sonnet / sonnet / opus | sonnet / sonnet / opus / opus |

## Profile notes

**Learning kit** — the answer to "I don't know this topic enough." The deliverable teaches: a clear mental model
first, then the structure, then worked examples, then a do-this-next. Fact-check is light because there are usually
no contested empirical claims — but any concrete number or "X causes Y" claim still gets at least one skeptic.
Design Thinking is the frame: who's the learner, what's the job, what's the simplest thing that teaches it.

**Feasibility / decision** — the full pipeline. This is where the fact-check earns its keep: the loud
claims in the material ("200–300 posts/day earns money") are exactly what gets refuted or corrected. Always ships a
verdict banner, a 30/60/90 plan, and an interactive calculator if the decision has live numbers.

**Landscape / scan** — breadth over depth. Many researchers, each a different slice; fact-check only the headline
numbers that anchor the map. Output is a map, not a recommendation.

**How-to-build** — practitioner advisors dominate (people who've actually built it). Fact-check the "a non-dev can
do this" and tooling-availability claims. Output ends in a concrete build plan / stack.

## Scaling within a profile (token budget)

If the user signals scale ("be thorough", "ultracode", "+500k", "go deep"), push the knobs up — more researchers, 3
voters/claim, a completeness-critic pass at the end ("what modality didn't we run, what claim is unverified?"). If
he signals "quick", drop to the floor of the profile. When in doubt, default to the profile's middle column.
