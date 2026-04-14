# Plan: P1 runtime capability wrap-up

## Stories
- P1 Install as OpenClaw plugin
- align plugin shape with the real intended use cases

## Why this is next
Packaging alone is not enough.
The plugin needs a clear contract for what setup actually enables inside OpenClaw.
Right now that answer is too fuzzy.

The next step is to lock the plugin's intended runtime capability surface before implementing the next behavior slice.

## Goal
Define and document the first real runtime capabilities the plugin will own inside OpenClaw.

## In scope
- explicit roadmap for mining hooks, UI exposure, eval tools, and eval promotion
- clarify what current setup does vs does not do
- update repo status/docs so plugin work is described honestly

## Out of scope
- implementing all runtime capabilities in this slice
- broad hook automation
- full HTTP/API packaging

## Definition of done
This slice is done when the repo has a concrete plugin capability roadmap tied to actual next implementation slices, and the current plugin behavior is documented without ambiguity.
