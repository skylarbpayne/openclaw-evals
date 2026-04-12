# AGENTS.md - openclaw-evals

This repo exists to build an eval system from real failures, not to accumulate random implementation debris.

## Source of truth

The source of truth for product and implementation direction is:
1. `docs/user-stories.md`
2. `docs/architecture.md`
3. `docs/trace-matrix.md`

Read these before changing code.

If code, plans, or status drift from these docs, the docs win until explicitly updated.

## Required development process

Every non-trivial change must follow this order:

1. **Choose the user story or stories**
   - Identify the exact story IDs being implemented.
   - If no story exists, add one first in `docs/user-stories.md`.

2. **Check architecture fit**
   - Confirm the change fits `docs/architecture.md`.
   - If the design changes subsystem boundaries, package layout, data flow, storage model, or major interfaces, update `docs/architecture.md` first.

3. **Create or update the implementation plan**
   - Reflect the intended slice in `docs/implementation-plan.md` or a more specific design/plan doc under `docs/`.
   - The plan must be congruent with the architecture, not a sidecar invention.

4. **Update the trace matrix before or alongside implementation start**
   - Mark the selected stories honestly, for example `Ready for implementation` or `In progress`.
   - Add notes pointing to the intended implementation artifacts when useful.

5. **Implement**
   - Only after steps 1 through 4 are done.
   - Keep the implementation narrowly scoped to the selected stories and plan.

6. **Update the trace matrix after implementation**
   - Record the new status honestly.
   - Point to the actual artifacts, tests, or docs that now satisfy the story.

7. **Verify before claiming done**
   - Run the relevant tests.
   - If a slice is only partial, say so plainly.

## Hard rules

### No implementation without story alignment
Do not start coding first and rationalize later.

Every meaningful code change must map to one or more user stories.

### No architecture drift by accident
If implementation reveals the architecture is wrong or incomplete, update the architecture document deliberately.
Do not silently fork the real system shape in code.

### No stale trace matrix
`docs/trace-matrix.md` must reflect reality.
If code exists, the matrix should show it.
If something is still a stub, say it is a stub.
If something is not started, do not mark it in progress because it feels nice.

### Prefer thin vertical slices
Finish the smallest closed loop that satisfies a story before expanding surfaces.
Do not build dashboards, MCP tools, or optimization loops while the core failure-catalog path is still fake.

## Default workflow for a new slice

Use this checklist:

- Story IDs selected
- Architecture checked
- Plan updated
- Trace matrix updated to reflect start state
- Code implemented
- Tests added or updated
- Trace matrix updated to reflect end state
- Repo status/docs updated if the overall project posture changed

## Current repo posture

Right now this repo has:
- strong product docs
- a partial Phase 1 skeleton
- an incomplete closed loop

That means the correct bias is:
- finish the failure-catalog MVP cleanly
- keep docs and implementation tightly coupled
- avoid speculative surface-area growth until the core loop is real

## When in doubt

Return to the docs in this order:
1. user stories
2. architecture
3. trace matrix
4. implementation plan

Then make the smallest honest move.