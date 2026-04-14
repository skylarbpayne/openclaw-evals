import { compareEvalRuns } from './compare-eval-runs.js';

export async function detectRegression({ baseDir, evalCaseId }) {
  const summary = await compareEvalRuns({ baseDir, evalCaseId });
  const comparison = summary.evalCases[0] ?? null;

  if (!comparison) {
    return {
      evalCaseId,
      status: 'insufficient-history',
      regressionDetected: false,
      reason: 'No persisted runs found for eval case.',
      evidence: {
        runCount: 0,
        newlyFailedChecks: [],
        verdictTransition: null,
      },
    };
  }

  if (comparison.runCount < 2) {
    return {
      evalCaseId: comparison.evalCaseId,
      status: 'insufficient-history',
      regressionDetected: false,
      reason: 'Need at least two runs to detect a regression.',
      evidence: {
        runCount: comparison.runCount,
        newlyFailedChecks: [],
        verdictTransition: null,
      },
    };
  }

  const first = comparison.verdicts[0];
  const latest = comparison.verdicts.at(-1);
  const firstFailed = new Set(first.failedChecks ?? []);
  const latestFailed = new Set(latest.failedChecks ?? []);
  const newlyFailedChecks = [...latestFailed].filter((check) => !firstFailed.has(check));
  const verdictTransition = `${first.passed ? 'pass' : 'fail'}→${latest.passed ? 'pass' : 'fail'}`;
  const regressionDetected = first.passed && !latest.passed;
  const improved = !first.passed && latest.passed;

  return {
    evalCaseId: comparison.evalCaseId,
    status: regressionDetected ? 'regression' : improved ? 'improved' : 'no-regression',
    regressionDetected,
    reason: regressionDetected
      ? 'Latest run regressed from pass to fail.'
      : improved
        ? 'Latest run improved from fail to pass.'
        : 'Latest run did not regress relative to the first persisted run.',
    evidence: {
      runCount: comparison.runCount,
      verdictTransition,
      newlyFailedChecks,
      latestFailedChecks: [...latestFailed],
      latestRunId: latest.runId,
      baselineRunId: first.runId,
    },
    comparison,
  };
}
