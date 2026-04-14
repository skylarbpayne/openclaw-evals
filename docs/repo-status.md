# Repo Status

Last updated: 2026-04-14

## What exists now

This repo is no longer docs-only.

Implemented repo-local MVP pieces:
- transcript validation in `src/schemas/transcript.js`
- explicit correction detector in `src/detectors/explicit-correction.js`
- runtime/provider failure detector in `src/detectors/runtime-failure.js`
- SQLite-backed candidate persistence in `src/repository/candidate-store.js`
- mining runner entrypoint in `src/index.js` and `src/cli/run-a2.js`
- repo-local review repository in `src/review/review-repository.js`
- repo-local review API in `src/review/api.js`
- thin local top-mistakes, review, and comparison UI in `src/ui/review-server.js`
- eval conversion in `src/evals/convert-candidate-to-eval.js`
- honest plugin bridge in `src/plugin/openclaw-evals-plugin.js`
- install-oriented plugin config and run path in `src/plugin/config.js` and `src/cli/run-plugin-flow.js`
- native plugin packaging metadata in `package.json.openclaw` and `openclaw.plugin.json`
- plugin-native runtime mining path for real OpenClaw session logs in `src/plugin/openclaw-evals-plugin.js`
- plugin-owned UI startup and local route reporting in `src/plugin/openclaw-evals-plugin.js`
- plugin capability roadmap in `docs/plugin-capability-roadmap.md`
- real OpenClaw session-log importer in `src/ingest/openclaw-session-import.js`
- acceptance-tested runtime-failure E2E loop helper in `src/e2e/run-runtime-failure-loop.js`
- A2 tests in `test/a2-explicit-correction.test.js`
- A3 tests in `test/a3-runtime-failure.test.js`
- B2 review/curation tests in `test/b2-review-curation.test.js`
- runtime-failure E2E tests in `test/e2e-runtime-failure-loop.test.js`

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
- A3 repeated runtime/provider failure-loop detection from real OpenClaw session logs
- B1 SQLite-backed registry MVP for the current narrow candidate record
- B2 repo-local review and curation MVP with approve, dismiss, edit, merge, and audit history
- B3 severity/frequency MVP with explicit ranking metadata on stored candidates
- C3-lite runtime failure families MVP with deterministic family metadata on repeated runtime/provider failure artifacts
- D1-lite local eval runner MVP with durable pass/fail result artifacts over existing eval cases
- D1 real captured response run MVP with preserved response provenance on scored real Palmer/OpenClaw captured assistant responses
- D2-lite run summary comparison MVP over persisted D1 result artifacts for the same eval case
- D3-lite regression gate MVP over persisted run histories with deterministic regression judgments
- F1-lite top-mistakes view MVP over persisted candidates with ranked family/type summaries
- P1 installability MVP with sane defaults, first-run storage initialization, and a documented plugin run path
- P1 plugin packaging polish MVP with docs-aligned manifest and package metadata for native OpenClaw plugin discovery
- P1 runtime mining path MVP for real OpenClaw session-log mining through the plugin surface
- P1 plugin-owned UI routes MVP for top mistakes, candidate review, and eval comparisons
- F3-lite comparison view MVP in progress, focused on exposing D2 run comparisons through the thin local UI
- acceptance-tested end-to-end loop from transcript fixture to reviewed candidate
- acceptance-tested end-to-end loop from a real runtime failure session fixture to approved eval artifact

Not yet complete:
- broader dashboard and operator surfaces beyond the thin local review UI
- deeper OpenClaw runtime integration beyond the current plugin bridge, session-log adapter, runtime-failure mining, runtime-failure eval-loop, and severity/frequency slices
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

This repo has a real spine now.
It now has two honest closed-loop proofs: one for explicit user corrections and one for runtime/provider failure loops from real OpenClaw session data.
The right move is still to avoid fake breadth and keep deepening the real corpus, ranking, and eval utility.