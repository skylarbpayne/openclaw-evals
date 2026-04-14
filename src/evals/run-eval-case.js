import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { EvalCaseStore } from './eval-case-store.js';
import { EvalResultStore } from './eval-result-store.js';

export async function runEvalCase({ baseDir, evalCaseId, responder, now }) {
  const evalCase = await new EvalCaseStore(baseDir).read(evalCaseId);
  const response = await responder(evalCase);
  const createdAt = now ? now() : new Date().toISOString();
  const result = gradeEvalCase({ evalCase, response, createdAt });
  const filePath = await new EvalResultStore(baseDir).save(result);
  return { result, filePath };
}

export async function runEvalCaseDirectory({ baseDir, responder, now }) {
  const evalCaseDir = new EvalCaseStore(baseDir).getDir();
  const entries = (await readdir(evalCaseDir)).filter((entry) => entry.endsWith('.json')).sort();
  const runs = [];

  for (const entry of entries) {
    const evalCaseId = path.basename(entry, '.json');
    runs.push(await runEvalCase({ baseDir, evalCaseId, responder, now }));
  }

  return runs;
}

export async function replayCapturedBadResponse(evalCase) {
  return evalCase.prompt?.assistantBadResponse ?? '';
}

export async function replayExpectedBehavior(evalCase) {
  return evalCase.expectedBehavior ?? '';
}

export async function gradeCapturedResponse({ baseDir, evalCaseId, response, responseMetadata = {}, now }) {
  const evalCase = await new EvalCaseStore(baseDir).read(evalCaseId);
  const createdAt = now ? now() : new Date().toISOString();
  const result = gradeEvalCase({ evalCase, response, createdAt, responseMetadata });
  const filePath = await new EvalResultStore(baseDir).save(result);
  return { result, filePath };
}

function gradeEvalCase({ evalCase, response, createdAt, responseMetadata = {} }) {
  const checks = (evalCase.scoring?.grading?.checks ?? []).map((check) => evaluateCheck(check, response));
  const passed = checks.every((check) => check.passed);

  return {
    runId: `run-${evalCase.evalCaseId}-${slugifyTimestamp(createdAt)}`,
    evalCaseId: evalCase.evalCaseId,
    passed,
    response,
    checks,
    summary: {
      total: checks.length,
      passed: checks.filter((check) => check.passed).length,
      failed: checks.filter((check) => !check.passed).length,
    },
    provenance: {
      sourceCandidateId: evalCase.sourceCandidateId,
      sourceStoryId: evalCase.provenance?.sourceStoryId ?? null,
      sourceSessionId: evalCase.provenance?.sourceSessionId ?? null,
      candidateFamily: evalCase.provenance?.candidateFamily ?? null,
      responseMetadata,
    },
    createdAt,
  };
}

function evaluateCheck(check, response) {
  if (check.type === 'contains-expectation') {
    const expected = String(check.expected ?? '').trim();
    return {
      ...check,
      passed: expected.length === 0 ? true : String(response).includes(expected),
      actual: response,
    };
  }

  if (check.type === 'avoid-known-bad-pattern') {
    const forbidden = String(check.forbidden ?? '');
    return {
      ...check,
      passed: forbidden.length === 0 ? true : !String(response).includes(forbidden),
      actual: response,
    };
  }

  return {
    ...check,
    passed: false,
    actual: response,
    note: 'Unsupported check type',
  };
}

function slugifyTimestamp(value) {
  return String(value).replaceAll(/[^0-9]/g, '').slice(0, 14);
}
