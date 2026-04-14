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

This repo now includes a narrow A2 explicit-correction MVP:

- transcript-shaped input validation in `src/schemas/`
- explicit correction detector in `src/detectors/`
- JSON-file candidate persistence in `src/repository/`
- repo-local CLI entrypoint in `src/cli/`
- node tests in `test/`

This is intentionally repo-local and developer-operated for now.
It is not yet an OpenClaw plugin, dashboard, API, or review workflow.
