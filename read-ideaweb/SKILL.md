---
name: read-ideaweb
description: Pull Wiw's IdeaWeb idea-notebooks (stored in the live Supabase cloud) into the session as clean Markdown, so Claude can read his ideas WITHOUT a manual per-file export — from ANY project folder. Runs a local, read-only script. Use when Wiw types `/read-ideaweb`, or says "read my ideaweb", "read my <project> ideaweb" (e.g. "read my aood ideaweb"), "what ideas do I have about X", "อ่าน ideaweb", "ดูไอเดียใน ideaweb", "ไอเดียใน ideaweb". Optional argument = a topic filter (a substring of the notebook title).
---

# read-ideaweb — one pipe to read every IdeaWeb notebook, from anywhere

## What it does
Runs a local, **read-only** Node script that queries Wiw's live IdeaWeb Supabase database and prints his notebooks (his account only) as lean Markdown — the same view the app's `.md` export produces (Ideas / Connections / Tensions / Summary / Recommended next dots), ~8× lighter than the raw `.ideaweb.json`. This replaces the old "export one file per project by hand" handoff.

## The command
Run this (works from ANY current directory — the script resolves its key + dependencies from its own location, not the cwd):

```
node "C:\Users\thana\Desktop\IdeaWeb\IdeaWeb-App\tools\read-notebooks.mjs" <optional-topic-filter>
```

- **No argument** → all notebooks (a one-line index first, then each notebook in full).
- **With a topic filter** → only notebooks whose title contains that substring (case-insensitive `ilike`).

The harness may save large output to a file and show only a preview — if so, **read that file** to get the full content before reasoning over it.

## Turning Wiw's request into the filter
- `/read-ideaweb` or "read my ideaweb" → run with **no filter** (everything).
- "read my **aood** ideaweb" / "/read-ideaweb aood" → filter = `aood`.
- "what ideas do I have about **the ledger**" → filter = `ledger` (pick the obvious keyword).
- If Wiw is clearly working inside a project and asks for "this project's ideas," use that project's name as the filter (e.g. in `AoodBeef/` → `aood`). When unsure, run with **no filter** and show the index so nothing is hidden — a single keyword can miss notebooks (his beef notebooks like "ระบบเช็คยอดทำเนื้อ" don't contain "aood").

After reading, do what Wiw asked (summarize, plan, build, critique) using the notebooks as context.

## Hard rules — read-only by contract
- This skill **only reads.** NEVER write back to IdeaWeb / Supabase. The pipe has no write path, by design — so Claude can never silently mutate his ideas.
- Reading IdeaWeb from another project's session is a **reference read** — it does NOT break the "stay in-folder" rule. Do not, as a side effect, write anything into the current project or into IdeaWeb unless Wiw explicitly asks.
- Never print the contents of `.env.local` or the `SUPABASE_SERVICE_ROLE_KEY`.

## Setup (one-time — already done 2026-06-17)
The script reads two lines from `C:\Users\thana\Desktop\IdeaWeb\IdeaWeb-App\.env.local`:
`SUPABASE_SERVICE_ROLE_KEY=...` and `MY_USER_ID=...`. If the command prints **"Missing config"** or an account roster instead of notebooks, those lines are missing — have Wiw add them (Supabase dashboard → Project Settings → API → service_role; run once with no `MY_USER_ID` to print the roster and copy his id). The key stays local in `.env.local` (git-ignored, no `VITE_` prefix → never bundled).

## Note for others reusing this
Personal skill: the path above is Wiw's machine and the data is his private Supabase. To reuse, repoint the path to your own clone of IdeaWeb-App and follow the env setup documented in `tools/read-notebooks.mjs`.
