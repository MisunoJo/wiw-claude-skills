---
name: weekly-review
description: Whole-machine end-of-week review. Reads a GLOBAL session-log (every daily-sync / save-chat entry across ALL projects) as the activity spine for everything since the last review, then shows every project's CURRENT STAGE (active or dark) from its project-state.md, enriching active ones with Notion (tasks Done) + Google Calendar (events) where configured. Presents one aggregated "what I did since last review" across every project, PLUS a remaining-tasks roster (full open backlog). Then asks YOU the next move for EACH project — you write it yourself (no options, no guessing) — and saves it as a note in that project's `## What's queued next` (which daily-sync then reads) + a global week-ahead.md board (Notion projects can also get it as tasks), capped by a big-picture through-line direction. Appends a portfolio trend to a global weekly-log.md. Use when you type `/weekly-review` or say "weekly review", "week in review", "what did I do this week", "wrap the week", "Sunday batch", "สรุปสัปดาห์", "รีวิวอาทิตย์นี้", "อาทิตย์นี้ทำอะไรไปบ้าง", "วางแผนสัปดาห์หน้า". `/weekly-review here` reviews only the cwd project.
---

# weekly-review — whole-machine week in review + per-project planning

> **Personal-OS template.** This is the weekly bookend of a three-skill loop: `weekly-review` (week) → `daily-sync` (morning) → work → `save-chat` (night). It assumes a few conventions you can adapt to your own setup:
> - Each project lives in its own folder under a **projects root**, and carries a `project-state.md` with a small YAML frontmatter (`project_name`, `status`, `calendar_marker`, `notion_tasks_db`, `notion_page_id`, `timezone`).
> - A global `~/.claude/session-log.md` collects one-line entries written by every `daily-sync` / `save-chat` session.
> - Notion and Google Calendar are **optional** per-project integrations — a project opts out by setting the relevant ID to `none`.
>
> Set your **projects root** in Step 1 and adjust the paths / field names / time commands to your own system. Time commands below use PowerShell `Get-Date` (Windows); on macOS/Linux use `date "+%Y-%m-%d %H:%M:%S"`.

## When to invoke

Run this at the END of a week (typically Sunday) to see **everything done across every project on your machine** in the last 7 days, then load next week's plan. It's the zoom-out bookend to `daily-sync` (opens a day) and `save-chat` (closes a day).

