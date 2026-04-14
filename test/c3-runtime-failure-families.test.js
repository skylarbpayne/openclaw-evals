import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { importOpenClawSessionLog } from '../src/ingest/openclaw-session-import.js';
import { runA2 } from '../src/index.js';
import { ReviewRepository } from '../src/review/review-repository.js';
import { convertApprovedCandidateToEval } from '../src/evals/convert-candidate-to-eval.js';

const REVIEWER = { reviewer: 'Skylar', rationale: 'family proof' };

test('C3-POS-1 runtime/provider failure families are stable for the same normalized error signature', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-c3-'));

  try {
    const transcript = await importOpenClawSessionLog(
      path.resolve('test/fixtures/real-openclaw-sessions/session-206b827e.jsonl'),
    );

    await runA2({ transcript, outputDir });
    const repository = new ReviewRepository(outputDir);
    const candidates = await repository.list();
    const runtimeCandidate = candidates.find((candidate) => candidate.mistakeType === 'runtime_provider_failure_loop');

    assert.ok(runtimeCandidate);
    assert.equal(runtimeCandidate.family.familyType, 'runtime_provider_failure');
    assert.equal(runtimeCandidate.family.signature.errorSignature, 'oauth-auth-not-allowed');

    const otherCandidateSameSignature = {
      ...runtimeCandidate,
      candidateId: 'a3-synthetic-same-signature',
      sourceSessionId: 'different-session',
      family: undefined,
      provenance: {
        ...runtimeCandidate.provenance,
        errorMessage: 'OAuth authentication is currently not allowed for this organization.',
      },
    };

    await repository.store.save(otherCandidateSameSignature);
    const reloaded = await repository.get('a3-synthetic-same-signature');

    assert.equal(reloaded.family.signature.errorSignature, runtimeCandidate.family.signature.errorSignature);
    assert.equal(reloaded.family.familyId, runtimeCandidate.family.familyId);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('C3-POS-2 approved runtime/provider failure eval artifacts preserve family lineage', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-c3-eval-'));

  try {
    const transcript = await importOpenClawSessionLog(
      path.resolve('test/fixtures/real-openclaw-sessions/session-206b827e.jsonl'),
    );

    await runA2({ transcript, outputDir });
    const repository = new ReviewRepository(outputDir, { now: () => '2026-04-14T15:00:00.000Z' });
    const candidates = await repository.list();
    const runtimeCandidate = candidates.find((candidate) => candidate.storyId === 'A3');

    assert.ok(runtimeCandidate);
    await repository.approve(runtimeCandidate.candidateId, REVIEWER);

    const { evalCase } = await convertApprovedCandidateToEval({
      baseDir: outputDir,
      candidateId: runtimeCandidate.candidateId,
      now: () => '2026-04-14T15:05:00.000Z',
    });

    assert.equal(evalCase.provenance.candidateFamily.familyId, runtimeCandidate.family.familyId);
    assert.equal(evalCase.provenance.candidateFamily.signature.errorSignature, 'oauth-auth-not-allowed');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
