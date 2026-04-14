# Acceptance Test - A1 Discover mistakes from transcripts

## Story metadata
- Story ID: A1
- Story title: Discover mistakes from transcripts
- Owner: Skylar
- Related architecture subsystem(s): Data ingestion, Failure mining
- Related PR(s): local working tree after `34475cd`
- Environment: local repo
- Build or commit under test: working tree with A1 transcript import contract MVP

## Intent
- User value: ingest transcript JSON files through a real import contract instead of relying on a single hardcoded fixture path in test code
- Risk if this fails: failure mining remains coupled to handcrafted in-memory inputs and cannot honestly scale to real transcript evidence

## Acceptance criteria under test
1. Can ingest session transcripts from JSON files
2. Produces normalized transcript objects with preserved metadata
3. Allows imported transcripts to flow into downstream candidate generation

## Preconditions
- Data setup: `test/fixtures/a2-explicit-correction.json` plus temporary JSON files created during automated tests
- Required services: none beyond local Node.js execution
- Test accounts or fixtures: file-based transcript fixtures only

## Automated commands run
```bash
node --test test/a1-transcript-import.test.js test/a2-explicit-correction.test.js test/b2-review-curation.test.js
```

## Results by acceptance case

### Positive path
| Case ID | Scenario | Expected result | Actual result | Status |
|---|---|---|---|---|
| A1-POS-1 | Import valid transcript file | Returns normalized transcript preserving metadata | Valid transcript file imports successfully with `sessionId`, `channel`, `model`, `instructionVersion`, and normalized turns preserved | Pass |
| A1-POS-2 | Import directory of transcript files | Returns normalized transcripts for each JSON file | Batch directory import returns all valid transcript files in deterministic order | Pass |

### Negative path
| Case ID | Scenario | Expected result | Actual result | Status |
|---|---|---|---|---|
| A1-NEG-1 | Invalid transcript file | Import fails with useful file-aware validation error | Invalid file is rejected with path-aware validation message | Pass |

### Edge cases
| Case ID | Scenario | Expected result | Actual result | Status |
|---|---|---|---|---|
| A1-EDGE-1 | Imported transcript flows into A2 | Imported transcript works with downstream mining path | Imported transcript passes into `runA2()` without fixture-specific handling and produces the expected candidate | Pass |

## Evidence summary
The A1 import-contract MVP now exists in `src/ingest/transcript-import.js`.
It supports single-file and directory-based JSON transcript imports and validates them through the existing transcript schema boundary in `src/schemas/transcript.js`.
Automated coverage lives in `test/a1-transcript-import.test.js`.

## What remains out of scope
- OpenClaw runtime transcript export ingestion
- tool trace ingestion beyond transcript JSON
- privacy/redaction handling
- implicit failure mining
- richer transcript bundle formats

## Result summary
- Overall verdict: A1 file-import MVP passes its current acceptance bar
- Release posture: acceptable as the first honest ingestion slice supporting the existing A2 and B2 loop
- Known gaps: still file-based and transcript-only, not yet wired to real OpenClaw runtime exports

## Sign-off
- Tested by: Palmer
- Tested at: 2026-04-13
- Approval status: A1 file-import MVP accepted
