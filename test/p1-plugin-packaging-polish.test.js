import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const manifest = JSON.parse(await readFile(new URL('../openclaw.plugin.json', import.meta.url), 'utf8'));

test('P1-PACKAGE-1 package metadata exposes native OpenClaw plugin packaging fields', () => {
  assert.ok(packageJson.openclaw);
  assert.deepEqual(packageJson.openclaw.extensions, ['./src/plugin/openclaw-evals-plugin.js']);
  assert.equal(packageJson.openclaw.install.localPath, '.');
  assert.equal(packageJson.openclaw.install.defaultChoice, 'local');
});

test('P1-PACKAGE-2 plugin manifest id matches package entry expectations and exposes config schema', () => {
  assert.equal(manifest.id, 'openclaw-evals');
  assert.equal(manifest.name, 'OpenClaw Evals');
  assert.ok(manifest.configSchema);
  assert.equal(manifest.configSchema.type, 'object');
  assert.equal(manifest.configSchema.additionalProperties, false);
  assert.ok(manifest.configSchema.properties.outputDir);
  assert.ok(manifest.configSchema.properties.reviewer);
});
