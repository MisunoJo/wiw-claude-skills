---
name: save-chat
description: Save current conversation state to project-state.md (incl. the 📍 Resume-here + ⏭️ next-/daily-sync handoff sections), append to decisions-log.md if a durable decision was made, sync Notion tasks (today unfinished → interactive carry/done, tomorrow → push to Google Calendar day-by-day). Bootstraps new projects (creates strategy.md, project-state.md, decisions-log.md, Notion page+Tasks DB if missing). Use when Wiw types `/save-chat` or says "save the chat", "save chat", "เซฟ", "บันทึก". For verbatim (full transcript) mode, Wiw triggers with "save chat verbatim", "save chat full", "บันทึกเต็ม", "เซฟทุกข้อความ".
---

# save-chat — multi-project state save + Notion/Calendar sync

## Overview

Three modes:

| Trigger | Mode | Time | Files written |
|---|---|---|---|
| `/save-chat` · `save chat` · `เซฟ` · `บันทึก` | **State-only (default)** | ~30 sec | `project-state.md` + `decisions-log.md` (if applicable) + Notion task updates + Calendar pushes |
| `/save-chat verbatim` · `บันทึกเต็ม` · `เซฟทุกข้อความ` | **Verbatim (opt-in)** | 2-3 min | All of the above + verbatim transcript |

Both modes run the **Notion/Calendar sync** (Steps 3-4 below) — that's the new always-on behavior.

If trigger is ambiguous → default to state-only.

---

## Step 0 — Detect mode + project

**Mode detection:** Parse Wiw's most recent trigger for verbatim keywords (`verbatim`, `full`, `transcript`, `เต็ม`, `ทุกข้อความ`) → verbatim mode. Else → state-only.

**Project detection:**
1. Read `<cwd>\project-state.md` frontmatter (YAML block at top between `---` markers) → get `project_name`, `notion_page_id`, `notion_tasks_db`, `calendar_marker`, `strategy_file`, `timezone`
2. If `project-state.md` doesn't exist → **BOOTSTRAP** (see Step B below) before continuing
3. If `project-state.md` exists but missing frontmatter → ask Wiw to fill the missing fields, then save

**Get current system time** (PowerShell: `Get-Date -Format "yyyy-MM-dd HH:mm"`) — needed for save timestamp and "today/tomorrow" calculations. Use the actual returned value, not estimates.

**Capture skill_start_time** (PowerShell: `Get-Date -Format "yyyy-MM-dd HH:mm:ss"`) — save as variable for runtime calculation at Step 5. Do this BEFORE any other work begins.

---

## Step B — Setup (runs if project-state.md missing OR has no frontmatter)

Triggered when:
- `project-state.md` doesn't exist (new project), OR
- `project-state.md` exists but has no YAML frontmatter (existing project not yet adapted)

**FIRST: detect mode (Adapt vs Fresh):**

Run detection at cwd:
- `project-state.md` exists? `CLAUDE.md` exists? `conversations/` folder exists?
- Any `*strategy*.md` files (at root or in subfolders 1 level deep)?
- Any `decisions-log.md` (at root or subfolder)?
- Any `*knowledge*` folders?

If ≥2 signals found → **ADAPT mode** (existing project)
If 0-1 signals → **FRESH mode** (new project)

---

### B1 — ADAPT mode (existing project)

1. **Show what was detected:**
   ```
   เจอ project ที่มีอยู่แล้ว — จะ adapt มาใช้ workflow ของ skill:
   • project-state.md → <found / not found>
   • strategy file candidates: <list>
   • decisions-log.md → <path or not found>
   • conversations/ → <exists or not>
   ```
2. **Ask Wiw to confirm fields (with smart defaults from detection):**
   - `project_name`: suggest folder basename → confirm/edit
   - `strategy_file`: suggest most recent matching file (e.g., `*-v2.3.md` over `*-v2.md`) → confirm/edit
   - `decisions_log_file`: if found NOT at root → ask explicit path; if at root → leave as default
   - `notion_page_id` + `notion_tasks_db`: "มี Notion tracker อยู่แล้วมั้ย? paste URL หรือพิมพ์ 'no':" → extract IDs from URL OR skip
   - `calendar_marker`: default = `project_name` → confirm/edit
   - `timezone`: default `Asia/Bangkok`
