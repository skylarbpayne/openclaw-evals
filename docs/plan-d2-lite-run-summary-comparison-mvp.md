# Plan: D2-lite run summary comparison MVP

## Stories
- D2 Compare eval outcomes across runs
- follow-through on D1 real captured response grading

## Why this is next
The repo can now grade one real captured Palmer/OpenClaw response against an eval artifact and persist the result.
That is useful, but still too isolated.

The next honest need is a small comparison layer that makes multiple result artifacts inspectable together so we can answer basic questions like:
- did the captured response perform better or worse than the replay baseline?
- how many checks passed across runs?
- what changed between two scored responses for the same eval case?

## Goal
Add the smallest honest result-comparison layer over existing D1 run artifacts.

## In scope
- load multiple persisted eval result artifacts
- summarize them by eval case
- compare pass/fail and check outcomes across runs
- one CLI for generating a comparison summary from stored results
- tests proving comparison behavior on current D1 result artifacts

## Out of scope
- charts/dashboard UI
- cross-model orchestration
- statistical significance or experiment management
- large benchmark reporting

## Design stance
Keep it boring and inspectable.
The output should be structured JSON that makes differences obvious.
Do not invent analytics beyond what current result artifacts can honestly support.

## Definition of done
This slice is done when two or more stored run results for the same eval case can be summarized and compared in a durable, inspectable way that clearly shows verdict differences and check-level deltas.
