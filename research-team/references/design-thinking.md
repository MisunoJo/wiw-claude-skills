# Design Thinking — the framing method mckinsey-report lacks

McKinsey framing (issue tree → hypothesis → prove) is built to *decide* and *recommend*. Design Thinking is built
to *understand a human and build something for them*. Use it when the deliverable is a learning kit, a product/UX
idea, an onboarding flow, or anything where the right question is "what does the user actually need" rather than
"what's the answer." The router picks it for the **Learning kit** profile and for product/UX asks.

## The five stages

1. **Empathize** — understand the user and their context. Who is the learner/user? What do they already know? What
   frustrates them? What's the real job they're hiring this for? (For a personal learning kit, the "user" is usually
   the person who asked — read their `~/.claude/CLAUDE.md` for their background, level, and how they like answers.)
2. **Define** — sharpen one point-of-view statement: *"[user] needs [need] because [insight]."* This is the
   Design-Thinking equivalent of the SMART question. Weak: "teach Design Thinking." Strong: "a solo operator needs a
   one-sitting mental model of Design Thinking he can apply to his own projects tomorrow, because abstract theory
   doesn't stick without a worked example from his world."
3. **Ideate** — diverge: many ways to meet the need (formats, angles, examples), then converge on the few worth
   prototyping. This maps to the research streams: each stream explores one angle / one part of the topic.
4. **Prototype** — build the smallest thing that teaches or tests the idea: a draft kit, a worked example, a
   one-pager. Cheap, fast, throwaway.
5. **Test** — put it in front of the user (or simulate the learner), see where it fails, loop back. In a single run
   this is the QC pass + the Teacher advisor lens asking "would a beginner actually get it from this?"

## How a "learning kit" maps onto the stages

A learning-material request runs the team like this:
- **Empathize / Define** (Framing Lead, inline): write the point-of-view statement — who learns this, what they need,
  the insight that makes it stick. This replaces the issue tree.
- **Ideate** (Research Associates, 2–4 parallel): each takes one facet — the core mental model, the canonical
  framework, real worked examples/case studies, common mistakes & how to avoid them. Each cites sources.
- **Fact-check** (light): any concrete claim, statistic, or "X causes Y" still gets at least one skeptic; pure
  conceptual material may skip it.
- **Test** (Teacher advisor + QC): "can a beginner reconstruct this from the kit alone?"
- **Synthesize** into a teaching arc, not a verdict:
  1. **The one-paragraph mental model** (what it IS, in plain language + a picture/analogy).
  2. **The structure** (the stages/parts, each in a sentence).
  3. **A worked example from the learner's own world** — the highest-value section; abstract theory doesn't stick
     without it. Ground it in **whoever the learner actually is** (the audience the router set): if the user is the
     reader, use an example from their own world/projects (per their CLAUDE.md); if the kit is re-targeted to their
     customers, their team, or a public audience, use an example from *that* audience's world. Never force a
     user-specific example when they aren't the reader — this is presentation, so it follows the audience, and the
     substance stays objective either way.
  4. **Common traps** and how to avoid them.
  5. **Do-this-next** — one small exercise to apply it immediately.

Deliver as a structured markdown guide or an interactive HTML kit (tabs per stage, a worked-example walkthrough).
Keep the McKinsey discipline where it still helps: lead with the takeaway, one message per section, action-title
headings. The difference is the goal — comprehension and application, not a recommendation.
