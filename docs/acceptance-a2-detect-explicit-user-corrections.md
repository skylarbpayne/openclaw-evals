# Acceptance Test - A2 Detect explicit user corrections

## Story metadata
- Story ID: A2
- Story title: Detect explicit user corrections
- Owner: Skylar
- Related architecture subsystem(s): Failure mining
- Related PR(s): pending A2 implementation PR from `feat/a2-explicit-correction-mvp`
- Environment: local repo
- Build or commit under test: working tree for A2 MVP implementation

## Intent
- User value: turn high-signal user corrections into candidate failure records
- Risk if this fails: the MVP misses the best real failure source and the initial eval corpus is weak or noisy

## Current repo posture
This repo now contains a narrow A2 implementation slice.
It supports transcript-shaped local input, explicit correction detection, prior-assistant association, durable JSON artifact persistence, and automated tests.

This is still a repo-local developer-operated slice.
It is not yet an installed OpenClaw plugin and does not claim A1, B1, B2, or P1 completion.

## Acceptance criteria under test
1. Detect correction language like “that’s wrong,” “don’t do that,” “you missed,” and “I asked for X”
2. Associate the correction with the assistant turn being corrected
3. Store both bad behavior and corrected expectation in the candidate artifact

## Preconditions
- Data setup: transcript-shaped fixture with assistant turn followed by explicit correction
- Required services: none beyond local Node.js execution
- Test accounts or fixtures: `test/fixtures/a2-explicit-correction.json`

## Test fixtures used
- `test/fixtures/a2-explicit-correction.json`
  - session id: `session-explicit-1`
  - assistant produces the wrong artifact type
  - user explicitly corrects with: `That's wrong, I asked for a summary not an email.`

## Automated commands run
```bash
npm test
node src/cli/run-a2.js test/fixtures/a2-explicit-correction.json
```

## Results by acceptance case

### Unit tests
| Case ID | Scenario | Expected result | Actual result | Status |
|---|---|---|---|---|
| UNIT-POS-1 | Detect clear explicit correction | One candidate returned | One candidate returned | Pass |
| UNIT-NEG-1 | Ordinary user turn | No candidate returned | No candidate returned | Pass |
| UNIT-EDGE-1 | No prior assistant turn | No candidate returned | No candidate returned | Pass |
| UNIT-ASSOC-1 | Correct assistant turn linked | Candidate points to intended prior assistant turn | Candidate linked to immediately prior assistant turn | Pass |
| UNIT-PROV-1 | Provenance retained | Session id and metadata preserved | Session id, channel, model, instruction version preserved | Pass |

### Fixture-level integration test
| Case ID | Scenario | Expected result | Actual result | Status |
|---|---|---|---|---|
| INT-1 | End-to-end A2 path | Candidate artifact exists with required fields and provenance | One persisted JSON candidate artifact written with transcript excerpt, corrected expectation, session id, and turn range | Pass |

## Evidence summary
The implemented A2 slice now provides:
- transcript validation in `src/schemas/transcript.js`
- explicit correction detection in `src/detectors/explicit-correction.js`
- durable JSON-file candidate persistence in `src/repository/candidate-store.js`
- repo-local execution path in `src/cli/run-a2.js`
- automated tests in `test/a2-explicit-correction.test.js`

## What remains unvalidated or out of scope
- plugin installation and runtime triggering
- broad transcript ingestion beyond the narrow A2 contract
- full typed mistake-record workflow for B1
- review and curation workflow for B2
- API, MCP, dashboard, scheduling, and benchmarking surfaces
- broader heuristic coverage beyond the MVP correction phrase set

## Result summary
- Overall verdict: A2 MVP slice passes its current repo-local acceptance bar
- Release posture: acceptable as the first real A2 implementation slice
- Known gaps: limited phrase coverage and no OpenClaw plugin/runtime surface yet

## Sign-off
- Tested by: Palmer
- Tested at: 2026-04-13
- Approval status: A2 MVP accepted for this narrow implementation slice