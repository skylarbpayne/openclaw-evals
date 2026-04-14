# Repo Status

Last updated: 2026-04-13

## What exists now

This repo is no longer docs-only.

Implemented repo-local MVP pieces:
- transcript validation in `src/schemas/transcript.js`
- explicit correction detector in `src/detectors/explicit-correction.js`
- SQLite-backed candidate persistence in `src/repository/candidate-store.js`
- A2 runner entrypoint in `src/index.js` and `src/cli/run-a2.js`
- repo-local review repository in `src/review/review-repository.js`
- repo-local review API in `src/review/api.js`
- A2 tests in `test/a2-explicit-correction.test.js`
- B2 review/curation tests in `test/b2-review-curation.test.js`

Current package layout on disk:
- `src/` contains the active thin-slice implementation
- the architecture still targets package boundaries later, but the current repo-local loop is intentionally narrow

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
- A2 explicit correction detection, repo-local and acceptance-tested
- B1 SQLite-backed registry MVP for the current narrow candidate record
- B2 repo-local review and curation MVP with approve, dismiss, edit, merge, and audit history
- acceptance-tested end-to-end loop from transcript fixture to reviewed candidate

Not yet complete:
- broader dashboard and operator surfaces beyond the thin local review UI
- deeper OpenClaw runtime integration beyond the first honest plugin bridge
- eval families and benchmark-running surfaces beyond the first C1 plus C4 artifact path
- fuller B1 typed mistake record model beyond the narrow current payload boundary

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

1. **Formalize B1 further**
   - turn the current narrow persisted candidate payload into a fuller typed mistake record
   - preserve compatibility with the current A2 and B2 loop

2. **Wire broader transcript ingestion**
   - define the first real input contract for session slices beyond the narrow A2 fixture path
   - support importing transcript batches or session exports

4. **Align code structure with architecture**
   - move active code from `src/` into package boundaries that match the intended product shape
   - keep compatibility shims only if needed

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