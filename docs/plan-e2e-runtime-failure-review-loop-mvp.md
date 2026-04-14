# Plan: E2E runtime-failure review loop MVP

## Stories
- A3 Detect implicit failures
- B2 Review and curate candidates
- C1 Create minimal reproducible eval
- P1 Honest plugin integration

## Why this is next
We now have a real runtime/provider failure mined from a real OpenClaw session log.
The next honest question is whether that artifact is actually useful when pushed through the existing human review and eval-conversion flow.

## Goal
Prove one real A3 candidate can move end to end through:
1. real session-log ingestion
2. A3 mining
3. human review action
4. eval conversion when appropriate

## In scope
- one fixture-backed real A3 candidate from the auth/provider failure session
- review action via existing repository/API semantics
- eval conversion through current C1 path
- acceptance evidence showing final artifact shape

## Out of scope
- new UI surfaces
- ranking/prioritization systems
- additional detector families
- production plugin packaging

## Design stance
Do not broaden the product.
Use the current thin UI/review/eval spine and prove it works for runtime failures, not just explicit corrections.

## Definition of done
This slice is done when a real A3 runtime-failure candidate can be mined from the real session fixture, reviewed, converted if approved, and reloaded as a durable eval artifact with acceptance evidence.
