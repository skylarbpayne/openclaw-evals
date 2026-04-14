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
    expectedBehavior: candidate.correctedExpectation ?? '',
    scoring: {
      strategy: 'rule-based-review',
      rubric: 'Response should satisfy the corrected expectation and avoid repeating the captured failure.',
    },
    provenance: {
      sourceStoryId: candidate.storyId,
      sourceSessionId: candidate.sourceSessionId,
      sourceTurnRange: candidate.sourceTurnRange,
      candidateReview: candidate.review ?? null,
      candidateProvenance: candidate.provenance ?? null,
    },
    createdFrom: {
      candidateStatus: candidate.status,
      createdAt,
    },
  };
}
