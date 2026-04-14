import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { CandidateStore } from '../src/repository/candidate-store.js';
import { createOpenClawEvalsPlugin } from '../src/plugin/openclaw-evals-plugin.js';

test('P1-UI-1 plugin-owned UI server starts and exposes top-mistakes, candidates, and comparisons routes', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-plugin-ui-'));

  try {
    const store = new CandidateStore(outputDir);
    await store.save({
      candidateId: 'rt-1',
      storyId: 'A3',
      mistakeType: 'runtime_provider_failure_loop',
      status: 'candidate',
      provenance: {
        errorMessage: 'OAuth authentication is currently not allowed',
        retryCount: 4,
      },
      title: 'Repeated provider/runtime failure loop',
    });

    const plugin = createOpenClawEvalsPlugin({
      outputDir,
      reviewer: 'Skylar',
      uiHost: '127.0.0.1',
      uiPort: 0,
      now: () => '2026-04-14T18:20:00.000Z',
    });

    const ui = await plugin.startUiServer();

    try {
      assert.match(ui.origin, /^http:\/\/127\.0\.0\.1:\d+$/);
      assert.equal(ui.routes.topMistakes, `${ui.origin}/top-mistakes`);
      assert.equal(ui.routes.candidates, `${ui.origin}/candidates`);
      assert.equal(ui.routes.comparisons, `${ui.origin}/comparisons`);

      const topMistakesResponse = await fetch(ui.routes.topMistakes);
      const topMistakesBody = await topMistakesResponse.text();
      assert.equal(topMistakesResponse.status, 200);
      assert.match(topMistakesBody, /Top Mistakes/);

      const candidatesResponse = await fetch(ui.routes.candidates);
      const candidatesBody = await candidatesResponse.text();
      assert.equal(candidatesResponse.status, 200);
      assert.match(candidatesBody, /Candidate Review Queue/);

      const comparisonsResponse = await fetch(ui.routes.comparisons);
      const comparisonsBody = await comparisonsResponse.text();
      assert.equal(comparisonsResponse.status, 200);
      assert.match(comparisonsBody, /Eval Comparisons/);
    } finally {
      const stopResult = await plugin.stopUiServer();
      assert.equal(stopResult.stopped, true);
    }
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
