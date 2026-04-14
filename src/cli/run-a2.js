import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { runA2 } from '../index.js';

const [, , transcriptPath, outputDirArg] = process.argv;

if (!transcriptPath) {
  console.error('Usage: node src/cli/run-a2.js <transcript.json> [outputDir]');
  process.exit(1);
}

const outputDir = outputDirArg ?? path.resolve(process.cwd(), 'artifacts', 'candidates');
await mkdir(outputDir, { recursive: true });

const transcript = JSON.parse(await readFile(transcriptPath, 'utf8'));
const result = await runA2({ transcript, outputDir });

console.log(JSON.stringify({
  candidateCount: result.candidates.length,
  outputDir,
  candidateIds: result.candidates.map((candidate) => candidate.candidateId),
}, null, 2));
