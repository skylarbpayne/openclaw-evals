# Acceptance Test - C4 grading rubrics MVP

## Story metadata
- Story ID: C4
- Owner: Skylar
- Related architecture subsystem(s): Eval generation, Scoring
- Environment: local repo
- Build or commit under test: working tree after C1 minimal reproducible eval MVP

## Intent
Prove generated eval artifacts carry structured grading metadata that prefers rule-based checks first.

## Commands under test
```bash
node --test test/c1-convert-approved-candidate.test.js test/f4-thin-review-ui.test.js test/e2e-first-loop.test.js test/a1-transcript-import.test.js test/a2-explicit-correction.test.js test/b2-review-curation.test.js
```

## Acceptance criteria under test
1. Generated eval artifacts include structured grading metadata
2. Grading metadata stores rubric text and deterministic checks
3. Judge prompt version is present as a field but unset by default

## Result summary
- Generated eval artifacts now include structured grading metadata
- Grading metadata stores rubric text, deterministic checks, and a judgePromptVersion field set to null by default
- Verification completed through automated tests over the real candidate-to-eval conversion path
- Overall verdict: pass
- Approval status: C4 grading rubrics MVP accepted in the current working tree
