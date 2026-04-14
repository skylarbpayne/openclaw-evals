import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { importOpenClawSessionLog } from '../src/ingest/openclaw-session-import.js';
import { detectRuntimeFailureLoops } from '../src/detectors/runtime-failure.js';

test('A3-POS-1 detects repeated provider/runtime failure loops from a real session log fixture', async () => {
  const transcript = await importOpenClawSessionLog(
    path.resolve('test/fixtures/real-openclaw-sessions/session-206b827e.jsonl'),
  );

  const candidates = detectRuntimeFailureLoops(transcript);

  assert.ok(candidates.length >= 1);
  assert.equal(candidates[0].storyId, 'A3');
  assert.equal(candidates[0].mistakeType, 'runtime_provider_failure_loop');
  assert.match(candidates[0].provenance.errorMessage, /OAuth authentication is currently not allowed/);
  assert.ok(candidates[0].provenance.retryCount >= 2);
});
