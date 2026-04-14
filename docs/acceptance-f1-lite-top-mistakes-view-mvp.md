# Acceptance Test - F1-lite top mistakes view MVP

## Story metadata
- Story ID: F1
- Owner: Skylar
- Related architecture subsystem(s): Dashboard, Analytics
- Environment: local persisted candidate registry with mixed candidate types and ranking metadata

## Intent
Prove that the repo can produce and render a deterministic ranked top-mistakes summary over persisted candidates.

## Commands under test
```bash
node --test test/f1-lite-top-mistakes-summary.test.js test/f1-lite-top-mistakes-ui.test.js test/f3-lite-comparison-ui.test.js test/f4-thin-review-ui.test.js
```

## Acceptance criteria under test
1. group runtime failure candidates by family when family metadata exists
2. rank higher-priority groups ahead of routine groups
3. render the ranked summary in the thin local UI
4. preserve existing comparison and review UI behavior in the same server surface

## Result summary
- runtime failure families are grouped and ranked ahead of routine explicit corrections
- top-mistakes page renders grouped priority, severity, counts, and reasons
- existing comparison and review pages remain green
- overall verdict: pass
- approval status: accepted in current working tree
