# Architecture

## Product shape
This system is an agent-native eval substrate for OpenClaw, not just a dashboard.

Primary surfaces:
- OpenClaw plugin runtime
- MCP tools and resources
- HTTP API
- Dashboard app
- Import and export bridge for research artifacts

## High-level architecture

```text
Session logs / tool traces / task outcomes
                ↓
        Failure mining pipeline
                ↓
     Candidate mistake records store
                ↓
      Human review + curation layer
                ↓
       Eval generation + familying
                ↓
        Eval registry / case store
                ↓
  Eval runner + scoring + judge layer
                ↓
 Results warehouse / analytics store
                ↓
        Dashboard + comparison UI
```

## Core subsystems

### 1. Data ingestion layer
Purpose: collect the raw evidence needed to find failures.

Inputs:
- session transcripts
- tool calls and outcomes
- task lifecycle signals
- review outcomes
- explicit user corrections
- retries and reversions
- model or version metadata
- prompt or instruction version metadata
- imported artifact bundles

Outputs:
- normalized source events
- transcript slices
- run metadata references

### 2. Failure mining layer
Purpose: turn raw traces into candidate mistake records.

Responsibilities:
- explicit correction detection
- implicit failure heuristic detection
- transcript window extraction
- failure summarization
- mistake-type classification
- severity, confidence, and reproducibility estimation

Design stance:
- heuristics first
- LLM analysis second
- clustering after candidate creation

### 3. Mistake registry
Purpose: store first-class failure artifacts.

Primary entities:
- mistake_candidate
- mistake_family
- source_event
- curation_decision

Storage recommendation:
- SQLite for MVP
- keep schema portable to Postgres

### 4. Human review and curation layer
Purpose: keep the corpus clean and useful.

Responsibilities:
- approve, edit, dismiss, merge
- assign family
- preserve decision history
- promote candidate to eval generation

### 5. Eval generation service
Purpose: convert curated mistakes into rerunnable cases.

Responsibilities:
- minimal reproducible context extraction
- expected behavior capture
- scoring mode assignment
- variant generation
- rubric attachment

Primary entities:
- eval_case
- eval_family
- judge_rubric

### 6. Eval runner
Purpose: execute suites across candidate configurations.

Responsibilities:
- run selected cases across models and prompt versions
- capture outputs and traces deterministically
- invoke scoring pipeline
- persist results

Primary entities:
- eval_run
- eval_run_case_result
- release_candidate

### 7. Scoring layer
Purpose: produce scores stable enough to trust.

Order of preference:
1. exact or structured checks
2. schema validation
3. rubric plus deterministic feature extraction
4. LLM judge

Constraint:
- judge prompts must be versioned and calibrated against a gold set

### 8. Results warehouse and analytics
Purpose: keep historical run results and support comparisons.

Responsibilities:
- aggregate by suite, family, model, prompt version, and time
- compare baseline vs candidate
- surface regressions and wins

### 9. Dashboard app
Purpose: give a human control surface for review and comparison.

Core views:
- overview
- candidate review queue
- family detail
- eval family detail
- model comparison
- prompt comparison
- regressions
- case explorer

Note:
- this is an app, so it belongs in apps in an eventual OpenClaw deployment

### 10. Plugin runtime layer
Purpose: make the system installable and native to OpenClaw.

Responsibilities:
- register config schema
- subscribe to runtime events
- expose API routes
- expose MCP tools and resources
- run migrations
- schedule mining and benchmark jobs

### 11. Research bridge
Purpose: support artifact-level interoperability with external research loops.

Responsibilities:
- import candidate cases and bundles
- export families, suites, runs, and results
- preserve provenance and metadata
- translate internal schema to exchange schema

## Recommended package layout

```text
packages/
  core/
  plugin-openclaw/
  mcp/
  dashboard/
  research-bridge/
  schemas/
docs/
```

## Suggested data model

### mistake_candidate
- id
- source_session_id
- source_turn_range
- source_timestamp
- channel
- model
- instruction_version
- tool_context
- detection_type
- title
- summary
- transcript_excerpt
- expected_behavior
- likely_root_cause
- severity
- confidence
- reproducibility_score
- status
- created_at

### mistake_family
- id
- label
- description
- canonical_failure_pattern
- intervention_hypotheses
- severity_weight
- active

### eval_case
- id
- family_id
- origin_type
- based_on_mistake_candidate_id
- input_context
- task_type
- expected_behavior
- scoring_type
- scoring_spec
- judge_rubric_id
- difficulty
- active

### eval_run
- id
- suite_name
- model
- model_version
- instruction_version
- routing_version
- tool_policy_version
- run_reason
- created_at

### eval_run_case_result
- id
- eval_run_id
- eval_case_id
- raw_output
- tool_trace
- score
- pass_fail
- judge_result_id
- latency_ms
- cost

### judge_rubric
- id
- name
- rubric_text
- judge_prompt
- calibration_status
- version

## Implementation flows

### Flow A. Discover new failures
1. ingest recent sessions
2. run explicit correction detector
3. run implicit failure heuristics
4. extract transcript slices
5. summarize and classify
6. write candidate mistakes
7. queue for human review

### Flow B. Convert mistakes into evals
1. reviewer approves candidate
2. system proposes minimal reproducible case
3. reviewer edits if needed
4. system generates optional variants
5. reviewer accepts family and cases
6. cases enter registry

### Flow C. Benchmark a new model or prompt
1. select suite and candidate config
2. run cases across baseline and candidate
3. score outputs
4. compare aggregate and family metrics
5. flag regressions and wins
6. store report snapshot

### Flow D. Optimize safely
1. pick target family or suite
2. generate candidate instruction changes
3. test on tuning set
4. require pass on held-out and regression suites
5. surface explanation and diff
6. require approval before promotion

## Architectural decisions

1. Start with explicit corrections, not magic discovery.
2. Make mistake family the primary organizing object.
3. Preserve provenance from every eval back to a real failure.
4. Prefer deterministic scoring whenever possible.
5. Keep dashboard secondary to the corpus and workflow.
6. Keep import or export boundaries clean instead of deeply coupling to outside systems.
