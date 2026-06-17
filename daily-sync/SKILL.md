---
name: daily-sync
description: Morning briefing for the current project. Detects project from cwd, then gates on the frontmatter: Calendar-enabled projects (AoodBeef/CDC2025) get a live Google Calendar query sorted by time + priority; projects with calendar_marker/notion_tasks_db = none brief from project-state.md + session-log head (both local files) with zero MCP calls. Notion is reconciled via the Calendar mirror, never re-queried live. Use when Wiw types `/daily-sync` or says "what's on today", "today's plan", "วันนี้ทำอะไรบ้าง", "morning briefing", "เริ่มงาน".
---

# daily-sync — morning briefing per project

## When to invoke

Wiw runs this at the START of a work session (opposite of `/save-chat` which runs at end). Goal: tell Wiw exactly what to do today, in priority order, for THIS project.

## Step 0 — Detect project + capture start time

1. **Capture `skill_start_time`** (PowerShell: `Get-Date -Format "yyyy-MM-dd HH:mm:ss"`) — for runtime calculation at Step 5
2. Read `<cwd>\project-state.md` frontmatter → get `project_name`, `calendar_marker`, `notion_tasks_db`, `timezone`, `session_log_file` (optional)
3. If `project-state.md` doesn't exist → tell Wiw "ไม่เจอ project-state.md — รัน `/save-chat` ก่อนเพื่อ bootstrap project นี้"
4. Get today's date (PowerShell: `Get-Date -Format "yyyy-MM-dd"`)

## Step 0.5 — Ground in the state FIRST: session-log + project-state, BEFORE any MCP call (LEAN — zero MCP/ToolSearch)

`project-state.md` is auto-loaded via CLAUDE.md; the per-project session-log is a cheap local read (~15 lines). Read BOTH before any Calendar/Notion tool — this morning grounding is the whole point:
0. **Read the session-log head first (~15 lines** of `<cwd>\<session_log_file>`, default `session-log.md`). Find the most recent **/save-chat** entry (SKIP `/daily-sync` lines — a sync is a briefing, not work) for the `🔁 Since last session` line (Step 3):
   - newest /save-chat is today / yesterday / N days ago → phrase relative to today; a 00:00–05:00 save → "overnight save (HH:MM)".
   - newest head entry is a `/daily-sync` with no save after → `Since last session: opened <when> but never saved — using project-state (<Last updated>) as the last captured point` (don't fabricate a work phrase).
   - **session-log missing/empty** (new project) → **suppress** the `🔁` line; don't crash, don't guess, don't read the global log for it. (Step 0's missing-project-state abort still takes precedence.)
   - Match the date heading to today (newest day at TOP — don't read yesterday's tail as today). **Reuse this single head-read at Step 5b — don't re-read.**
1. **Apply the "🧭 How we work" block** as binding this session (V2.4 canonical, Tight–Loose–Tight, Notion=compass, data-first-but-weekly, lean). Don't make Wiw remind you.
2. **Lead the briefing with the next action, grounded — not the calendar:** surface the `## ⏭️ Next /daily-sync` `▶️` line first (the baton; match the section by *contains* `⏭️ Next /daily-sync`), with the `📍 Resume here` catch-up behind it. Wiw works in weekly batches; the calendar is often empty.
3. **Freshness check:** if `Last updated` is >2 days ago, say so and ask "what's progressed since <date>?" before trusting the plan — and suffix the First-up line with `(set <date>, Nd stale — re-confirm)` rather than presenting it as today's action. **Age the baton by its own `set <date>` token** when the `▶️`/`🎯` line carries one (so a freshly weekly-review-set baton isn't flagged stale just because the last /save-chat is older); fall back to `Last updated` only when no set-date is present. And if it was saved earlier the SAME day, verify what's shipped before treating it as live — the auto-loaded copy can be a stale cache (per `feedback_same_day_state_freshness`).
4. **Do NOT scan raw FB data** unless (a) today's task is a data/format/timing/review decision, OR (b) the rolling data file is >7 days stale (then flag it, suggest a pull — don't auto-scan). Data updates ~weekly; re-scanning every session wastes tokens.

