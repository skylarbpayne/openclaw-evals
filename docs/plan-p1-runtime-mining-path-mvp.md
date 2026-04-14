# Plan: P1 runtime mining path MVP

## Stories
- P1 Install as OpenClaw plugin
- A1 Discover mistakes from transcripts
- A2 Detect explicit user corrections
- A3 Detect implicit/runtime failures

## Why this is next
The repo already has real mining logic for transcript-shaped input and real OpenClaw session logs.
What it does not yet have is a plugin-native runtime path that makes that mining behavior part of the plugin story.

This is the first slice that makes setup mean something operational.

## Goal
Add one honest plugin-native runtime mining path over real OpenClaw session logs.

## In scope
- plugin method for mining a session log into persisted candidates
- optional narrow auto-review/eval-promotion policy kept off by default
- focused tests proving runtime mining over a real session log fixture
- docs clarifying what the runtime mining path does and does not automate

## Out of scope
- broad always-on mining hooks over every conversation
- live per-message interception
- HTTP/UI exposure
- broad tool surface

## Design stance
Keep the first runtime path narrow and explicit.
It should work on real session logs and persist real candidate artifacts, but should not silently mine everything by default.

## Definition of done
This slice is done when the plugin can run a real session-log mining path that produces persisted candidates through the existing registry and the behavior is acceptance-tested.
