# Acceptance Test - P1 backfill mining onboarding MVP

## Story metadata
- Story ID: P1 / A1 / A2 / A3
- Owner: Skylar
- Related architecture subsystem(s): Plugin runtime, Data ingestion, Failure mining
- Environment: local repo checkout with real session-log fixtures

## Intent
Prove that the plugin can backfill one or more past OpenClaw session logs to create immediate onboarding value.

## Commands under test
```bash
node --test test/p1-backfill-mining-onboarding.test.js test/p1-runtime-mining-path.test.js
```

## Acceptance criteria under test
1. plugin backfills a single session log with summary output
2. plugin backfills a directory of session logs with summary output
3. backfill persists real mined candidates through the existing registry

## Result summary
- plugin now exposes single-session and directory backfill mining methods
- onboarding can create immediate candidate value from past session logs
- runtime mining path remains green alongside backfill flows
- overall verdict: pass
- approval status: accepted in current working tree
