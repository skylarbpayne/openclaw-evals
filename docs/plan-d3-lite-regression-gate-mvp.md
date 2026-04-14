# Plan: D3-lite regression gate MVP

## Stories
- D3 Catch regressions before rollout
- follow-through on D1 and D2 result artifacts

## Why this is next
The repo can now generate eval cases, score runs, persist result artifacts, compare runs, and inspect those comparisons in a thin local UI.
What it still cannot do is answer the useful operational question: did the new run regress?

A narrow regression gate is the honest next slice.
It should sit directly on the existing result artifacts and comparison summaries, without inventing a broader release-management system.

## Goal
Add a minimal regression decision layer over persisted eval run results.

## In scope
- define a regression report for one eval case across at least two runs
- treat a verdict flip from pass to fail as a regression
- treat newly failed checks as regression evidence
- expose a small local CLI for reporting regression status
- add focused tests for pass-to-fail, fail-to-pass, and unchanged outcomes

## Out of scope
- rollout orchestration
- weighted benchmark suites
- scheduled benchmark gates
- cross-case policy engines
- dashboard alerting or notifications

## Design stance
Use the existing D2 comparison output as the input boundary.
Prefer explicit, inspectable decision rules over tunable heuristics.
A false sense of sophistication here would be bullshit.

## Definition of done
This slice is done when the repo can look at persisted results for an eval case and produce a deterministic regression judgment with cited evidence about verdict change and newly failing checks.
