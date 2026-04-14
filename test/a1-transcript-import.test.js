import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { importTranscriptFile, importTranscriptDirectory } from '../src/ingest/transcript-import.js';
import { runA2 } from '../src/index.js';

test('A1-POS-1 imports a valid transcript file and preserves metadata', async () => {
  const fixturePath = path.resolve('test/fixtures/a2-explicit-correction.json');
  const transcript = await importTranscriptFile(fixturePath);

  assert.equal(transcript.sessionId, 'session-explicit-1');
  assert.equal(transcript.channel, 'discord');
  assert.equal(transcript.model, 'gpt-5.4');
  assert.equal(transcript.instructionVersion, '2026-04-13-a2');
  assert.equal(transcript.turns.length, 3);
});

test('A1-POS-2 imports a directory of transcript files', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-a1-batch-'));

  try {
    await writeFile(
      path.join(tempDir, 'one.json'),
      JSON.stringify({
        sessionId: 'batch-1',
        channel: 'discord',
        turns: [
          { role: 'assistant', content: 'draft' },
          { role: 'user', content: "that's wrong" },
        ],
      }, null, 2),
    );

    await writeFile(
      path.join(tempDir, 'two.json'),
      JSON.stringify({
        sessionId: 'batch-2',
        channel: 'telegram',
        turns: [
          { role: 'assistant', content: 'answer' },
          { role: 'user', content: 'you missed the request' },
        ],
      }, null, 2),
    );

    const transcripts = await importTranscriptDirectory(tempDir);

    assert.equal(transcripts.length, 2);
    assert.deepEqual(transcripts.map((item) => item.sessionId), ['batch-1', 'batch-2']);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('A1-NEG-1 rejects invalid transcript files with file-aware errors', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-a1-invalid-'));
  const invalidPath = path.join(tempDir, 'invalid.json');

  try {
    await writeFile(invalidPath, JSON.stringify({ sessionId: '', turns: [] }, null, 2));

    await assert.rejects(
      () => importTranscriptFile(invalidPath),
      /Invalid transcript file .*invalid\.json: Transcript\.sessionId must be a non-empty string/,
    );
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('A1-EDGE-1 imported transcript can flow into A2 without fixture-specific handling', async () => {
  const fixturePath = path.resolve('test/fixtures/a2-explicit-correction.json');
  const transcript = await importTranscriptFile(fixturePath);
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-a1-e2e-'));

  try {
    const result = await runA2({ transcript, outputDir });

    assert.equal(result.candidates.length, 1);
    assert.equal(result.candidates[0].sourceSessionId, 'session-explicit-1');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
