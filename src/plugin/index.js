export function createPluginSkeleton() {
  return {
    name: 'openclaw-evals',
    version: '0.1.0',
    capabilities: {
      ingestion: true,
      detection: true,
      reviewQueue: true,
      api: true,
    },
    routes: [
      'POST /api/evals/ingest/session',
      'GET /api/evals/mistakes',
      'POST /api/evals/mistakes/:id/review',
    ],
  };
}
