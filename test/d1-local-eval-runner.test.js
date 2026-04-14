import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runFirstLoop } from '../src/e2e/run-first-loop.js';
import { convertApprovedCandidateToEval } from '../src/evals/convert-candidate-to-eval.js';
import { EvalResultStore } from '../src/evals/eval-result-store.js';
import { replayCapturedBadResponse, replayExpectedBehavior, runEvalCase } from '../src/evals/run-eval-case.js';

test('D1-POS-1 local eval runner records a failing result for the captured bad response', async () => {
  const outputDir = await seedEvalCase();

  try {
    const { result } = await runEvalCase({
      baseDir: outputDir,
      evalCaseId: 'eval-a2-session-explicit-1-1-2',
      responder: replayCapturedBadResponse,
      now: () => '2026-04-14T16:00:00.000Z',
    });

    assert.equal(result.passed, false);
    assert.equal(result.summary.failed >= 1, true);
    assert.equal(result.provenance.sourceCandidateId, 'a2-session-explicit-1-1-2');

    const reloaded = await new EvalResultStore(outputDir).read('run-eval-a2-session-explicit-1-1-2-20260414160000');
    assert.equal(reloaded.passed, false);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('D1-POS-2 local eval runner records a passing result for the expected behavior replay', async () => {
  const outputDir = await seedEvalCase();

  try {
    const { result } = await runEvalCase({
      baseDir: outputDir,
      evalCaseId: 'eval-a2-session-explicit-1-1-2',
      responder: replayExpectedBehavior,
      now: () => '2026-04-14T16:05:00.000Z',
    });

    assert.equal(result.passed, true);
    assert.equal(result.summary.failed, 0);
    assert.equal(result.summary.passed, 2);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

async function seedEvalCase() {
  const transcriptDir = path.resolve('test/fixtures/e2e/transcripts');
  const decisions = (await import(path.resolve('test/fixtures/e2e/review-decisions.json'), {
    with: { type: 'json' },
  })).default;
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-d1-'));

  await runFirstLoop({
    transcriptDir,
    decisions,
    outputDir,
    now: () => '2026-04-14T03:15:00.000Z',
  });

  await convertApprovedCandidateToEval({
    baseDir: outputDir,
    candidateId: 'a2-session-explicit-1-1-2',
    now: () => '2026-04-14T03:20:00.000Z',
  });

  return outputDir;
}
