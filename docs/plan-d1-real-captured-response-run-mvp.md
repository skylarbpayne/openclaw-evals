# Plan: D1 real captured response run MVP

## Stories
- D1 Compare models on suite
- follow-through on D1-lite local eval runner

## Why this is next
D1-lite proved the eval harness can execute eval artifacts and record results, but only against replay modes.
That is honest infrastructure proof, not yet honest product proof.

The next thing that matters is running at least one approved eval case against a real captured Palmer/OpenClaw assistant response so the repo demonstrates usefulness against live behavior rather than only self-generated test paths.

## Goal
Add the smallest honest path for evaluating a real captured assistant response against an existing eval artifact and persisting the scored result.

## In scope
- one helper that accepts a captured response string for an eval case
- deterministic grading using existing eval-case checks
- one test covering a real-ish captured response shape from current fixtures or imported real session-derived artifacts
- minimal CLI support if needed
- durable result artifact output retained

## Out of scope
- invoking live providers in this slice
- repeated benchmark orchestration
- dashboard/reporting
- broad experiment management

## Design stance
Do not fake "live model evaluation". This slice is about grading a real captured response payload, not orchestrating fresh inference.
If the response came from a real session, preserve that provenance in the run result.

## Definition of done
This slice is done when an existing eval artifact can be graded against a captured assistant response payload through the D1 runner and produce a durable scored result that is materially closer to live Palmer/OpenClaw behavior than replay-mode tests.
