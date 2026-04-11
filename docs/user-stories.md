# User Stories

## Summary
Build an eval system that learns from real assistant mistakes, turns them into reproducible test cases, and uses those cases to improve instructions, routing, and model selection over time.

## Product goal
Give Skylar a practical way to:
- see what kinds of mistakes Palmer makes
- quantify whether changes actually improve behavior
- compare instruction sets and model releases on real work
- discover new failure modes instead of only testing known ones
- build trust through visible learning, not vague claims

## Story index
- A. Failure discovery
- B. Mistake record management
- C. Eval generation
- D. Benchmarking and regression testing
- E. Optimization workflow
- F. Dashboard and workflow UX
- G. Research and operations
- P. Platform and plugin requirements

---

## A. Failure discovery

### A1. Discover mistakes from transcripts
As Skylar, I want the system to scan prior sessions and identify likely mistakes so I can build evals from real failures instead of memory or anecdotes.

**Acceptance criteria**
- Can ingest session transcripts and tool traces
- Flags likely failure moments with confidence score
- Extracts the relevant transcript slice
- Links each candidate to session id, timestamp, and model or instruction context

### A2. Detect explicit user corrections
As Skylar, I want the system to detect when I corrected Palmer so those moments can become high-confidence failure examples.

**Acceptance criteria**
- Detects correction language like “that’s wrong,” “don’t do that,” “you missed,” “I asked for X”
- Associates the correction with the assistant turn being corrected
- Stores both bad behavior and corrected expectation

### A3. Detect implicit failures
As Skylar, I want the system to catch likely failures even when I did not explicitly call them out.

**Acceptance criteria**
- Uses signals like retries, abandoned tool flows, rework, reverted edits, repeated asks, and task rejection
- Marks these as lower-confidence than explicit corrections
- Lets me confirm or dismiss them

### A4. Cluster failures into recurring mistake types
As Skylar, I want similar failures grouped together so I can see patterns rather than isolated incidents.

**Acceptance criteria**
- Groups failures into mistake families
- Suggests cluster labels and descriptions
- Shows top recurring classes over time
- Supports manual relabeling and merge or split

---

## B. Mistake record management

### B1. Create a typed mistake record
As Skylar, I want every failure to be represented as a structured record so it can drive downstream eval generation and reporting.

**Acceptance criteria**
Each mistake record includes at least:
- mistake id
- title
- mistake type
- severity
- confidence
- transcript excerpt
- triggering context
- expected behavior
- likely root cause
- reproducibility estimate
- source sessions
- status: candidate, confirmed, dismissed, converted_to_eval

### B2. Review and curate mistake candidates
As Skylar, I want a review queue for discovered mistakes so I can keep the eval corpus clean.

**Acceptance criteria**
- Can approve, edit, dismiss, or merge candidates
- Can promote a candidate into an eval family
- Preserves audit history of edits and decisions

### B3. Track failure severity and frequency
As Skylar, I want to distinguish costly failures from trivial ones so optimization effort goes to the right problems.

**Acceptance criteria**
- Mistakes can be tagged by severity and business impact
- Dashboard can sort by frequency, severity, or combined score

---

## C. Eval generation

### C1. Generate a minimal reproducible eval from a mistake
As Skylar, I want the system to turn a confirmed mistake into a compact eval case so it can be rerun reliably.

**Acceptance criteria**
- Produces a minimal prompt or context package
- Includes expected output or behavior rubric
- Includes scoring strategy
- Can be edited before being accepted

### C2. Expand one mistake into several variants
As Skylar, I want the system to generate adjacent variations of a failure so we test the class of mistake, not only one example.

**Acceptance criteria**
- Supports paraphrases, context variants, and difficulty levels
- Clearly marks synthetic variants vs real-source cases
- Keeps provenance from original failure family

### C3. Create eval families
As Skylar, I want related cases grouped into eval families so I can reason about whole failure modes.

**Acceptance criteria**
- Families have labels, descriptions, and owner fields
- Each family contains one or more real cases plus optional synthetic variants
- Family-level performance metrics are available

### C4. Attach grading rubrics
As Skylar, I want each eval to define what success looks like so scoring is consistent.

**Acceptance criteria**
- Supports rule-based checks, rubric checks, and LLM-judge checks
- Encourages rule-based scoring first
- Stores rubric text and judge prompt version

---

## D. Benchmarking and regression testing

### D1. Compare models on the same eval suite
As Skylar, I want to run the same cases across multiple models so I can see which one handles my actual work best.

**Acceptance criteria**
- Runs evals across selected models and instruction sets
- Stores per-case and aggregate results
- Supports side-by-side comparison

### D2. Test prompt and instruction variants
As Skylar, I want to compare system prompt versions and policy changes so I can improve instructions without guessing.

