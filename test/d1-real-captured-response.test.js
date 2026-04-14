import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runRuntimeFailureLoop } from '../src/e2e/run-runtime-failure-loop.js';
import { EvalResultStore } from '../src/evals/eval-result-store.js';
import { gradeCapturedResponse } from '../src/evals/run-eval-case.js';

test('D1-REAL-1 grades a real captured runtime failure response and preserves response provenance', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-d1-real-'));

  try {
    const seeded = await runRuntimeFailureLoop({
      sessionLogPath: path.resolve('test/fixtures/real-openclaw-sessions/session-206b827e.jsonl'),
      decisionsPath: path.resolve('test/fixtures/e2e/runtime-failure-review-decisions.json'),
      outputDir,
      now: () => '2026-04-14T04:45:00.000Z',
    });

    const evalCase = seeded.evalCases[0];
    const capturedResponse = 'OAuth authentication is currently not allowed for this organization.';

    const { result } = await gradeCapturedResponse({
      baseDir: outputDir,
      evalCaseId: evalCase.evalCaseId,
      response: capturedResponse,
      responseMetadata: {
        source: 'real-openclaw-session-log',
        sessionId: '206b827e-f3a3-4969-bde3-0bb36bb53ccf',
        capturedFromTurnRole: 'assistant',
      },
      now: () => '2026-04-14T16:15:00.000Z',
    });

    assert.equal(result.passed, false);
    assert.equal(result.provenance.sourceStoryId, 'A3');
    assert.equal(result.provenance.responseMetadata.source, 'real-openclaw-session-log');
    assert.equal(result.provenance.responseMetadata.sessionId, '206b827e-f3a3-4969-bde3-0bb36bb53ccf');
    assert.ok(result.summary.failed >= 1);

    const reloaded = await new EvalResultStore(outputDir).read(`run-${evalCase.evalCaseId}-20260414161500`);
    assert.equal(reloaded.provenance.responseMetadata.capturedFromTurnRole, 'assistant');
    assert.equal(reloaded.response, capturedResponse);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
