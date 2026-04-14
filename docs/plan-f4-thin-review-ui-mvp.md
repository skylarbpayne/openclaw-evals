# Plan: F4 thin review UI MVP

## Stories
- F4 Manage the eval corpus
- supports B2 Review and curate mistake candidates
- supports F2 Drill down to evidence in the narrow candidate-review context

## Why this is next
The repo now has an honest local loop:
- import transcript files
- mine explicit correction candidates
- review them
- persist the reviewed state

The next bottleneck is human operation.
Right now the loop is real but only comfortable through tests and CLI paths.
A thin local review UI is the next honest step.

## Goal
Build the smallest possible local review UI that lets a human:
1. list current candidates
2. inspect transcript excerpt and provenance
3. approve, dismiss, or edit a candidate
4. see audit history

## In scope
- thin local HTTP server in-repo
- server-rendered HTML only
- candidate list page
- candidate detail page
- review actions: approve, dismiss, edit
- audit history display
- read/write through the existing review repository and API

## Out of scope
- merge UI
- dashboard analytics
- auth
- plugin packaging
- fancy frontend framework
- realtime updates
- cross-session comparisons

## Design stance
Keep this brutally simple.
No React. No build system. No speculative app shell.
Use server-rendered HTML and standard forms so the UI proves the operator workflow without adding frontend complexity.

## Definition of done
This slice counts as done only when:
- local server starts from one command
- candidate list page renders persisted candidates
- detail page shows transcript excerpt, provenance, status, and audit history
- approve, dismiss, and edit actions work through form submits
- automated coverage exists for the HTTP surface at a meaningful level
- acceptance doc records how the UI was verified
