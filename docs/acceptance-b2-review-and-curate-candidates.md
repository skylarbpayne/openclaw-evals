# Acceptance Test - B2 Review and curate mistake candidates

## Story metadata
- Story ID: B2
- Story title: Review and curate mistake candidates
- Owner: Skylar
- Related architecture subsystem(s): Review and curation layer
- Related PR(s): local working tree after `e534e44`
- Environment: local repo
- Build or commit under test: working tree after B2 review-curation MVP

## Intent
- User value: curate discovered failures instead of letting noisy candidates flow straight into the eval corpus
- Risk if this fails: the system accumulates garbage, loses auditability, or cannot promote useful mistakes cleanly

## Acceptance criteria under test
1. Can review candidate records through a defined API surface
2. Can approve, edit, dismiss, or merge candidates
3. Preserves audit history of edits and decisions

## Preconditions
- Data setup: transcript fixture persisted through the existing A2 path into JSON candidate artifacts
- Required services: none beyond local Node.js execution
- Test accounts or fixtures: `test/fixtures/a2-explicit-correction.json`

## Automated commands run
```bash
node --test test/a2-explicit-correction.test.js test/b2-review-curation.test.js
```

## Results by acceptance case

### Positive path
| Case ID | Scenario | Expected result | Actual result | Status |
|---|---|---|---|---|
| B2-POS-1 | List persisted candidates through review API | Returns candidate artifacts from disk | One persisted candidate returned with default `candidate` status | Pass |
| B2-POS-2 | Approve candidate | Candidate becomes `approved` and audit entry is appended | Approved status persisted with `approve` audit event | Pass |
| B2-POS-3 | Dismiss candidate | Candidate becomes `dismissed` and audit entry is appended | Dismissed status persisted with `dismiss` audit event | Pass |
| B2-POS-4 | Edit candidate | Candidate fields updated without losing provenance/source linkage | Edited fields persisted, provenance and source turn range preserved, `edit` audit event appended | Pass |
| B2-POS-5 | Merge candidate into another | Source candidate marked `merged` with target pointer and audit entry | Source candidate persisted as `merged` with `mergedInto` target and `merge` audit event | Pass |

### Negative path
| Case ID | Scenario | Expected result | Actual result | Status |
|---|---|---|---|---|
| B2-NEG-1 | Missing decision object | Review API rejects action | Throws `decision is required` | Pass |

### Edge cases
| Case ID | Scenario | Expected result | Actual result | Status |
|---|---|---|---|---|
| B2-EDGE-1 | End-to-end transcript to approved reviewed candidate | A2 candidate can be approved and reloaded with audit trail intact | Candidate persisted from transcript fixture, approved through review API, reloaded with `approved` status and one audit event | Pass |

## Evidence summary
The implemented B2 repo-local slice now provides:
- file-backed candidate persistence with default status/audit normalization in `src/repository/candidate-store.js`
- review repository with approve, dismiss, edit, merge, list, and get behavior in `src/review/review-repository.js`
- minimal review API in `src/review/api.js`
- B2-focused automated tests in `test/b2-review-curation.test.js`
- end-to-end proof that the A2 artifact path can flow into a reviewed candidate state

## What remains unvalidated or out of scope
- dashboard review queue UI
- OpenClaw plugin runtime integration
- MCP or HTTP API surfaces
- SQLite-backed registry
- promotion into eval families beyond a minimal merge pointer
- richer typed mistake record semantics from full B1

## Result summary
- Overall verdict: B2 repo-local curation MVP passes its current acceptance bar
- Release posture: acceptable as the next honest closed-loop slice after A2
- Known gaps: still file-backed and repo-local, not yet a full registry or operator surface

## Sign-off
- Tested by: Palmer
- Tested at: 2026-04-13
- Approval status: B2 repo-local curation MVP accepted
