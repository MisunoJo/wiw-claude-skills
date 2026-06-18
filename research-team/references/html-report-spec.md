# Interactive HTML deliverable spec

Use this when the profile is feasibility/decision, or the user asks for HTML, or the report has live numbers worth
playing with. The output is ONE self-contained `.html` file — no CDN, no external fonts, no network calls, works
offline when double-clicked.

**Canonical exemplar — match this quality bar.** A gold-standard build of this spec is a single finished HTML
feasibility report containing: a navy/amber CSS palette via `:root` variables, a hero + verdict banner with a 4-cell
score strip, a sticky tab bar, a working income calculator (range sliders → live figure + a "goal progress" bar),
pure-CSS bar charts, a Market×Ability 2×2 with the operator's dot plotted, fact-check cards that show the corrected
claim, an **agent-stack diagram** + **advisor cards** (score / top-worry / first-move), FAQ `<details>`, and a footer
sources list — all inline, with the reader's primary language and `lang` set, on a two-font system stack. If such an
exemplar file is available locally, read it before building to lift structure, class names, and component patterns;
don't copy its content. That is the bar; aim there.

## Hard rules
- **Self-contained, renders offline.** All CSS + JS inline in the file. No `<script src=...>`, no chart CDN — charts
  are hand-drawn inline SVG (or Canvas). **One allowed exception:** a Google-Fonts `<link>` for display polish, *only
  if* a system-font fallback stack is set in the font-family so the page still renders fine offline (the loop-skill
  exemplar below does this). Everything else must work with the network disconnected — test that.
- **House style** from `..\..\mckinsey-report\references\design-spec.md`: two fonts (a CDN display font + body, or a
  system stack), a tight palette, lots of white space, action-title headings, one message per exhibit.
- **Match the reader's language.** Use the audience's primary language for the body (English technical terms
  preserved); set `<html lang>` accordingly (e.g. `lang="th"` for a Thai reader).
- **Action titles everywhere.** Every tab, section, and chart leads with the finding as a full sentence, not a topic.

## Standard structure (decision/feasibility)
1. **Verdict banner** at the very top — `GO` / `CONDITIONAL-GO` / `NO-GO` as a colored band, with the one-line WHY
   beside it. The reader gets the answer in the first 100 px.
2. **Tabbed sections** (buttons toggle `display`). Typical set, TH labels:
   สรุปผู้บริหาร · ตลาด & กลไก · ถอดรหัสเคสจริง · โมเดลเทียบกัน · เศรษฐศาสตร์ต่อหน่วย · ความเสี่ยง & ToS ·
   คณะที่ปรึกษา (advisor panel) · แผน 30/60/90 วัน. Adapt to the topic.
3. **Advisor panel** — the multi-lens verdicts as cards (lens name · verdict chip · score · top worry · first move),
   so agreement/disagreement is visible at a glance.
4. **Fact-check transparency** — refuted/corrected claims shown honestly (struck-through claim → corrected version),
   unverifiable ones tagged "ยังพิสูจน์ไม่ได้". This is the trust signal.
5. **Live calculator** (when there are live numbers) — sliders / number inputs that recompute a result on `input`,
   e.g. clicks × conversion × AOV × commission → ฿/month, plus "orders needed to hit the goal." Plain JS, no libs.
6. **Charts** — inline SVG: comparison bars, scenario lines (pessimistic/base/optimistic), a 2×2
   (Market-Attractiveness × Ability-to-Win) with the operator's position plotted. Action title on each; highlight the one
   data point that proves the title, mute the rest.
7. **About this research** — sources list, the fact-check verdicts summary, and limitations. Not optional.

## Minimal skeleton (expand, keep inline)
```html
<!doctype html><html lang="th"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{{Title}}</title>
<style>/* palette, type, tabs, cards, banner, slider — all here */</style>
</head><body>
  <header class="verdict verdict--conditional">{{VERDICT}} — {{one-line why}}</header>
  <nav class="tabs"><!-- buttons --></nav>
  <main><!-- one <section data-tab> per tab; SVG charts; calculator inputs --></main>
  <footer class="about"><!-- sources, fact-check summary, limitations --></footer>
  <script>/* tab switching + calculator recompute, vanilla JS */</script>
</body></html>
```

## Learning-kit variant
Same self-contained rules, different shape: **no verdict banner**; the page follows the **teaching arc** (mental
model → structure → worked example → traps → do-this-next), with the worked example as the centerpiece and a tiny
self-check at the end. The signature of a great learning kit is an **interactive widget that lets the reader *play*
with the concept** — a simulator, a slider-driven model, a toggle that shows cause→effect — not just prose. That
interactivity IS the Design-Thinking "prototype/test" stage made tangible.

**Canonical learning-kit exemplar — match this bar.** A gold-standard learning kit (e.g. a "teach me the loop skill"
page) nails the arc: an animated SVG diagram with active-node states; a live **simulator** (sliders driving a model,
a run-log that shows the concept compounding and a deliberately broken/edge case); a step-by-step anatomy with *why*
+ a worked example each, grounded in the learner's own world; honest pros/cons with one flagged "big con"; and a
builder to apply it. A dark "lab" palette with a display/body/mono font trio via a font CDN with system fallbacks
works well. If such an exemplar file is available locally, read it before building a learning kit to lift the
interactive-widget pattern and the arc; don't copy its content.

## Always also write `research-notes.md`
Beside the HTML, drop a markdown file with every source (title + URL), the raw findings, and the full fact-check
verdict table — so any number in the report traces back. This is the methodology spine.