3. **Write frontmatter** at top of existing `project-state.md` (PRESERVE existing body untouched)
4. **DON'T create** strategy.md / decisions-log.md / Notion (use existing)
5. Continue normal save-chat flow.

---

### B2 — FRESH mode (new project, e.g., Wiw Health)

1. **Ask Wiw:** "นี่เป็น project ใหม่ใช่มั้ย? ชื่ออะไร?" → store as `project_name`
2. **Ask:** "สร้าง strategy.md ด้วยมั้ย? (Y/n)" → if Y, write minimal template:
   ```markdown
   # <project_name> — Strategy
   > Source of truth for this project. Notion + Calendar pull tasks from here.

   ## Goals
   - [TBD]

   ## Tactics / Methodology
   - [TBD]

   ## Phases
   - Phase 0: [TBD]
   ```
3. **Create `decisions-log.md`** at cwd root (empty with format header)
4. **Ask:** "สร้าง Notion tracker ด้วยมั้ย? (Y/n) — จะสร้าง page + Tasks DB ให้อัตโนมัติ"
   - If Y → use `mcp__claude_ai_Notion__notion-create-pages` + `mcp__claude_ai_Notion__notion-create-database` (schema: Task/Day/Done/Phase/Week/Category/Priority/Notes)
   - Store returned IDs (page_id, data_source_id) for frontmatter
5. **Ask:** "Calendar marker tag คืออะไร? (default = project_name)" → store as `calendar_marker`
6. **Write `project-state.md`** with YAML frontmatter:
   ```yaml
   ---
   project_name: <name>
   notion_page_id: <id or "none">
   notion_tasks_db: <id or "none">
   calendar_marker: <marker>
   strategy_file: strategy.md
   timezone: Asia/Bangkok
   ---
   ```
   followed by standard state-only template (see Step 1).
7. Continue normal save-chat flow.

---

### Frontmatter field reference

| Field | Required? | Default | Notes |
|---|---|---|---|
| `project_name` | yes | — | Display name |
| `notion_page_id` | yes | `"none"` | Notion page UUID; "none" if not using Notion |
| `notion_tasks_db` | yes | `"none"` | Notion DB UUID for Tasks |
| `calendar_marker` | yes | `project_name` | String used in `[Project: X]` Calendar filter |
| `strategy_file` | yes | `strategy.md` | Path relative to cwd |
| `decisions_log_file` | **optional** | `decisions-log.md` | Path relative to cwd. Only specify if non-default (e.g., subfolder) |
| `session_log_file` | **optional** | `session-log.md` | Path relative to cwd for per-project session timing log. Only specify if non-default |
| `timezone` | yes | `Asia/Bangkok` | IANA timezone name |

---

## State-only mode (default — runs every save)

### Step 1 — Refresh `project-state.md`

Overwrite `<cwd>\project-state.md`. Preserve the YAML frontmatter at top (project metadata). Update everything below.

Required structure (below frontmatter):
```markdown
# Project State — <project_name>
**Last updated:** <YYYY-MM-DD HH:MM> by /save-chat
**Source conversation:** <relative path to verbatim transcript IF verbatim mode, else "(state-only save — no transcript)">
**Previous saves:** <newest first, last 6-8>

## Where we are now
<one paragraph — what phase, what was just completed, current system state>

## 📍 Resume here
<catch-up: where we left off + the decision gate + data/freshness status — the broader picture>

## ⏭️ Next /daily-sync
▶️ <the most concrete next action for the next session (one per lane, up to two — see rules below) — the baton /daily-sync surfaces first>

## What's queued next
- <near-term tasks, dated where known>

## Load-bearing files (read these first next session)
- <list>

## External systems touched this session
- Notion: <one line or "none">
- Google Calendar: <one line or "none">
- Other: <one line or "none">

## Open follow-ups (rolling — carry forward until cleared)
- <bullet list of un-done items>
```

