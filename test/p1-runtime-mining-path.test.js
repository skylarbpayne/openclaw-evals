import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createOpenClawEvalsPlugin } from '../src/plugin/openclaw-evals-plugin.js';

test('P1-RUNTIME-1 plugin runtime mining path mines a real OpenClaw session log into persisted candidates', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-plugin-runtime-'));

  try {
    const plugin = createOpenClawEvalsPlugin({
      outputDir,
      reviewer: 'Skylar',
      now: () => '2026-04-14T18:05:00.000Z',
    });

    const result = await plugin.mineSessionLog({
      sessionLogPath: path.resolve('test/fixtures/real-openclaw-sessions/session-206b827e.jsonl'),
    });

    assert.match(result.transcriptSessionId, /^206b827e-/);
    assert.ok(result.minedCount >= 1);
    assert.ok(result.candidateIds.some((id) => id.startsWith(`a3-${result.transcriptSessionId}-`)));
    assert.ok(result.candidates.some((candidate) => candidate.mistakeType === 'runtime_provider_failure_loop'));
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
