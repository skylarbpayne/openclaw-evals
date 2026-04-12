# Acceptance Test - A1 Discover mistakes from transcripts

## Story metadata
- Story ID: A1
- Story title: Discover mistakes from transcripts
- Owner: Skylar
- Related architecture subsystem(s): Data ingestion, Failure mining
- Related PR(s): https://github.com/skylarbpayne/openclaw-evals/pull/3
- Environment: local repo
- Build or commit under test: `ea187c2` and later

## Intent
- User value: ingest transcript-shaped input so downstream failure detection can run on normalized session data
- Risk if this fails: failure mining has no stable evidence input and all downstream artifacts become hand-wavy

## Acceptance criteria under test
1. Can ingest session transcripts and preserve core metadata needed downstream
2. Produces a normalized transcript object with turns and ingestion metadata
3. Links candidates to session id and model or instruction context once passed downstream

## Preconditions
- Data setup: local transcript-shaped fixture object
- Required services: none
- Test accounts or fixtures: none

## Test cases

### Positive path
| Case ID | Scenario | Steps | Expected result | Actual result | Pass or fail | Evidence |
|---|---|---|---|---|---|---|
| POS-1 | Ingest minimal valid session | Call `ingestSessionTranscript()` with `sessionId` and `turns` | Returns normalized object with `sessionId`, `turns`, default metadata, and `ingestedAt` | Implemented in code | Pass | `src/ingest/transcript-ingestion.js` |
| POS-2 | Preserve optional metadata | Call `ingestSessionTranscript()` with `channel`, `model`, `instructionVersion` | Returned object preserves supplied metadata | Implemented in code | Pass | `src/ingest/transcript-ingestion.js` |

### Negative path
| Case ID | Scenario | Steps | Expected result | Actual result | Pass or fail | Evidence |
|---|---|---|---|---|---|---|
| NEG-1 | Missing session object | Call `ingestSessionTranscript()` with null or non-object | Throws `session is required` | Implemented in code, not yet covered by automated test | Partial | `src/ingest/transcript-ingestion.js` |

### Edge cases
| Case ID | Scenario | Steps | Expected result | Actual result | Pass or fail | Evidence |
|---|---|---|---|---|---|---|
| EDGE-1 | Missing optional metadata | Omit `channel`, `model`, `instructionVersion` | Defaults to `unknown` values | Implemented in code | Pass | `src/ingest/transcript-ingestion.js` |
| EDGE-2 | Missing turns array | Omit `turns` | Returns empty turns array | Implemented in code | Pass | `src/ingest/transcript-ingestion.js` |

## Observability and evidence
- Logs checked: none
- Metrics checked: none
- Output artifacts: normalized transcript object
- Transcript or run ids: local synthetic fixture only

## Result summary
- Overall verdict: Partial pass
- Known gaps:
  - no real transcript fixture file yet
  - no automated test coverage for ingest error path
  - no end-to-end proof with downstream persistence
- Follow-up bugs or stories:
  - add transcript fixture-based tests
  - add end-to-end acceptance slice
- Recommended release decision: acceptable only as an early scaffold for A1, not as a finished implementation

## Sign-off
- Tested by: Palmer
- Tested at: 2026-04-12
- Approval status: scaffold validated, not complete