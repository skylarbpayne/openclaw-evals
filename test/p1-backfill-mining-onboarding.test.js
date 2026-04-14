import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, cp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createOpenClawEvalsPlugin } from '../src/plugin/openclaw-evals-plugin.js';

test('P1-BACKFILL-1 plugin backfills one session log with immediate candidate output', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-backfill-out-'));

  try {
    const plugin = createOpenClawEvalsPlugin({ outputDir });
    const result = await plugin.backfillSessionLog({
      sessionLogPath: path.resolve('test/fixtures/real-openclaw-sessions/session-206b827e.jsonl'),
    });

    assert.equal(result.sessionsScanned, 1);
    assert.ok(result.minedCount >= 1);
    assert.equal(result.sessions.length, 1);
    assert.match(result.sessions[0].transcriptSessionId, /^206b827e-/);
    assert.ok(result.candidateIds.some((id) => id.startsWith(`a3-${result.sessions[0].transcriptSessionId}-`)));
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('P1-BACKFILL-2 plugin backfills a directory of session logs', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-backfill-out-'));
  const logsDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-backfill-logs-'));

  try {
    await cp(path.resolve('test/fixtures/real-openclaw-sessions/session-206b827e.jsonl'), path.join(logsDir, 'session-206b827e.jsonl'));
    await cp(path.resolve('test/fixtures/real-openclaw-sessions/session-206b827e.jsonl'), path.join(logsDir, 'session-206b827e-copy.jsonl'));

    const plugin = createOpenClawEvalsPlugin({ outputDir });
    const result = await plugin.backfillSessionLogDirectory({ directoryPath: logsDir });

    assert.equal(result.sessionsScanned, 2);
    assert.ok(result.minedCount >= 2);
    assert.equal(result.sessions.length, 2);
    assert.ok(result.candidateIds.length >= 2);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
    await rm(logsDir, { recursive: true, force: true });
  }
});
