import { ReviewRepository } from '../review/review-repository.js';
import { EvalCaseStore } from './eval-case-store.js';

export async function convertApprovedCandidateToEval({ baseDir, candidateId, now }) {
  const repository = new ReviewRepository(baseDir, now ? { now } : undefined);
  const candidate = await repository.get(candidateId);

  if (candidate.status !== 'approved') {
    throw new Error(`candidate must be approved before eval conversion: ${candidateId}`);
  }

  const evalCase = buildEvalCase(candidate, now ? now() : new Date().toISOString());
  const store = new EvalCaseStore(baseDir);
  const filePath = await store.save(evalCase);

  return {
    evalCase,
    filePath,
  };
}

function buildEvalCase(candidate, createdAt) {
  const assistantTurn = candidate.transcriptExcerpt?.correctedAssistantTurn?.content ?? '';
  const userTurn = candidate.transcriptExcerpt?.correctingUserTurn?.content ?? '';
  const expectedBehavior = candidate.correctedExpectation ?? '';

  return {
    evalCaseId: `eval-${candidate.candidateId}`,
    sourceCandidateId: candidate.candidateId,
    storyId: 'C1',
    title: candidate.title ?? `Eval for ${candidate.candidateId}`,
    prompt: {
      userInput: userTurn,
      assistantBadResponse: assistantTurn,
      transcriptWindow: candidate.transcriptExcerpt ?? null,
    },
    expectedBehavior,
    scoring: {
      strategy: 'rule-based-review',
      rubric: 'Response should satisfy the corrected expectation and avoid repeating the captured failure.',
      grading: {
        mode: 'rule-based',
        rubricText: buildRubricText(expectedBehavior),
        checks: buildChecks(expectedBehavior, assistantTurn),
        judgePromptVersion: null,
      },
    },
    provenance: {
      sourceStoryId: candidate.storyId,
      sourceSessionId: candidate.sourceSessionId,
      sourceTurnRange: candidate.sourceTurnRange,
      candidateReview: candidate.review ?? null,
      candidateProvenance: candidate.provenance ?? null,
      candidateFamily: candidate.family ?? null,
    },
    createdFrom: {
      candidateStatus: candidate.status,
      createdAt,
    },
  };
}

function buildRubricText(expectedBehavior) {
  return [
    'A passing response should satisfy the corrected expectation expressed by the reviewer.',
    expectedBehavior ? `Expected behavior: ${expectedBehavior}` : null,
    'The response should avoid repeating the captured failure mode.',
  ]
    .filter(Boolean)
    .join(' ');
}

function buildChecks(expectedBehavior, assistantTurn) {
  const checks = [
    {
      type: 'contains-expectation',
      description: 'Output should satisfy the corrected expectation captured from the review flow.',
      expected: expectedBehavior,
    },
  ];

  if (assistantTurn) {
    checks.push({
      type: 'avoid-known-bad-pattern',
      description: 'Output should not repeat the captured bad response verbatim.',
      forbidden: assistantTurn,
    });
  }

  return checks;
}
