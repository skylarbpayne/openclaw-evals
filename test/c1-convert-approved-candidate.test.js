import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runFirstLoop } from '../src/e2e/run-first-loop.js';
import { convertApprovedCandidateToEval } from '../src/evals/convert-candidate-to-eval.js';
import { EvalCaseStore } from '../src/evals/eval-case-store.js';

test('C1-POS-1 converts an approved candidate into an eval-case artifact', async () => {
  const outputDir = await seedApprovedCandidate();

  try {
    const result = await convertApprovedCandidateToEval({
      baseDir: outputDir,
      candidateId: 'a2-session-explicit-1-1-2',
      now: () => '2026-04-14T03:15:00.000Z',
    });

    assert.equal(result.evalCase.evalCaseId, 'eval-a2-session-explicit-1-1-2');
    assert.equal(result.evalCase.sourceCandidateId, 'a2-session-explicit-1-1-2');
    assert.equal(result.evalCase.expectedBehavior, "That's wrong, I asked for a summary not an email.");
    assert.equal(result.evalCase.scoring.strategy, 'rule-based-review');
    assert.equal(result.evalCase.scoring.grading.mode, 'rule-based');
    assert.equal(result.evalCase.scoring.grading.judgePromptVersion, null);
    assert.match(result.evalCase.scoring.grading.rubricText, /Expected behavior:/);
    assert.equal(result.evalCase.scoring.grading.checks[0].type, 'contains-expectation');
    assert.equal(result.evalCase.scoring.grading.checks[1].type, 'avoid-known-bad-pattern');

    const reloaded = await new EvalCaseStore(outputDir).read('eval-a2-session-explicit-1-1-2');
    assert.equal(reloaded.evalCaseId, 'eval-a2-session-explicit-1-1-2');
    assert.equal(reloaded.provenance.sourceSessionId, 'session-explicit-1');
    assert.equal(reloaded.scoring.grading.mode, 'rule-based');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('C1-NEG-1 refuses to convert a non-approved candidate', async () => {
  const transcriptDir = path.resolve('test/fixtures/e2e/transcripts');
  const decisions = (await import(path.resolve('test/fixtures/e2e/review-decisions.json'), {
    with: { type: 'json' },
  })).default;
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-c1-neg-'));

  try {
    await runFirstLoop({
      transcriptDir,
      decisions,
      outputDir,
      now: () => '2026-04-14T03:15:00.000Z',
    });

    await assert.rejects(
      () => convertApprovedCandidateToEval({
        baseDir: outputDir,
        candidateId: 'a2-session-explicit-2-1-2',
      }),
      /candidate must be approved before eval conversion: a2-session-explicit-2-1-2/,
    );
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

async function seedApprovedCandidate() {
  const transcriptDir = path.resolve('test/fixtures/e2e/transcripts');
  const decisions = (await import(path.resolve('test/fixtures/e2e/review-decisions.json'), {
    with: { type: 'json' },
  })).default;
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-c1-pos-'));

  await runFirstLoop({
    transcriptDir,
    decisions,
    outputDir,
    now: () => '2026-04-14T03:15:00.000Z',
  });

  return outputDir;
}
