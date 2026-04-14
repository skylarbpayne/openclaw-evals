# Plan: A1 transcript import contract MVP

## Story
- Story ID: A1
- Story title: Discover mistakes from transcripts

## Why this is next
The repo can now mine explicit corrections, review them, and persist them in SQLite.
What it still cannot do honestly is ingest transcript inputs beyond the single narrow fixture shape already used in A2 tests.

That makes A1 the next bottleneck.
We need a first real import contract for transcript-shaped data so failure mining is not coupled to one handcrafted fixture.

## Goal
Implement the smallest honest A1 slice that:
1. accepts transcript JSON files through a defined import contract
2. normalizes and validates imported transcript data
3. preserves source metadata needed by A2 downstream
4. supports batch import of transcript files from a directory
5. proves the import path with automated tests and updated acceptance evidence

## In scope
- transcript import module for file-based JSON imports
- normalization and validation over imported files
- support for single-file and directory-based imports
- carry-forward metadata: session id, timestamps, channel, model, instruction version
- automated tests for valid import, invalid import, and batch import
- updated A1 acceptance documentation

## Out of scope
- OpenClaw runtime log ingestion
- tool trace ingestion beyond transcript JSON
- privacy redaction logic
- implicit failure heuristics
- streaming or API ingestion

## Import contract
Initial MVP contract:
- input is a JSON file containing one transcript object in the same logical shape currently validated by `src/schemas/transcript.js`
- batch import accepts a directory of `.json` files and returns normalized transcripts for each valid file
- invalid files fail loudly with path-aware error messages

## Design stance
Do not invent a giant ingestion framework.
Keep this slice narrow:
- file import only
- transcript JSON only
- validation through the existing transcript schema boundary
- enough metadata preserved to support A2 honestly

## Definition of done
This slice counts as done only when:
- a transcript JSON file can be imported and normalized
- a directory of transcript JSON files can be imported as a batch
- invalid transcript files fail with useful errors
- A2 can run on imported transcript objects without special-casing fixtures
- A1 acceptance documentation is updated with actual commands and evidence
- trace matrix and repo status reflect the new ingestion posture honestly
