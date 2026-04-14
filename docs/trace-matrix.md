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
| A1 | Discover mistakes from transcripts | Data ingestion, Failure mining | transcript ingestion job, candidate detector | Phase 2 | Not started | Skylar | No implementation artifacts currently exist in the repo. Re-plan after the A2 slice is landed. Existing acceptance doc reflects a deleted scaffold and is not current implementation evidence. |
| A2 | Detect explicit user corrections | Failure mining | explicit correction detector, candidate persistence path | Phase 1 | Acceptance-tested | Skylar | Implemented in `src/schemas/transcript.js`, `src/detectors/explicit-correction.js`, `src/repository/candidate-store.js`, `src/index.js`, `src/cli/run-a2.js`, and `test/a2-explicit-correction.test.js`. Acceptance evidence lives in `docs/acceptance-a2-detect-explicit-user-corrections.md`. This remains a narrow repo-local slice, not a claim that A1, B1, B2, or P1 are complete. |
| A3 | Detect implicit failures | Failure mining | implicit heuristic detector | Phase 2 | Not started | Skylar | Lower-confidence path |
| A4 | Cluster recurring mistake types | Failure mining, Mistake registry | family clustering service | Phase 2 | Not started | Skylar | Needs enough data |
| B1 | Create typed mistake record | Mistake registry | mistake schema, persistence layer | Phase 2 | Not started | Skylar | The A2 slice persists a narrow candidate artifact only. Do not treat that as B1 completion. |
| B2 | Review and curate candidates | Review and curation, Dashboard | review queue UI, curation actions | Phase 3 | Not started | Skylar | Review workflow should wait until A2 and B1 are real. |
| B3 | Track severity and frequency | Mistake registry, Results analytics | severity model, aggregation views | Phase 2 | Not started | Skylar | Depends on corpus |
| C1 | Generate minimal repro eval | Eval generation | mistake-to-eval converter | Phase 2 | Not started | Skylar | First eval creator |
| C2 | Expand variants | Eval generation | variant generator | Phase 3 | Not started | Skylar | Synthetic after real cases |
| C3 | Create eval families | Eval generation, Registry | family model, family editor | Phase 2 | Not started | Skylar | Depends on C1 and A4 |
| C4 | Attach grading rubrics | Eval generation, Scoring | rubric schema, rubric editor | Phase 2 | Not started | Skylar | Prefer rule-based first |
| D1 | Compare models on suite | Eval runner, Results analytics | run orchestrator, comparison report | Phase 3 | Not started | Skylar | First benchmark slice |
| D2 | Test prompt variants | Eval runner, Results analytics | prompt version registry, compare runner | Phase 3 | Not started | Skylar | Same infra as D1 |
| D3 | Catch regressions before rollout | Eval runner, Results analytics | protected regression suite, thresholds | Phase 4 | Not started | Skylar | Gate after confidence |
| D4 | Evaluate weighted task distributions | Results analytics | weighting engine, task-distribution model | Phase 4 | Not started | Skylar | Advanced analytics |
| E1 | Hill-climb instructions | Optimization workflow | tuning loop, guarded proposal flow | Phase 5 | Not started | Skylar | Never auto-ship |
| E2 | Recommend likely fixes | Analytics, Optimization workflow | intervention recommender | Phase 4 | Not started | Skylar | Triage aid |
| E3 | Track improvements over time | Results analytics, Dashboard | trend views, release timeline | Phase 4 | Not started | Skylar | Needs history |
| F1 | View top mistakes | Dashboard, Analytics | overview dashboard | Phase 3 | Not started | Skylar | Human visibility |
| F2 | Drill to evidence | Dashboard, Registry | family detail and transcript explorer | Phase 3 | Not started | Skylar | Provenance critical |
| F3 | Review model comparisons | Dashboard, Results analytics | comparison UI | Phase 3 | Not started | Skylar | Backed by D1 and D2 |
| F4 | Manage eval corpus | Dashboard, Eval generation | case editor, family editor, archive flow | Phase 4 | Not started | Skylar | Stewardship surface |
| G1 | Export cases for offline analysis | Research bridge | export API, markdown and JSON export | Phase 4 | Not started | Skylar | Useful external hook |
| G2 | Preserve privacy boundaries | Ingestion, Export, Registry | redaction policy, sanitization controls | Phase 2 | Not started | Skylar | Non-optional |
| G3 | Re-run benchmarks on schedule | Plugin runtime, Eval runner | cron runner, snapshot history | Phase 4 | Not started | Skylar | Operational hardening |
| P1 | Install as OpenClaw plugin | Plugin runtime | plugin module, config, migrations | Phase 5 | Not started | Skylar | Packaging should follow a proven core failure-catalog slice, not precede it. |
| P2 | MCP-first interface | MCP layer | tools and resources contract | Phase 3 | Not started | Skylar | Agent-native access |
| P3 | API out of the box | API layer | HTTP API spec and handlers | Phase 2 | Not started | Skylar | External integration |
| P4 | Research compatibility layer | Research bridge, Schemas | exchange schemas, bundle validator | Phase 4 | Not started | Skylar | Artifact boundary |
