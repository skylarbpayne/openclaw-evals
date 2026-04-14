# Plan: C4 grading rubrics MVP

## Stories
- C4 Attach grading rubrics
- supports C1 by making generated eval artifacts meaningfully scorable

## Why this is next
C1 now creates eval artifacts, but the scoring block is still minimal.
If we stop there, the artifacts are structurally real but operationally vague.

The next honest step is to make each eval case carry a clearer grading contract.

## Goal
Implement the smallest honest C4 slice that adds structured grading metadata to generated eval cases.

## In scope
- rule-based grading metadata attached to generated eval artifacts
- explicit rubric text stored on each eval case
- optional judge metadata field present but unset by default
- deterministic derivation from approved candidate data only
- tests and acceptance documentation

## Out of scope
- running evals
- LLM judge execution
- family-level rubrics
- rubric editing UI
- benchmark integration

## Design stance
Prefer rule-based scoring first, just like the architecture says.
Do not pretend we have an evaluator engine yet.
Instead, make eval artifacts carry enough rubric structure that a later runner can use them honestly.

## Proposed grading shape
Each eval case should include grading metadata with at least:
- mode
- rubricText
- checks
- judgePromptVersion

For the MVP:
- mode defaults to `rule-based`
- checks are deterministic textual expectations derived from corrected expectation and known failure shape
- judgePromptVersion remains null unless explicitly set later

## Definition of done
This slice counts as done only when:
- generated eval artifacts include structured grading metadata
- grading metadata prefers rule-based checks first
- rubric text is persisted on the eval artifact
- tests prove the grading block is present and stable
- acceptance documentation records real verification evidence
