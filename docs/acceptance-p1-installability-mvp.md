# Acceptance Test - P1 installability MVP

## Story metadata
- Story ID: P1
- Owner: Skylar
- Related architecture subsystem(s): Plugin runtime
- Environment: local repo checkout with Node.js native sqlite support

## Intent
Prove that the plugin path now has sane defaults, first-run storage initialization, and one install-oriented CLI flow that works with minimal configuration.

## Commands under test
```bash
node --test test/p1-installability.test.js test/p1-honest-plugin.test.js
```

## Acceptance criteria under test
1. plugin config normalizes to sensible default output and reviewer values
2. install-oriented CLI initializes storage on first run
3. transcript-driven plugin flow still mines, reviews, and converts artifacts end to end

## Result summary
- default plugin config resolves to an absolute `.openclaw-evals` output path with reviewer fallback
- install-oriented CLI creates first-run storage and processes transcript input successfully
- existing honest plugin bridge remains green alongside the installability layer
- overall verdict: pass
- approval status: accepted in current working tree
