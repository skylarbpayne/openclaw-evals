import process from 'node:process';
import { convertApprovedCandidateToEval } from '../evals/convert-candidate-to-eval.js';

const baseDir = process.argv[2];
const candidateId = process.argv[3];

if (!baseDir || !candidateId) {
  console.error('Usage: node src/cli/convert-approved-candidate.js <registry-dir> <candidate-id>');
  process.exit(1);
}

const result = await convertApprovedCandidateToEval({ baseDir, candidateId });
console.log(JSON.stringify(result, null, 2));
