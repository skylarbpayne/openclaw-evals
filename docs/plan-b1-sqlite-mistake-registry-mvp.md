# Plan: B1 SQLite mistake registry MVP

## Stories
- Story ID: B1
- Story title: Create typed mistake record

## Why this is next
A2 and B2 now form a real repo-local loop, but the storage layer is still JSON files with loosely shaped candidate objects.
That is enough to prove the loop, but not enough to support trustworthy registry behavior, future migrations, or downstream eval creation.

The next honest move is to replace file-per-candidate artifacts with a SQLite-backed registry while keeping the existing A2 and B2 behavior intact.

## Goal
Implement the thinnest SQLite-backed mistake registry that:
1. stores the current narrow candidate artifact shape durably in SQLite
2. preserves B2 review state and audit history
3. keeps the current A2 and B2 interfaces working
4. establishes the first explicit typed record boundary for persisted candidates

## In scope
- SQLite-backed persistence for candidate records
- typed normalization for the persisted candidate record as used by A2 and B2 today
- audit history persistence in SQLite
- review repository compatibility over SQLite storage
- automated tests proving A2 and B2 still pass through the storage swap
- updated acceptance documentation for the B1 slice

## Out of scope
- full family tables and clustering
- dashboard or API surfaces
- plugin migrations
- batch import pipeline
- Postgres support
- broad schema expansion beyond what the current loop needs

## Storage design
Use SQLite for MVP, but keep the schema narrow.

Proposed tables:

### `mistake_candidates`
Columns:
- `candidate_id` text primary key
- `story_id` text not null
- `mistake_type` text not null
- `status` text not null
- `source_session_id` text
- `source_turn_start` integer
- `source_turn_end` integer
- `merged_into` text null
- `payload_json` text not null
- `created_at` text not null
- `updated_at` text not null

### `curation_audit_events`
Columns:
- `event_id` integer primary key autoincrement
- `candidate_id` text not null
- `event_type` text not null
- `reviewer` text null
- `rationale` text null
- `event_json` text not null
- `created_at` text not null

This keeps the typed boundary honest without pretending the whole future schema is already known.

## Compatibility stance
The existing code paths should keep their current outward behavior:
- `runA2()` still persists candidates and returns saved artifacts
- `ReviewRepository` still supports list/get/approve/dismiss/edit/merge
- tests should need only minimal adaptation for SQLite-backed storage

## Definition of done
This slice counts as done only when:
- candidate persistence is SQLite-backed instead of file-backed
- B2 audit history is preserved across reloads from SQLite
- A2 and B2 tests pass against the new store
- B1 acceptance doc records the exact commands and evidence
- repo status and trace matrix reflect the new storage reality honestly
