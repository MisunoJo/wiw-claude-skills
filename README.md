# wiw-claude-skills

A few [Claude Code](https://claude.com/claude-code) **skills** I built for my own work, shared for anyone to use or adapt.

A skill is just a folder with a `SKILL.md` (plus any helper files). Claude Code loads it automatically and invokes it when your request matches the skill's description.

## Install

Copy any skill folder below into your personal skills directory, then restart Claude Code:

- **macOS / Linux:** `~/.claude/skills/`
- **Windows:** `%USERPROFILE%\.claude\skills\`

```bash
# example: install the report writer
git clone https://github.com/MisunoJo/wiw-claude-skills
cp -r wiw-claude-skills/mckinsey-report ~/.claude/skills/
```

Run `/skills` in Claude Code to confirm it's loaded.

## Skills

| Skill | What it does |
|-------|--------------|
| **mckinsey-report** | Research a topic and write a structured, McKinsey-style report end to end — issue tree, action-titled sections, exhibits. Self-contained; works for anyone. |
| **carousel-render** | Turn a doc or notes into a polished **square PNG carousel** (Instagram/Facebook slides, explainer deck) from an HTML/CSS component kit rendered via headless Chrome. |
| **save-chat** | End-of-session skill: save conversation state to project files and sync tasks to Notion + Google Calendar. *(Part of my personal operating system — see note below.)* |
| **daily-sync** | Morning briefing for the current project, from its state file plus (optionally) a live Google Calendar query. *(Personal-OS skill — see note below.)* |
| **weekly-review** | Whole-machine end-of-week review: aggregates everything done across **all** projects since the last review (from a global session-log + each project's state file + optional Notion/Calendar), shows every project's current stage, then walks you project-by-project to plan next week and caps with a big-picture through-line. *(Personal-OS skill — shipped genericized so the flow is reusable; see note below.)* |

### carousel-render — requirements
Needs **Node.js** and **Google Chrome or Microsoft Edge** installed (the renderer drives one of them headless). No `npm install` needed — it uses only Node built-ins. After copying the folder, point the `import` line in your `deck.mjs` at your own install path (`<YOUR_HOME>/.claude/skills/carousel-render/assets/render.mjs`). Brand presets `wiwbuilds`, `aood`, and `generic` live in `assets/brands.js` — `generic` is a neutral starting point you can re-skin.

### A note on `save-chat`, `daily-sync`, and `weekly-review`
These three are my **personal-OS loop** — a closed cycle: **`weekly-review` (week) → `daily-sync` (morning) → work → `save-chat` (night)**. They're wired to conventions I use — per-project folders each with a `project-state.md`, a global session-log, Notion task-DB fields, and Google Calendar tagging — so they won't run as-is against your accounts. I'm sharing them as **templates**: read the `SKILL.md`, see how the loop fits together, and adapt the field names and paths to your own system. `weekly-review` ships **genericized** (no personal names, projects, or paths) so its flow is the easiest of the three to reuse directly.

## License

MIT — see [LICENSE](LICENSE). Use, modify, and share freely.
