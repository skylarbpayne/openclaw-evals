import { mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { runFirstLoop } from '../e2e/run-first-loop.js';

const transcriptDir = process.argv[2];
const decisionsPath = process.argv[3];

if (!transcriptDir || !decisionsPath) {
  console.error('Usage: node src/cli/run-first-loop.js <transcript-dir> <decisions.json>');
  process.exit(1);
}

const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-first-loop-'));
const decisions = JSON.parse(await readFile(decisionsPath, 'utf8'));
const result = await runFirstLoop({ transcriptDir, decisions, outputDir });

console.log(JSON.stringify({ outputDir, ...result }, null, 2));
