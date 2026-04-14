# Acceptance Test - P1 honest plugin MVP

## Story metadata
- Story ID: P1
- Owner: Skylar
- Related architecture subsystem(s): Plugin runtime, Data ingestion, Failure mining, Review and curation, Eval generation
- Environment: local repo
- Build or commit under test: working tree after C4 grading rubrics MVP

## Intent
Prove the repo exposes one real OpenClaw-native bridge into the existing eval pipeline instead of staying repo-local only.

## Commands under test
```bash
node --test test/p1-honest-plugin.test.js test/c1-convert-approved-candidate.test.js test/f4-thin-review-ui.test.js test/e2e-first-loop.test.js test/a1-transcript-import.test.js test/a2-explicit-correction.test.js test/b2-review-curation.test.js
```

## Acceptance criteria under test
1. Plugin entrypoint can process transcript-shaped input
2. Plugin entrypoint exercises real mining, review, and eval conversion logic
3. Plugin bridge returns mined, reviewed, and eval-converted artifacts from one honest path

## Result summary
- Plugin entrypoint verified against the real local pipeline
- Transcript-shaped input was mined, reviewed, and converted into an eval artifact through the plugin bridge
- The plugin bridge reuses actual repo logic instead of stubbed packaging behavior
- Overall verdict: pass
- Approval status: P1 honest plugin MVP accepted in the current working tree
