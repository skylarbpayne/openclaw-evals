# Plugin surface mapping

This maps desired product behavior to actual OpenClaw plugin surfaces.

## 1. Hooks to mine mistakes in conversations
Desired behavior:
- plugin can observe conversation/runtime evidence and mine mistake candidates

Likely OpenClaw surface:
- plugin hooks
- possibly plugin-owned commands/tools for explicit invocation

Honest first implementation:
- start with a narrow hook or explicit plugin command over transcript/session-log evidence
- do not auto-mine every message by default yet

## 2. Accessible UI / frontend
Desired behavior:
- operator can inspect top mistakes, review queue, comparisons, regressions

Likely OpenClaw surface:
- plugin-owned HTTP routes
- reuse the existing thin server rendering instead of inventing a second frontend

Honest first implementation:
- expose current thin UI pages via plugin-owned routes
- keep auth/access local and operator-oriented at first

## 3. Automatic expansion of errors into a case
Desired behavior:
- mined failures can become eval cases without manual repo intervention

Likely OpenClaw surface:
- plugin hook or service logic
- maybe plugin command/tool for explicit promotion

Honest first implementation:
- automatic conversion only after approval or narrow high-confidence runtime-failure policy
- keep audit trail explicit

## 4. Tools to view and run evals
Desired behavior:
- OpenClaw itself can inspect evals, run them, compare runs, and report regressions

Likely OpenClaw surface:
- plugin tools
- possibly plugin CLI commands

Honest first implementation:
- start with tools for list evals, inspect eval, run eval, compare runs, detect regression
- keep write/mutation actions narrower than read/run actions initially

## Recommended implementation order
1. runtime mining path
2. plugin-owned UI routes
3. eval tools
4. automatic candidate -> eval promotion

## Why this order
- mining creates the raw material
- UI makes it inspectable
- tools make it usable in OpenClaw
- automatic promotion only makes sense once visibility and control exist
