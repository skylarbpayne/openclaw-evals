# Plan: P1 backfill mining onboarding MVP

## Stories
- P1 Install as OpenClaw plugin
- A1 Discover mistakes from transcripts
- A2 Detect explicit user corrections
- A3 Detect implicit/runtime failures

## Why this is next
The plugin is now useful enough that onboarding should create immediate value.
Waiting for future failures is a weak first-run experience.

A backfill mining tool lets a new installation scan past session logs and immediately populate candidates, top mistakes, and promotion-ready items.

## Goal
Add a plugin-owned backfill mining tool for one session log or a directory of session logs.

## In scope
- plugin method to backfill one session log
- plugin method to backfill a directory of session logs
- summary output for sessions scanned, candidates mined, and candidate ids
- focused tests over real session-log fixtures
- docs clarifying onboarding/backfill use

## Out of scope
- automatic recursive discovery across all possible OpenClaw paths
- live hooks
- UI redesign
- auto-promotion during backfill

## Design stance
Keep onboarding explicit and boring.
Backfill should mine and persist, then hand the operator to the UI/review flow.

## Definition of done
This slice is done when the plugin can backfill one or more past session logs into the registry with clear summary output and green tests.
