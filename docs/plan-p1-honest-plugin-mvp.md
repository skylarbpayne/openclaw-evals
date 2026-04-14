# Plan: P1 honest plugin MVP

## Stories
- P1 Install as OpenClaw plugin
- supports A1, A2, B2, C1, C4, and F4 by exposing one real OpenClaw-native path

## Why this is next
The repo-local loop is now honest enough to test on real Palmer/OpenClaw data.
The next step should not be more isolated substrate work. It should be a narrow plugin integration that proves this system can plug into OpenClaw for actual use.

## Goal
Implement the smallest honest plugin slice that lets OpenClaw call into the existing local eval pipeline.

## In scope
- plugin entrypoint in this repo
- one OpenClaw-facing command or function that runs the existing local loop over transcript-shaped input
- local plugin config for storage path
- reuse existing A1/A2/B2/C1/C4 flow rather than reimplementing it
- acceptance doc that proves the plugin entrypoint exercises real repo logic

## Out of scope
- full event subscriptions
- background mining jobs
- MCP interface
- broad HTTP API
- dashboard embedding
- automated runtime capture from all Palmer traffic

## Design stance
This should be an honest bridge, not fake packaging.
The plugin must call the real core path already implemented in this repo.
If the plugin only wraps the existing pipeline for manual invocation at first, that is fine.

## Proposed MVP shape
- plugin module exposes one callable operation: process transcript input into reviewed/eval-ready artifacts
- config includes storage/output directory
- plugin adapter delegates to existing import, mining, review, and eval conversion modules where appropriate
- one fixture-driven integration test proves the plugin entrypoint works end to end enough to trust the bridge

## Definition of done
This slice counts as done only when:
- the repo contains a real plugin entrypoint
- the plugin entrypoint invokes actual pipeline code in this repo
- one integration test proves the plugin surface can exercise the flow
- acceptance documentation records exactly what was verified and what remains manual or future work
