import path from 'node:path';

export function normalizePluginConfig(config = {}) {
  const outputDir = path.resolve(config.outputDir ?? path.join(process.cwd(), '.openclaw-evals'));
  const reviewer = config.reviewer ?? 'Palmer';

  return {
    ...config,
    outputDir,
    reviewer,
  };
}
