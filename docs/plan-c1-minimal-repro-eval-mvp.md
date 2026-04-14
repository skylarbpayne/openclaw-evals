# Plan: C1 minimal reproducible eval MVP

## Stories
- C1 Generate a minimal reproducible eval from a mistake
- supports B2 by giving approved candidates a meaningful downstream use

## Why this is next
The repo can now import transcripts, mine mistakes, review them, persist them, and operate that loop through a thin UI.
The next missing step is turning an approved mistake into an actual eval artifact.

Without that, the system still stops short of the core payoff.

## Goal
Implement the smallest honest C1 slice that converts an approved candidate into a runnable eval case artifact.

## In scope
- eval-case JSON artifact generated from one approved candidate
- deterministic conversion logic only, no LLM synthesis
- include minimal prompt/context package from transcript excerpt
- include expected behavior text from corrected expectation
- include a simple scoring strategy declaration
- CLI entrypoint for conversion
- automated tests and acceptance doc

## Out of scope
- eval familying
- rubric authoring UI
- judge prompts
- synthetic variants
- benchmark runner integration

## Design stance
Keep it narrow and deterministic.
An approved candidate should become one compact eval artifact that is easy to inspect and rerun later.
No fancy generation. No family model yet.

## Proposed artifact shape
Each eval case should include at least:
- evalCaseId
- sourceCandidateId
- storyId
- title
- prompt
- expectedBehavior
- scoring
- provenance
- createdFrom status metadata

## Definition of done
This slice counts as done only when:
- an approved candidate can be converted into an eval-case artifact
- the artifact contains compact prompt/context, expected behavior, and scoring metadata
- conversion refuses non-approved candidates
- one CLI command performs the conversion
- automated tests cover success and rejection paths
- acceptance documentation records how the slice was verified
