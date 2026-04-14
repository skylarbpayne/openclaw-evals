# Acceptance Test - E2E runtime-failure review loop MVP

## Story metadata
- Story IDs: A3, B2, C1, P1
- Owner: Skylar
- Related architecture subsystem(s): Failure mining, Review and curation, Eval generation, Plugin runtime
- Environment: local repo with real OpenClaw failure-session fixture

## Intent
Prove that a real runtime/provider failure mined from a real OpenClaw session log can move through the current review and eval-generation spine end to end.

## Commands under test
```bash
node --test test/e2e-runtime-failure-loop.test.js test/a3-runtime-failure.test.js test/p1-real-session-log-adapter.test.js test/p1-honest-plugin.test.js test/c1-convert-approved-candidate.test.js test/f4-thin-review-ui.test.js test/e2e-first-loop.test.js test/a1-transcript-import.test.js test/a2-explicit-correction.test.js test/b2-review-curation.test.js
```

## Acceptance criteria under test
1. A real OpenClaw runtime failure loop yields at least one A3 candidate
2. The candidate can be approved through the existing review flow
3. The approved runtime-failure candidate can be converted into an eval artifact
4. The resulting eval artifact preserves real provenance, retry count, and provider error message

## Result summary
- Real runtime-failure loop was mined successfully from session `206b827e-f3a3-4969-bde3-0bb36bb53ccf`
- Candidate `a3-206b827e-f3a3-4969-bde3-0bb36bb53ccf-0-1` was approved and converted successfully
- Resulting eval artifact preserved `sourceStoryId: A3`, retry count `7`, and the real OAuth permission error message
- Overall verdict: pass
- Approval status: accepted in current working tree
