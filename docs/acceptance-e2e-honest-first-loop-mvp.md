# Acceptance Test - honest first end-to-end loop MVP

## Story metadata
- Slice: honest first end-to-end loop MVP
- Owner: Skylar
- Related architecture subsystem(s): Data ingestion, Failure mining, Review and curation, Persistence
- Environment: local repo
- Build or commit under test: working tree after A1, A2, B1, and B2 MVP slices

## Intent
Prove the repo works as one real local system on realistic file-based inputs.

## Commands under test
```bash
npm run e2e:first-loop
node --test test/e2e-first-loop.test.js test/a1-transcript-import.test.js test/a2-explicit-correction.test.js test/b2-review-curation.test.js
```

## Acceptance criteria under test
1. Imports multiple transcript files from disk
2. Mines A2 candidates from those imported transcripts
3. Applies review decisions from fixture input
4. Persists final reviewed state durably and reloads it for inspection

## Expected evidence
- transcript batch count
- mined candidate count
- applied review count
- final persisted candidate states with audit history

## Result summary
- CLI path executed successfully over two imported transcript files and two review decisions
- Automated verification passed across the full path
- Final result:
  - transcriptCount: 2
  - minedCount: 2
  - appliedCount: 2
  - final state included one approved candidate and one edited candidate with preserved audit history
- Overall verdict: pass
- Approval status: honest first end-to-end loop MVP accepted in the current working tree
