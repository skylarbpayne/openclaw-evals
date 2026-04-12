# Acceptance Test - A2 Detect explicit user corrections

## Story metadata
- Story ID: A2
- Story title: Detect explicit user corrections
- Owner: Skylar
- Related architecture subsystem(s): Failure mining
- Related PR(s): https://github.com/skylarbpayne/openclaw-evals/pull/3
- Environment: local repo
- Build or commit under test: `ea187c2` and later

## Intent
- User value: turn high-signal user corrections into candidate failure records
- Risk if this fails: the MVP misses the best real failure source and the initial eval corpus is weak or noisy

## Acceptance criteria under test
1. Detect correction language like “that’s wrong,” “don’t do that,” “you missed,” and “I asked for X”
2. Associate the correction with the assistant turn being corrected
3. Store both bad behavior and corrected expectation in the candidate artifact

## Preconditions
- Data setup: transcript-shaped session with assistant turn followed by explicit correction
- Required services: none
- Test accounts or fixtures: none

## Test cases

### Positive path
| Case ID | Scenario | Steps | Expected result | Actual result | Pass or fail | Evidence |
|---|---|---|---|---|---|---|
| POS-1 | Detect clear explicit correction | Run automated test with assistant turn followed by `that's wrong, I asked for a summary not an email` | One mistake candidate returned | Automated test passes | Pass | `test/explicit-correction.test.js` |
| POS-2 | Candidate classified correctly | Inspect returned candidate | `mistakeType` is `explicit_user_correction` and `sourceSessions[0]` matches session id | Automated test passes | Pass | `test/explicit-correction.test.js` |
| POS-3 | Candidate captures bad behavior and corrected expectation | Inspect candidate body | `transcriptExcerpt` includes assistant + user correction, `expectedBehavior` stores the correction text | Implemented in code, not yet directly asserted in automated test | Partial | `src/detectors/explicit-correction.js` |

### Negative path
| Case ID | Scenario | Steps | Expected result | Actual result | Pass or fail | Evidence |
|---|---|---|---|---|---|---|
| NEG-1 | Ordinary user turn | Run automated test with non-correction user text like `thanks` | No candidates returned | Automated test passes | Pass | `test/explicit-correction.test.js` |
| NEG-2 | Correction phrase without prior assistant turn | Run detector on session starting with user correction | No candidate returned | Implemented in code, not yet covered by automated test | Partial | `src/detectors/explicit-correction.js` |

### Edge cases
| Case ID | Scenario | Steps | Expected result | Actual result | Pass or fail | Evidence |
|---|---|---|---|---|---|---|
| EDGE-1 | Pattern variation | Use alternate phrases from default pattern set | Candidate should still be detected when regex matches | Implemented in code, not yet fully covered by automated tests | Partial | `src/detectors/explicit-correction.js` |
| EDGE-2 | Multiple corrections in one session | Provide multiple corrected assistant turns | Multiple candidates should be returned | Behavior implied by loop, not yet acceptance-tested | Partial | `src/detectors/explicit-correction.js` |

## Observability and evidence
- Logs checked: none
- Metrics checked: none
- Output artifacts: automated node test results, candidate object shape
- Transcript or run ids: synthetic session fixtures in test

## Result summary
- Overall verdict: Partial pass
- Known gaps:
  - automated tests cover only the primary positive path and ordinary negative path
  - no fixture coverage for multiple corrections or missing prior assistant turn
  - no end-to-end persistence or review validation yet
- Follow-up bugs or stories:
  - expand automated detector coverage
  - add end-to-end story validation once persistence exists
- Recommended release decision: acceptable for an MVP detector scaffold, not yet enough for a claimed production-ready A2

## Sign-off
- Tested by: Palmer
- Tested at: 2026-04-12
- Approval status: scaffold validated, not complete