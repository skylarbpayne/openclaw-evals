import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { CandidateStore } from '../src/repository/candidate-store.js';
import { createOpenClawEvalsPlugin } from '../src/plugin/openclaw-evals-plugin.js';
import { ReviewRepository } from '../src/review/review-repository.js';

test('P1-PROMOTE-1 plugin lists promotion eligibility and promotes approved candidates to evals', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-plugin-promote-'));

  try {
    const store = new CandidateStore(outputDir);
    await store.save({
      candidateId: 'a2-approved-1',
      storyId: 'A2',
      mistakeType: 'explicit_user_correction',
      status: 'candidate',
      sourceSessionId: 'session-1',
      sourceTurnRange: { start: 1, end: 2 },
      transcriptExcerpt: {
        correctingUserTurn: { role: 'user', content: 'I asked for a concise answer.', index: 1 },
        correctedAssistantTurn: { role: 'assistant', content: 'Here is a huge wall of text...', index: 2 },
      },
      correctedExpectation: 'Give a concise answer.',
      title: 'Verbose answer after concise request',
      provenance: {},
    });

    const repository = new ReviewRepository(outputDir, { now: () => '2026-04-14T18:40:00.000Z' });
    await repository.approve('a2-approved-1', {
      reviewer: 'Skylar',
      rationale: 'This should become an eval',
    });

    const plugin = createOpenClawEvalsPlugin({
      outputDir,
      now: () => '2026-04-14T18:41:00.000Z',
    });

    const eligibility = await plugin.listPromotionCandidates();
    assert.equal(eligibility.items[0].candidateId, 'a2-approved-1');
    assert.equal(eligibility.items[0].eligibleForPromotion, true);

    const promoted = await plugin.promoteCandidateToEval({ candidateId: 'a2-approved-1' });
    assert.equal(promoted.promoted, true);
    assert.equal(promoted.policy, 'approved-candidate-only');
    assert.equal(promoted.evalCaseId, 'eval-a2-approved-1');
    assert.equal(promoted.evalCase.sourceCandidateId, 'a2-approved-1');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('P1-PROMOTE-2 plugin refuses promotion for unapproved candidates', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-plugin-promote-'));

  try {
    const store = new CandidateStore(outputDir);
    await store.save({
      candidateId: 'a2-candidate-1',
      storyId: 'A2',
      mistakeType: 'explicit_user_correction',
      status: 'candidate',
      sourceSessionId: 'session-2',
      sourceTurnRange: { start: 1, end: 2 },
      transcriptExcerpt: {
        correctingUserTurn: { role: 'user', content: 'Be concise.', index: 1 },
        correctedAssistantTurn: { role: 'assistant', content: 'Very long answer...', index: 2 },
      },
      correctedExpectation: 'Be concise.',
      title: 'Needs approval first',
      provenance: {},
    });

    const plugin = createOpenClawEvalsPlugin({ outputDir });

    const eligibility = await plugin.listPromotionCandidates();
    assert.equal(eligibility.items[0].eligibleForPromotion, false);

    await assert.rejects(
      () => plugin.promoteCandidateToEval({ candidateId: 'a2-candidate-1' }),
      /candidate must be approved before eval conversion/
    );
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
