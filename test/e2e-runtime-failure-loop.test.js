import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runRuntimeFailureLoop } from '../src/e2e/run-runtime-failure-loop.js';

test('E2E-RUNTIME-1 real runtime failure loops can be mined, approved, converted, and reloaded', async () => {
  const sessionLogPath = path.resolve('test/fixtures/real-openclaw-sessions/session-206b827e.jsonl');
  const decisionsPath = path.resolve('test/fixtures/e2e/runtime-failure-review-decisions.json');
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-runtime-loop-test-'));

  try {
    const result = await runRuntimeFailureLoop({
      sessionLogPath,
      decisionsPath,
      outputDir,
      now: () => '2026-04-14T04:45:00.000Z',
    });

    assert.ok(result.minedCount >= 1);
    assert.equal(result.appliedCount, 1);
    assert.equal(result.convertedCount, 1);
    assert.ok(result.finalCandidates.length >= 1);
    assert.equal(result.evalCases.length, 1);

    const candidate = result.finalCandidates.find((entry) => entry.candidateId === 'a3-206b827e-f3a3-4969-bde3-0bb36bb53ccf-0-1');
    assert.equal(candidate.status, 'approved');
    assert.equal(candidate.auditHistory.at(-1).type, 'approve');

    const evalCase = result.evalCases[0];
    assert.equal(evalCase.sourceCandidateId, 'a3-206b827e-f3a3-4969-bde3-0bb36bb53ccf-0-1');
    assert.equal(evalCase.provenance.sourceStoryId, 'A3');
    assert.equal(evalCase.provenance.candidateProvenance.retryCount, 7);
    assert.match(evalCase.provenance.candidateProvenance.errorMessage, /OAuth authentication is currently not allowed/);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