## Step 0.6 — Integration gate (decides which steps run — don't skip this)

From the frontmatter (Step 0), read `calendar_marker` and `notion_tasks_db`. They pick the path. **Compare quote-/case-insensitively:** strip surrounding quotes + whitespace and case-fold before testing — `none`, `"none"`, `None` all mean opt-out (some real files write the quoted form). **Never call `ToolSearch` or load an MCP tool for a system this project doesn't use** — that loading is the whole token cost.

| `calendar_marker` | `notion_tasks_db` | Path |
|---|---|---|
| `none` | `none` | **STATE-ONLY** — skip Steps 1 & 2 completely. Zero MCP calls, zero `ToolSearch`. Brief from `project-state.md` + the session-log head (~15 lines) — both local files → Step 3 (state-only format) → Step 4 → Step 5. |
| set | anything | Run Step 1 (Calendar). Notion handled via the Calendar mirror in Step 2 — still no live Notion query. |
| `none` | set | Rare. Skip Step 1. No cheap live Notion query exists (see Step 2) — brief from state; suggest `/save-chat` if state is stale. |

Most projects (IdeaWeb, Xerathos, WiWGrowth, report, Multi Agens, games, Content-solution, Ledger) are **STATE-ONLY** and pay almost nothing per run. Only AoodBeef / CDC2025 reach the Calendar.

## Step 1 — Query Calendar (today only)

**Skip this entire step if `calendar_marker` is `none`** (state-only path — Step 0.6).

Load **only** `list_events` (one `ToolSearch` `select:` call — do NOT load any Notion tool), then call `mcp__claude_ai_Google_Calendar__list_events`:
- `startTime`: `<today>T00:00:00` in project timezone
- `endTime`: `<today>T23:59:59` in project timezone
- `fullText`: `[Project: <calendar_marker>]` (filters to this project)
- `orderBy`: `startTime`

## Step 2 — Reconcile with Notion via the Calendar mirror (NO live Notion query)

**Skip if** `notion_tasks_db` is "none".

Do **not** query Notion live. `/save-chat` already mirrors Notion → Calendar every night (its Step 4 pushes tomorrow's Notion tasks onto the Calendar; Notion is the source, Calendar mirrors it). So the Step-1 Calendar result **already is** today's Notion plan — re-querying is redundant, and this Notion MCP has no cheap way to do it anyway (see "What NOT to do").

Instead, gauge mirror freshness from `project-state.md` **`Last updated`**:
- **≤ 1 day old** → the Calendar = today's Notion plan. Trust it. Add a line `Notion↔Cal: in sync (last save <HH:MM>)`. On empty/sparse-Calendar days, fill the briefing from the state file's "What's queued next" + "Open follow-ups" (free — already loaded).
- **> 1 day old** → a `/save-chat` was likely skipped, so the Calendar may lag Notion. Flag: `⚠ Calendar may lag Notion — last /save-chat <N> days ago; run /save-chat to re-mirror.` Brief from Calendar + state anyway.
- **On-demand only:** if Wiw explicitly says "check Notion" / wants certainty, then (and only then) do the heavy per-page Notion read — warn him it costs ~5–8K+. Never the default.

## Step 3 — Display briefing

**Calendar projects** (Step 1 ran):

```
☀️ <Project name> — Today's Briefing (<YYYY-MM-DD>)

🔁 Since last session (<when>): <one phrase>     ← from session-log head (Step 0.5); omit the line if suppressed
<First-up line — render exactly as Step 4 produces it: `▶️ First up: …` or `▶️ First up (from queued — no baton set yet): …`>

⏰ Scheduled (sorted by time):

  09:00-10:00  🎯 [HIGH] <Event title>
               Reminder 15min before
  14:00-14:30  📊 [MED] <Event title>

Notion↔Cal: in sync (last save <HH:MM>)          ← if state ≤ 1 day old
⚠ Calendar may lag Notion — last /save-chat <N>d ago; run /save-chat   ← if > 1 day

Total: N scheduled events today
```

**State-only projects** (Step 0.6 STATE-ONLY path — no Calendar/Notion, zero tool calls):

```
☀️ <Project name> — Today's Briefing (<YYYY-MM-DD>)

🔁 Since last session (<when>): <one phrase>     ← omit if suppressed (Step 0.5)
📍 Resume here: <from project-state "📍 Resume here">
<First-up line — render exactly as Step 4 produces it; this is the one next-action line>
🔜 Queued: <other items from "What's queued next">
🧹 Open follow-ups: <rolling items>
```

Pull everything from the auto-loaded `project-state.md` — no MCP calls.

## Step 4 — Suggest first action

First-up source order (read project-state, never a Notion query):
1. The `▶️` line(s) from `## ⏭️ Next /daily-sync` (match the section by *contains* `⏭️ Next /daily-sync`; read each `▶️` line verbatim — treat a bare `▶` without the emoji selector as the same marker — keeping any `(carried — …)` suffix; surface BOTH lines if the project runs two lanes).
2. If that section is absent/empty, fall back IN ORDER to: (a) a `🎯 Next move (… by /weekly-review)` line inside `## What's queued next`, (b) a `▶️` line inside `📍 Resume here`, (c) the top `## What's queued next` bullet, (d) `## Open follow-ups`.

**Always label the source (the action line uses the `▶️` glyph; reserve `📍` for Resume here):**
- real baton → `▶️ First up: <action>` (add ` at <time>` if a calendar event matches)
- any fallback → `▶️ First up (from queued — no baton set yet): <action>`

For Calendar projects, prefer the earliest scheduled high-priority event for the time slot, but still show the baton as the first action when the calendar is empty.

## Step 5 — Log session start

**5a. Compute skill_runtime:**
- Get current time as `skill_end_time` (PowerShell)
- `skill_runtime` = `skill_end_time` − `skill_start_time` (in seconds)

**5b. Append to BOTH session-log files:**

Before inserting, read only the **head (~15 lines)** of each log to find today's heading — do NOT read the whole file (the new entry always goes at the top of today's section).

