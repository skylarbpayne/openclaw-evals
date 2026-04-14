# Plan: F1-lite top mistakes view MVP

## Stories
- F1 View top mistakes
- follow-through on B3 severity/frequency ranking and current candidate family metadata

## Why this is next
The repo now has real candidates, severity/frequency ranking, family metadata for runtime failures, eval generation, run comparison, and a basic regression gate.
What it still lacks is a plain answer to: what is hurting most right now?

A narrow top-mistakes view is the honest next slice.
It should summarize persisted candidates using the ranking and family data that already exist, instead of pretending we have a full analytics warehouse.

## Goal
Add a deterministic ranked top-mistakes summary over persisted candidates, plus a thin local view for inspection.

## In scope
- aggregate persisted candidates into a ranked top-mistakes summary
- group by family when family metadata exists, otherwise by mistake type
- expose count, statuses, severity, priority band, and representative candidate ids
- add a thin local UI page in the existing server
- add focused tests for ranking and rendering

## Out of scope
- trend lines over time
- weighted analytics
- dashboard filters and search
- external API/reporting surfaces
- automated remediation recommendations

## Design stance
Prefer explicit summaries over fake analytics.
Use the ranking fields already attached to candidates.
Keep the first cut inspectable and boring.

## Definition of done
This slice is done when the repo can read persisted candidates and produce a ranked top-mistakes summary that is visible in the thin local UI and backed by focused automated tests.
