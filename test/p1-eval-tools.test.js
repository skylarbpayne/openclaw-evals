import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runFirstLoop } from '../src/e2e/run-first-loop.js';
import { convertApprovedCandidateToEval } from '../src/evals/convert-candidate-to-eval.js';
import { replayCapturedBadResponse, replayExpectedBehavior, runEvalCase } from '../src/evals/run-eval-case.js';
import { createOpenClawEvalsPlugin } from '../src/plugin/openclaw-evals-plugin.js';

test('P1-EVAL-1 plugin lists evals and reads a specific eval case', async () => {
  const outputDir = await seedEvalArtifacts();

  try {
    const plugin = createOpenClawEvalsPlugin({ outputDir });

    const listed = await plugin.listEvals();
    assert.deepEqual(listed.evalCaseIds, ['eval-a2-session-explicit-1-1-2']);

    const read = await plugin.getEval({ evalCaseId: 'eval-a2-session-explicit-1-1-2' });
    assert.equal(read.evalCase.evalCaseId, 'eval-a2-session-explicit-1-1-2');
    assert.equal(read.evalCase.sourceCandidateId, 'a2-session-explicit-1-1-2');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('P1-EVAL-2 plugin lists eval runs, compares runs, and detects regression', async () => {
  const outputDir = await seedEvalArtifacts();

  try {
    const plugin = createOpenClawEvalsPlugin({ outputDir });

    const runs = await plugin.listEvalRuns({ evalCaseId: 'eval-a2-session-explicit-1-1-2' });
    assert.equal(runs.totalRuns, 2);
    assert.equal(runs.evalCases[0].runCount, 2);

    const comparison = await plugin.compareEvalRuns({ evalCaseId: 'eval-a2-session-explicit-1-1-2' });
    assert.equal(comparison.evalCases[0].evalCaseId, 'eval-a2-session-explicit-1-1-2');
    assert.equal(comparison.evalCases[0].deltaFromFirstToLatest.verdictChanged, true);

    const regression = await plugin.detectRegression({ evalCaseId: 'eval-a2-session-explicit-1-1-2' });
    assert.equal(regression.status, 'improved');
    assert.equal(regression.regressionDetected, false);
    assert.equal(regression.evidence.verdictTransition, 'fail→pass');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

async function seedEvalArtifacts() {
  const transcriptDir = path.resolve('test/fixtures/e2e/transcripts');
  const decisions = (await import(path.resolve('test/fixtures/e2e/review-decisions.json'), {
    with: { type: 'json' },
  })).default;
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-plugin-evals-'));

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

  await runEvalCase({
    baseDir: outputDir,
    evalCaseId: 'eval-a2-session-explicit-1-1-2',
    responder: replayCapturedBadResponse,
    now: () => '2026-04-14T16:00:00.000Z',
  });

  await runEvalCase({
    baseDir: outputDir,
    evalCaseId: 'eval-a2-session-explicit-1-1-2',
    responder: replayExpectedBehavior,
    now: () => '2026-04-14T16:05:00.000Z',
  });

  return outputDir;
}
