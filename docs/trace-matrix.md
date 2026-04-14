# Initial Trace Matrix

Purpose: track each user story from definition through implementation and validation.

## Status legend
- Not started
- In design
- Ready for implementation
- In progress
- Implemented
- Acceptance-tested
- Blocked

## Trace matrix

| Story ID | Story summary | Architecture subsystem(s) | Primary artifact(s) | Implementation phase | Readiness status | Acceptance owner | Notes |
|---|---|---|---|---|---|---|---|
| A1 | Discover mistakes from transcripts | Data ingestion, Failure mining | transcript import contract, normalized transcript importer, session-log adapter, plugin runtime mining path | Phase 6 | In progress | Skylar | Current slices are the file-based transcript import MVP in `docs/plan-a1-transcript-import-contract-mvp.md`, the real-session adapter MVP in `docs/plan-p1-real-session-log-adapter-mvp.md`, and the plugin runtime mining path MVP in `docs/plan-p1-runtime-mining-path-mvp.md`, extending ingestion toward actual OpenClaw session logs inside the plugin path. |
| A2 | Detect explicit user corrections | Failure mining | explicit correction detector, candidate persistence path | Phase 1 | Acceptance-tested | Skylar | Implemented in `src/schemas/transcript.js`, `src/detectors/explicit-correction.js`, `src/repository/candidate-store.js`, `src/index.js`, `src/cli/run-a2.js`, and `test/a2-explicit-correction.test.js`. Acceptance evidence lives in `docs/acceptance-a2-detect-explicit-user-corrections.md`. This remains a narrow repo-local slice, not a claim that A1, B1, B2, or P1 are complete. |
| A3 | Detect implicit failures | Failure mining | runtime/provider failure detector, repeated error-loop candidate extraction | Phase 6 | In progress | Skylar | Current slice is the runtime failure detection MVP described in `docs/plan-a3-runtime-failure-detection-mvp.md`, focused on repeated assistant error loops proven in real local session logs. |
| A4 | Cluster recurring mistake types | Failure mining, Mistake registry | family clustering service | Phase 2 | Not started | Skylar | Needs enough data |
| B1 | Create typed mistake record | Mistake registry | SQLite-backed persistence layer, typed candidate record boundary | Phase 3 | In progress | Skylar | Current slice is the SQLite registry MVP described in `docs/plan-b1-sqlite-mistake-registry-mvp.md`. Goal: replace JSON-file storage while preserving the current A2 and B2 loop honestly. |
| B2 | Review and curate candidates | Review and curation, Dashboard | repo-local review repository, curation actions | Phase 2 | Acceptance-tested | Skylar | Implemented in `src/review/review-repository.js`, `src/review/api.js`, and `src/repository/candidate-store.js` with tests in `test/b2-review-curation.test.js`. Acceptance evidence lives in `docs/acceptance-b2-review-and-curate-candidates.md`. This remains a repo-local curation slice, not a dashboard or plugin claim. |
| B3 | Track severity and frequency | Mistake registry, Results analytics | severity metadata, retry/frequency signals, review-readable ranking fields | Phase 6 | In progress | Skylar | Current slice is the severity/frequency MVP described in `docs/plan-b3-severity-frequency-mvp.md`, starting with runtime/provider failure artifacts mined from real session logs. |
| C1 | Generate minimal repro eval | Eval generation | approved-candidate to eval-case converter, eval-case artifact CLI | Phase 6 | In progress | Skylar | Current slice is the deterministic C1 MVP described in `docs/plan-c1-minimal-repro-eval-mvp.md`, converting approved candidates into inspectable eval-case artifacts. The runtime-failure path is already proven separately through `docs/plan-e2e-runtime-failure-review-loop-mvp.md`. |
| C2 | Expand variants | Eval generation | variant generator | Phase 3 | Not started | Skylar | Synthetic after real cases |
| C3 | Create eval families | Eval generation, Registry | deterministic family key, runtime-failure family metadata | Phase 6 | In progress | Skylar | Current slice is the runtime-failure families MVP described in `docs/plan-c3-lite-runtime-failure-families-mvp.md`, narrowly grouping repeated provider/auth failure loops before broader familying exists. |
| C4 | Attach grading rubrics | Eval generation, Scoring | grading metadata schema on eval artifacts, deterministic rubric attachment | Phase 6 | In progress | Skylar | Current slice is the grading-rubrics MVP described in `docs/plan-c4-grading-rubrics-mvp.md`, adding structured scoring metadata to generated eval cases while keeping rule-based checks first. |
| D1 | Compare models on suite | Eval runner, Results analytics | local eval runner, result artifact, single-case and batch CLI | Phase 6 | In progress | Skylar | D1-lite runner is merged. Current follow-through slice is `docs/plan-d1-real-captured-response-run-mvp.md`, focused on grading real captured Palmer/OpenClaw responses against existing eval artifacts before any broader comparison/orchestration layer. |
| D2 | Compare eval outcomes across runs | Eval runner, Results analytics | run summary, comparison report, check delta view | Phase 6 | In progress | Skylar | Current slice is `docs/plan-d2-lite-run-summary-comparison-mvp.md`, focused on comparing persisted D1 result artifacts for the same eval case before broader analytics/reporting layers. |
| D3 | Catch regressions before rollout | Eval runner, Results analytics | regression report, deterministic gate decision, local CLI | Phase 6 | In progress | Skylar | Current slice is `docs/plan-d3-lite-regression-gate-mvp.md`, focused on a narrow deterministic regression judgment over persisted run results before broader benchmark gating exists. |
| D4 | Evaluate weighted task distributions | Results analytics | weighting engine, task-distribution model | Phase 4 | Not started | Skylar | Advanced analytics |
| E1 | Hill-climb instructions | Optimization workflow | tuning loop, guarded proposal flow | Phase 5 | Not started | Skylar | Never auto-ship |
| E2 | Recommend likely fixes | Analytics, Optimization workflow | intervention recommender | Phase 4 | Not started | Skylar | Triage aid |
| E3 | Track improvements over time | Results analytics, Dashboard | trend views, release timeline | Phase 4 | Not started | Skylar | Needs history |
| F1 | View top mistakes | Dashboard, Analytics | ranked top-mistakes summary, thin local overview page | Phase 6 | In progress | Skylar | Current slice is `docs/plan-f1-lite-top-mistakes-view-mvp.md`, focused on a narrow ranked summary over persisted candidates rather than a broad analytics dashboard. |
| F2 | Drill to evidence | Dashboard, Registry | candidate detail evidence view, transcript excerpt, provenance display | Phase 6 | In progress | Skylar | Narrowly supported through the thin review UI MVP for candidate-level evidence inspection, not full family exploration. |
| F3 | Review model comparisons | Dashboard, Results analytics | thin comparison UI, run summary view, delta detail page | Phase 6 | In progress | Skylar | Current slice is `docs/plan-f3-lite-comparison-view-mvp.md`, focused on a narrow local view over D2 comparison summaries rather than a broad dashboard. |
| F4 | Manage eval corpus | Dashboard, Eval generation | thin local review UI, candidate list/detail pages, approve/dismiss/edit forms, plugin-owned UI startup | Phase 6 | In progress | Skylar | Current slices are the thin review UI MVP described in `docs/plan-f4-thin-review-ui-mvp.md` and the plugin-owned UI routes MVP in `docs/plan-p1-plugin-ui-routes-mvp.md`, extending the local UI into a plugin-owned surface. |
| G1 | Export cases for offline analysis | Research bridge | export API, markdown and JSON export | Phase 4 | Not started | Skylar | Useful external hook |
| G2 | Preserve privacy boundaries | Ingestion, Export, Registry | redaction policy, sanitization controls | Phase 2 | Not started | Skylar | Non-optional |
| G3 | Re-run benchmarks on schedule | Plugin runtime, Eval runner | cron runner, snapshot history | Phase 4 | Not started | Skylar | Operational hardening |
| P1 | Install as OpenClaw plugin | Plugin runtime | plugin entrypoint, manifest, package metadata, config defaults, storage initialization, install-oriented run path | Phase 6 | In progress | Skylar | Current slices are `docs/plan-p1-honest-plugin-mvp.md`, `docs/plan-p1-installability-mvp.md`, and `docs/plan-p1-plugin-packaging-polish-mvp.md`, moving from a narrow bridge toward a docs-aligned native plugin package. |
| P2 | MCP-first interface | MCP layer | tools and resources contract | Phase 3 | Not started | Skylar | Agent-native access |
| P3 | API out of the box | API layer | HTTP API spec and handlers | Phase 2 | Not started | Skylar | External integration |
| P4 | Research compatibility layer | Research bridge, Schemas | exchange schemas, bundle validator | Phase 4 | Not started | Skylar | Artifact boundary |
