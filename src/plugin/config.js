import path from 'node:path';

export function normalizePluginConfig(config = {}) {
  const outputDir = path.resolve(config.outputDir ?? path.join(process.cwd(), '.openclaw-evals'));
  const reviewer = config.reviewer ?? 'Palmer';
  const uiHost = config.uiHost ?? '127.0.0.1';
  const uiPort = config.uiPort ?? 0;

  return {
    ...config,
    outputDir,
    reviewer,
    uiHost,
    uiPort,
  };
}
