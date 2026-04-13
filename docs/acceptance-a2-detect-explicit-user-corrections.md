# Acceptance Test - A2 Detect explicit user corrections

## Story metadata
- Story ID: A2
- Story title: Detect explicit user corrections
- Owner: Skylar
- Related architecture subsystem(s): Failure mining
- Related PR(s): https://github.com/skylarbpayne/openclaw-evals/pull/4
- Environment: local repo
- Build or commit under test: `75ce882` and later

## Intent
- User value: turn high-signal user corrections into candidate failure records
- Risk if this fails: the MVP misses the best real failure source and the initial eval corpus is weak or noisy

## Current repo posture
This PR is docs-only.
There is currently no detector implementation, no persistence path, and no test suite in the repo for A2.

That means this acceptance artifact cannot claim behavior validation yet.
Its job in the current PR is to define the acceptance bar the future A2 implementation PR must satisfy.

## Acceptance criteria under test
1. Detect correction language like “that’s wrong,” “don’t do that,” “you missed,” and “I asked for X”
2. Associate the correction with the assistant turn being corrected
3. Store both bad behavior and corrected expectation in the candidate artifact

## Preconditions for the future implementation PR
- Data setup: transcript-shaped session fixture with assistant turn followed by explicit correction
- Required services: only the local implementation and its chosen local persistence path
- Test accounts or fixtures: fixture transcripts checked into the repo or generated deterministically in tests

## Planned test cases for the implementation PR

### Unit tests
| Case ID | Scenario | Steps | Expected result | Current status |
|---|---|---|---|---|
| UNIT-POS-1 | Detect clear explicit correction | Run detector against fixture with assistant turn followed by `that's wrong, I asked for a summary not an email` | One candidate returned | Not yet testable in this docs-only PR |
| UNIT-NEG-1 | Ordinary user turn | Run detector against fixture with non-correction user text like `thanks` | No candidate returned | Not yet testable in this docs-only PR |
| UNIT-EDGE-1 | No prior assistant turn | Run detector on transcript beginning with correction-like user text | No candidate returned | Not yet testable in this docs-only PR |
| UNIT-ASSOC-1 | Correct assistant turn linked | Inspect candidate metadata | Candidate points to intended prior assistant turn | Not yet testable in this docs-only PR |
| UNIT-PROV-1 | Provenance retained | Inspect persisted candidate or returned artifact | Session id and turn range are preserved | Not yet testable in this docs-only PR |

### Fixture-level integration test
| Case ID | Scenario | Steps | Expected result | Current status |
|---|---|---|---|---|
| INT-1 | End-to-end A2 path | Load transcript-shaped fixture, run A2 detection, persist candidate, inspect stored artifact | Candidate artifact exists with required fields and provenance | Not yet testable in this docs-only PR |

## What I tested on this docs-only PR
I ran the validation that is actually possible on the current repo state.

### Repo-state validation performed
1. Confirmed the repo does not currently contain the earlier deleted implementation files referenced by stale docs
2. Confirmed `docs/plan-a2-explicit-correction-mvp.md` now defines a concrete test plan for the future implementation PR
3. Confirmed this acceptance doc now matches the real repo posture instead of pretending tests already exist

### Evidence from current validation
- `docs/trace-matrix.md` now marks A2 as ready for implementation rather than in progress from deleted code
- `docs/plan-a2-explicit-correction-mvp.md` now includes unit, fixture-level integration, and acceptance-doc expectations
- no executable A2 behavior exists yet to validate beyond documentation consistency

## Result summary
- Overall verdict for this PR: Docs validated, behavior not yet testable
- Known gaps:
  - no detector implementation exists yet
  - no persistence path exists yet
  - no automated tests exist yet
  - no end-to-end A2 execution path exists yet
- Recommended release decision: acceptable as planning and acceptance-prep only, not a functional A2 implementation

## What the future A2 implementation PR must prove before merge
- passing unit tests for positive, negative, edge, association, and provenance behavior
- at least one passing fixture-level end-to-end test from transcript input to persisted candidate artifact
- updated acceptance evidence with exact commands, results, and remaining gaps

## Sign-off
- Tested by: Palmer
- Tested at: 2026-04-13
- Approval status: docs and acceptance posture validated; functional A2 remains unimplemented