# Plan: A2 Explicit Correction MVP

## Story
- Story ID: A2
- Story title: Detect explicit user corrections

## Why this is the next slice
A2 is the highest-signal failure source in the current story set.
It is the smallest realistic vertical slice that can prove this repo turns real evidence into a durable mistake candidate without drifting into scaffolds, dashboards, or packaging theater.

## Goal
Implement one complete A2 slice that:
1. reads transcript-shaped input
2. detects explicit user corrections
3. links the correction to the assistant turn being corrected
4. persists a candidate artifact with the required A2 evidence and provenance
5. validates the slice with automated tests and updated acceptance testing

## In scope
- a narrow transcript-shaped input contract sufficient for A2 fixtures or imports
- explicit correction phrase detection for an MVP pattern set
- prior-assistant-turn association logic
- persisted candidate artifact for A2 outputs
- automated test coverage for A2-positive, A2-negative, and at least one key edge path
- update of `docs/acceptance-a2-detect-explicit-user-corrections.md` with actual evidence from the implementation
- corresponding trace-matrix updates before and after implementation

## Out of scope
- broad transcript ingestion beyond what A2 needs
- generic failure-mining scaffolding
- implicit failure heuristics
- review queue or curation workflow
- plugin packaging
- MCP, API, dashboard, benchmarking, or optimization surfaces
- claiming A1, B1, B2, or P1 are complete

## Required inputs
The first implementation must support a transcript-shaped fixture or import format with enough structure to satisfy A2.

Minimum required fields:
- `sessionId`
- ordered `turns`
  - each turn should include at least `role` and `content`
- enough provenance to preserve source context for the candidate artifact

Preferred metadata when available:
- timestamp or turn index
- channel
- model
- instruction version

## Expected output artifact
The A2 slice must produce a persisted candidate artifact containing at least:
- candidate id
- mistake type for explicit correction
- transcript excerpt containing the corrected assistant behavior and correcting user turn
- corrected expectation
- source session id
- source turn range or equivalent pointer
- available provenance metadata such as model or instruction version when present

This artifact may be narrower than the eventual full B1 typed record, but it must be durable and explicit.

## Implementation constraints
- keep the implementation shaped around A2, not around all future stories
- choose the smallest storage path that satisfies durability for the MVP
- avoid introducing package or plugin boundaries unless strictly required for A2
- keep naming and data shape compatible with future B1 expansion where reasonable, but do not overbuild B1 now

## Acceptance approach
Use `docs/acceptance-a2-detect-explicit-user-corrections.md` as the story-level acceptance artifact.

That doc must be updated during implementation to include:
- what test fixtures were used
- what automated tests were run
- what passed
- what key gaps remain

Automated validation should cover:
1. **Positive path**
   - explicit correction phrase after an assistant turn produces a candidate
2. **Negative path**
   - ordinary user response does not produce a candidate
3. **Key edge path**
   - correction-like phrase without a prior assistant turn does not produce a false candidate
4. **Provenance path**
   - candidate retains required source session and turn linkage

## Definition of done
A fresh A2 PR counts as done only when:
- transcript-shaped fixture input is supported for A2
- explicit correction patterns are detected for the MVP set
- the correct assistant turn is associated with the correction
- a candidate artifact is persisted durably
- automated tests cover positive, negative, and key edge behavior
- `docs/acceptance-a2-detect-explicit-user-corrections.md` is updated with actual evidence
- `docs/trace-matrix.md` is updated honestly to reflect the post-implementation state
- the PR description names A2 explicitly and describes validation clearly

## Pre-implementation doc updates required
Before code starts in the fresh A2 PR:
- `docs/trace-matrix.md` should mark A2 as in progress for that branch
- `docs/implementation-plan.md` should already point to A2 as the first real implementation slice
- this plan doc should be referenced by the PR as the implementation guide

## Notes on story boundaries
A2 may require a narrow persisted candidate shape and narrow transcript input contract.
That is acceptable.

Do not let those support pieces silently expand into claims that A1 or B1 are complete.
If either story needs to be claimed later, that should happen in a separate PR with its own acceptance evidence.