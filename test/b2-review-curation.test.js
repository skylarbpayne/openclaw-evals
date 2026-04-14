import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { runA2 } from '../src/index.js';
import { ReviewRepository } from '../src/review/review-repository.js';
import { createReviewApi } from '../src/review/api.js';

const REVIEWER = { reviewer: 'Skylar', rationale: 'curation pass' };

test('B2-POS-1 lists persisted candidates through the review API', async () => {
  const outputDir = await seedCandidateDirectory();

  try {
    const repository = new ReviewRepository(outputDir, { now: () => '2026-04-14T01:00:00.000Z' });
    const api = createReviewApi(repository);

    const candidates = await api.listCandidates();

    assert.equal(candidates.length, 1);
    assert.equal(candidates[0].status, 'candidate');
    assert.equal(candidates[0].candidateId, 'a2-session-explicit-1-1-2');
    assert.equal(candidates[0].ranking.severity, 'low');
    assert.equal(candidates[0].ranking.priorityBand, 'routine');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('B2-POS-2 approves a candidate and appends audit history', async () => {
  const outputDir = await seedCandidateDirectory();

  try {
    const repository = new ReviewRepository(outputDir, { now: () => '2026-04-14T01:00:00.000Z' });
    const api = createReviewApi(repository);

    const candidate = await api.approveCandidate('a2-session-explicit-1-1-2', REVIEWER);

    assert.equal(candidate.status, 'approved');
    assert.equal(candidate.review.approvedBy, 'Skylar');
    assert.equal(candidate.auditHistory.at(-1).type, 'approve');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('B2-POS-3 dismisses a candidate and appends audit history', async () => {
  const outputDir = await seedCandidateDirectory();

  try {
    const repository = new ReviewRepository(outputDir, { now: () => '2026-04-14T01:00:00.000Z' });
    const api = createReviewApi(repository);

    const candidate = await api.dismissCandidate('a2-session-explicit-1-1-2', REVIEWER);

    assert.equal(candidate.status, 'dismissed');
    assert.equal(candidate.dismissal.reviewer, 'Skylar');
    assert.equal(candidate.auditHistory.at(-1).type, 'dismiss');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('B2-POS-4 edits a candidate while preserving provenance and source linkage', async () => {
  const outputDir = await seedCandidateDirectory();

  try {
    const repository = new ReviewRepository(outputDir, { now: () => '2026-04-14T01:00:00.000Z' });
    const api = createReviewApi(repository);

    const candidate = await api.editCandidate(
      'a2-session-explicit-1-1-2',
      {
        title: 'Wrong artifact type returned',
        correctedExpectation: 'Return a short summary, not an email draft.',
      },
      REVIEWER,
    );

    assert.equal(candidate.title, 'Wrong artifact type returned');
    assert.equal(candidate.correctedExpectation, 'Return a short summary, not an email draft.');
    assert.equal(candidate.sourceSessionId, 'session-explicit-1');
    assert.deepEqual(candidate.sourceTurnRange, { start: 1, end: 2 });
    assert.equal(candidate.provenance.channel, 'discord');
    assert.equal(candidate.auditHistory.at(-1).type, 'edit');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('B2-POS-5 merges one candidate into another and marks the source merged', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-b2-merge-'));

  try {
    const repository = new ReviewRepository(outputDir, { now: () => '2026-04-14T01:00:00.000Z' });
    await repository.store.save({ candidateId: 'cand-1', storyId: 'A2', mistakeType: 'explicit_user_correction' });
    await repository.store.save({ candidateId: 'cand-2', storyId: 'A2', mistakeType: 'explicit_user_correction' });
    const api = createReviewApi(repository);

    const merged = await api.mergeCandidate('cand-1', 'cand-2', REVIEWER);

    assert.equal(merged.status, 'merged');
    assert.equal(merged.mergedInto, 'cand-2');
    assert.equal(merged.auditHistory.at(-1).type, 'merge');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('B2-NEG-1 review API requires a decision object', async () => {
  const outputDir = await seedCandidateDirectory();

  try {
    const repository = new ReviewRepository(outputDir);
    const api = createReviewApi(repository);

    assert.throws(
      () => api.approveCandidate('a2-session-explicit-1-1-2'),
      /decision is required/,
    );
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('B2-EDGE-1 end-to-end transcript to approved reviewed candidate preserves audit trail', async () => {
  const fixturePath = path.resolve('test/fixtures/a2-explicit-correction.json');
  const transcript = JSON.parse(await readFile(fixturePath, 'utf8'));
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-b2-e2e-'));

  try {
    await runA2({ transcript, outputDir });
    const repository = new ReviewRepository(outputDir, { now: () => '2026-04-14T01:00:00.000Z' });
    const api = createReviewApi(repository);

    const approved = await api.approveCandidate('a2-session-explicit-1-1-2', REVIEWER);
    const reloaded = await api.getCandidate('a2-session-explicit-1-1-2');

    assert.equal(approved.status, 'approved');
    assert.equal(reloaded.status, 'approved');
    assert.equal(reloaded.auditHistory.length, 1);
    assert.equal(reloaded.auditHistory[0].type, 'approve');
    assert.equal(reloaded.sourceSessionId, 'session-explicit-1');
    assert.deepEqual(reloaded.sourceTurnRange, { start: 1, end: 2 });
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

async function seedCandidateDirectory() {
  const fixturePath = path.resolve('test/fixtures/a2-explicit-correction.json');
  const transcript = JSON.parse(await readFile(fixturePath, 'utf8'));
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-b2-'));
  await runA2({ transcript, outputDir });
  return outputDir;
}
