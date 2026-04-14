# Plan: B2 Review and curation MVP

## Story
- Story ID: B2
- Story title: Review and curate mistake candidates

## Why this is the next slice
A2 now produces durable candidate artifacts, but the repo still has no trustworthy way to curate them.
That means the failure corpus is still raw output, not a usable eval substrate.

B2 is the next honest slice because it closes the loop from:
- transcript-shaped input
- explicit correction detection
- candidate persistence
- human review decision

## Goal
Implement one narrow review and curation slice that:
1. reads persisted candidate artifacts from disk
2. supports approve, dismiss, edit, and merge actions
3. preserves audit history for every decision and edit
4. persists reviewed candidate state durably
5. validates the loop with automated tests and updated acceptance testing

## In scope
- file-backed candidate loading and saving
- a review repository that can list and fetch candidates
- approve, dismiss, edit, and merge actions
- audit history stored on each candidate artifact
- minimal API surface for review actions in repo-local use
- automated tests for the main review actions and audit preservation
- one end-to-end test from transcript fixture to reviewed candidate
- updates to acceptance and trace docs

## Out of scope
- dashboard UI
n- OpenClaw plugin runtime
- MCP or HTTP API surfaces
- candidate familying beyond a minimal merge link
- severity/frequency modeling
- SQLite migration

## Storage approach
Keep the storage model narrow and durable for the MVP:
- candidate artifacts remain JSON files on disk
- review actions mutate the candidate artifact and append audit entries
- merge records point from source candidate to target candidate

This is intentionally smaller than the eventual registry architecture, but it is honest and testable.

## Candidate state model
Each candidate should support at least:
- `status`: `candidate` | `approved` | `dismissed` | `merged`
- `auditHistory`: append-only array of review/edit events
- optional review metadata such as reviewer, rationale, timestamps
- optional merge metadata for merged candidates

## Test plan
### 1. Review repository tests
Required coverage:
1. list persisted candidates
2. approve candidate
3. dismiss candidate
4. edit candidate fields while preserving provenance and adding audit entry
5. merge one candidate into another and mark source candidate merged

### 2. End-to-end test
Required flow:
- load transcript fixture
- run A2
- persist candidate artifact
- approve the candidate through the review repository/API
- assert status changed and audit history exists

### 3. Acceptance artifact
Update `docs/acceptance-b2-review-and-curate-candidates.md` with:
- exact commands run
- pass/fail result for each acceptance case
- known remaining gaps

## Definition of done
This B2 slice counts as done only when:
- persisted candidates can be listed and loaded
- approve, dismiss, edit, and merge work on persisted artifacts
- audit history is preserved for all review actions
- one end-to-end transcript-to-review test passes
- B2 acceptance documentation is updated with actual evidence
- trace matrix and repo status reflect reality honestly

## Notes on boundaries
This slice should complete the repo-local curation loop.
It should not claim dashboard, plugin, MCP, or full registry completion.
