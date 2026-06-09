# carousel-render — component reference

Canvas is **1080×1080**, output 2× (2160²). Put one component family per content slide. Every slide string is the **inner** HTML of `.slide` — the renderer adds the wrapper + footer. Theme is `dark` (brand dark bg) or `light` (white bg).

Escape HTML entities in JS strings: `&middot;(·) &mdash;(—) &ndash;(–) &rarr;(→) &le;(≤) &ge;(≥) &lt;(<) &times;(×) &minus;(−) &Sigma;(Σ) &divide;(÷) &amp;(&)`. Use `<br>` to force headline line breaks; wrap the punchy word in `<span class="accent">`.

---

## Text primitives

```html
<p class="eyebrow">Eyebrow &middot; Label</p>          <!-- small tracked caps, blue/gold -->
<h1 class="h1">Cover head<span class="accent">line</span></h1>  <!-- cover only, ~96px serif -->
<h2 class="h2">Content headline</h2>                    <!-- content slides, ~60px serif -->
<p class="sub">Cover subtitle, one or two lines.</p>    <!-- pairs with h1 -->
<p class="lead">Lead-in sentence under an h2.</p>       <!-- muted, pairs with h2 -->
<p class="note"><b>Takeaway.</b> Pinned to slide bottom.</p>  <!-- margin-top:auto -->
```

## Cover pills (cover slide)
```html
<div class="pills">
  <span class="pill">When to scan</span><span class="pill">The 7 steps</span>
</div>
```

## Two stat/definition cards — `.grid2`
```html
<div class="grid2">
  <div class="card">
    <div class="ct">Card label</div>
    <div class="cb">03:00&ndash;10:00</div>
    <div class="cd">One supporting sentence.</div>
    <span class="tag">Optional tag</span>
  </div>
  <div class="card"> ... </div>
</div>
```

## Numbered steps — `.steps` (best 3–7 rows)
```html
<div class="steps">
  <div class="step"><div class="sn">1</div><div class="st">Bold action <span>&mdash; muted detail</span></div></div>
  <div class="step"><div class="sn">2</div><div class="st">Next action</div></div>
</div>
```

## Tiers / left-rule blocks — `.tiers` (3–4 blocks; great on dark)
```html
<div class="tiers">
  <div class="tier">
    <div class="tk">1 &middot; Kicker</div>      <!-- optional -->
    <div class="tt">Tier title</div>
    <div class="td">One or two sentences.</div>
  </div>
</div>
```

## Ranked bands — `.bands` (a priority ladder)
```html
<div class="bands">
  <div class="band prio"><div class="brange">78.6&ndash;88.7%</div>
    <div><div class="blabel">Priority</div><div class="bdesc">Why it's top.</div></div></div>
  <div class="band ok"><div class="brange">61.8&ndash;78.6%</div>
    <div><div class="blabel">Acceptable</div><div class="bdesc">Conditional.</div></div></div>
  <div class="band skip"><div class="brange">&lt; 61.8%</div>
    <div><div class="blabel">Skip</div><div class="bdesc">Out of bounds.</div></div></div>
</div>
```

## Formula card + key-values — `.formula` / `.kv`
```html
<div class="formula">
  <div class="fl">Label</div>
  <div class="fx">Shares = (Equity &times; <span class="accent">1%</span>) &divide; (Entry &minus; Stop)</div>
</div>
<div class="kv">
  <div class="kvrow"><span class="k">Risk per trade</span><span class="v">1% = 4,000 &#3647;</span></div>
  <div class="kvrow"><span class="k">Stop</span><span class="v">Previous Low</span></div>
</div>
```
(`&#3647;` = ฿ Thai baht.)

## Labelled command rows + timing cards — `.cmds` / `.timing`
```html
<div class="cmds">
  <div class="cmd"><div class="ch">Buy</div><div class="cc">Type <b>Symbol + Price</b> &rarr; auto-fill.</div></div>
</div>
<div class="timing">
  <div class="tcard"><div class="tt2">TH ATO</div><div class="tv2">&rarr; 10:00</div></div>
  <div class="tcard"><div class="tt2">US ATO</div><div class="tv2">&rarr; 20:30</div></div>
</div>
```

## Rhythm blocks — `.rhythm` (titled time-blocks; good on dark)
```html
<div class="rhythm">
  <div class="rblock">
    <div class="rt"><span>Morning check</span><span class="rtime">~10:05 &middot; 2 min</span></div>
    <div class="rd">What to do, with <b>emphasis</b>.</div>
  </div>
</div>
```

---

## Brand presets

| brand | look | fonts | notes |
|---|---|---|---|
| `wiwbuilds` | navy `#051C2C` + blue `#2251FF`, serif heads | Source Serif Pro + Inter | default; dark cover + light content + dark close |
| `aood` | gold `#D4A827` on near-black `#0F0F0F` | Bai Jamjuree (Thai-safe) | prefer `dark` slides; informational shop carousels only — NOT the photo Canva templates |
| `generic` | slate `#0f172a` + indigo | Source Serif Pro + Inter | when there's no brand |

Add a brand by copying a block in [assets/brands.js](assets/brands.js): a Google-Fonts `font` URL + the `vars` map.

## Render flags (in assets/render.mjs — usually leave alone)
`--headless=new` (faithful rendering) · `--force-device-scale-factor=2` (crisp 2×) · `--window-size=1080,1080` (square) · `--virtual-time-budget=12000` (waits for web fonts to load before the screenshot — the #1 cause of fallback-font output if too low) · `--run-all-compositor-stages-before-draw`.

## Troubleshooting
- **Wrong/fallback font** → fonts didn't finish loading; raise `--virtual-time-budget`. Confirm the brand's `font` URL covers the weights used.
- **Text overflows the slide** → too much content. Cut words, drop a row, or split into two slides. Headlines ≤ 2 lines. Always `Read` a rendered PNG to catch this.
- **Thai text** → use the `aood` preset (Bai Jamjuree); avoid Tahoma-class fonts that drop stacked tone marks.
- **No browser found** → install Chrome, or add the path in `findBrowser()`.
- **Want to keep the HTML** (to hand-tweak) → pass `keepHtml:true` to `renderDeck`.
