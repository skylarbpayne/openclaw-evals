# Plan: P1 real session-log adapter MVP

## Stories
- P1 Install as OpenClaw plugin
- supports A1 and the real-data validation posture for the existing loop

## Why this is next
The honest plugin bridge exists, but it still consumes transcript-shaped JSON directly.
To run a real Palmer/OpenClaw test, it should be able to ingest actual OpenClaw session JSONL files.

## Goal
Add the smallest honest adapter from OpenClaw session JSONL into the transcript shape already used by the repo.

## In scope
- parse session JSONL files
- extract alternating user and assistant text turns
- preserve session id and basic metadata
- feed the adapted transcript into the existing plugin bridge
- one real-session integration test using an actual local session log fixture from the machine

## Out of scope
- perfect support for every event type
- tool-call normalization
- multi-session stitching
- automatic runtime subscription

## Design stance
Keep it honest and narrow.
If a session log has no usable user/assistant text turns, reject it plainly.
Only support the event shapes we can prove from local data right now.

## Definition of done
This slice counts as done only when:
- session JSONL can be adapted into the repo transcript shape
- the plugin bridge can process a real local session log fixture through that adapter
- acceptance documentation states exactly what session shape was proven and what remains unsupported
