# Acceptance Test - F3-lite comparison view MVP

## Story metadata
- Story ID: F3
- Owner: Skylar
- Related architecture subsystem(s): Dashboard, Results analytics
- Environment: local thin UI server seeded with multiple runs for one eval case

## Intent
Prove that persisted run results can be inspected through a thin local comparison UI that shows run history and deltas for the same eval case.

## Commands under test
```bash
node --test test/f3-lite-comparison-ui.test.js test/d2-run-summary-comparison.test.js test/f4-thin-review-ui.test.js
```

## Acceptance criteria under test
1. Comparison list page renders eval cases with run counts and latest verdicts
2. Comparison detail page renders verdict history and first-to-latest delta details
3. Existing thin review UI remains intact alongside the new comparison surface

## Result summary
- comparison list renders persisted eval-case summaries
- comparison detail exposes verdict history and delta payload clearly
- candidate review UI remains green in the same server surface
- overall verdict: pass
- approval status: accepted in current working tree
