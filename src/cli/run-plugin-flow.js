import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createOpenClawEvalsPlugin } from '../plugin/openclaw-evals-plugin.js';

const args = process.argv.slice(2);
const options = parseArgs(args);

if (!options.input) {
  console.error('Usage: node src/cli/run-plugin-flow.js --input <transcript.json|session.jsonl> [--decisions <decisions.json>] [--output-dir <dir>] [--reviewer <name>] [--session-log]');
  process.exit(1);
}

await mkdir(options.outputDir, { recursive: true });

const plugin = createOpenClawEvalsPlugin({
  outputDir: options.outputDir,
  reviewer: options.reviewer,
});

const result = options.sessionLog
  ? await plugin.processOpenClawSessionLog({
      sessionLogPath: options.input,
      decisionsPath: options.decisions,
    })
  : await plugin.processTranscriptFile({
      transcriptPath: options.input,
      decisionsPath: options.decisions,
    });

console.log(JSON.stringify({
  mode: options.sessionLog ? 'session-log' : 'transcript',
  outputDir: options.outputDir,
  decisionsPath: options.decisions ?? null,
  ...result,
}, null, 2));

function parseArgs(argv) {
  const parsed = {
    outputDir: path.resolve(process.cwd(), '.openclaw-evals'),
    reviewer: 'Palmer',
    sessionLog: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--input') {
      parsed.input = argv[index + 1];
      index += 1;
    } else if (token === '--decisions') {
      parsed.decisions = argv[index + 1];
      index += 1;
    } else if (token === '--output-dir') {
      parsed.outputDir = path.resolve(argv[index + 1]);
      index += 1;
    } else if (token === '--reviewer') {
      parsed.reviewer = argv[index + 1];
      index += 1;
    } else if (token === '--session-log') {
      parsed.sessionLog = true;
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  return parsed;
}
