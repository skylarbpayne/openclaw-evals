import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createReviewServer } from '../src/ui/review-server.js';
import { runA2 } from '../src/index.js';

const REVIEWER = 'Skylar';

test('F4-UI-1 list page renders persisted candidates', async () => {
  const outputDir = await seedRegistry();
  const { server, baseUrl } = await startServer(outputDir);

  try {
    const response = await fetch(`${baseUrl}/candidates`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /Candidate Review Queue/);
    assert.match(body, /a2-session-explicit-1-1-2/);
  } finally {
    server.close();
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('F4-UI-2 detail page shows evidence and audit history', async () => {
  const outputDir = await seedRegistry();
  const { server, baseUrl } = await startServer(outputDir);

  try {
    const response = await fetch(`${baseUrl}/candidates/a2-session-explicit-1-1-2`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /Transcript excerpt/);
    assert.match(body, /Corrected expectation/);
    assert.match(body, /Audit history/);
  } finally {
    server.close();
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('F4-UI-3 approve action updates candidate state through form submit', async () => {
  const outputDir = await seedRegistry();
  const { server, baseUrl } = await startServer(outputDir);

  try {
    const response = await fetch(`${baseUrl}/candidates/a2-session-explicit-1-1-2`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        action: 'approve',
        reviewer: REVIEWER,
        rationale: 'looks right',
      }),
      redirect: 'manual',
    });

    assert.equal(response.status, 302);

    const detail = await fetch(`${baseUrl}/candidates/a2-session-explicit-1-1-2`);
    const body = await detail.text();

    assert.match(body, /Status: <strong>approved<\/strong>/);
    assert.match(body, /looks right/);
  } finally {
    server.close();
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('F4-UI-4 edit action updates title and corrected expectation', async () => {
  const outputDir = await seedRegistry();
  const { server, baseUrl } = await startServer(outputDir);

  try {
    const response = await fetch(`${baseUrl}/candidates/a2-session-explicit-1-1-2`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        action: 'edit',
        reviewer: REVIEWER,
        rationale: 'tighten language',
        title: 'Summary requested, email returned',
        correctedExpectation: 'Return a short summary.',
      }),
      redirect: 'manual',
    });

    assert.equal(response.status, 302);

    const detail = await fetch(`${baseUrl}/candidates/a2-session-explicit-1-1-2`);
    const body = await detail.text();

    assert.match(body, /Summary requested, email returned/);
    assert.match(body, /Return a short summary\./);
    assert.match(body, /tighten language/);
  } finally {
    server.close();
    await rm(outputDir, { recursive: true, force: true });
  }
});

async function seedRegistry() {
  const fixturePath = path.resolve('test/fixtures/a2-explicit-correction.json');
  const transcript = JSON.parse(await readFile(fixturePath, 'utf8'));
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'openclaw-evals-f4-ui-'));
  await runA2({ transcript, outputDir });
  return outputDir;
}

async function startServer(outputDir) {
  const server = createReviewServer({ baseDir: outputDir, now: () => '2026-04-14T03:00:00.000Z' });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
}
