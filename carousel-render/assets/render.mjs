// carousel-render — render library. Import this from a deck.mjs and call renderDeck().
//
//   import { renderDeck } from 'file:///<YOUR_HOME>/.claude/skills/carousel-render/assets/render.mjs';
//   renderDeck({ outDir, brand, slides });
//
// Each slide: { theme:'dark'|'light', footer:'bottom-left text', swipe:true|false, html:'<inner html>' }
// Renders 1080x1080 PNGs at 2x via headless Chrome/Edge. Intermediate HTML is deleted unless keepHtml:true.

import { writeFileSync, mkdirSync, readFileSync, rmSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { brands } from './brands.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const SLIDES_CSS = readFileSync(join(__dir, 'slides.css'), 'utf8');

function findBrowser() {
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  throw new Error('carousel-render: no Chrome or Edge found. Install Chrome or edit findBrowser() paths.');
}

export function renderDeck({ outDir, brand = 'wiwbuilds', slides, scale = 2, keepHtml = false }) {
  if (!Array.isArray(slides) || !slides.length) throw new Error('carousel-render: slides[] is required.');
  const b = brands[brand] || brands.wiwbuilds;
  mkdirSync(outDir, { recursive: true });
  const browser = findBrowser();
  const varBlock = ':root{' + Object.entries(b.vars).map(([k, v]) => `${k}:${v};`).join('') + '}';
  const flags = [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--run-all-compositor-stages-before-draw',
    `--force-device-scale-factor=${scale}`,
    '--window-size=1080,1080', '--virtual-time-budget=12000',
  ];
  const made = [];
  slides.forEach((s, i) => {
    const n = i + 1;
    const swipe = s.swipe === false
      ? '<span class="swipe">&#9632;</span>'
      : '<span class="swipe">swipe &rarr;</span>';
    const footer = `<div class="footer"><span class="brand">${s.footer || ''}</span>${swipe}</div>`;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">`
      + `<style>@import url('${b.font}');${varBlock}${SLIDES_CSS}</style></head>`
      + `<body><div class="slide ${s.theme || 'light'}">${s.html}${footer}</div></body></html>`;
    const hp = join(outDir, `slide-${n}.html`);
    const pp = join(outDir, `slide-${n}.png`);
    writeFileSync(hp, html, 'utf8');
    execFileSync(browser, [...flags, `--screenshot=${pp}`, `file:///${hp.replace(/\\/g, '/')}`], { stdio: 'ignore' });
    if (!keepHtml) rmSync(hp);
    made.push(pp);
    console.log(`rendered slide-${n}.png`);
  });
  console.log(`DONE — ${made.length} slides → ${outDir}`);
  return made;
}
