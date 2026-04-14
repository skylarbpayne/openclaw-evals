# Plan: P1 eval tools MVP

## Stories
- P1 Install as OpenClaw plugin
- D1 Compare models on suite
- D2 Compare eval outcomes across runs
- D3 Catch regressions before rollout

## Why this is next
The plugin now has runtime mining and plugin-owned UI startup.
The next useful capability is direct eval access through the plugin surface itself.

The repo already has the underlying eval-case, run, comparison, and regression logic.
This slice should expose that existing capability cleanly through plugin methods.

## Goal
Add plugin-owned eval tools for listing evals, inspecting one eval, listing runs, comparing runs, and detecting regressions.

## In scope
- plugin methods for eval listing/inspection/run history/comparison/regression
- focused tests over seeded eval artifacts
- docs clarifying the plugin eval surface

## Out of scope
- full model-provider execution inside the plugin
- broad mutation-heavy admin APIs
- automatic candidate -> eval promotion in this slice

## Design stance
Use the current repo logic as-is.
This is a thin plugin façade, not a rearchitecture.

## Definition of done
This slice is done when the plugin can expose the current eval artifacts and analysis through focused plugin methods with green tests.
