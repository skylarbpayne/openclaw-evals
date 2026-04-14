# Acceptance Test - D1-lite local eval runner MVP

## Story metadata
- Story ID: D1
- Owner: Skylar
- Related architecture subsystem(s): Eval runner, Results analytics
- Environment: local repo with approved-candidate-derived eval artifacts

## Intent
Prove that current eval artifacts are executable and scoreable through a local deterministic runner that emits durable pass/fail result artifacts.

## Commands under test
```bash
node --test test/d1-local-eval-runner.test.js test/c1-convert-approved-candidate.test.js test/c3-runtime-failure-families.test.js test/b3-severity-frequency.test.js
```

## Acceptance criteria under test
1. Replaying the captured bad response yields a failing eval result
2. Replaying the expected behavior yields a passing eval result
3. Result artifacts persist pass/fail summary, check outcomes, and provenance

## Result summary
- failing replay correctly records one or more failed checks
- expected-behavior replay records a passing result with all checks satisfied
- result provenance preserves source candidate and source session lineage
- overall verdict: pass
- approval status: accepted in current working tree
