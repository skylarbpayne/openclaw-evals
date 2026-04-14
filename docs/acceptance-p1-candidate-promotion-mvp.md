# Acceptance Test - P1 candidate promotion MVP

## Story metadata
- Story ID: P1 / C1 / F4
- Owner: Skylar
- Related architecture subsystem(s): Plugin runtime, Eval generation, Review and curation
- Environment: local repo checkout

## Intent
Prove that the plugin exposes a clear first promotion policy: approved candidates can be converted to eval cases, and unapproved candidates cannot.

## Commands under test
```bash
node --test test/p1-candidate-promotion.test.js test/c1-minimal-repro-eval.test.js test/b2-review-curation.test.js
```

## Acceptance criteria under test
1. plugin lists promotion eligibility state for candidates
2. approved candidates are eligible for promotion
3. plugin can promote an approved candidate to an eval case
4. unapproved candidates are rejected with a clear error
5. existing review/curation and eval conversion logic remain green

## Result summary
- plugin now exposes promotion eligibility inspection
- plugin now exposes explicit approved-candidate promotion to eval
- unapproved candidates are blocked from promotion with clear error behavior
- overall verdict: pass
- approval status: accepted in current working tree
