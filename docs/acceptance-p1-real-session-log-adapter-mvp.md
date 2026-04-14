# Acceptance Test - P1 real session-log adapter MVP

## Story metadata
- Story IDs: P1, A1
- Owner: Skylar
- Related architecture subsystem(s): Plugin runtime, Data ingestion
- Environment: local repo with real local OpenClaw session-log fixture
- Build or commit under test: working tree after P1 honest plugin MVP

## Intent
Prove the plugin bridge can ingest a real local OpenClaw session JSONL shape rather than only repo-native transcript fixtures.

## Commands under test
```bash
node --test test/p1-real-session-log-adapter.test.js test/p1-honest-plugin.test.js test/c1-convert-approved-candidate.test.js test/f4-thin-review-ui.test.js test/e2e-first-loop.test.js test/a1-transcript-import.test.js test/a2-explicit-correction.test.js test/b2-review-curation.test.js
```

## Acceptance criteria under test
1. Real OpenClaw session JSONL can be adapted into transcript shape
2. Plugin bridge can process that adapted transcript through the existing local flow
3. Acceptance explicitly notes the currently proven session-log shape and its limitations

## Result summary
- Real local OpenClaw session JSONL was adapted into the repo transcript shape successfully
- Plugin bridge processed that adapted transcript through the existing local flow
- Current proven shape is session header plus user/assistant message events with text content arrays
- Unsupported or ignored for now: tool-call normalization, non-text content, and multi-session stitching
- Overall verdict: pass
- Approval status: P1 real session-log adapter MVP accepted in the current working tree
