# Plan: P1 installability MVP

## Stories
- P1 Install as OpenClaw plugin
- follow-through on the existing honest plugin bridge

## Why this is next
The repo now has a real core loop, thin operator views, eval generation, comparison, and regression checks.
But the plugin surface is still developer-shaped.
It is not yet close to "easy to install" because setup still assumes repo familiarity and manual orchestration.

The next honest slice is installability.
Not broad runtime integration. Not privacy work. Not more eval features.
Just making the existing plugin path boring to configure and start.

## Goal
Make the current plugin path meaningfully easier for a technical OpenClaw user to install and run locally.

## In scope
- formal plugin config defaults and normalization
- deterministic storage initialization on first run
- one install-oriented entrypoint that can process either transcript fixtures or real session logs with minimal arguments
- a concise install/run guide in repo docs
- focused tests for default config behavior and storage initialization

## Out of scope
- publishing to a registry
- automatic event subscriptions
- background jobs
- MCP and HTTP packaging
- privacy/sanitization expansion
- non-technical one-click install

## Design stance
Do not fake ease of installation.
A technical user should be able to clone, set one output path if desired, and run one honest plugin flow without spelunking the codebase.

## Definition of done
This slice is done when the repo has a documented plugin install/run path with sensible defaults, first-run storage initialization, and automated proof that the plugin can run with minimal configuration.
