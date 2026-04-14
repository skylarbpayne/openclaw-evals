# Plan: F3-lite comparison view MVP

## Stories
- F3 Review model comparisons
- follow-through on D2-lite run summary comparison

## Why this is next
The repo can now compare persisted run results for the same eval case, but the output is still backend JSON only.
That means the next bottleneck is visibility.

A thin local comparison view is the honest next step: enough UI to inspect run summaries and deltas, without pretending we have a full dashboard product.

## Goal
Add the smallest honest local view over D2 comparison summaries.

## In scope
- one local server-rendered comparison page
- list eval cases with run counts and latest verdict
- detail view showing verdict history and check-level deltas
- tests for rendered comparison output
- no frontend framework

## Out of scope
- full dashboard shell
- auth and multi-user concerns
- charts and visual analytics
- broad corpus management surfaces beyond current thin UI

## Design stance
Use the same thin-server approach as F4.
Keep it inspectable, local, and narrow.
If a PR includes UI, include a screenshot in the PR description.

## Definition of done
This slice is done when persisted run results can be viewed locally through a comparison page that makes verdict changes and check deltas obvious for at least one eval case with multiple runs.
