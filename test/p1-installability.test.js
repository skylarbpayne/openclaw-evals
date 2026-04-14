import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { normalizePluginConfig } from '../src/plugin/config.js';

const execFileAsync = promisify(execFile);

test('P1-INSTALL-1 normalizePluginConfig sets boring defaults', () => {
  const normalized = normalizePluginConfig();

  assert.equal(normalized.reviewer, 'Palmer');
  assert.match(normalized.outputDir, /\.openclaw-evals$/);
  assert.equal(path.isAbsolute(normalized.outputDir), true);
});

test('P1-INSTALL-2 install-oriented plugin CLI initializes output and processes transcript with minimal flags', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-p1-install-'));

  try {
    const { stdout } = await execFileAsync('node', [
      'src/cli/run-plugin-flow.js',
      '--input',
      'test/fixtures/a2-explicit-correction.json',
      '--decisions',
      'test/fixtures/plugin-review-decisions.json',
      '--output-dir',
      outputDir,
    ], {
      cwd: path.resolve('.'),
    });

    const parsed = JSON.parse(stdout);
    assert.equal(parsed.mode, 'transcript');
    assert.equal(parsed.minedCount, 1);
    assert.equal(parsed.appliedCount, 1);
    assert.equal(parsed.convertedCount, 1);

    const dbStats = await stat(path.join(outputDir, 'mistake-registry.sqlite'));
    assert.equal(dbStats.isFile(), true);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
