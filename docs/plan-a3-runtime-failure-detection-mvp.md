# Plan: A3 runtime failure detection MVP

## Stories
- A3 Detect implicit failures
- supports P1 real-session validation by covering failure classes that do not show up as explicit user corrections

## Why this is next
The first real manual run exposed a clear gap.
A real OpenClaw session with repeated provider/auth failures adapted successfully through the plugin bridge, but the current detector produced zero candidates because it only handles explicit user correction language.

That means the next honest move is not more UI or familying.
It is detecting runtime-style failures that already appear in real session logs.

## Goal
Implement the smallest honest A3 slice that detects repeated assistant runtime/provider failures from OpenClaw session logs.

## In scope
- detect assistant error events from session logs
- detect repeated failure loops where the same user request is retried against repeated assistant errors
- emit a candidate artifact with provenance and failure summary
- support this through the existing OpenClaw session-log adapter/plugin path
- tests and acceptance documentation based on a real local failure session fixture

## Out of scope
- generic clustering of all implicit failures
- tool failure analysis
- severity/frequency scoring beyond simple defaults
- automatic remediation

## Design stance
Stay narrow and literal.
Use the event shapes proven in the real local auth-failure session.
Do not pretend to solve all implicit failure detection.
Just detect one real repeated runtime-failure pattern honestly.

## Definition of done
This slice counts as done only when:
- a real local assistant error loop from an OpenClaw session log yields at least one candidate artifact
- the candidate captures failure type, repeated pattern, and provenance
- the detection works through the plugin/session-log path, not only isolated unit helpers
- acceptance documentation records exactly what runtime-failure shape is supported
