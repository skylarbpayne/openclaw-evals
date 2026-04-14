import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { CandidateStore } from '../src/repository/candidate-store.js';
import { createReviewServer } from '../src/ui/review-server.js';

test('F1-UI-1 top-mistakes page renders ranked grouped summaries', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-f1-ui-'));

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
      candidateId: 'a2-1',
      storyId: 'A2',
      mistakeType: 'explicit_user_correction',
      status: 'candidate',
      provenance: {},
    });

    const server = createReviewServer({ baseDir: outputDir, now: () => '2026-04-14T18:00:00.000Z' });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    const baseUrl = `http://127.0.0.1:${address.port}`;

    try {
      const response = await fetch(`${baseUrl}/top-mistakes`);
      const body = await response.text();

      assert.equal(response.status, 200);
      assert.match(body, /Top Mistakes/);
      assert.match(body, /OAuth auth not allowed runtime failures/);
      assert.match(body, /investigate-now/);
      assert.match(body, /explicit_user_correction/);
    } finally {
      server.close();
    }
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
