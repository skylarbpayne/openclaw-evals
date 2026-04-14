import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { importOpenClawSessionLog } from '../src/ingest/openclaw-session-import.js';
import { createOpenClawEvalsPlugin } from '../src/plugin/openclaw-evals-plugin.js';

test('P1-REAL-1 imports a real OpenClaw session log into transcript shape', async () => {
  const transcript = await importOpenClawSessionLog(
    path.resolve('test/fixtures/real-openclaw-sessions/session-77e13eb9.jsonl'),
  );

  assert.equal(transcript.sessionId, '77e13eb9-ace0-4db5-91ff-99b260ac389b');
  assert.equal(transcript.channel, 'openclaw-session-log');
  assert.ok(transcript.turns.length >= 2);
  assert.equal(transcript.turns[0].role, 'user');
  assert.equal(transcript.turns[1].role, 'assistant');
});

test('P1-REAL-2 plugin bridge can process a real local OpenClaw session log shape', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-real-session-'));

  try {
    const plugin = createOpenClawEvalsPlugin({
      outputDir,
      reviewer: 'Skylar',
      now: () => '2026-04-14T04:35:00.000Z',
    });

    const result = await plugin.processOpenClawSessionLog({
      sessionLogPath: path.resolve('test/fixtures/real-openclaw-sessions/session-77e13eb9.jsonl'),
    });

    assert.equal(result.transcriptSessionId, '77e13eb9-ace0-4db5-91ff-99b260ac389b');
    assert.ok(result.minedCount >= 0);
    assert.equal(result.appliedCount, 0);
    assert.equal(result.convertedCount, 0);
    assert.ok(Array.isArray(result.candidates));
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
