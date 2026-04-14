# Plan: B3 severity and frequency MVP

## Stories
- B3 Track severity and frequency
- supports A3 runtime/provider failure detection and real-session prioritization

## Why this is next
The repo now has real runtime/provider failure artifacts from real OpenClaw session data.
That changes the next question from "can we detect it?" to "which failures matter most?"

Without even a thin severity/frequency layer, the registry treats a repeated auth/provider failure loop and a one-off formatting miss like the same kind of thing operationally.
That is not honest.

## Goal
Add the smallest honest ranking layer so mined candidates can carry basic severity/frequency signals, starting with runtime/provider failures.

## In scope
- severity heuristics on candidate artifacts
- frequency signals based on repeated retries already visible in the artifact/provenance
- review/list surfaces can read those fields without needing a new UI
- tests and acceptance coverage for runtime/provider failure candidates

## Out of scope
- global aggregation across the whole corpus
- dashboards and charts
- user-adjustable scoring weights
- advanced clustering or trend analytics

## Design stance
Keep it literal and inspectable.
Prefer explicit fields over opaque scores.
If a candidate is severe because it is a repeated runtime/provider failure loop, say that plainly.

## Definition of done
This slice is done when runtime/provider failure candidates carry stable severity/frequency metadata that can distinguish repeated auth/provider meltdowns from ordinary low-severity candidate artifacts, with automated proof.
