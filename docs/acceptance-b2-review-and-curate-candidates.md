# Acceptance Test - B2 Review and curate candidates

## Story metadata
- Story ID: B2
- Story title: Review and curate mistake candidates
- Owner: Skylar
- Related architecture subsystem(s): Review and curation layer
- Related PR(s): https://github.com/skylarpayne/openclaw-evals/pull/3
- Environment: local repo
- Build or commit under test: `ea187c2` and later

## Intent
- User value: curate discovered failures instead of letting noisy candidates flow straight into the eval corpus
- Risk if this fails: the system accumulates garbage, loses auditability, or cannot promote useful mistakes cleanly

## Acceptance criteria under test
1. Can review candidate records through a defined API surface
2. Can approve, edit, dismiss, or merge candidates
3. Preserves audit history of edits and decisions

## Preconditions
- Data setup: repository object implementing `list()` and `review()` methods
- Required services: none
- Test accounts or fixtures: none

## Test cases

### Positive path
| Case ID | Scenario | Steps | Expected result | Actual result | Pass or fail | Evidence |
|---|---|---|---|---|---|---|
| POS-1 | List mistakes through review API | Call `createReviewApi(repository).listMistakes()` | Returns `repository.list()` output | Implemented in code | Pass | `src/review/api.js` |
| POS-2 | Submit review decision through review API | Call `createReviewApi(repository).reviewMistake(id, decision)` | Delegates to `repository.review(id, decision)` | Implemented in code | Pass | `src/review/api.js` |

### Negative path
| Case ID | Scenario | Steps | Expected result | Actual result | Pass or fail | Evidence |
|---|---|---|---|---|---|---|
| NEG-1 | Missing decision object | Call `reviewMistake(id)` without decision | Throws `decision is required` | Implemented in code, not yet automated | Partial | `src/review/api.js` |

### Edge cases
| Case ID | Scenario | Steps | Expected result | Actual result | Pass or fail | Evidence |
|---|---|---|---|---|---|---|
| EDGE-1 | Approve decision | Provide repository that accepts approve decision | API should pass through correctly | Not acceptance-tested yet | Partial | `src/review/api.js` |
| EDGE-2 | Edit, dismiss, or merge decision | Provide repository that accepts different decisions | API should pass through correctly | Not acceptance-tested yet | Partial | `src/review/api.js` |

## Observability and evidence
- Logs checked: none
- Metrics checked: none
- Output artifacts: review API function behavior only
- Transcript or run ids: none

## Result summary
- Overall verdict: Fails as full B2 implementation, passes only as API scaffold
- Known gaps:
  - no automated tests
  - no repository behavior contract tests
  - no explicit approve, edit, dismiss, merge semantics implemented here
  - no audit history at all
- Follow-up bugs or stories:
  - implement real review repository and decisions model
  - add tests for review behavior
  - add audit trail
- Recommended release decision: do not claim B2 complete; only claim an early review API scaffold

## Sign-off
- Tested by: Palmer
- Tested at: 2026-04-12
- Approval status: scaffold only, not complete