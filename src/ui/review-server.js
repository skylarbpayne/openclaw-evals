import http from 'node:http';
import { URL } from 'node:url';
import { ReviewRepository } from '../review/review-repository.js';
import { createReviewApi } from '../review/api.js';
import { compareEvalRuns } from '../evals/compare-eval-runs.js';

export function createReviewServer({ baseDir, now } = {}) {
  const repository = new ReviewRepository(baseDir, now ? { now } : undefined);
  const api = createReviewApi(repository);

  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');

    try {
      if (req.method === 'GET' && url.pathname === '/') {
        return redirect(res, '/candidates');
      }

      if (req.method === 'GET' && url.pathname === '/candidates') {
        const candidates = await api.listCandidates();
        return html(res, renderCandidateListPage(candidates));
      }

      if (req.method === 'GET' && url.pathname === '/comparisons') {
        const summary = await compareEvalRuns({ baseDir });
        return html(res, renderComparisonListPage(summary));
      }

      if (req.method === 'GET' && url.pathname.startsWith('/comparisons/')) {
        const evalCaseId = decodeURIComponent(url.pathname.split('/')[2]);
        const summary = await compareEvalRuns({ baseDir, evalCaseId });
        const comparison = summary.evalCases[0];
        if (!comparison) {
          return notFound(res, `comparison not found: ${evalCaseId}`);
        }
        return html(res, renderComparisonDetailPage(comparison));
      }

      if (req.method === 'GET' && url.pathname.startsWith('/candidates/')) {
        const candidateId = decodeURIComponent(url.pathname.split('/')[2]);
        const candidate = await api.getCandidate(candidateId);
        return html(res, renderCandidateDetailPage(candidate));
      }

      if (req.method === 'POST' && url.pathname.startsWith('/candidates/')) {
        const candidateId = decodeURIComponent(url.pathname.split('/')[2]);
        const form = await readForm(req);
        const action = form.get('action');
        const reviewer = form.get('reviewer') || 'Skylar';
        const rationale = form.get('rationale') || '';

        if (action === 'approve') {
          await api.approveCandidate(candidateId, { reviewer, rationale });
        } else if (action === 'dismiss') {
          await api.dismissCandidate(candidateId, { reviewer, rationale });
        } else if (action === 'edit') {
          await api.editCandidate(
            candidateId,
            {
              title: form.get('title') || undefined,
              correctedExpectation: form.get('correctedExpectation') || undefined,
            },
            { reviewer, rationale },
          );
        } else {
          throw new Error(`Unsupported action: ${action}`);
        }

        return redirect(res, `/candidates/${encodeURIComponent(candidateId)}`);
      }

      notFound(res);
    } catch (error) {
      res.writeHead(500, { 'content-type': 'text/html; charset=utf-8' });
      res.end(`<h1>Review UI error</h1><pre>${escapeHtml(error.message)}</pre>`);
    }
  });
}