**Acceptance criteria**
- Can version prompts and routing rules
- Can run A/B or matrix comparisons
- Shows which failure families improved or regressed

### D3. Catch regressions before rollout
As Skylar, I want a regression suite that runs before adopting a model or prompt change so obvious old mistakes do not come back.

**Acceptance criteria**
- Defines a protected regression suite
- Fails a candidate release when key metrics degrade past threshold
- Highlights exact failing cases

### D4. Evaluate new releases on task distributions that matter
As Skylar, I want to evaluate new model releases against the actual shape of Palmer’s work so selection is grounded in reality.

**Acceptance criteria**
- Cases can be filtered by task type, tool usage, channel, or project
- Aggregate scores can be weighted by real-world frequency and impact
- Dashboard can compare baseline vs candidate release

---

## E. Optimization workflow

### E1. Hill-climb instructions against evals
As Skylar, I want to iteratively improve instructions using the eval corpus so behavior improves over time.

**Acceptance criteria**
- Candidate prompt changes can be proposed and tested automatically
- Improvement is measured on a tuning set
- Changes must also pass held-out and regression suites
- The system warns when a change appears overfit

### E2. Recommend likely fixes for mistake families
As Skylar, I want the system to suggest where to intervene so we do not treat all failures as prompt problems.

**Acceptance criteria**
For each failure family, the system can suggest likely intervention classes:
- better instructions
- routing change
- tool affordance change
- retrieval change
- review or approval guardrail
- model swap
- user-experience fix

### E3. Track improvements over time
As Skylar, I want to see whether failure rates are actually falling so progress is visible.

**Acceptance criteria**
- Trend lines by family and by release
- Improvement and regression callouts
- Links from metrics to underlying cases

---

## F. Dashboard and workflow UX

### F1. View top mistakes at a glance
As Skylar, I want a dashboard that shows the most common and most expensive mistake types so I know where to focus.

**Acceptance criteria**
Dashboard includes:
- top mistake families
- new failure modes this week
- frequency by period
- severity-weighted leaderboard
- recent regressions

### F2. Drill down to evidence
As Skylar, I want to click into a mistake family and see the raw sessions behind it so I can judge whether the classification is real.

**Acceptance criteria**
- Every aggregate metric links to source examples
- Transcript slices are visible with metadata and provenance

### F3. Review model comparisons
As Skylar, I want to compare model versions and prompt versions on the eval suite so I can make rollout choices confidently.

**Acceptance criteria**
- Comparison view by overall score and by failure family
- Can inspect specific wins or losses per case

### F4. Manage the eval corpus
As Skylar, I want a working view for approving candidates, editing cases, and retiring stale evals.

**Acceptance criteria**
- Review queue
- Family editor
- Case editor
- Archival status for outdated evals

---

## G. Research and operations

### G1. Export cases for offline analysis
As Skylar, I want to export eval cases and results so I can analyze them elsewhere.

**Acceptance criteria**
- Export to JSON or Markdown
- Preserves provenance and score metadata

### G2. Preserve privacy and sanitization boundaries
As Skylar, I want the system to avoid leaking sensitive context when producing eval artifacts.

**Acceptance criteria**
- Supports redaction and sanitization
- Can exclude sensitive sessions or projects
- Tracks whether a case is safe for broader sharing

### G3. Re-run benchmarks on a schedule
As Skylar, I want periodic reruns so the dashboard stays current as prompts and models change.

**Acceptance criteria**
- Supports scheduled benchmark runs
- Keeps historical result snapshots

---

## P. Platform and plugin requirements

### P1. OpenClaw plugin first
As an OpenClaw user, I want the system to install as a plugin so I can adopt it without bespoke wiring.

**Acceptance criteria**
- Plugin registers config schema and setup path
- Plugin supports storage initialization and migrations
- Plugin can optionally register dashboard, API, MCP, and cron jobs

### P2. MCP-first interface
As an agent, I want to inspect mistakes, create evals, and launch runs without relying on the dashboard.

**Acceptance criteria**
- MCP tools exist for mistakes, families, suites, runs, compare, import, and export
- MCP resources expose review queue, reports, and registry views

### P3. API out of the box
As an integrator, I want a stable API so external systems can ingest data and fetch results.

**Acceptance criteria**
- API supports ingest, review, family and case management, run launch, compare, and export
- API responses preserve provenance and machine-readable status

### P4. Research compatibility layer
As a research operator, I want import and export of structured benchmark artifacts so outside workflows can interoperate.

**Acceptance criteria**
- Neutral schemas exist for failure, case, family, rubric, run, and result artifacts
- System can validate, import, export, and compare artifact bundles
