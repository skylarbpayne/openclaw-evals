# Plan: C3-lite runtime failure families MVP

## Stories
- C3 Create eval families
- supports A3 runtime/provider failure mining and B3 ranking

## Why this is next
The system can now mine and rank repeated runtime/provider failure loops from real session data.
The next honest bottleneck is that repeated auth/provider meltdowns across sessions still appear as separate candidate rows.
That makes review noisier than it should be.

## Goal
Add a minimal familying layer for repeated runtime/provider failures so obviously similar auth/provider failure loops can be grouped under a stable family identifier.

## In scope
- deterministic family key derivation for runtime/provider failure candidates
- family metadata attached to candidate artifacts
- tests proving similar auth/provider failures collapse into one family signature
- keep the current candidate and eval pipeline intact

## Out of scope
- generic clustering across all mistake types
- fuzzy semantic grouping
- operator UI for family management
- historical aggregation dashboards

## Design stance
Be literal first.
Start with deterministic family keys derived from story, mistake type, and normalized runtime error signature.
If two failures are only "family-related" because we wish they were, do not merge them.

## Definition of done
This slice is done when repeated runtime/provider failure candidates mined from similar real-session failure loops carry a stable family identifier and summary metadata that make cross-session grouping possible without guesswork.
