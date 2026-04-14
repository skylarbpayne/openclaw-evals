import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runA2 } from '../src/index.js';
import { importOpenClawSessionLog } from '../src/ingest/openclaw-session-import.js';
import { ReviewRepository } from '../src/review/review-repository.js';

test('B3-POS-1 explicit correction candidates get low routine ranking by default', async () => {
  const transcript = JSON.parse(
    await readFile(path.resolve('test/fixtures/a2-explicit-correction.json'), 'utf8'),
  );
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-b3-a2-'));

  try {
    await runA2({ transcript, outputDir });
    const repository = new ReviewRepository(outputDir);
    const [candidate] = await repository.list();

    assert.equal(candidate.ranking.severity, 'low');
    assert.equal(candidate.ranking.frequency.label, 'single');
    assert.equal(candidate.ranking.priorityBand, 'routine');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('B3-POS-2 repeated runtime/provider failure loops get high priority ranking metadata', async () => {
  const transcript = await importOpenClawSessionLog(
    path.resolve('test/fixtures/real-openclaw-sessions/session-206b827e.jsonl'),
  );
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-b3-a3-'));

  try {
    await runA2({ transcript, outputDir });
    const repository = new ReviewRepository(outputDir);
    const candidates = await repository.list();
    const candidate = candidates.find((entry) => entry.storyId === 'A3');

    assert.ok(candidate);
    assert.equal(candidate.ranking.severity, 'high');
    assert.equal(candidate.ranking.frequency.label, 'repeated');
    assert.equal(candidate.ranking.frequency.retryCount, 7);
    assert.equal(candidate.ranking.priorityBand, 'investigate-now');
    assert.ok(candidate.ranking.reasons.some((reason) => reason.includes('runtime/provider failure loop')));
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