Rules:
- **Overwrite, don't append** — it's a snapshot
- **Keep ≤ 80 lines** below frontmatter
- **Carry forward open follow-ups** from previous version; drop resolved
- Preserve frontmatter untouched
- **Preserve the "🧭 How we work" block verbatim** (stable operating principles near the top — don't rewrite it).
- **The two handoff sections are SINGLE-INSTANCE and refreshed every save — never dropped on overwrite:**
  - Use the exact headings `## 📍 Resume here` and `## ⏭️ Next /daily-sync` (no decoration on the heading itself — put any status into the body).
  - **Find-or-relocate, don't blind-insert.** Before writing, scan the prior file for a heading *containing* `📍 Resume here` (ignore any trailing ` — …` suffix AND its current position — live files keep it at the top, after 🧭, or near the end). Refresh that one in place, delete any duplicate, and demote a decorated suffix into the body. If none exists, create it right after the 🧭 block. Place `## ⏭️ Next /daily-sync` immediately after `📍 Resume here`. **Exactly one of each per file.**
  - `📍 Resume here` = the catch-up (where we left off + decision gate + data/freshness status). `## ⏭️ Next /daily-sync` = the baton `daily-sync` reads first: a single `▶️ <imperative first action>` surfaced THIS session (prefer it over any `🎯 Next move (by /weekly-review)` line). Carry both forward unchanged unless this session surfaced a newer action. When this session DOES set a fresh `▶️`, also clear/refresh any now-stale `🎯 Next move (set … by /weekly-review)` line in `## What's queued next` so the two never disagree.
  - **Zero-progress guard:** if essentially nothing shipped this session, don't distil a baton from an empty session — set the `▶️` line to the top carried open item, suffixed `(carried — no progress <date>)`.
  - **Multi-lane:** if two distinct active lanes each have a live next-action (e.g. AoodBeef app + content floor), write up to TWO `▶️` lines, one per lane (cap at two — never let it become a backlog). Reserve the `▶️` glyph for THIS section; use a different marker for any inline "next" note elsewhere in the body. When refreshing the `📍 Resume here` body, convert any pre-existing inline `▶️` note (e.g. a carried-forward `▶️ APP NEXT:`) to a non-`▶️` marker (🛠/📣) so `▶️` lives ONLY under `## ⏭️ Next /daily-sync`.
  - **Bootstrap / no-work-yet save:** still create both — `📍 Resume here` = "project bootstrapped — no work yet" and the `▶️` line = the first queued item, or omit it. Never fabricate a baton.

**Example — the two handoff sections, filled in:**
```markdown
## 📍 Resume here
Dashboard redesign (dark UI + 9:16 snapshot) built + headless-verified; deploy pending. Trading state unchanged since Jun 14; 8 positions open. Gate: deploy before the next trade session.

## ⏭️ Next /daily-sync
▶️ Deploy the redesigned dashboard (paste dashboard.html + dashboardWebApp.gs → Apps Script → Manage deployments → New version), then run the 8-position management loop.
```

### Step 2 — Append to decisions-log if durable decision was made

Resolve decisions-log path: use `decisions_log_file` from frontmatter if set, else default to `<cwd>\decisions-log.md`. If file doesn't exist → skip (Setup creates it for Fresh mode; Adapt mode uses existing).

**Append ONLY if one or more of:**
- A new memory file was created in `<memory_folder>\`
- An existing memory file's body was edited (rule changed)
- `strategy.md` (or project's equivalent) was edited
- Wiw explicitly flagged a decision as "durable" / "lock this in" / "from now on"

Routine close-outs do NOT warrant a log entry.

**If yes, prepend a new entry** at the top (just below `---` separator):
```markdown
## <YYYY-MM-DD> — <Short decision title>

**Decision:** <one paragraph, active voice>
**Why:** <one sentence — reason or trigger>
**Lives in:** <files where this rule canonically lives>
**Conversation:** <if verbatim: `conversations/<filename>`, else: "(state-only save — no transcript)">
```

### Step 3 — Notion: the WEEK-AHEAD task plan

**Horizon (Wiw's rule, 2026-05-29):** Notion holds the rolling **~1-week-ahead** task plan; Google Calendar pulls only **tomorrow** from it (Step 4). Notion is the single source — Calendar mirrors it, never the reverse.

**Skip if** `notion_tasks_db` is "none" in frontmatter (Notion not set up).

1. Query Notion Tasks DB filter `Day == today AND Done == false`
2. Also count today's tasks with `Done == true` (to detect "no progress today" edge case)
3. **If results > 0:**
   - **Edge case:** if zero done today AND ≥3 unfinished → auto-carry ALL to tomorrow (Wiw didn't work today, just roll forward). Report: "Auto-carried N tasks to tomorrow (no progress today)"
   - **Normal case:** present list:
     ```
     Today's unfinished (N):
     1. [HIGH] <Task title>
     2. [MED] <Task title>
     ...
     ```
   - For each, ask Wiw interactively: "Task #N — Done / Carry to tomorrow / Skip (leave as-is)?"
   - **Done** → update Notion: set `Done = __YES__`
   - **Carry** → update Notion: set `date:Day:start = tomorrow`
   - **Skip** → no change
4. **Week-ahead upkeep:** ensure the upcoming ~7 days have their planned tasks in Notion (the Sunday batch populates this). If a concrete next-action surfaced THIS session isn't a Notion task yet, create it (dated within the week-ahead horizon, with Category/Week/Priority). If the next week is unplanned near a week boundary, flag "next week not planned yet." Don't duplicate a task an umbrella batch page already covers.

### Step 4 — Calendar: push tomorrow's tasks day-by-day

**Skip if** `calendar_marker` is "none" in frontmatter.

1. Query Notion Tasks DB filter `Day == tomorrow`
2. Query Calendar events for tomorrow (full day), filter `fullText` contains `[Project: <calendar_marker>]`
3. For each Notion task without matching Calendar event (match by exact Task title):
   - Determine time block based on Category:
     - `Scan` → 09:00-11:00
     - `Trade` → 09:55-10:30
     - `Sheet Ops` → 16:30-17:00
     - `Review` → 15:00-16:00
     - Other / unset → 14:00-14:30
   - Create event:
     - `summary`: `<emoji from category> <Project>: <Task title>`
     - `description`: `[Project: <calendar_marker>]\n\n<Notes from Notion>\n\nNotion: <task URL>`
     - `timeZone`: from frontmatter (default Asia/Bangkok)
     - Reminder: 15 min before (popup)
4. **Do NOT bulk-push beyond tomorrow.** Only the next single day.
5. Report: "Pushed N new events to Calendar for <tomorrow date>"
6. **Compass integrity (reverse check):** every tomorrow `[Project: <marker>]` Calendar event must have a matching Notion task (it will, since Notion is the week-ahead source). If one is orphaned, create the Notion task (Day = tomorrow) instead of leaving a Calendar-only event.

### Step 5 — Log session + confirm to Wiw

**5a. Compute runtimes:**
- Get current time as `skill_end_time` (PowerShell: `Get-Date -Format "yyyy-MM-dd HH:mm:ss"`)
- `skill_runtime` = `skill_end_time` − `skill_start_time` (in seconds)
- Resolve `session_log_file` path: use the frontmatter field if set, else default `session-log.md` in the **saved project's own folder** (the folder whose `project-state.md` this save targets — not necessarily literal `<cwd>`, so a cross-folder save still logs to the right project)
- Read per-project session-log → find latest `/daily-sync` entry today (same date)
- If found → `session_duration` = `skill_start_time` − `daily_sync_time`
- If not found → no session duration ("(no /daily-sync — single save)")

**5b. Append entries to BOTH session-log files:**

Per-project (`<cwd>\<session_log_file>`) — create if missing with header `# Session Log — <project_name>`:
```
## YYYY-MM-DD (create today's heading if missing, newest day at TOP)

- HH:MM — /save-chat · runtime Ns · <mode> · session Xh Ym (since /daily-sync at HH:MM)
```

Global (`~/.claude/session-log.md`) — create if missing with header `# Session Log — All Projects`:
```
- HH:MM — [<project_name>] /save-chat · runtime Ns · <mode> · session Xh Ym (since /daily-sync at HH:MM)
```

Newest entry at TOP of each day's section.

**5c. Print summary (3-5 lines):**
- `project-state.md` updated at `<timestamp>`
- `decisions-log.md` entry added (title, if applicable)
- Notion: N tasks done / M carried / K skipped
- Calendar: J events pushed for `<tomorrow date>` (or "no new events needed")
- Mode: state-only or verbatim

**5d. Print timing footer:**
```
⏱ /save-chat took <N>s
📊 Session: <duration> (since /daily-sync at HH:MM)
   OR
📊 Session: (no /daily-sync — single save)
```

**End of state-only mode.**

---

## Verbatim mode (opt-in — runs in addition to state-only)

Verbatim mode runs state-only Steps 1-5 PLUS writes a full transcript. Order: write transcript first (Steps V1-V3), then run state-only.

### Step V1 — Pick a topic slug

1–4 hyphenated English words reflecting the conversation's dominant subject (e.g., `ledger-v2-build`, `monthly-report-feb`, `pinned-post-copy`).

### Step V2 — Build filename

Get current time (PowerShell: `Get-Date -Format "HHmm"`). Format: `YYYY-MM-DD_HHMM_<slug>.md`. Alphabetical sort = chronological.

### Step V3 — Write verbatim transcript

Path: `<cwd>\conversations\<filename>.md`. Create folder if missing.

```markdown
---
name: <YYYY-MM-DD> — <Short Title>
date: <YYYY-MM-DD>
topic: <slug>
summary: <one sentence>
files_touched: [...]
notion_pages_touched: [...]
next_session_should_read_first: [...]
---

# Conversation — <date>

> Verbatim transcript. Quote exactly.

## Turn 1

**User:**
> <verbatim user message>

**Assistant:**
<verbatim assistant prose>

[Tools used: <one-line description>]

## Turn 2
...
```

**Verbatim rules:**
- User messages: 100% verbatim (typos, casing, all of it)
- Assistant prose: 100% verbatim (preserve tables, lists, code blocks)
- Tool calls: condense to `[Tools: ...]` one-line notes
- System reminders: omit unless they carried real instructions from Wiw
- Long deliverables (full strategy doc): reference path `[Full content saved to <path>]` instead of duplicating
- **Multi-pass saves: copy prior turns through UNCHANGED.** Verbatim is a property of the file, not just the initial save.

### Step V4 — Run state-only Steps 1-5

Reference the transcript path in `Source conversation:` field of project-state.md and in `Conversation:` field of decisions-log.md (if applicable).

**The "copy prior turns UNCHANGED" rule (above) applies ONLY to transcript turns.** The project-state Steps 1-5 ALWAYS run in full and ALWAYS refresh the `## 📍 Resume here` + `## ⏭️ Next /daily-sync` sections — verbatim mode never freezes the state snapshot.

### Step V5 — Confirm

Print final summary (transcript path + state save summary).

---

## What NOT to do

- Do NOT default to verbatim when trigger is ambiguous. State-only is safe default.
- Do NOT summarize user words in verbatim mode.
- Do NOT condense earlier turns when re-saving an existing transcript to append new turns.
- Do NOT bulk-push to Calendar beyond tomorrow. Day-by-day only.
- Do NOT touch Notion/Calendar if their IDs are "none" in frontmatter (project opted out).
- Do NOT hardcode any paths — derive everything from cwd.

## Why this exists

Wiw works across multiple chat sessions and multiple projects (CDC2025 trading, Aood butcher shop, etc.). Without persistence:
- Next session loses corrections, decisions, file references, progress
- Tasks live in Notion but Wiw forgets to push reminders to Calendar
- "What did I leave off?" requires re-reading conversation history

State-only + Notion sync + Calendar push together preserve ~95% of value at ~30 sec time cost. Verbatim mode covers the remaining 5% when wording matters.
