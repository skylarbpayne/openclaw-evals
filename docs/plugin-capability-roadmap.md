# Plugin capability roadmap

This is the user-facing definition of what the OpenClaw Evals plugin should actually do once the packaging work is wrapped.

## Target capabilities

### 1. Hooks to mine mistakes in conversations
Goal: let the plugin observe OpenClaw-native conversation/runtime evidence and persist candidate mistakes automatically.

Needed pieces:
- one hook or runtime integration point that can receive transcript/session evidence
- safe gating so mining is opt-in and narrow at first
- durable candidate persistence into the existing registry

Recommended first slice:
- mine from explicit session-log or transcript-shaped events triggered from the plugin runtime, not from every message live on day one

### 2. Accessible UI / frontend
Goal: give the operator a normal place to inspect top mistakes, candidates, comparisons, and regressions.

Needed pieces:
- plugin-owned HTTP routes or a documented bridge into an existing web surface
- a single thin server surface for top mistakes, review queue, comparisons, and regressions
- a clear auth/access story

Recommended first slice:
- expose the existing thin UI through plugin-owned HTTP routes rather than inventing a second frontend

### 3. Automatic expansion of errors into eval cases
Goal: approved or high-confidence runtime failures should become eval cases without manual repo surgery.

Needed pieces:
- policy for when candidate -> eval conversion happens automatically
- audit trail showing why the eval was created
- clear distinction between candidate mining and eval promotion

Recommended first slice:
- automatic conversion only after explicit approval or a narrow high-confidence runtime-failure path

### 4. Tools to view and run evals
Goal: make evals accessible from OpenClaw itself.

Needed pieces:
- plugin tools or commands to list evals, inspect one eval, run one eval, compare runs, and view regressions
- output formatted for agent/operator use

Recommended first slice:
- start with read/run tools before adding mutation-heavy flows

## Honest sequencing
1. Finish plugin packaging wrap-up
2. Add one real mining/runtime hook path
3. Expose the existing thin UI through plugin-owned routes
4. Add eval listing/run/comparison tools
5. Add cautious automatic candidate -> eval promotion

## Non-goals right now
- auto-mine every conversation by default
- broad always-on background autonomy without operator controls
- second dashboard stack separate from the current thin UI
