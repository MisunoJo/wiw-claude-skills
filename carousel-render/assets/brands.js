// Brand presets for carousel-render. Each preset = a Google-Fonts import URL
// + a map of CSS variables consumed by slides.css.
// Add a new brand by copying a block and changing the values.

export const brands = {
  // Navy + vivid blue, serif headlines (Source Serif Pro). The WiWBuilds / report look.
  wiwbuilds: {
    font: "https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap",
    vars: {
      '--serif': "'Source Serif Pro',Georgia,serif",
      '--sans': "'Inter',system-ui,Arial,sans-serif",
      '--paper': '#ffffff',
      '--dark': '#051C2C',
      '--ink': '#0c1722',
      '--head-light': '#051C2C',
      '--accent': '#2251FF',
      '--accent-dk': '#7FA0FF',
      '--eyebrow-light': '#2251FF',
      '--eyebrow-dark': '#7FA0FF',
      '--gray': '#6E7B85',
      '--sub-dark': '#c7d2de',
      '--sub-dark-2': '#b9c6d4',
      '--sub-dark-3': '#9fb0c0',
      '--rule': '#e4e8ec',
      '--rule-dk': 'rgba(255,255,255,.18)',
      '--soft': '#f3f6ff',
      '--soft2': '#dbe4ff',
      '--tag-bg': '#e6f7ee',
      '--tag-fg': '#1c7a4a',
      '--brand-dim-light': '#9aa6b0',
      '--brand-dim-dark': '#AFC3E0',
    },
  },

  // เขียงเนื้อพ่ออูด butcher shop — gold on near-black, Thai-safe (Bai Jamjuree).
  // Prefer theme:'dark' slides for this brand; light slides work but go off the dark-brand feel.
  // NOTE: this is for INFORMATIONAL text carousels in shop colors — it does NOT replace the
  // photo-based Canva brand templates (reel cover / square photo / 5-slide product carousel).
  aood: {
    font: "https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@400;500;600;700&display=swap",
    vars: {
      '--serif': "'Bai Jamjuree',sans-serif",   // shop brand has no serif; bold sans for heads
      '--sans': "'Bai Jamjuree',system-ui,sans-serif",
      '--paper': '#ffffff',
      '--dark': '#0F0F0F',
      '--ink': '#1A1A1A',
      '--head-light': '#0F0F0F',
      '--accent': '#D4A827',          // brand gold
      '--accent-dk': '#D4A827',
      '--eyebrow-light': '#B8901F',
      '--eyebrow-dark': '#D4A827',
      '--gray': '#888888',
      '--sub-dark': '#F0F0F0',
      '--sub-dark-2': '#C8C8C8',
      '--sub-dark-3': '#C8C8C8',
      '--rule': '#e4e0d4',
      '--rule-dk': 'rgba(212,168,39,.28)',
      '--soft': '#faf4e2',            // faint gold tint
      '--soft2': '#efe2bd',
      '--tag-bg': '#D4A827',
      '--tag-fg': '#0F0F0F',
      '--brand-dim-light': '#888888',
      '--brand-dim-dark': '#D4A827',
    },
  },

  // IdeaWeb — "a quiet clearing for your thoughts". Warm cream paper + deep teal-green
  // ink + coral accent + sage ambient. Monospace heads (JetBrains Mono) falling back to
  // Noto Sans Thai for Thai glyphs. Calm/airy: deep-teal cover & close, cream content.
  ideaweb: {
    font: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@400;500;600;700&display=swap",
    vars: {
      '--serif': "'JetBrains Mono','Noto Sans Thai',ui-monospace,monospace",
      '--sans': "'Noto Sans Thai','JetBrains Mono',system-ui,sans-serif",
      '--paper': '#f4f2e9',          // warm cream paper (the clearing)
      '--dark': '#16302b',           // deep teal-green
      '--ink': '#1c3b35',            // headline ink on cream
      '--head-light': '#1c3b35',
      '--accent': '#df6f68',         // coral (light slides)
      '--accent-dk': '#ef938b',      // softer coral on dark
      '--eyebrow-light': '#5e7d75',  // muted sage-teal small caps
      '--eyebrow-dark': '#9fc0b9',
      '--gray': '#6a7d77',           // secondary text on cream
      '--sub-dark': '#d8e2dd',
      '--sub-dark-2': '#bccdc6',
      '--sub-dark-3': '#a3b8b0',
      '--rule': '#e3ddcf',           // warm divider on cream
      '--rule-dk': 'rgba(159,192,185,.20)',
      '--soft': '#e7eee9',           // pale sage card tint on cream
      '--soft2': '#d6e2db',
      '--tag-bg': '#f6ded9',         // coral-tint tag
      '--tag-fg': '#b4534c',
      '--brand-dim-light': '#9aa8a2',
      '--brand-dim-dark': '#86a59c',
    },
  },

  // CDC / chaloke.com — sky blue + deep navy + gold CTA. Blue accents on light
  // slides, gold accents on navy (dark) slides — mirrors their navy banner + gold button.
  cdc: {
    font: "https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap",
    vars: {
      '--serif': "'Source Serif Pro',Georgia,serif",
      '--sans': "'Inter',system-ui,Arial,sans-serif",
      '--paper': '#ffffff',
      '--dark': '#14294A',            // deep navy banner
      '--ink': '#1a2733',
      '--head-light': '#14294A',      // navy headlines on white
      '--accent': '#2B95D6',          // CDC sky blue (light slides)
      '--accent-dk': '#F4B619',       // gold (dark slides) — like their CTA on navy
      '--eyebrow-light': '#2B95D6',
      '--eyebrow-dark': '#F4B619',
      '--gray': '#5b6b78',
      '--sub-dark': '#cdd9e6',
      '--sub-dark-2': '#b3c2d4',
      '--sub-dark-3': '#93a4b8',
      '--rule': '#e2e8ef',
      '--rule-dk': 'rgba(255,255,255,.16)',
      '--soft': '#eaf4fb',            // light sky-blue tint
      '--soft2': '#cfe6f6',
      '--tag-bg': '#F4B619',          // gold tag
      '--tag-fg': '#14294A',          // navy text on gold (their CTA pattern)
      '--brand-dim-light': '#93a4b8',
      '--brand-dim-dark': '#9db2c9',
    },
  },

  // Neutral slate + indigo. Safe default when there is no brand.
  generic: {
    font: "https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap",
    vars: {
      '--serif': "'Source Serif Pro',Georgia,serif",
      '--sans': "'Inter',system-ui,Arial,sans-serif",
      '--paper': '#ffffff',
      '--dark': '#0f172a',
      '--ink': '#0f172a',
      '--head-light': '#0f172a',
      '--accent': '#4f46e5',
      '--accent-dk': '#a5b4fc',
      '--eyebrow-light': '#4f46e5',
      '--eyebrow-dark': '#a5b4fc',
      '--gray': '#64748b',
      '--sub-dark': '#cbd5e1',
      '--sub-dark-2': '#b6c2d2',
      '--sub-dark-3': '#94a3b8',
      '--rule': '#e2e8f0',
      '--rule-dk': 'rgba(255,255,255,.16)',
      '--soft': '#eef2ff',
      '--soft2': '#dbe4ff',
      '--tag-bg': '#dcfce7',
      '--tag-fg': '#15803d',
      '--brand-dim-light': '#94a3b8',
      '--brand-dim-dark': '#94a3b8',
    },
  },
};
