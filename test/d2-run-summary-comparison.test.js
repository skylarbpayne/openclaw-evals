import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runFirstLoop } from '../src/e2e/run-first-loop.js';
import { convertApprovedCandidateToEval } from '../src/evals/convert-candidate-to-eval.js';
import { compareEvalRuns } from '../src/evals/compare-eval-runs.js';
import { gradeCapturedResponse, replayCapturedBadResponse, replayExpectedBehavior, runEvalCase } from '../src/evals/run-eval-case.js';

test('D2-POS-1 compares multiple runs for the same eval case and reports verdict/check deltas', async () => {
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

    const summary = await compareEvalRuns({
      baseDir: outputDir,
      evalCaseId: 'eval-a2-session-explicit-1-1-2',
    });

    assert.equal(summary.totalRuns, 2);
    assert.equal(summary.evalCases.length, 1);
    assert.equal(summary.evalCases[0].runCount, 2);
    assert.equal(summary.evalCases[0].deltaFromFirstToLatest.verdictChanged, true);
    assert.equal(summary.evalCases[0].deltaFromFirstToLatest.summary.failedChecksDelta < 0, true);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('D2-POS-2 comparison summaries preserve response provenance for captured-response runs', async () => {
  const outputDir = await seedEvalCase();

  try {
    await gradeCapturedResponse({
      baseDir: outputDir,
      evalCaseId: 'eval-a2-session-explicit-1-1-2',
      response: 'Sure, here\'s an email draft you can send to the team.',
      responseMetadata: {
        source: 'captured-session',
        sessionId: 'session-explicit-1',
      },
      now: () => '2026-04-14T16:10:00.000Z',
    });

    const summary = await compareEvalRuns({
      baseDir: outputDir,
      evalCaseId: 'eval-a2-session-explicit-1-1-2',
    });

    assert.equal(summary.totalRuns, 1);
    assert.equal(summary.evalCases[0].verdicts[0].responseMetadata.source, 'captured-session');
    assert.equal(summary.evalCases[0].verdicts[0].responseMetadata.sessionId, 'session-explicit-1');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

async function seedEvalCase() {
  const transcriptDir = path.resolve('test/fixtures/e2e/transcripts');
  const decisions = (await import(path.resolve('test/fixtures/e2e/review-decisions.json'), {
    with: { type: 'json' },
  })).default;
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-d2-'));

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
