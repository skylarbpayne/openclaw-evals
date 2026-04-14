import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createOpenClawEvalsPlugin } from '../src/plugin/openclaw-evals-plugin.js';

test('P1-PLUGIN-1 plugin bridge processes transcript input through mined, reviewed, and converted artifacts', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-plugin-'));

  try {
    const plugin = createOpenClawEvalsPlugin({
      outputDir,
      reviewer: 'Skylar',
      now: () => '2026-04-14T04:20:00.000Z',
    });

    const result = await plugin.processTranscriptFile({
      transcriptPath: path.resolve('test/fixtures/a2-explicit-correction.json'),
      decisionsPath: path.resolve('test/fixtures/plugin-review-decisions.json'),
    });

    assert.equal(result.transcriptSessionId, 'session-explicit-1');
    assert.equal(result.minedCount, 1);
    assert.equal(result.appliedCount, 1);
    assert.equal(result.convertedCount, 1);
    assert.equal(result.candidates[0].status, 'approved');
    assert.equal(result.evalCases[0].evalCaseId, 'eval-a2-session-explicit-1-1-2');
    assert.equal(result.evalCases[0].scoring.grading.mode, 'rule-based');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
