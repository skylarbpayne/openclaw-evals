import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { runA2 } from '../index.js';
import { createReviewApi } from '../review/api.js';
import { ReviewRepository } from '../review/review-repository.js';
import { convertApprovedCandidateToEval } from '../evals/convert-candidate-to-eval.js';
import { importOpenClawSessionLog } from '../ingest/openclaw-session-import.js';
import { normalizePluginConfig } from './config.js';

export function createOpenClawEvalsPlugin(config = {}) {
  const normalized = normalizePluginConfig(config);
  const outputDir = normalized.outputDir;
  const reviewer = normalized.reviewer;
  const now = normalized.now;

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

    async processOpenClawSessionLog({ sessionLogPath, decisionsPath } = {}) {
      if (!sessionLogPath) {
        throw new Error('sessionLogPath is required');
      }

      await mkdir(outputDir, { recursive: true });

      const transcript = await importOpenClawSessionLog(sessionLogPath);
      const tempTranscriptPath = path.join(outputDir, `${transcript.sessionId}.transcript.json`);
      await writeFile(tempTranscriptPath, `${JSON.stringify(transcript, null, 2)}\n`, 'utf8');
      return this.processTranscriptFile({ transcriptPath: tempTranscriptPath, decisionsPath });
    },

    async mineSessionLog({ sessionLogPath } = {}) {
      if (!sessionLogPath) {
        throw new Error('sessionLogPath is required');
      }

      await mkdir(outputDir, { recursive: true });

      const transcript = await importOpenClawSessionLog(sessionLogPath);
      const mined = await runA2({ transcript, outputDir });
      return {
        outputDir,
        transcriptSessionId: mined.transcript.sessionId,
        minedCount: mined.candidates.length,
        candidateIds: mined.candidates.map((candidate) => candidate.candidateId),
        candidates: mined.candidates,
      };
    },
  };
}