Per-project (`<cwd>\<session_log_file>`, default `session-log.md`) — create if missing with header `# Session Log — <project_name>`:
```
## YYYY-MM-DD (create today's heading if missing, newest day at TOP)

- HH:MM — /daily-sync · runtime Ns · <N events on calendar today | state-only, no calendar>
```

Global (`~/.claude/session-log.md`) — create if missing with header `# Session Log — All Projects`:
```
- HH:MM — [<project_name>] /daily-sync · runtime Ns · <N events on calendar today | state-only, no calendar>
```

Newest entry at TOP of each day's section.

**5c. Print at footer of briefing:**
```
⏱ /daily-sync took <N>s · logged to session-log
```

## What NOT to do

- Do NOT load any MCP tool or call `ToolSearch` for a system the frontmatter marks `none` (Step 0.6). For a no-Notion/no-Calendar project, the whole run is state-file + log — zero tool calls.
- Do NOT query Notion live. `notion-fetch` on the Tasks DB returns schema only (no rows); `notion-search` returns rows WITHOUT the `Day`/`Priority`/`Done` fields (verified). There is no cheap today's-tasks query — the Calendar IS the Notion mirror (save-chat Step 4).
- Do NOT `ToolSearch`-hunt for a Notion "query rows by date" tool — it does not exist in this MCP.
- Do NOT push new events to Calendar (that's save-chat's job at end-of-day)
- Do NOT mark tasks Done (that's save-chat's interactive flow)
- Do NOT query Calendar for dates other than today (this is a TODAY briefing)
- Do NOT cross multi-project — focus on the cwd's project only
- Do NOT deep-scan raw FB data on every run — weekly / on-demand only (see Step 0.5). Keep this skill lean and low-token.

## Why this exists

Wiw juggles multiple projects (CDC2025 trading, Aood butcher shop, others). Without a per-project briefing:
- Switching context = re-reading project state to know "what's on today"
- Notion + Calendar drift apart silently
- Easy to miss time-sensitive events (FIRST TRADE DAY, content deadline, etc.)

`/daily-sync` = one command gives full picture: scheduled events + Notion gaps + first action. Pairs with `/save-chat` (end of day): together they close the loop.
