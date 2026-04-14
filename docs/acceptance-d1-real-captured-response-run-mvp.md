# Acceptance Test - D1 real captured response run MVP

## Story metadata
- Story ID: D1
- Owner: Skylar
- Related architecture subsystem(s): Eval runner, Results analytics
- Environment: local repo with real session-derived A3 eval artifact and captured assistant response payload

## Intent
Prove the D1 runner can score a real captured Palmer/OpenClaw assistant response payload against an existing eval artifact and persist the scored result with response provenance.

## Commands under test
```bash
node --test test/d1-real-captured-response.test.js test/e2e-runtime-failure-loop.test.js test/d1-local-eval-runner.test.js
```

## Acceptance criteria under test
1. A real session-derived A3 eval artifact can be graded against a captured assistant response string
2. The graded result persists pass/fail outcome and check details
3. Result provenance preserves captured-response metadata showing that the graded payload came from a real OpenClaw session path

## Result summary
- real runtime/provider failure response is graded and fails as expected against the eval checks
- result artifacts retain response provenance metadata and source session lineage
- overall verdict: pass
- approval status: accepted in current working tree
