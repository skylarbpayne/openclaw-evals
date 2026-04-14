import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { CandidateStore } from '../src/repository/candidate-store.js';
import { buildTopMistakesSummary } from '../src/analytics/top-mistakes-summary.js';

test('F1-POS-1 ranks grouped runtime failure families ahead of routine explicit corrections', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-f1-'));

  try {
    const store = new CandidateStore(outputDir);

    await store.save({
      candidateId: 'rt-1',
      storyId: 'A3',
      mistakeType: 'runtime_provider_failure_loop',
      status: 'candidate',
      provenance: {
        errorMessage: 'OAuth authentication is currently not allowed',
        retryCount: 5,
      },
    });

    await store.save({
      candidateId: 'rt-2',
      storyId: 'A3',
      mistakeType: 'runtime_provider_failure_loop',
      status: 'approved',
      provenance: {
        errorMessage: 'OAuth authentication is currently not allowed',
        retryCount: 3,
      },
    });

    await store.save({
      candidateId: 'a2-1',
      storyId: 'A2',
      mistakeType: 'explicit_user_correction',
      status: 'candidate',
      provenance: {},
    });

    const summary = await buildTopMistakesSummary({ baseDir: outputDir });

    assert.equal(summary.totalCandidates, 3);
    assert.equal(summary.groupCount, 2);
    assert.match(summary.items[0].label, /OAuth auth not allowed runtime failures/);
    assert.equal(summary.items[0].priorityBand, 'investigate-now');
    assert.equal(summary.items[0].totalCount, 2);
    assert.equal(summary.items[0].statusCounts.approved, 1);
    assert.equal(summary.items[1].mistakeType, 'explicit_user_correction');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
