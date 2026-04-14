# Acceptance Test - P1 plugin packaging polish MVP

## Story metadata
- Story ID: P1
- Owner: Skylar
- Related architecture subsystem(s): Plugin runtime
- Environment: local repo checkout compared against current OpenClaw plugin docs

## Intent
Prove that the repo now includes the native plugin packaging primitives OpenClaw docs expect: `package.json.openclaw` metadata and `openclaw.plugin.json` manifest metadata.

## Commands under test
```bash
node --test test/p1-plugin-packaging-polish.test.js test/p1-installability.test.js test/p1-honest-plugin.test.js
```

## Acceptance criteria under test
1. package metadata exposes native OpenClaw plugin packaging fields
2. manifest identity and config schema are present and internally consistent
3. existing install-oriented and honest plugin flows still pass

## Result summary
- `package.json` now exposes `openclaw.extensions` and install metadata
- `openclaw.plugin.json` now provides native manifest metadata and config schema
- install-oriented and local plugin bridge flows remain green
- known remaining gap: SDK-style `definePluginEntry(...)` wiring is still pending because the OpenClaw plugin SDK package is not installed in this repo environment
- overall verdict: pass
- approval status: accepted in current working tree
