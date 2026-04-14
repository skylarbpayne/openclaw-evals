import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { EvalResultStore } from './eval-result-store.js';

export async function compareEvalRuns({ baseDir, evalCaseId }) {
  const store = new EvalResultStore(baseDir);
  const entries = await store.list();
  const results = [];

  for (const entry of entries) {
    const content = await readFile(path.join(store.getDir(), entry), 'utf8');
    const parsed = JSON.parse(content);
    if (!evalCaseId || parsed.evalCaseId === evalCaseId) {
      results.push(parsed);
    }
  }

  results.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));

  const groups = groupByEvalCase(results);
  return {
    totalRuns: results.length,
    evalCases: Object.values(groups).map(buildEvalCaseSummary),
  };
}

function groupByEvalCase(results) {
  return results.reduce((acc, result) => {
    acc[result.evalCaseId] ??= [];
    acc[result.evalCaseId].push(result);
    return acc;
  }, {});
}

function buildEvalCaseSummary(results) {
  const [first, ...rest] = results;
  const latest = results.at(-1);

  return {
    evalCaseId: first.evalCaseId,
    runCount: results.length,
    verdicts: results.map((result) => ({
      runId: result.runId,
      passed: result.passed,
      createdAt: result.createdAt,
      failedChecks: result.checks.filter((check) => !check.passed).map((check) => check.type),
      responseMetadata: result.provenance?.responseMetadata ?? null,
    })),
    latest,
    deltaFromFirstToLatest: rest.length === 0 ? null : buildDelta(first, latest),
  };
}

function buildDelta(first, latest) {
  return {
    verdictChanged: first.passed !== latest.passed,
    summary: {
      passedChecksDelta: latest.summary.passed - first.summary.passed,
      failedChecksDelta: latest.summary.failed - first.summary.failed,
    },
    checks: latest.checks.map((check) => {
      const prior = first.checks.find((candidate) => candidate.type === check.type && candidate.expected === check.expected && candidate.forbidden === check.forbidden);
      return {
        type: check.type,
        changed: prior ? prior.passed !== check.passed : true,
        before: prior ? prior.passed : null,
        after: check.passed,
      };
    }),
  };
}
