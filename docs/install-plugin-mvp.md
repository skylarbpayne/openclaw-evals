# Install and Run - Plugin MVP

This is not one-click yet.
It is, however, now supposed to be boring for a technical OpenClaw user.

## Docs alignment status
This repo now includes the native OpenClaw packaging primitives the docs expect:
- `package.json.openclaw`
- `openclaw.plugin.json`

What is still pending is a full SDK-style default entry using `definePluginEntry(...)`.
That step requires the OpenClaw plugin SDK package to be available in this repo environment.
Until then, the plugin flow remains honest and local, but not fully SDK-wired.

## Requirements
- Node.js with native `node:sqlite` support
- this repo checked out locally

## Default output location
If you do not specify an output directory, the plugin flow writes to:

```text
.openclaw-evals/
```

in the current working directory.

## Process a transcript fixture
```bash
npm run plugin:run -- \
  --input test/fixtures/a2-explicit-correction.json \
  --decisions test/fixtures/plugin-review-decisions.json
```

## Process a real OpenClaw session log
```bash
npm run plugin:run -- \
  --session-log \
  --input test/fixtures/real-openclaw-sessions/session-206b827e.jsonl \
  --output-dir .openclaw-evals-runtime
```

## What gets created on first run
- output directory if missing
- SQLite mistake registry at `mistake-registry.sqlite`
- transcript snapshot when using the session-log path
- persisted candidate and review/eval artifacts as the flow produces them

## Current scope
This is still a technical-user local flow.
It does not yet publish as a polished extension package or auto-subscribe to runtime events.
But it should now be straightforward to run without reading half the repo.
