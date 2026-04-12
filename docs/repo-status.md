# Repo Status

Last updated: 2026-04-12

## What exists now

This repo is no longer docs-only.

Implemented skeleton pieces:
- transcript ingestion stub in `src/ingest/transcript-ingestion.js`
- explicit correction detector in `src/detectors/explicit-correction.js`
- mistake candidate schema in `src/schemas/mistake-candidate.js`
- in-memory repository in `src/schemas/repository.js`
- review API shape in `src/review/api.js`
- plugin skeleton in `src/plugin/index.js`
- basic tests in `test/explicit-correction.test.js`

Current package layout on disk:
- `src/` contains the active Phase 1 skeleton
- `packages/` exists but is not populated as the architecture target layout yet

## Honest phase status

### Phase 0. Product foundation
Status: complete

Artifacts:
- `docs/user-stories.md`
- `docs/architecture.md`
- `docs/trace-matrix.md`
- `docs/acceptance-testing-template.md`
- `docs/implementation-plan.md`

### Phase 1. Failure catalog MVP
Status: in progress

Implemented:
- P1 plugin skeleton, partial
- A1 transcript ingestion, stub
- A2 explicit correction detection, initial implementation
- B1 typed mistake record schema, initial implementation
- B2 review API shape, initial scaffold

Not yet complete:
- durable persistence
- real OpenClaw runtime integration
- review workflow with approve, edit, dismiss, merge behavior
- provenance-rich candidate storage
- acceptance-tested end-to-end loop from transcript slice to reviewed candidate

### Phase 2+
Status: not started

## Gap between docs and code

The architecture doc proposes a package layout:

```text
packages/
  core/
  plugin-openclaw/
  mcp/
  dashboard/
  research-bridge/
  schemas/
```

The current implementation still lives mostly in `src/`. That is fine for the first thin slice, but the next meaningful refactor should move the active Phase 1 pieces into package boundaries that match the intended product shape.

## Recommended next implementation slice

Do these next, in this order:

1. **Make persistence real**
   - replace the in-memory repository with SQLite-backed storage for mistake candidates and curation decisions
   - keep schema portable to Postgres later

2. **Complete the review loop**
   - implement approve, edit, dismiss, merge actions
   - preserve audit history and provenance
   - expose a minimal API that can actually drive curation

3. **Wire real transcript ingestion**
   - define the first real input contract for session slices
   - support importing a transcript fixture instead of only inline test objects

4. **Align code structure with architecture**
   - move Phase 1 code from `src/` into `packages/core`, `packages/plugin-openclaw`, and `packages/schemas`
   - keep compatibility shims only if needed

5. **Add one end-to-end acceptance test**
   - ingest transcript fixture
   - detect explicit correction
   - persist candidate
   - review and approve it
   - assert provenance is preserved

## Recommended working definition of done for Phase 1

Phase 1 should count as done only when:
- a real transcript slice can be ingested
- explicit corrections reliably produce structured candidates
- candidates persist durably
- a reviewer can approve or dismiss them through a real flow
- evidence and provenance survive round-trip
- one end-to-end acceptance test proves the loop

## Immediate project posture

This repo has a good spine.
It does **not** yet have the first closed loop finished.
So the right move is to stop adding broad new surfaces and finish the Phase 1 loop cleanly.