Two halves:
1. **Look back (default, whole-machine)** — summarize **everything since the last review** across ALL projects (sourced from the global session-log + each project's `project-state.md` + Notion + Google Calendar where configured), and show **every project's current stage** — active ones by what moved, dark ones by where they now sit (not a bare "went dark"). Also inventories every project's **still-open tasks** (the remaining-tasks roster, Step 3.6).
2. **Look forward (EVERY project)** — for each project, having just seen its current stage, **you write the next move yourself** — no multiple-choice, no guessing/pre-filling. Your move is saved as a note in that project's `## What's queued next` (which `daily-sync` reads when you next open the project) AND mirrored to a global `week-ahead.md` board. Notion-enabled projects can also get the move written as Notion task(s). The forward half then **caps with a through-line** (Step 5.5): one big-picture direction move for YOU, synthesized from all your project moves — the "big picture of me" above the folders.

## Step 0 — Mode + start time + windows

1. **Capture `skill_start_time`** (PowerShell: `Get-Date -Format "yyyy-MM-dd HH:mm:ss"`) — for runtime at the end. Do this FIRST.
2. **Mode:**
   - default (no arg, or `all` / `portfolio` / `ทุก project`) → **whole-machine mode** (Steps 1–6)
   - `here` / `this project` / `เฉพาะ project นี้` → **single-project mode** (skip discovery; review only cwd's project, then its one-project planning round)
3. **Windows** (use real returned values, never estimate):
   - `today` = `Get-Date -Format "yyyy-MM-dd"`
   - `since` = the **previous weekly-review's end date** — read the top `## Week of … → <prev_end>` entry in `~/.claude/weekly-log.md` and set `since` = the day AFTER `<prev_end>` (don't re-count it). **Fallback** = today − 6 if weekly-log is empty/missing. Review window = **[since .. today]** — *everything since the last review*, so the gap between reviews never swallows a day. If `since` < today − 13, flag the long gap in the header.
   - `next_start` = today + 1, `next_end` = today + 7 → plan window **[next_start .. next_end]**

---

## LOOK BACK — whole-machine (default mode)

### Step 1 — Build / refresh the project registry

Your machine has many projects; their FOLDER names differ from session-log DISPLAY names, and some logged projects have no state file (and vice-versa). Reconcile both sources.

1. **Glob** `<your projects root>/**/project-state.md` — **set your projects root** to wherever your project folders live (e.g. `~/projects`, or a Desktop/work folder). **Skip archives:** ignore any match whose path contains a folder named `_archive` (or any `_`-prefixed folder) — that's a common retired-project convention; those are intentionally out of the active registry. **Also skip delivered deliverables:** if a file's frontmatter has `status: delivered`, exclude it too (a finished deliverable, not an ongoing project). For each remaining file, read the YAML frontmatter → `project_name`, `status`, `calendar_marker`, `notion_tasks_db`, `notion_page_id`, `timezone`, and record its **path**.
2. **Dedupe:** when several `project-state.md` share a `project_name` (e.g. a project with duplicate state files in subfolders), keep the **most recently modified** as canonical and treat the rest as stale copies — don't double-count them.
3. **Cache** the result to `~/.claude/projects-registry.md` (table: `display_name | folder_path | calendar_marker | notion_tasks_db | last_seen`). Create if missing; update rows on each run. This makes the name↔path↔IDs mapping fast and stable across runs.

### Step 2 — Read the activity spine (global session-log)

The global log is the authoritative "what I did" timeline — every `daily-sync` / `save-chat` already wrote rich one-line notes there.

1. Read `~/.claude/session-log.md`.
2. Extract every entry whose date heading is in **[since .. today]** (all activity since the last review).
3. **Group by project display name** (the `[Name]` tag). For each project, collect: session count, distinct active days, and the substantive notes (what shipped / decided / pivoted — it's already in the entries).
4. Match each log project to a registry row (by name ≈ `calendar_marker`/`project_name`). Note any **unmatched** projects (logged but no state file) — still include them in the review from the log alone; flag "no state file."

### Step 3 — Read EVERY project's current stage (+ enrich the active ones)

The spine of the review: **every project shows its current stage — active or dark.** For EACH project in the registry, read its `project-state.md` (at the registry path — NOT auto-loaded since cwd differs, so read it): grab **"Where we are now"** + the **"📍 Resume here"** pointer = that project's **current stage** (condense to one tight line), plus its **open follow-ups**. This is the line a dark project gets *instead of* a bare "went dark" — so "no activity" still tells you exactly where the project sits.

Then, only for projects **active since the last review** (they appear in Step 2), additionally pull concrete task/calendar truth. Skip a source when its ID is `"none"`.

- **Notion** (if `notion_tasks_db` ≠ none): query Tasks DB `Day >= since AND Day <= today`. Split **Done** (`Done == true`) vs **Slipped** (`Done == false`, still in-window). Note chronic carries (Day moved >1×).
- **Calendar** (if `calendar_marker` ≠ none): `mcp__claude_ai_Google_Calendar__list_events` for the window, `fullText: [Project: <calendar_marker>]` → scheduled blocks; flag events with no matching Notion task (drift).
- **decisions-log.md** (registry path, if present): entries dated in-window → decisions locked.

Keep it lean: don't deep-scan raw data files; current-stage + the task/decision/calendar layer is the point.

### Step 3.5 — Execution heartbeat (accountability for real-world-stakes projects)

Activity logs measure *building*; this measures *showing up in the real world*. Some projects only matter when a real action happens **off-screen** — a trade placed, a post published, a customer reply sent. A project can look busy in the log (lots of planning/re-systematising) while the real thing hasn't happened in weeks. Surface that.

**Opt-in via frontmatter.** A project marks itself execution-stakes with:
- `exec_metric: <the real-world action>` — e.g. `trades placed`, `posts published`
- `exec_last: <YYYY-MM-DD | never>` — when it last *actually* happened (optional)
- `exec_redline: <days>` — stall threshold (optional, default **7**)

For each project that declares `exec_metric`:
1. Get `last_action` from `exec_last`. **If `exec_last` is missing or older than the window, ASK** ("When did <project> last actually <exec_metric>?") — **never infer it from session activity** (working on it ≠ doing it). Offer to persist the answer via `/save-chat` so next week it's automatic.
2. `days_since = today − last_action` (or ∞ if `never`).
3. Flag: 🔴 if `days_since > exec_redline` or `never` · 🟡 within 2 days of redline · 🟢 otherwise.

If **no** project declares `exec_metric` yet, scan the look-back for execution-stall markers ("0 done", "did nothing", "not built/posted", chronic staleness) and **offer** to set up a heartbeat on those projects (ask for the metric + last date, then point to `/save-chat` to lock it in). Don't force it — name the candidates.

The point is one honest number, shown every week, so a quiet stall becomes loud.

### Step 3.6 — Remaining-tasks roster (the full open-work inventory, every folder)

Step 3's **"Slipped"** only counts tasks that were *scheduled inside this week's window*. This step answers the broader question — **"which project / folder still has tasks left to do?"** — by inventorying ALL open work regardless of date, so backlog and undated/future-dated open items don't stay invisible. Slipped ⊂ Remaining; keep the two distinct.

Run for **every project in the registry — active AND dark** (a dark folder can still hold a backlog). For each:

- **Notion-enabled** (`notion_tasks_db` ≠ none): query the Tasks DB for **all `Done == false`** (drop the date filter Step 3 used). Count them; split **overdue** (`Day < today`) from undated/future. Keep the soonest/oldest few for display.
- **Non-Notion** (`notion_tasks_db == none`): read the project-state.md **`## Open follow-ups (rolling — carry forward until cleared)`** section (every project has one) plus **`## What's queued next`** if present. Each unchecked/unstruck bullet = one remaining task.
- A project with an empty Open-follow-ups section AND no open Notion task → **✅ clear** (a clean folder is signal too — say so).

**Flag per project:** 🔴 has overdue Notion task(s) OR ≥1 open item on a *dark* project (stale backlog) · 🟡 has open items, none overdue · ✅ none open.

Keep it a roster, not a dump: list each project's actual open items, but **cap a long Notion backlog at ~5 and add a `• +N more` line**. **Read-only** — Step 3.6 never ticks, creates, re-dates, or moves a task (that's `save-chat` / the Sunday batch).

### Step 4 — Present the whole-machine week in review

```
🗓 Review — whole machine · since last review (<since> → <today>)

📊 Totals: <P> projects · <S> sessions across <D> active days (window <Wd>d)
   ✅ <Tdone> tasks shipped · 🔁 <Tslip> slipped · 🔒 <Tdec> decisions locked
   📂 <Topen> tasks still open across <Po> projects (full backlog, not just this week)

⏱ Execution heartbeat (real-world stakes — only projects that declare exec_metric):
   🔴 <Project> — <metric>: <N> days since (redline <R>)   ← stalled, say it plainly
   🟢 <Project> — <metric>: <N> days since

────────────────────────────────────────
🟢 <Project A>          <s> sessions · <d> days
   ✅ Did:      <concrete wins since last review — session-log notes + Notion Done>
   🔁 Slipped:  <undone/carried — name chronic carries>
   📍 Stage:    <CURRENT STAGE — "Where we are now" + Resume-here, one line>
🟢 <Project B>          ...
⚪ <Project C>          no activity since last review
   📍 Stage:    <its CURRENT STAGE from project-state — where it's parked>
────────────────────────────────────────

📂 Remaining tasks (open, all-time — every folder, not just this week)
   🔴 <Project> — <N> open (<X> overdue)
      • <open item>
      • <open item>
      • +<N> more
   🟡 <Project> — <N> open
      • <open item>
   ✅ Clear: <Project · Project · Project>   ← folders with nothing open
────────────────────────────────────────

💬 Read (3-5 sentences): where the week's attention ACTUALLY went vs. where it
   should have (tie to what's strategically hot — e.g. a launch deadline, your
   publishing cadence). Which project carried momentum, which stalled and why,
   what's the one thing next week most needs. Ground every claim in the data above.
```

Every project gets a `📍 Stage` line — that's the heart of the review: active ones show what moved + where they now sit; dark ones show their current stage, so "no activity" still says exactly where the project stands.

---

## LOOK FORWARD — per-project next move (YOU write it) + through-line

### Step 5 — Ask the next move for each project (YOU write it — no options, no guessing)

Having just seen each project's **current stage** (Step 3/4), you decide the **next move** yourself. Hard rules for this step:
- **Do NOT use `AskUserQuestion` / multiple-choice.** Ask in plain text; you type the move.
- **Do NOT guess, suggest, pre-fill, or recommend an action.** Present only the factual current stage; the move is yours to write. (The stage line is read from `project-state.md`, not invented.)

**5a — Show all first, then ask ONE project at a time.** First the full board so you see everything (the Step 4 review already lists every project with its current stage — that overview IS the "show all"; confirm it looks right). THEN walk the projects **one at a time, in heat order** (execution-stakes / 🔴 first → active → dark/parked): ask a single plain-text question for ONE project, **wait for your free-text answer, capture it, then move to the next.** Never dump all the blanks at once for batch fill; never use options. One project per turn keeps each move deliberate.
```
✍️ (one project per turn)
<Project> — stage: <one-line current stage from project-state>.
   What's your next move?  (write it yourself · or "park" / "skip")
```
Keep each prompt to that one project + its factual stage + the open question. "park"/"skip" is always fine; don't pressure, don't suggest.

**5b — Capture verbatim** what you wrote as each project's next move. **Skip** → leave that project's existing `## What's queued next` untouched (don't blank it). **Park** → record "⏸ parked" + any reason given. Never invent a move for a project not answered.

**5c — Notion-enabled projects only.** If the move written for one of these is a concrete task, offer to also write it as Notion task(s): **draft** (Day / Week / Category / Priority) → **show it** → on confirm **write** to the Tasks DB (`mcp__claude_ai_Notion__notion-create-pages`: `Task`, `Day`, `Week`, `Category`, `Priority`, `Done = false`, `Notes`). A carried slipped task already in Notion → move its `Day`, don't duplicate. **Do NOT push to Calendar** — `save-chat` mirrors one day forward.

Persistence (the move written as a note into each project-state + the board) happens in Step 6 — that note is what `daily-sync` reads when you next open the project.

### Step 5.5 — Through-line: the big-picture direction move (for YOU, not a project)

The per-project round answers "what's next for each folder." This step zooms one level **above the projects** to answer the question that actually matters: **"across everything, where am *I* heading — what's the one move that matters?"** It's the big-picture-of-me layer.

**Bottom-up — the through-line emerges from the moves just written.** Look across: the moves written in Step 5 + what was actually done in the look-back + the execution heartbeat + the remaining-roster. Then name the **single through-line** connecting them — what this period is really about for you.

Hold it honest against the things you've told the assistant matter most:
- **Your north-star goal** — whatever you've defined as the thing that actually counts (income, independence, health, shipping a specific launch). Measure the week against *that*, not against how many artifacts got built.
- **Any known pattern worth watching** — e.g. a **build-vs-ship gap**: shipping lots of *building* while avoiding real-world-stakes *execution* (a trade placed, a post shipped, a pitch sent). If that's a pattern for you, weigh the week against it.

So the through-line is **coaching, not cheerleading**. If the week's decided moves are all comfort-building and dodge the move that actually advances your goal, **say it plainly** and propose the harder direction (e.g. "3 of your 11 moves cross a real-world line this week — that's the shift from building to executing; protect those three, let the rest idle"). If the moves genuinely point at the goal, name the momentum and what protects it.

Present **one sharp headline + 1-2 sentences of why**, grounded in the data above. Then offer it to **confirm / sharpen / replace in your own words** — you own the final wording (free text). Record the agreed line in Step 6 (atop the board + weekly-log trend).

---

## Step 6 — Write the portfolio trend + log + confirm

**6a. Append to global weekly-log** `~/.claude/weekly-log.md` (create with header `# Weekly Log — All Projects` if missing). **Prepend** (newest week at TOP):
```markdown
## Week of <week_start> → <today>
**Reviewed:** <today HH:MM> by /weekly-review

- 📊 <P> projects · <S> sessions / <D> days · <Hh Mm>
- ✅ Shipped <Tdone> · 🔁 Slipped <Tslip> · 🔒 Decisions <Tdec>
- 🟢 Active: <project: one-line win each>
- ⚪ Dark: <projects with no sessions>
- ⏱ Heartbeat: <per execution project — "metric: N days 🔴/🟢"; omit the line if none declare exec_metric>
- 📂 Remaining: <Topen> open across <Po> projects (<top project: N> · …) — backlog trend
- 🧭 Direction: <the Step 5.5 through-line — your one move this week>
- 🎯 Next week's focus: <top 3 across the batch>
```
This is the week-over-week trend line across the whole machine — the `🧭 Direction` bullet lets you see, over weeks, whether your direction holds or scatters.

**6-board. Write the week-ahead board** `~/.claude/week-ahead.md` (create with header `# Week Ahead — All Projects` if missing). **Prepend** (newest week at TOP) — one line for EVERY registry project, planned or parked:
```markdown
## Week of <next_start> → <next_end>   (planned <today HH:MM> by /weekly-review)
🧭 Through-line: <the Step 5.5 direction move — your own words if you reworded it>
- <Display name>  → <decision>
- <Display name>  → ⏸ parked: <reason>
- …every project in the registry…
```
This is your whole-machine compass for the coming week — the `🧭 Through-line` headline says where YOU are heading; the project lines say how each folder serves it.

**6-state. Write your move as a note into each project-state** — the ONE place weekly-review may write into `project-state.md` (a NARROW, additive write), and the whole point of the ask: it's the note `daily-sync` reads when you next open that project. For EACH project a move was given for, under its `## What's queued next` heading, write/replace ONE delimited line — **your words, verbatim, not paraphrased**:
`🎯 Next move (set <today> by /weekly-review): <your move | ⏸ parked: reason>`
- **Idempotent:** if a prior `set … by /weekly-review` line already sits there, REPLACE it — never stack duplicates across weeks.
- If the project has no `## What's queued next` heading, add the heading + the line.
- **Skipped projects:** write nothing — leave their `## What's queued next` exactly as it was.
- **Touch nothing else** in project-state — the full snapshot stays `save-chat`'s job; `daily-sync` reads this one line next time you open the project.

**6b. Compute runtime** (`skill_end_time` − `skill_start_time`, seconds) and **append to the global session-log** `~/.claude/session-log.md` (newest day at TOP, newest entry atop its day):
```
- HH:MM — [weekly-review] /weekly-review · runtime Ns · <whole-machine|here> · <P> projects · <Tdone> shipped / <Tslip> slipped · 🎯 planned <Pplanned> / ⏸ parked <Pparked> · <Knotion> Notion tasks written
```
(In `here` mode also append to the cwd project's `session-log.md`.)

**6c. Footer:**
```
⏱ /weekly-review took <N>s
🧭 Through-line: <your direction move this week>
📓 weekly-log + week-ahead board updated · 🗂 registry: <P> projects · 🎯 planned <Pplanned> / ⏸ parked <Pparked> · Notion: <Knotion> tasks written
```

---

## Single-project mode (`/weekly-review here`)

Same shape, scoped to cwd: skip Step 1 discovery; read cwd `project-state.md` frontmatter + the project's own `session-log.md` since the last review (plus its slice of the global log), enrich via Notion/Calendar, present a one-project review **showing its current stage**, then ask the **next move** for this project (free text, no options, no guessing) and write that move as the `🎯 Next move` line into its `## What's queued next` (read by daily-sync) + a board entry in `week-ahead.md`. The Step 3.6 remaining-tasks roster still runs, scoped to just this one project (its open Notion tasks or its `## Open follow-ups`). Also append a per-project `weekly-log.md` in cwd.

## What NOT to do

- Do NOT rebuild the activity record by re-reading conversations — the global session-log already has it. Read, don't reconstruct.
- Do NOT push to Google Calendar — Notion is the week-ahead source; `save-chat` mirrors one day forward.
- Do NOT write `decisions-log.md` (that's `save-chat`). The ONLY thing weekly-review may write into `project-state.md` is the single delimited `🎯 Next move (set … by /weekly-review)` line under `## What's queued next` (Step 6-state) — never edit any other part of the snapshot. If the look-back surfaced a durable DECISION, suggest `/save-chat`.
- **Do NOT offer multiple-choice options, suggest, guess, or pre-fill the per-project next move (Step 5) — you write it yourself in free text.** Present only the factual current stage; never use `AskUserQuestion` for the move. For a project answered "skip", write nothing; for "park", record the reason. Never invent a move that wasn't given.
- DO present every registry project in the Step 5 ask (active + dark), so none is silently skipped — but "skip" / "park" are valid answers.
- Do NOT create, tick, re-date, or move any task while building the Step 3.6 remaining-tasks roster — it is strictly read-only (writes happen in Step 5/6). And do NOT conflate it with this-week "Slipped": Remaining = the full open backlog across all time.
- Do NOT double-count duplicate `project-state.md` copies — canonical = most recently modified.
- Do NOT deep-scan raw data files — stay on the task/decision/calendar layer.
- Do NOT fabricate `exec_last` from activity — working on a project ≠ doing the real action. Read the frontmatter field, or ask.
- Do NOT hardcode paths or dates — derive from the glob + frontmatter + the current date command.

## Why this exists

`daily-sync` opens a day and `save-chat` closes a day, but if you run many projects, no skill ever steps back to ask **"across everything, what did I actually do this week, and where did my attention really go?"** The global session-log already captures every session — weekly-review reads that spine, cross-checks it against Notion and Calendar truth, and turns it into one portfolio view plus a week-over-week trend in `weekly-log.md`. Then it shows **every project's current stage** (active or dark) and asks the **next move** for each — *you write it yourself, no options, no guessing* — saved as a note in that project's `## What's queued next` (which `daily-sync` reads next time you open the project) and a whole-machine `week-ahead.md` board, so the daily loop has a compass for each project. Finally it zooms above the folders to a **through-line** — the one big-picture direction move for you, held honest against your real goal and any pattern you're watching. So weekly-review answers both "what's next for each project?" and "where am I actually heading?"

Full loop, closed: **weekly-review (week)** → `daily-sync` (morning) → work → `save-chat` (night).
