# Acceptance Test - P1 plugin-owned UI routes MVP

## Story metadata
- Story ID: P1 / F1 / F3 / F4
- Owner: Skylar
- Related architecture subsystem(s): Plugin runtime, Operator UI, Dashboard
- Environment: local repo checkout

## Intent
Prove that the plugin can own startup of the existing thin UI server and expose usable local routes for top mistakes, candidate review, and eval comparisons.

## Commands under test
```bash
node --test test/p1-plugin-ui-routes.test.js test/f1-lite-top-mistakes-ui.test.js test/f3-lite-comparison-ui.test.js
```

## Acceptance criteria under test
1. plugin-owned UI startup returns a usable local origin and route set
2. top mistakes route responds successfully
3. candidates route responds successfully
4. comparisons route responds successfully
5. existing thin UI views remain green under plugin-owned startup

## Result summary
- plugin now owns startup of the thin UI server
- plugin returns a local origin plus routes for top mistakes, candidates, and comparisons
- thin UI route coverage remains green
- overall verdict: pass
- approval status: accepted in current working tree
