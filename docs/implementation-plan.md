# High-Level Implementation Plan

This plan orders work according to the architecture and tries not to build theater before the core loop works.

## Ordering principle
Build the smallest closed loop first:
1. ingest real evidence
2. detect high-confidence failures
3. curate them into structured mistake records
4. convert them into eval cases
5. run benchmark comparisons
6. expose the workflow through dashboard, API, MCP, and ops surfaces

## Phase 0. Product foundation
Goal: establish shared language and execution order.

Deliverables:
- user stories
- architecture
- trace matrix
- acceptance testing template
- implementation plan

## Phase 1. Failure catalog MVP
Goal: create the first reliable corpus of real mistakes.

Implement first:
- P1 plugin skeleton
- A1 transcript ingestion
- A2 explicit correction detection
- B1 typed mistake record schema and persistence
- B2 review queue with approve or dismiss flow

Why this order:
- A2 gives the highest-signal source of real failures
- B1 is the minimum durable artifact
- B2 prevents garbage from contaminating the eval corpus
- P1 keeps the system aligned with final packaging from day one

Exit criteria:
- system ingests session slices
- explicit corrections produce candidate records
- reviewer can approve, edit, dismiss, or merge
- evidence and provenance are preserved

## Phase 2. Eval creation and safe data handling
Goal: turn curated failures into rerunnable eval assets.

Implement next:
- G2 privacy and sanitization boundaries
- A3 implicit failure heuristics
- A4 clustering into mistake families
- C1 mistake-to-eval conversion
- C3 eval family model
- C4 rubric model and scoring spec
- P3 initial HTTP API

## Phase 3. Benchmarking and first human-facing comparisons
Goal: make the corpus useful for model and prompt decisions.

Implement next:
- D1 compare models on a suite
- D2 compare prompt or instruction variants
- F1 dashboard overview
- F2 family detail and evidence drilldown
- F3 comparison views
- P2 MCP interface

## Phase 4. Operational hardening and portfolio management
Goal: make the system dependable and broadly useful.

Implement next:
- B3 severity and frequency tracking
- D3 regression suite and thresholds
- D4 weighted task-distribution analysis
- E2 intervention recommendations
- E3 trend tracking over time
- F4 corpus management tools
- G1 export workflows
- G3 scheduled benchmark reruns
- P4 research compatibility layer

## Phase 5. Guarded optimization workflow
Goal: improve behavior without quietly overfitting.

Implement last:
- E1 hill-climbing or guided prompt optimization

## Recommended first thin slice
If we want the first implementation PR after this docs PR to prove the direction, it should include:
- plugin skeleton
- mistake candidate schema
- transcript ingestion stub
- explicit correction detector
- basic review queue artifact or API
