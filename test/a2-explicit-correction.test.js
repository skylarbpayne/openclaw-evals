import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { validateTranscript } from '../src/schemas/transcript.js';
import { detectExplicitCorrections } from '../src/detectors/explicit-correction.js';
import { runA2 } from '../src/index.js';

const explicitTranscript = {
  sessionId: 'unit-positive',
  channel: 'discord',
  model: 'gpt-5.4',
  instructionVersion: 'test-version',
  turns: [
    { role: 'assistant', content: 'Here is an email draft.' },
    { role: 'user', content: "That's wrong, I asked for a summary not an email." },
  ],
};

test('UNIT-POS-1 detects a clear explicit correction', () => {
  const transcript = validateTranscript(explicitTranscript);
  const candidates = detectExplicitCorrections(transcript);

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].mistakeType, 'explicit_user_correction');
});

test('UNIT-NEG-1 ignores ordinary user responses', () => {
  const transcript = validateTranscript({
    sessionId: 'unit-negative',
    turns: [
      { role: 'assistant', content: 'Here is your summary.' },
      { role: 'user', content: 'thanks' },
    ],
  });

  const candidates = detectExplicitCorrections(transcript);
  assert.equal(candidates.length, 0);
});

test('UNIT-EDGE-1 ignores correction-like text without a prior assistant turn', () => {
  const transcript = validateTranscript({
    sessionId: 'unit-edge',
    turns: [
      { role: 'user', content: "That's wrong, I asked for a summary." },
    ],
  });

  const candidates = detectExplicitCorrections(transcript);
  assert.equal(candidates.length, 0);
});

test('UNIT-ASSOC-1 links the correction to the immediately prior assistant turn', () => {
  const transcript = validateTranscript({
    sessionId: 'unit-association',
    turns: [
      { role: 'assistant', content: 'First answer' },
      { role: 'user', content: 'continue' },
      { role: 'assistant', content: 'Second answer that is wrong' },
      { role: 'user', content: 'you missed the actual request' },
    ],
  });

  const candidates = detectExplicitCorrections(transcript);

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].transcriptExcerpt.correctedAssistantTurn.content, 'Second answer that is wrong');
  assert.deepEqual(candidates[0].sourceTurnRange, { start: 2, end: 3 });
});

test('UNIT-PROV-1 retains session id and provenance metadata', () => {
  const transcript = validateTranscript(explicitTranscript);
  const candidates = detectExplicitCorrections(transcript);

  assert.equal(candidates[0].sourceSessionId, 'unit-positive');
  assert.equal(candidates[0].provenance.channel, 'discord');
  assert.equal(candidates[0].provenance.model, 'gpt-5.4');
  assert.equal(candidates[0].provenance.instructionVersion, 'test-version');
});

test('INT-1 persists a candidate artifact from fixture input end to end', async () => {
  const fixturePath = path.resolve('test/fixtures/a2-explicit-correction.json');
  const transcript = JSON.parse(await readFile(fixturePath, 'utf8'));
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-a2-'));

  try {
    const result = await runA2({ transcript, outputDir });

    assert.equal(result.candidates.length, 1);
    assert.equal(result.saved.length, 1);

    const savedPath = result.saved[0].filePath;
    const savedArtifact = JSON.parse(await readFile(savedPath, 'utf8'));

    assert.equal(savedArtifact.storyId, 'A2');
    assert.equal(savedArtifact.mistakeType, 'explicit_user_correction');
    assert.equal(savedArtifact.sourceSessionId, 'session-explicit-1');
    assert.deepEqual(savedArtifact.sourceTurnRange, { start: 1, end: 2 });
    assert.equal(savedArtifact.transcriptExcerpt.correctedAssistantTurn.content, "Sure, here's an email draft you can send to the team.");
    assert.equal(savedArtifact.correctedExpectation, "That's wrong, I asked for a summary not an email.");
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
