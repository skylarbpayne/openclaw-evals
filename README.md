# openclaw-evals

OpenClaw evals workspace for agent failure evals.

## Initial scope

This repo starts with product and architecture artifacts for the first implementation loop:

1. discover real failures from session history
2. review and curate mistake candidates
3. convert confirmed mistakes into eval cases
4. run benchmark suites across prompts and models
5. use the results to guide safe improvement

## Docs

- `docs/user-stories.md`
- `docs/architecture.md`
- `docs/trace-matrix.md`
- `docs/acceptance-testing-template.md`
- `docs/implementation-plan.md`


## First implementation slice

This repo now includes a minimal failure-catalog scaffold:

- plugin skeleton in `src/plugin/`
- mistake candidate schema and in-memory repository in `src/schemas/`
- transcript ingestion stub in `src/ingest/`
- explicit correction detector in `src/detectors/`
- review API shape in `src/review/`
- node tests in `test/`
