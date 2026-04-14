import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { runA2 } from '../index.js';
import { createReviewApi } from '../review/api.js';
import { ReviewRepository } from '../review/review-repository.js';
import { convertApprovedCandidateToEval } from '../evals/convert-candidate-to-eval.js';
import { EvalCaseStore } from '../evals/eval-case-store.js';
import { EvalResultStore } from '../evals/eval-result-store.js';
import { compareEvalRuns } from '../evals/compare-eval-runs.js';
import { detectRegression } from '../evals/detect-regression.js';
import { importOpenClawSessionLog } from '../ingest/openclaw-session-import.js';
import { createReviewServer } from '../ui/review-server.js';
import { normalizePluginConfig } from './config.js';

export function createOpenClawEvalsPlugin(config = {}) {
  const normalized = normalizePluginConfig(config);
  const outputDir = normalized.outputDir;
  const reviewer = normalized.reviewer;
  const uiHost = normalized.uiHost;
  const uiPort = normalized.uiPort;
  const now = normalized.now;
  let uiServer = null;

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

    async startUiServer() {
      await mkdir(outputDir, { recursive: true });

      if (uiServer?.listening) {
        const address = uiServer.address();
        return buildUiInfo(address, outputDir);
      }

      uiServer = createReviewServer({ baseDir: outputDir, now });
      await new Promise((resolve, reject) => {
        uiServer.once('error', reject);
        uiServer.listen(uiPort, uiHost, () => {
          uiServer.off('error', reject);
          resolve();
        });
      });

      return buildUiInfo(uiServer.address(), outputDir);
    },

    async stopUiServer() {
      if (!uiServer?.listening) {
        return { stopped: false };
      }

      await new Promise((resolve, reject) => {
        uiServer.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
      uiServer = null;
      return { stopped: true };
    },

    async listEvals() {
      const store = new EvalCaseStore(outputDir);
      const entries = await store.list();
      return {
        outputDir,
        evalCaseIds: entries.map((entry) => path.basename(entry, '.json')),
      };
    },

    async getEval({ evalCaseId } = {}) {
      if (!evalCaseId) {
        throw new Error('evalCaseId is required');
      }

      const evalCase = await new EvalCaseStore(outputDir).read(evalCaseId);
      return {
        outputDir,
        evalCase,
      };
    },

    async listEvalRuns({ evalCaseId } = {}) {
      const summary = await compareEvalRuns({ baseDir: outputDir, evalCaseId });
      return {
        outputDir,
        totalRuns: summary.totalRuns,
        evalCases: summary.evalCases.map((entry) => ({
          evalCaseId: entry.evalCaseId,
          runCount: entry.runCount,
          verdicts: entry.verdicts,
        })),
      };
    },

    async compareEvalRuns({ evalCaseId } = {}) {
      return compareEvalRuns({ baseDir: outputDir, evalCaseId });
    },

    async detectRegression({ evalCaseId } = {}) {
      if (!evalCaseId) {
        throw new Error('evalCaseId is required');
      }

      return detectRegression({ baseDir: outputDir, evalCaseId });
    },

    async listPromotionCandidates() {
      const candidates = await new ReviewRepository(outputDir, now ? { now } : undefined).list();
      return {
        outputDir,
        items: candidates.map((candidate) => ({
          candidateId: candidate.candidateId,
          status: candidate.status,
          title: candidate.title ?? null,
          eligibleForPromotion: candidate.status === 'approved',
          reason: candidate.status === 'approved'
            ? 'approved candidate can be converted to an eval'
            : 'candidate must be approved before eval conversion',
        })),
      };
    },

    async promoteCandidateToEval({ candidateId } = {}) {
      if (!candidateId) {
        throw new Error('candidateId is required');
      }

      const { evalCase, filePath } = await convertApprovedCandidateToEval({
        baseDir: outputDir,
        candidateId,
        now,
      });

      return {
        outputDir,
        candidateId,
        policy: 'approved-candidate-only',
        promoted: true,
        evalCaseId: evalCase.evalCaseId,
        filePath,
        evalCase,
      };
    },

    async backfillSessionLog({ sessionLogPath } = {}) {
      if (!sessionLogPath) {
        throw new Error('sessionLogPath is required');
      }

      const mined = await this.mineSessionLog({ sessionLogPath });
      return {
        outputDir,
        sessionsScanned: 1,
        minedCount: mined.minedCount,
        candidateIds: mined.candidateIds,
        sessions: [{
          sessionLogPath,
          transcriptSessionId: mined.transcriptSessionId,
          minedCount: mined.minedCount,
          candidateIds: mined.candidateIds,
        }],
      };
    },

    async backfillSessionLogDirectory({ directoryPath } = {}) {
      if (!directoryPath) {
        throw new Error('directoryPath is required');
      }

      const entries = (await readdir(directoryPath))
        .filter((entry) => entry.endsWith('.jsonl'))
        .sort();

      const sessions = [];
      let minedCount = 0;
      const candidateIds = [];

      for (const entry of entries) {
        const sessionLogPath = path.join(directoryPath, entry);
        const mined = await this.mineSessionLog({ sessionLogPath });
        minedCount += mined.minedCount;
        candidateIds.push(...mined.candidateIds);
        sessions.push({
          sessionLogPath,
          transcriptSessionId: mined.transcriptSessionId,
          minedCount: mined.minedCount,
          candidateIds: mined.candidateIds,
        });
      }

      return {
        outputDir,
        sessionsScanned: sessions.length,
        minedCount,
        candidateIds,
        sessions,
      };
    },
  };
}

function buildUiInfo(address, outputDir) {
  if (!address || typeof address === 'string') {
    throw new Error('UI server did not return a usable network address');
  }

  const origin = `http://${address.address}:${address.port}`;
  return {
    outputDir,
    origin,
    routes: {
      topMistakes: `${origin}/top-mistakes`,
      candidates: `${origin}/candidates`,
      comparisons: `${origin}/comparisons`,
    },
  };
}
