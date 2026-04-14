# Plan: P1 candidate promotion MVP

## Stories
- P1 Install as OpenClaw plugin
- C1 Generate minimal repro eval
- F4 Manage eval corpus

## Why this is next
The plugin can now mine, expose UI routes, and expose eval tools.
The main missing behavior is promotion policy: turning reviewed candidate mistakes into eval cases through the plugin surface.

The repo already has real review and conversion logic.
This slice should make that policy explicit and auditable in the plugin.

## Goal
Add plugin-owned promotion methods that convert approved candidates into eval cases with explicit policy and audit reporting.

## In scope
- plugin method to promote one approved candidate to an eval
- plugin method to list promotion eligibility state for candidates
- clear rejection/error behavior for unapproved candidates
- focused tests proving approved candidates convert and unapproved candidates do not
- docs clarifying the first promotion policy

## Out of scope
- broad automatic promotion of all candidate types
- silent background conversion
- auto-approval
- multi-candidate batching heuristics

## Design stance
Start narrow and explicit.
Approved candidate -> eval is enough for the first honest policy.
Anything more automatic can come later if it earns the right to exist.

## Definition of done
This slice is done when the plugin can expose clear promotion eligibility and convert an approved candidate into an eval case through the plugin surface, with green tests and explicit docs.
