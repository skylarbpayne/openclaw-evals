import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runFirstLoop } from '../src/e2e/run-first-loop.js';
import { convertApprovedCandidateToEval } from '../src/evals/convert-candidate-to-eval.js';
import { detectRegression } from '../src/evals/detect-regression.js';
import { replayCapturedBadResponse, replayExpectedBehavior, runEvalCase } from '../src/evals/run-eval-case.js';

test('D3-POS-1 reports regression when latest run flips from pass to fail', async () => {
  const outputDir = await seedEvalCase();

  try {
    await runEvalCase({
      baseDir: outputDir,
      evalCaseId: 'eval-a2-session-explicit-1-1-2',
      responder: replayExpectedBehavior,
      now: () => '2026-04-14T16:00:00.000Z',
    });

    await runEvalCase({
      baseDir: outputDir,
      evalCaseId: 'eval-a2-session-explicit-1-1-2',
      responder: replayCapturedBadResponse,
      now: () => '2026-04-14T16:05:00.000Z',
    });

    const report = await detectRegression({
      baseDir: outputDir,
      evalCaseId: 'eval-a2-session-explicit-1-1-2',
    });

    assert.equal(report.status, 'regression');
    assert.equal(report.regressionDetected, true);
    assert.equal(report.evidence.verdictTransition, 'pass→fail');
    assert.ok(report.evidence.newlyFailedChecks.length >= 1);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('D3-POS-2 reports improved when latest run flips from fail to pass', async () => {
  const outputDir = await seedEvalCase();

  try {
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

    const report = await detectRegression({
      baseDir: outputDir,
      evalCaseId: 'eval-a2-session-explicit-1-1-2',
    });

    assert.equal(report.status, 'improved');
    assert.equal(report.regressionDetected, false);
    assert.equal(report.evidence.verdictTransition, 'fail→pass');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('D3-POS-3 reports insufficient history with only one persisted run', async () => {
  const outputDir = await seedEvalCase();

  try {
    await runEvalCase({
      baseDir: outputDir,
      evalCaseId: 'eval-a2-session-explicit-1-1-2',
      responder: replayExpectedBehavior,
      now: () => '2026-04-14T16:00:00.000Z',
    });

    const report = await detectRegression({
      baseDir: outputDir,
      evalCaseId: 'eval-a2-session-explicit-1-1-2',
    });

    assert.equal(report.status, 'insufficient-history');
    assert.equal(report.regressionDetected, false);
    assert.equal(report.evidence.runCount, 1);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

async function seedEvalCase() {
  const transcriptDir = path.resolve('test/fixtures/e2e/transcripts');
  const decisions = (await import(path.resolve('test/fixtures/e2e/review-decisions.json'), {
    with: { type: 'json' },
  })).default;
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-d3-'));

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
