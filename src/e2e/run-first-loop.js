import { importTranscriptDirectory } from '../ingest/transcript-import.js';
import { runA2 } from '../index.js';
import { ReviewRepository } from '../review/review-repository.js';
import { createReviewApi } from '../review/api.js';

export async function runFirstLoop({ transcriptDir, decisions, outputDir, now }) {
  const transcripts = await importTranscriptDirectory(transcriptDir);
  const mined = [];

  for (const transcript of transcripts) {
    const result = await runA2({ transcript, outputDir });
    mined.push(...result.candidates);
  }

  const repository = new ReviewRepository(outputDir, now ? { now } : undefined);
  const api = createReviewApi(repository);
  const applied = [];

  for (const decision of decisions) {
    applied.push(await applyDecision(api, decision));
  }

  const finalCandidates = await api.listCandidates();

  return {
    transcriptCount: transcripts.length,
    minedCount: mined.length,
    appliedCount: applied.length,
    finalCandidates,
  };
}

async function applyDecision(api, decision) {
  switch (decision.action) {
    case 'approve':
      return api.approveCandidate(decision.candidateId, decision.decision);
    case 'dismiss':
      return api.dismissCandidate(decision.candidateId, decision.decision);
    case 'edit':
      return api.editCandidate(decision.candidateId, decision.patch ?? {}, decision.decision);
    case 'merge':
      return api.mergeCandidate(decision.sourceCandidateId, decision.targetCandidateId, decision.decision);
    default:
      throw new Error(`Unsupported review action: ${decision.action}`);
  }
}
