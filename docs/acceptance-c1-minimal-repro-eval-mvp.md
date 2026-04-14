# Acceptance Test - C1 minimal reproducible eval MVP

## Story metadata
- Story ID: C1
- Owner: Skylar
- Related architecture subsystem(s): Eval generation, Mistake registry, Review and curation
- Environment: local repo
- Build or commit under test: working tree after thin review UI MVP

## Intent
Prove the repo can turn an approved mistake candidate into a compact, inspectable eval-case artifact.

## Commands under test
```bash
node --test test/c1-convert-approved-candidate.test.js test/f4-thin-review-ui.test.js test/e2e-first-loop.test.js test/a1-transcript-import.test.js test/a2-explicit-correction.test.js test/b2-review-curation.test.js
```

## Acceptance criteria under test
1. Approved candidate converts into one eval-case artifact
2. Eval artifact contains prompt/context package, expected behavior, and scoring metadata
3. Non-approved candidates are rejected

## Result summary
- Approved-candidate conversion path verified through automated tests
- Eval-case artifact is created with prompt/context package, expected behavior, scoring strategy, and provenance
- Rejection path for non-approved candidates is also verified
- Overall verdict: pass
- Approval status: C1 minimal reproducible eval MVP accepted in the current working tree
