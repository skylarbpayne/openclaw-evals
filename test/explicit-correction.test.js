import test from 'node:test';
import assert from 'node:assert/strict';
import { ingestSessionTranscript } from '../src/ingest/transcript-ingestion.js';
import { detectExplicitCorrections } from '../src/detectors/explicit-correction.js';
import { createMistakeCandidate, validateMistakeCandidate } from '../src/schemas/mistake-candidate.js';

test('detectExplicitCorrections returns candidate for explicit correction language', () => {
  const session = ingestSessionTranscript({
    sessionId: 'sess-1',
    turns: [
      { role: 'user', content: 'Please summarize this.' },
      { role: 'assistant', content: 'Done, I sent the email.' },
      { role: 'user', content: "that's wrong, I asked for a summary not an email" },
    ],
  });

  const results = detectExplicitCorrections(session);
  assert.equal(results.length, 1);
  assert.equal(results[0].mistakeType, 'explicit_user_correction');
  assert.equal(results[0].sourceSessions[0], 'sess-1');
});

test('detectExplicitCorrections ignores ordinary user turns', () => {
  const session = ingestSessionTranscript({
    sessionId: 'sess-2',
    turns: [
      { role: 'assistant', content: 'Here is the draft.' },
      { role: 'user', content: 'thanks' },
    ],
  });

  const results = detectExplicitCorrections(session);
  assert.equal(results.length, 0);
});

test('createMistakeCandidate validates required fields', () => {
  const candidate = createMistakeCandidate({
    id: 'mc-1',
    title: 'test',
    transcriptExcerpt: `Assistant: x\nUser: y`,
    expectedBehavior: 'Do y',
    sourceSessions: ['sess-1'],
    detectionType: 'explicit',
    status: 'candidate',
  });

  const validation = validateMistakeCandidate(candidate);
  assert.equal(validation.ok, true);
});
