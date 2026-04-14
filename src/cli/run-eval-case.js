import process from 'node:process';
import { runEvalCase, replayCapturedBadResponse, replayExpectedBehavior } from '../evals/run-eval-case.js';

const baseDir = process.argv[2];
const evalCaseId = process.argv[3];
const mode = process.argv[4] ?? 'expected';

if (!baseDir || !evalCaseId) {
  console.error('Usage: node src/cli/run-eval-case.js <base-dir> <eval-case-id> [expected|bad]');
  process.exit(1);
}

const responder = mode === 'bad' ? replayCapturedBadResponse : replayExpectedBehavior;
const { result, filePath } = await runEvalCase({
  baseDir,
  evalCaseId,
  responder,
});

console.log(JSON.stringify({ result, filePath }, null, 2));
