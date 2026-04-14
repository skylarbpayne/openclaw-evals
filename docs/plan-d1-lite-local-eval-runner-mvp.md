# Plan: D1-lite local eval runner MVP

## Stories
- D1 Compare models on suite
- supports C1 eval artifacts and C4 grading metadata

## Why this is next
The repo can now mine failures, review them, convert them into eval artifacts, rank them, and group repeated runtime/provider failures into families.
What it still cannot do honestly is run those eval artifacts against a real response and score the result.

That means the repo is good at producing eval cases, but not yet at using them.

## Goal
Add the smallest honest local eval runner that can execute an eval-case artifact against a provided response function and emit inspectable pass/fail results.

## In scope
- local eval runner for existing eval-case JSON artifacts
- deterministic rule-based grading using the existing C4 checks
- result artifact persistence
- one thin CLI to run a single eval case or a directory of eval cases
- tests proving pass/fail behavior on current artifacts

## Out of scope
- model orchestration across providers
- benchmark dashboards
- statistical comparison reports
- parallel infra or scheduling

## Design stance
Do not pretend this is a full benchmark system.
This is a local harness that proves the eval artifacts are executable and scoreable.
Prefer inspectable result JSON over pretty output.

## Definition of done
This slice is done when an approved candidate-derived eval artifact can be run through a local deterministic grading pass and produce a durable result artifact that clearly records pass/fail, check outcomes, and provenance.
