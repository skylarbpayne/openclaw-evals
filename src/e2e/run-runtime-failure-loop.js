import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createOpenClawEvalsPlugin } from '../plugin/openclaw-evals-plugin.js';

export async function runRuntimeFailureLoop({ sessionLogPath, decisionsPath, outputDir, reviewer = 'Skylar', now } = {}) {
  if (!sessionLogPath) {
    throw new Error('sessionLogPath is required');
  }

  if (!outputDir) {
    throw new Error('outputDir is required');
  }

  await mkdir(outputDir, { recursive: true });

  const plugin = createOpenClawEvalsPlugin({ outputDir, reviewer, now });
  const mined = await plugin.processOpenClawSessionLog({ sessionLogPath });
  const decisions = decisionsPath ? JSON.parse(await readFile(decisionsPath, 'utf8')) : [];
  const reviewed = decisions.length
    ? await plugin.processOpenClawSessionLog({ sessionLogPath, decisionsPath })
    : mined;

  return {
    sessionLogPath: path.resolve(sessionLogPath),
    minedCount: mined.minedCount,
    appliedCount: reviewed.appliedCount,
    convertedCount: reviewed.convertedCount,
    finalCandidates: reviewed.candidates,
    evalCases: reviewed.evalCases,
  };
}
