# Acceptance Test - B1 Create typed mistake record

## Story metadata
- Story ID: B1
- Story title: Create a typed mistake record
- Owner: Skylar
- Related architecture subsystem(s): Mistake registry
- Related PR(s): https://github.com/skylarpayne/openclaw-evals/pull/3
- Environment: local repo
- Build or commit under test: `ea187c2` and later

## Intent
- User value: represent failures as structured artifacts that can drive review, eval generation, and reporting
- Risk if this fails: downstream systems operate on inconsistent or lossy failure records

## Acceptance criteria under test
1. Mistake record includes the minimum structured fields needed by the story
2. Invalid records are rejected clearly
3. Created records include normalized defaults where optional fields are omitted

## Preconditions
- Data setup: local candidate input objects
- Required services: none
- Test accounts or fixtures: none

## Test cases

### Positive path
| Case ID | Scenario | Steps | Expected result | Actual result | Pass or fail | Evidence |
|---|---|---|---|---|---|---|
| POS-1 | Create valid candidate | Run automated test with valid candidate fields | Candidate is created and validation returns ok | Automated test passes | Pass | `test/explicit-correction.test.js` |
| POS-2 | Optional fields omitted | Call `createMistakeCandidate()` with only required fields plus minimum context | Candidate gets defaults for severity, confidence, root cause, reproducibility, and createdAt | Implemented in code, not yet covered by automated test | Partial | `src/schemas/mistake-candidate.js` |

### Negative path
| Case ID | Scenario | Steps | Expected result | Actual result | Pass or fail | Evidence |
|---|---|---|---|---|---|---|
| NEG-1 | Missing required fields | Call `createMistakeCandidate()` without required fields | Throws validation error naming missing fields | Implemented in code, not yet covered by automated test | Partial | `src/schemas/mistake-candidate.js` |
| NEG-2 | Invalid detection or status enum | Call validator with unsupported values | Validation fails with enum error | Implemented in code, not yet covered by automated test | Partial | `src/schemas/mistake-candidate.js` |

### Edge cases
| Case ID | Scenario | Steps | Expected result | Actual result | Pass or fail | Evidence |
|---|---|---|---|---|---|---|
| EDGE-1 | Empty transcript excerpt | Validate candidate with blank excerpt | Validation fails | Implemented in code, not yet automated | Partial | `src/schemas/mistake-candidate.js` |
| EDGE-2 | Empty sourceSessions | Validate candidate with empty sourceSessions | Validation fails | Implemented in code, not yet automated | Partial | `src/schemas/mistake-candidate.js` |

## Observability and evidence
- Logs checked: none
- Metrics checked: none
- Output artifacts: validation result object and thrown validation errors
- Transcript or run ids: synthetic local inputs only

## Result summary
- Overall verdict: Partial pass
- Known gaps:
  - only one automated happy-path validation test exists
  - negative and edge-case validation paths are not yet covered by tests
  - no durable persistence yet
- Follow-up bugs or stories:
  - add schema-focused test file
  - connect typed records to durable repository and review flow
- Recommended release decision: acceptable as an internal schema scaffold, not as a complete B1 implementation

## Sign-off
- Tested by: Palmer
- Tested at: 2026-04-12
- Approval status: scaffold validated, not complete