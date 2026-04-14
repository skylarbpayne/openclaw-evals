# Plan: honest first end-to-end loop MVP

## Why this is next
The repo now has the main pieces:
- A1 transcript import MVP
- A2 explicit correction detection
- B1 SQLite-backed candidate registry MVP
- B2 review and curation MVP

What it still lacks is one explicit, inspectable path that proves the whole system works as a system on realistic file-based input.

That is the next milestone.

## Goal
Create one honest end-to-end path that runs:
1. transcript file import
2. candidate mining
3. review decision application
4. durable persistence of final reviewed state
5. inspectable output and automated verification

## In scope
- one pipeline entrypoint for the local repo
- file-based transcript import as the input boundary
- explicit correction mining only
- review decision fixture(s) applied after mining
- final persisted state reloaded and asserted in an automated test
- acceptance doc for the milestone path

## Out of scope
- UI/dashboard
- implicit failure mining
- eval generation
- plugin packaging
- generalized workflow engine

## Design stance
Keep it brutally small.
This is not a workflow platform.
It is one honest command and one honest test that prove the repo can run the full loop on realistic inputs.

## Definition of done
This slice counts as done only when:
- a batch of transcript files can be imported from disk
- A2 candidates are mined from those imports
- review decisions can be applied from fixture input
- the final SQLite-backed state can be reloaded and inspected
- one automated end-to-end test covers the full path
- one CLI command runs the same path locally
