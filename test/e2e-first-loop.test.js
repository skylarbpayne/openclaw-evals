import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runFirstLoop } from '../src/e2e/run-first-loop.js';

test('E2E-1 imported transcripts can be mined, reviewed, and reloaded from durable state', async () => {
  const transcriptDir = path.resolve('test/fixtures/e2e/transcripts');
  const decisions = (await import(path.resolve('test/fixtures/e2e/review-decisions.json'), {
    with: { type: 'json' },
  })).default;
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-first-loop-test-'));

  try {
    const result = await runFirstLoop({
      transcriptDir,
      decisions,
      outputDir,
      now: () => '2026-04-14T02:45:00.000Z',
    });

    assert.equal(result.transcriptCount, 2);
    assert.equal(result.minedCount, 2);
    assert.equal(result.appliedCount, 2);
    assert.equal(result.finalCandidates.length, 2);

    const approved = result.finalCandidates.find((candidate) => candidate.candidateId === 'a2-session-explicit-1-1-2');
    const edited = result.finalCandidates.find((candidate) => candidate.candidateId === 'a2-session-explicit-2-1-2');

    assert.equal(approved.status, 'approved');
    assert.equal(approved.auditHistory.at(-1).type, 'approve');

    assert.equal(edited.status, 'candidate');
    assert.equal(edited.title, 'Requested bullets but returned paragraph');
    assert.equal(edited.correctedExpectation, 'Return exactly three bullet points, not a paragraph.');
    assert.equal(edited.auditHistory.at(-1).type, 'edit');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
