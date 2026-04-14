# Acceptance Test - B3 severity and frequency MVP

## Story metadata
- Story ID: B3
- Owner: Skylar
- Related architecture subsystem(s): Mistake registry, Results analytics
- Environment: local repo with explicit-correction fixture and real runtime-failure session fixture

## Intent
Prove that the registry can attach stable severity/frequency metadata that distinguishes routine explicit corrections from repeated high-impact runtime/provider failure loops.

## Commands under test
```bash
node --test test/b3-severity-frequency.test.js test/a3-runtime-failure.test.js test/e2e-runtime-failure-loop.test.js test/b2-review-curation.test.js test/c1-convert-approved-candidate.test.js
```

## Acceptance criteria under test
1. Explicit user correction candidates get routine low-severity ranking metadata by default
2. Repeated runtime/provider failure loops get elevated severity/frequency metadata
3. Ranking metadata survives normal review/repository list access

## Result summary
- Explicit correction candidate ranked as `low` severity, `single` frequency, `routine` priority
- Real runtime/provider failure candidate ranked as `high` severity, `repeated` frequency, `investigate-now` priority
- Runtime/provider ranking preserved retry count `7` and human-readable reasons
- Overall verdict: pass
- Approval status: accepted in current working tree
