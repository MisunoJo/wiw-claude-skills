---
name: carousel-render
description: Render content (a finished report/markdown doc, or freeform notes) into a polished SQUARE slide carousel as PNG images — Instagram/Facebook carousel, visual guide, or explainer deck. Uses an HTML/CSS component kit + headless-Chrome render pipeline with brand presets (wiwbuilds navy/blue, aood shop gold/dark, generic). Use when the user says "make slides/carousel/deck", "turn this report/doc into slides", "create a visual guide", "slide artwork", or points at a report and asks for this kind of carousel. NOT for editable Canva designs (use the Canva MCP) or photo-based AoodBeef brand posts (those use the Canva templates).
---

# carousel-render

Turn content into a designed square-slide carousel (PNG), rendered from HTML/CSS via headless Chrome. The valuable, reusable parts — the component CSS kit, the brand presets, and the exact Chrome render flags — are bundled here so every deck is consistent and one-shot.

**This complements Canva, it does not replace it.** Canva = editable designs you tweak by hand. This skill = fast, free, pixel-perfect PNGs straight from content.

## Workflow

1. **Get the content.** A report/markdown path, an article, or freeform notes. If turning a report into slides, read it and distill — slides are a *summary*, not the full text.
2. **Plan the deck.** Cover → content slides → closing. One idea per slide. Aim 6–10 slides. Pick a **theme rhythm**: dark cover + light content + dark closing reads well (see presets).
3. **Pick a brand:** `wiwbuilds` (default, navy/blue serif), `aood` (gold on near-black, Thai-safe Bai Jamjuree — use mostly `dark` slides), or `generic`.
4. **Write `deck.mjs`** in the output folder (e.g. `<project>/<name>-slides/`). It imports the bundled renderer and defines the slides using the component classes. See template below + full kit in [REFERENCE.md](REFERENCE.md).
5. **Render:** `node deck.mjs`.
6. **QA (required):** `Read` 2–3 of the output PNGs — check fonts loaded, no text overflow past the slide, headlines ≤ 2 lines. Fix wording/sizing in `deck.mjs`, re-run.
7. The renderer deletes the intermediate HTML automatically; the folder ends with `deck.mjs` + `slide-N.png`.

## Quick start — deck.mjs template

```js
// Point this at your own install path: <YOUR_HOME>/.claude/skills/carousel-render/assets/render.mjs
import { renderDeck } from 'file:///<YOUR_HOME>/.claude/skills/carousel-render/assets/render.mjs';

renderDeck({
  outDir: './<name>-slides',
  brand: 'wiwbuilds',
  slides: [
    { theme:'dark', footer:'Section Label', html: `
      <p class="eyebrow">Eyebrow &middot; Label</p>
      <h1 class="h1">Big Cover<br>Head<span class="accent">line</span></h1>
      <p class="sub">One-line subtitle.</p>
      <div class="pills"><span class="pill">A</span><span class="pill">B</span></div>` },
    { theme:'light', footer:'01 &middot; Topic', html: `
      <p class="eyebrow">Kicker</p>
      <h2 class="h2">Content headline</h2>
      <p class="lead">A sentence of lead-in.</p>
      <div class="steps">
        <div class="step"><div class="sn">1</div><div class="st">First move <span>&mdash; detail</span></div></div>
        <div class="step"><div class="sn">2</div><div class="st">Second move</div></div>
      </div>` },
    { theme:'dark', footer:'Brand &middot; Deck', swipe:false, html: `
      <p class="eyebrow">Closing</p>
      <h2 class="h2">Last <span class="accent">word</span></h2>
      <p class="note"><b>Takeaway.</b> One line.</p>` },
  ],
});
```

## Components (classes)

Canvas is **1080×1080**, output is 2×. Each slide is `theme:'dark'` (brand dark bg) or `theme:'light'` (white). Every slide auto-gets a footer (`footer` = bottom-left brand text; `swipe:false` ends the deck with a ■).

Core: `.eyebrow` `.h1` `.h2` `.accent` `.sub` `.lead` `.note` · Layout blocks: `.pills`/`.pill` · `.grid2`/`.card` · `.steps`/`.step`(`.sn`,`.st`) · `.tiers`/`.tier`(`.tk`,`.tt`,`.td`) · `.bands`/`.band`(`.prio`,`.ok`,`.skip`) · `.formula`(`.fl`,`.fx`) · `.kv`/`.kvrow`(`.k`,`.v`) · `.cmds`/`.cmd`(`.ch`,`.cc`) · `.timing`/`.tcard` · `.rhythm`/`.rblock`.

Full HTML for each component + brand preset details + troubleshooting: **[REFERENCE.md](REFERENCE.md)**.

## Rules of thumb

- One idea per slide; headlines ≤ 2 lines; ≤ 7 rows in a list/steps; ≤ 4 kv rows.
- Use `<br>` to control headline line breaks; wrap the punchy word in `<span class="accent">`.
- Always QA by reading a rendered PNG before declaring done — overflow is invisible until you look.
- HTML-escape entities in strings: `&middot; &mdash; &rarr; &le; &times; &Sigma;` etc.
