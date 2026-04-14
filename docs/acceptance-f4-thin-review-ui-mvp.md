# Acceptance Test - F4 thin review UI MVP

## Story metadata
- Story IDs: F4, narrow support for F2, supports B2 operator flow
- Owner: Skylar
- Related architecture subsystem(s): Dashboard app, Review and curation, Mistake registry
- Environment: local repo
- Build or commit under test: working tree after the honest first loop milestone

## Intent
Prove there is a usable local operator surface for reviewing persisted candidates without relying only on CLI and tests.

## Commands under test
```bash
node --test test/f4-thin-review-ui.test.js test/e2e-first-loop.test.js test/a1-transcript-import.test.js test/a2-explicit-correction.test.js test/b2-review-curation.test.js
```

## Acceptance criteria under test
1. Candidate review queue renders persisted candidates
2. Candidate detail page shows evidence, provenance, corrected expectation, and audit history
3. Approve, dismiss, or edit actions can be performed through standard HTML form submits

## Result summary
- Local HTTP review surface verified through automated tests
- Queue page renders persisted candidates
- Detail page shows transcript evidence, provenance, corrected expectation, and audit history
- Approve and edit form submissions successfully mutate persisted state and remain visible on reload
- Overall verdict: pass
- Approval status: F4 thin review UI MVP accepted in the current working tree
