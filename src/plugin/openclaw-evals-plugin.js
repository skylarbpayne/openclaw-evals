import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { runA2 } from '../index.js';
import { createReviewApi } from '../review/api.js';
import { ReviewRepository } from '../review/review-repository.js';
import { convertApprovedCandidateToEval } from '../evals/convert-candidate-to-eval.js';

export function createOpenClawEvalsPlugin(config = {}) {
  const outputDir = path.resolve(config.outputDir ?? '.openclaw-evals');
  const reviewer = config.reviewer ?? 'Palmer';
  const now = config.now;

  return {
    id: 'openclaw-evals',
    async processTranscriptFile({ transcriptPath, decisionsPath } = {}) {
      if (!transcriptPath) {
        throw new Error('transcriptPath is required');
      }

      await mkdir(outputDir, { recursive: true });

      const transcript = JSON.parse(await readFile(transcriptPath, 'utf8'));
      const mined = await runA2({ transcript, outputDir });

      const repository = new ReviewRepository(outputDir, now ? { now } : undefined);
      const reviewApi = createReviewApi(repository);
      const decisions = decisionsPath ? JSON.parse(await readFile(decisionsPath, 'utf8')) : [];
      const applied = [];
      const converted = [];

      for (const step of decisions) {
        if (step.action === 'approve') {
          const approved = await reviewApi.approveCandidate(step.candidateId, {
            reviewer: step.decision?.reviewer ?? reviewer,
            rationale: step.decision?.rationale ?? 'Approved via plugin flow',
          });
          applied.push(approved);

          if (step.convertToEval) {
            converted.push(await convertApprovedCandidateToEval({
              baseDir: outputDir,
              candidateId: approved.candidateId,
              now,
            }));
          }
          continue;
        }

        if (step.action === 'dismiss') {
          applied.push(await reviewApi.dismissCandidate(step.candidateId, {
            reviewer: step.decision?.reviewer ?? reviewer,
            rationale: step.decision?.rationale ?? 'Dismissed via plugin flow',
          }));
          continue;
        }

        if (step.action === 'edit') {
          applied.push(await reviewApi.editCandidate(step.candidateId, step.patch ?? {}, {
            reviewer: step.decision?.reviewer ?? reviewer,
            rationale: step.decision?.rationale ?? 'Edited via plugin flow',
          }));
          continue;
        }

        throw new Error(`Unsupported plugin decision action: ${step.action}`);
      }

      return {
        outputDir,
        transcriptSessionId: mined.transcript.sessionId,
        minedCount: mined.candidates.length,
        appliedCount: applied.length,
        convertedCount: converted.length,
        candidates: await reviewApi.listCandidates(),
        evalCases: converted.map((entry) => entry.evalCase),
      };
    },
  };
}
