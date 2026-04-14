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
| A1 | Discover mistakes from transcripts | Data ingestion, Failure mining | transcript import contract, normalized transcript importer, session-log adapter | Phase 6 | In progress | Skylar | Current slices are the file-based transcript import MVP in `docs/plan-a1-transcript-import-contract-mvp.md` and the real-session adapter MVP in `docs/plan-p1-real-session-log-adapter-mvp.md`, extending ingestion toward actual OpenClaw session logs. |
| A2 | Detect explicit user corrections | Failure mining | explicit correction detector, candidate persistence path | Phase 1 | Acceptance-tested | Skylar | Implemented in `src/schemas/transcript.js`, `src/detectors/explicit-correction.js`, `src/repository/candidate-store.js`, `src/index.js`, `src/cli/run-a2.js`, and `test/a2-explicit-correction.test.js`. Acceptance evidence lives in `docs/acceptance-a2-detect-explicit-user-corrections.md`. This remains a narrow repo-local slice, not a claim that A1, B1, B2, or P1 are complete. |
| A3 | Detect implicit failures | Failure mining | runtime/provider failure detector, repeated error-loop candidate extraction | Phase 6 | In progress | Skylar | Current slice is the runtime failure detection MVP described in `docs/plan-a3-runtime-failure-detection-mvp.md`, focused on repeated assistant error loops proven in real local session logs. |
| A4 | Cluster recurring mistake types | Failure mining, Mistake registry | family clustering service | Phase 2 | Not started | Skylar | Needs enough data |
| B1 | Create typed mistake record | Mistake registry | SQLite-backed persistence layer, typed candidate record boundary | Phase 3 | In progress | Skylar | Current slice is the SQLite registry MVP described in `docs/plan-b1-sqlite-mistake-registry-mvp.md`. Goal: replace JSON-file storage while preserving the current A2 and B2 loop honestly. |
| B2 | Review and curate candidates | Review and curation, Dashboard | repo-local review repository, curation actions | Phase 2 | Acceptance-tested | Skylar | Implemented in `src/review/review-repository.js`, `src/review/api.js`, and `src/repository/candidate-store.js` with tests in `test/b2-review-curation.test.js`. Acceptance evidence lives in `docs/acceptance-b2-review-and-curate-candidates.md`. This remains a repo-local curation slice, not a dashboard or plugin claim. |
| B3 | Track severity and frequency | Mistake registry, Results analytics | severity model, aggregation views | Phase 2 | Not started | Skylar | Depends on corpus |
| C1 | Generate minimal repro eval | Eval generation | approved-candidate to eval-case converter, eval-case artifact CLI | Phase 6 | In progress | Skylar | Current slice is the deterministic C1 MVP described in `docs/plan-c1-minimal-repro-eval-mvp.md`, converting approved candidates into inspectable eval-case artifacts. |
| C2 | Expand variants | Eval generation | variant generator | Phase 3 | Not started | Skylar | Synthetic after real cases |
| C3 | Create eval families | Eval generation, Registry | family model, family editor | Phase 2 | Not started | Skylar | Depends on C1 and A4 |
| C4 | Attach grading rubrics | Eval generation, Scoring | grading metadata schema on eval artifacts, deterministic rubric attachment | Phase 6 | In progress | Skylar | Current slice is the grading-rubrics MVP described in `docs/plan-c4-grading-rubrics-mvp.md`, adding structured scoring metadata to generated eval cases while keeping rule-based checks first. |
| D1 | Compare models on suite | Eval runner, Results analytics | run orchestrator, comparison report | Phase 3 | Not started | Skylar | First benchmark slice |
| D2 | Test prompt variants | Eval runner, Results analytics | prompt version registry, compare runner | Phase 3 | Not started | Skylar | Same infra as D1 |
| D3 | Catch regressions before rollout | Eval runner, Results analytics | protected regression suite, thresholds | Phase 4 | Not started | Skylar | Gate after confidence |
| D4 | Evaluate weighted task distributions | Results analytics | weighting engine, task-distribution model | Phase 4 | Not started | Skylar | Advanced analytics |
| E1 | Hill-climb instructions | Optimization workflow | tuning loop, guarded proposal flow | Phase 5 | Not started | Skylar | Never auto-ship |
| E2 | Recommend likely fixes | Analytics, Optimization workflow | intervention recommender | Phase 4 | Not started | Skylar | Triage aid |
| E3 | Track improvements over time | Results analytics, Dashboard | trend views, release timeline | Phase 4 | Not started | Skylar | Needs history |
| F1 | View top mistakes | Dashboard, Analytics | overview dashboard | Phase 3 | Not started | Skylar | Human visibility |
| F2 | Drill to evidence | Dashboard, Registry | candidate detail evidence view, transcript excerpt, provenance display | Phase 6 | In progress | Skylar | Narrowly supported through the thin review UI MVP for candidate-level evidence inspection, not full family exploration. |
| F3 | Review model comparisons | Dashboard, Results analytics | comparison UI | Phase 3 | Not started | Skylar | Backed by D1 and D2 |
| F4 | Manage eval corpus | Dashboard, Eval generation | thin local review UI, candidate list/detail pages, approve/dismiss/edit forms | Phase 6 | In progress | Skylar | Current slice is the thin review UI MVP described in `docs/plan-f4-thin-review-ui-mvp.md`, intentionally limited to local candidate review on top of the proven loop. |
| G1 | Export cases for offline analysis | Research bridge | export API, markdown and JSON export | Phase 4 | Not started | Skylar | Useful external hook |
| G2 | Preserve privacy boundaries | Ingestion, Export, Registry | redaction policy, sanitization controls | Phase 2 | Not started | Skylar | Non-optional |
| G3 | Re-run benchmarks on schedule | Plugin runtime, Eval runner | cron runner, snapshot history | Phase 4 | Not started | Skylar | Operational hardening |
| P1 | Install as OpenClaw plugin | Plugin runtime | plugin entrypoint, minimal config, honest bridge into existing pipeline | Phase 6 | In progress | Skylar | Current slice is the honest plugin MVP described in `docs/plan-p1-honest-plugin-mvp.md`, focused on one real OpenClaw-native path instead of broad packaging claims. |
| P2 | MCP-first interface | MCP layer | tools and resources contract | Phase 3 | Not started | Skylar | Agent-native access |
| P3 | API out of the box | API layer | HTTP API spec and handlers | Phase 2 | Not started | Skylar | External integration |
| P4 | Research compatibility layer | Research bridge, Schemas | exchange schemas, bundle validator | Phase 4 | Not started | Skylar | Artifact boundary |
