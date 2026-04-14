# Acceptance Test - D3-lite regression gate MVP

## Story metadata
- Story ID: D3
- Owner: Skylar
- Related architecture subsystem(s): Eval runner, Results analytics
- Environment: local seeded eval artifact directory with persisted multi-run histories

## Intent
Prove that the repo can make a deterministic regression judgment from persisted eval run results for one eval case.

## Commands under test
```bash
node --test test/d3-lite-regression-gate.test.js test/d2-run-summary-comparison.test.js
```

## Acceptance criteria under test
1. report regression when latest run flips from pass to fail
2. report improvement when latest run flips from fail to pass
3. report insufficient history when fewer than two runs exist
4. preserve explicit evidence about verdict transition and newly failing checks

## Result summary
- pass-to-fail transitions are flagged as regressions
- fail-to-pass transitions are reported as improvements, not regressions
- single-run histories are reported honestly as insufficient history
- overall verdict: pass
- approval status: accepted in current working tree
