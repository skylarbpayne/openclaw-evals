import path from 'node:path';
import { detectRegression } from '../evals/detect-regression.js';

const [, , evalCaseId, outputDirArg] = process.argv;

if (!evalCaseId) {
  console.error('Usage: node src/cli/run-d3-lite.js <evalCaseId> [outputDir]');
  process.exit(1);
}

const baseDir = outputDirArg ?? path.resolve(process.cwd(), 'artifacts', 'candidates');
const report = await detectRegression({ baseDir, evalCaseId });
console.log(JSON.stringify(report, null, 2));