async function readForm(req) {
  const body = await readBody(req);
  return new URLSearchParams(body);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function html(res, body) {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(body);
}

function redirect(res, location) {
  res.writeHead(302, { location });
  res.end();
}

function notFound(res, message = 'Not found') {
  res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
  res.end(message);
}

function renderCandidateListPage(candidates) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Candidate Review Queue</title>
    <style>
      body { font-family: sans-serif; margin: 2rem; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ddd; padding: 0.6rem; text-align: left; vertical-align: top; }
      .status { font-weight: 600; }
    </style>
  </head>
  <body>
    <h1>Candidate Review Queue</h1>
    <table>
      <thead>
        <tr><th>ID</th><th>Status</th><th>Type</th><th>Session</th><th>Title</th></tr>
      </thead>
      <tbody>
        ${candidates.map((candidate) => `
          <tr>
            <td><a href="/candidates/${encodeURIComponent(candidate.candidateId)}">${escapeHtml(candidate.candidateId)}</a></td>
            <td class="status">${escapeHtml(candidate.status)}</td>
            <td>${escapeHtml(candidate.mistakeType ?? '')}</td>
            <td>${escapeHtml(candidate.sourceSessionId ?? '')}</td>
            <td>${escapeHtml(candidate.title ?? '')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </body>
</html>`;
}

function renderCandidateDetailPage(candidate) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(candidate.candidateId)}</title>
    <style>
      body { font-family: sans-serif; margin: 2rem; max-width: 900px; }
      pre { white-space: pre-wrap; background: #f6f6f6; padding: 1rem; }
      form { border: 1px solid #ddd; padding: 1rem; margin-top: 1rem; }
      label { display: block; margin-top: 0.75rem; }
      input[type="text"], textarea { width: 100%; padding: 0.5rem; }
      .meta { color: #444; }
      nav a { margin-right: 1rem; }
    </style>
  </head>
  <body>
    <nav><a href="/candidates">Candidates</a><a href="/comparisons">Comparisons</a></nav>
    <p><a href="/candidates">← Back to queue</a></p>
    <h1>${escapeHtml(candidate.candidateId)}</h1>
    <p class="meta">Status: <strong>${escapeHtml(candidate.status)}</strong></p>
    <p class="meta">Session: ${escapeHtml(candidate.sourceSessionId ?? '')}</p>
    <p class="meta">Story: ${escapeHtml(candidate.storyId ?? '')}</p>
    <p class="meta">Type: ${escapeHtml(candidate.mistakeType ?? '')}</p>
    <h2>Transcript excerpt</h2>
    <pre>${escapeHtml(JSON.stringify(candidate.transcriptExcerpt ?? {}, null, 2))}</pre>
    <h2>Provenance</h2>
    <pre>${escapeHtml(JSON.stringify(candidate.provenance ?? {}, null, 2))}</pre>
    <h2>Corrected expectation</h2>
    <pre>${escapeHtml(candidate.correctedExpectation ?? '')}</pre>
    <h2>Audit history</h2>
    <pre>${escapeHtml(JSON.stringify(candidate.auditHistory ?? [], null, 2))}</pre>

    <form method="POST" action="/candidates/${encodeURIComponent(candidate.candidateId)}">
      <h2>Approve</h2>
      <input type="hidden" name="action" value="approve" />
      <label>Reviewer <input type="text" name="reviewer" value="Skylar" /></label>
      <label>Rationale <textarea name="rationale"></textarea></label>
      <button type="submit">Approve candidate</button>
    </form>

    <form method="POST" action="/candidates/${encodeURIComponent(candidate.candidateId)}">
      <h2>Dismiss</h2>
      <input type="hidden" name="action" value="dismiss" />
      <label>Reviewer <input type="text" name="reviewer" value="Skylar" /></label>
      <label>Rationale <textarea name="rationale"></textarea></label>
      <button type="submit">Dismiss candidate</button>
    </form>

    <form method="POST" action="/candidates/${encodeURIComponent(candidate.candidateId)}">
      <h2>Edit</h2>
      <input type="hidden" name="action" value="edit" />
      <label>Reviewer <input type="text" name="reviewer" value="Skylar" /></label>
      <label>Rationale <textarea name="rationale"></textarea></label>
      <label>Title <input type="text" name="title" value="${escapeHtmlAttr(candidate.title ?? '')}" /></label>
      <label>Corrected expectation <textarea name="correctedExpectation">${escapeHtml(candidate.correctedExpectation ?? '')}</textarea></label>
      <button type="submit">Save edit</button>
    </form>
  </body>
</html>`;
}

function renderComparisonListPage(summary) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Eval Comparisons</title>
    <style>
      body { font-family: sans-serif; margin: 2rem; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ddd; padding: 0.6rem; text-align: left; vertical-align: top; }
      .pass { color: #0a7f2e; font-weight: 600; }
      .fail { color: #a11; font-weight: 600; }
      nav a { margin-right: 1rem; }
    </style>
  </head>
  <body>
    <nav><a href="/candidates">Candidates</a><a href="/comparisons">Comparisons</a></nav>
    <h1>Eval Comparisons</h1>
    <table>
      <thead>
        <tr><th>Eval case</th><th>Runs</th><th>Latest verdict</th><th>Verdict changed</th></tr>
      </thead>
      <tbody>
        ${summary.evalCases.map((entry) => `
          <tr>
            <td><a href="/comparisons/${encodeURIComponent(entry.evalCaseId)}">${escapeHtml(entry.evalCaseId)}</a></td>
            <td>${entry.runCount}</td>
            <td class="${entry.latest?.passed ? 'pass' : 'fail'}">${entry.latest?.passed ? 'pass' : 'fail'}</td>
            <td>${entry.deltaFromFirstToLatest ? escapeHtml(String(entry.deltaFromFirstToLatest.verdictChanged)) : 'n/a'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </body>
</html>`;
}

function renderComparisonDetailPage(comparison) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(comparison.evalCaseId)}</title>
    <style>
      body { font-family: sans-serif; margin: 2rem; max-width: 1000px; }
      pre { white-space: pre-wrap; background: #f6f6f6; padding: 1rem; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ddd; padding: 0.6rem; text-align: left; vertical-align: top; }
      nav a { margin-right: 1rem; }
      .pass { color: #0a7f2e; font-weight: 600; }
      .fail { color: #a11; font-weight: 600; }
    </style>
  </head>
  <body>
    <nav><a href="/candidates">Candidates</a><a href="/comparisons">Comparisons</a></nav>
    <p><a href="/comparisons">← Back to comparisons</a></p>
    <h1>${escapeHtml(comparison.evalCaseId)}</h1>
    <h2>Verdict history</h2>
    <table>
      <thead>
        <tr><th>Run</th><th>Created</th><th>Verdict</th><th>Failed checks</th></tr>
      </thead>
      <tbody>
        ${comparison.verdicts.map((entry) => `
          <tr>
            <td>${escapeHtml(entry.runId)}</td>
            <td>${escapeHtml(entry.createdAt)}</td>
            <td class="${entry.passed ? 'pass' : 'fail'}">${entry.passed ? 'pass' : 'fail'}</td>
            <td>${escapeHtml(entry.failedChecks.join(', '))}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <h2>Delta from first to latest</h2>
    <pre>${escapeHtml(JSON.stringify(comparison.deltaFromFirstToLatest, null, 2))}</pre>
    <h2>Latest result</h2>
    <pre>${escapeHtml(JSON.stringify(comparison.latest, null, 2))}</pre>
  </body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeHtmlAttr(value) {
  return escapeHtml(value).replaceAll('\n', '&#10;');
}
