# High-Level Implementation Plan

This plan orders work according to the architecture and keeps the repo focused on the smallest real closed loop.

## Ordering principle
Build one honest failure-catalog slice before expanding surfaces:
1. detect one high-confidence failure mode from real transcript-shaped input
2. persist the resulting candidate artifact with provenance
3. validate that slice with automated coverage and explicit acceptance testing
4. only then broaden ingestion, review, packaging, and downstream eval workflows

## Phase 0. Product foundation
Goal: establish shared language and execution order.

Deliverables:
- user stories
- architecture
- trace matrix
- acceptance testing template
- implementation plan

## Phase 1. A2 explicit correction MVP
Goal: finish one real implementation slice for explicit user corrections.

Primary story:
- A2 Detect explicit user corrections

Supporting work allowed in this phase:
- only the minimum storage and transcript-shaped input contract required to satisfy A2
- automated tests and acceptance artifacts needed to validate A2 honestly

Do first:
- implement a transcript-shaped input contract sufficient for A2 fixtures or imports
- detect explicit correction language from user turns
- associate each correction with the immediately preceding assistant turn being corrected
- persist a candidate artifact that stores the bad behavior, corrected expectation, and provenance needed by A2
- update `docs/acceptance-a2-detect-explicit-user-corrections.md` to match the new implementation and evidence

Do not include in the first PR:
- generic transcript ingestion beyond what A2 needs
- broad failure-mining scaffolds
- review queue or curation workflow
- plugin runtime packaging
- dashboard, API, MCP, or benchmarking surfaces
- claims that A1, B1, B2, or P1 are fully implemented

Why this order:
- A2 is the highest-signal failure source in the story set
- a full A2 slice proves the repo can turn a real correction into a durable candidate artifact
- this avoids rebuilding the deleted broad scaffold and keeps the next PR reviewable

Exit criteria:
- a transcript-shaped fixture or import can be processed for A2
- explicit correction phrases are detected reliably enough for the MVP pattern set
- the corrected assistant turn is linked correctly
- the stored candidate artifact contains both bad behavior and corrected expectation
- automated tests cover the main positive, negative, and key edge paths for A2
- the A2 acceptance doc records what was run, what passed, and what gaps remain

## Phase 2. Review and curation loop
Goal: complete the first honest closed loop after A2 by making persisted candidates reviewable.

Implement next:
- B2 review and curation workflow
  - approve, dismiss, edit, and merge actions on persisted candidates
  - append-only audit history for review decisions and edits
  - one end-to-end transcript-to-review test proving the loop
- B1 minimal candidate state expansion only as required to support B2 honestly

Use `docs/plan-b2-review-curation-mvp.md` as the scoped implementation guide for this slice.

## Phase 3. Typed mistake record and storage hardening
Goal: replace the JSON artifact store with a real registry boundary and formalize the persisted candidate record.

Implement next:
- B1 SQLite mistake registry MVP
  - replace file-per-candidate storage with SQLite-backed persistence
  - preserve current A2 and B2 behavior through the storage swap
  - persist review state and audit history in the registry
- A1 transcript ingestion beyond the A2-specific contract
- G2 privacy and sanitization boundaries
- A3 implicit failure heuristics
- A4 clustering into mistake families

Use `docs/plan-b1-sqlite-mistake-registry-mvp.md` as the scoped implementation guide for this slice.

## Phase 4. Honest first end-to-end milestone
Goal: prove the system works as a real local loop before building UI or downstream eval surfaces.

Implement next:
- one explicit end-to-end path from imported transcript files to reviewed persisted outcomes
- one automated milestone test covering import, mining, review, and reload from SQLite-backed storage
- one local CLI entrypoint for the same path

Use `docs/plan-e2e-honest-first-loop-mvp.md` as the scoped implementation guide for this slice.

## Phase 5. Eval creation and comparison
Goal: turn curated failures into useful eval assets.

Implement next:
- C1 mistake-to-eval conversion
- C3 eval family model
- C4 rubric model and scoring spec
- D1 compare models on a suite
- D2 compare prompt or instruction variants

## Phase 6. Human-facing and operational surfaces
Goal: expose and harden the system after the core loop is real.

Implement next:
- P1 OpenClaw plugin packaging
- P2 MCP interface
- P3 initial HTTP API
- F1, F2, and F3 dashboard views
- B3, D3, D4, E2, E3, F4, G1, G3, and P4

## Recommended first implementation PR
If the next PR is meant to start real implementation, it should be only the A2 slice described in `docs/plan-a2-explicit-correction-mvp.md`.

That PR should prove one path end to end:
- transcript-shaped input
- explicit correction detection
- assistant-turn association
- candidate persistence
- A2-focused automated tests
- current A2 acceptance evidence
