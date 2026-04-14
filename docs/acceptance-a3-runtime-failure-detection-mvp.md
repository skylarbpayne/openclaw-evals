# Acceptance Test - A3 runtime failure detection MVP

## Story metadata
- Story ID: A3
- Owner: Skylar
- Related architecture subsystem(s): Failure mining, Data ingestion, Plugin runtime
- Environment: local repo with real local OpenClaw failure-session fixture
- Build or commit under test: working tree after P1 real session-log adapter MVP

## Intent
Prove the system can detect a real repeated provider/runtime failure loop from an actual OpenClaw session log.

## Commands under test
```bash
node --test test/a3-runtime-failure.test.js test/p1-real-session-log-adapter.test.js test/p1-honest-plugin.test.js test/c1-convert-approved-candidate.test.js test/f4-thin-review-ui.test.js test/e2e-first-loop.test.js test/a1-transcript-import.test.js test/a2-explicit-correction.test.js test/b2-review-curation.test.js
```

## Acceptance criteria under test
1. Real local assistant runtime-error loops produce at least one candidate artifact
2. Candidate captures failure type, repeated pattern, and provenance
3. Detection works through the real session-log and plugin path, not only isolated helpers

## Result summary
- Real local auth/provider failure loop was detected successfully
- Candidate artifact captured runtime failure type, repeated retry count, and provider error provenance
- Detection now works through the real session-log path used in plugin integration
- Overall verdict: pass
- Approval status: A3 runtime failure detection MVP accepted in the current working tree
