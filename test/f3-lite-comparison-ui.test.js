import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runFirstLoop } from '../src/e2e/run-first-loop.js';
import { convertApprovedCandidateToEval } from '../src/evals/convert-candidate-to-eval.js';
import { createReviewServer } from '../src/ui/review-server.js';
import { replayCapturedBadResponse, replayExpectedBehavior, runEvalCase } from '../src/evals/run-eval-case.js';

test('F3-UI-1 comparison list renders eval cases with run summaries', async () => {
  const outputDir = await seedComparisonData();
  const { server, baseUrl } = await startServer(outputDir);

  try {
    const response = await fetch(`${baseUrl}/comparisons`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /Eval Comparisons/);
    assert.match(body, /eval-a2-session-explicit-1-1-2/);
    assert.match(body, /pass|fail/);
  } finally {
    server.close();
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('F3-UI-2 comparison detail renders verdict history and delta details', async () => {
  const outputDir = await seedComparisonData();
  const { server, baseUrl } = await startServer(outputDir);

  try {
    const response = await fetch(`${baseUrl}/comparisons/eval-a2-session-explicit-1-1-2`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /Verdict history/);
    assert.match(body, /Delta from first to latest/);
    assert.match(body, /verdictChanged/);
    assert.match(body, /run-eval-a2-session-explicit-1-1-2/);
  } finally {
    server.close();
    await rm(outputDir, { recursive: true, force: true });
  }
});

async function seedComparisonData() {
  const transcriptDir = path.resolve('test/fixtures/e2e/transcripts');
  const decisions = (await import(path.resolve('test/fixtures/e2e/review-decisions.json'), {
    with: { type: 'json' },
  })).default;
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-f3-ui-'));

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

async function startServer(outputDir) {
  const server = createReviewServer({ baseDir: outputDir, now: () => '2026-04-14T03:00:00.000Z' });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
}
