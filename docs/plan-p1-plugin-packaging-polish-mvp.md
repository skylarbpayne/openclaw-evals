# Plan: P1 plugin packaging polish MVP

## Stories
- P1 Install as OpenClaw plugin
- follow-through on installability and docs-aligned plugin shape

## Why this is next
The OpenClaw plugin docs are explicit: a plugin should have package metadata under `package.json.openclaw`, a native `openclaw.plugin.json` manifest, and a default SDK entrypoint whose id matches the manifest.

Our current repo has useful plugin logic, but it is still repo-shaped rather than OpenClaw-shaped.
That is the next thing to fix if we want to be able to say this is "right" by OpenClaw plugin standards.

## Goal
Reshape the current plugin path to match documented native OpenClaw plugin packaging expectations.

## In scope
- add `package.json.openclaw` metadata for native plugin discovery
- add `openclaw.plugin.json` manifest with config schema and plugin identity
- add a docs-aligned default plugin SDK entrypoint
- keep existing local plugin flow working through the new packaging shape
- add focused tests that validate package/manifest/entrypoint consistency

## Out of scope
- publishing to ClawHub or npm
- background event subscriptions
- HTTP/API expansion
- setup-entry optimization
- full runtime registration breadth beyond one honest path

## Design stance
Match the docs literally where reasonable.
Do not fake a plugin package while still depending on private repo conventions.
The plugin id, manifest, package metadata, and entrypoint should agree or this slice is bullshit.

## Definition of done
This slice is done when the repo contains a native OpenClaw plugin manifest, package metadata, and SDK-style entrypoint that line up with the docs and still exercise the existing real plugin flow.
