# Acceptance Test - B1 SQLite mistake registry MVP

## Story metadata
- Story ID: B1
- Story title: Create typed mistake record
- Owner: Skylar
- Related architecture subsystem(s): Mistake registry
- Related PR(s): local working tree after `b4d6510`
- Environment: local repo
- Build or commit under test: working tree with SQLite-backed registry MVP

## Intent
- User value: persist mistake candidates in a real registry boundary instead of brittle file-per-candidate artifacts
- Risk if this fails: candidate and review state remain ad hoc, hard to migrate, and unsafe to build downstream eval creation on top of

## Acceptance criteria under test
1. A2 persists candidates into a SQLite-backed registry
2. Stored candidate record can be reloaded with the expected typed fields
3. B2 review and audit history still work after the storage swap

## Preconditions
- Data setup: transcript fixture in `test/fixtures/a2-explicit-correction.json`
- Required services: none beyond local Node.js execution
- Test accounts or fixtures: existing A2 and B2 fixtures/tests

## Automated commands run
```bash
node --test test/a2-explicit-correction.test.js test/b2-review-curation.test.js
```

## Results by acceptance case

### Positive path
| Case ID | Scenario | Expected result | Actual result | Status |
|---|---|---|---|---|
| B1-POS-1 | Persist candidate through A2 | Candidate stored in SQLite-backed registry | `runA2()` saves candidate to `mistake-registry.sqlite` and candidate reload succeeds by id | Pass |
| B1-POS-2 | Reload typed candidate record | Persisted record preserves current typed fields used by A2/B2 | `storyId`, `mistakeType`, `sourceSessionId`, `sourceTurnRange`, transcript excerpt, and corrected expectation reload correctly | Pass |
| B1-POS-3 | Review loop survives storage swap | B2 approve/dismiss/edit/merge and audit history still work | Existing B2 automated tests pass unchanged in behavior against SQLite-backed storage | Pass |

## Evidence summary
The SQLite-backed registry MVP now exists in `src/repository/candidate-store.js` using `node:sqlite`.
The current typed persistence boundary is still intentionally narrow, but it is now explicit and durable enough to support the A2 to B2 loop honestly.

## What remains out of scope
- broader typed mistake-family schema
- batch ingestion contracts
- migration framework for plugin installs
- Postgres portability validation
- registry APIs beyond the current repo-local surfaces

## Result summary
- Overall verdict: B1 SQLite registry MVP passes its current acceptance bar
- Release posture: acceptable as the next storage-hardening slice after B2
- Known gaps: typed record remains narrow and payload-centric, but no longer file-fragmented

## Sign-off
- Tested by: Palmer
- Tested at: 2026-04-13
- Approval status: B1 SQLite registry MVP accepted
