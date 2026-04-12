const VALID_DETECTION_TYPES = new Set(['explicit', 'implicit', 'hybrid']);
const VALID_STATUSES = new Set(['candidate', 'confirmed', 'dismissed', 'converted_to_eval']);

export function validateMistakeCandidate(input) {
  const errors = [];
  if (!input || typeof input !== 'object') {
    return { ok: false, errors: ['candidate must be an object'] };
  }
  if (!input.id || typeof input.id !== 'string') errors.push('id is required');
  if (!input.title || typeof input.title !== 'string') errors.push('title is required');
  if (!VALID_DETECTION_TYPES.has(input.detectionType)) errors.push('detectionType must be explicit, implicit, or hybrid');
  if (!VALID_STATUSES.has(input.status)) errors.push('status must be candidate, confirmed, dismissed, or converted_to_eval');
  if (!Array.isArray(input.sourceSessions) || input.sourceSessions.length === 0) errors.push('sourceSessions must be a non-empty array');
  if (typeof input.transcriptExcerpt !== 'string' || !input.transcriptExcerpt.trim()) errors.push('transcriptExcerpt is required');
  if (typeof input.expectedBehavior !== 'string' || !input.expectedBehavior.trim()) errors.push('expectedBehavior is required');
  return { ok: errors.length === 0, errors };
}

export function createMistakeCandidate(fields) {
  const candidate = {
    id: fields.id,
    title: fields.title,
    mistakeType: fields.mistakeType ?? 'unclassified',
    severity: fields.severity ?? 'medium',
    confidence: fields.confidence ?? 0.5,
    transcriptExcerpt: fields.transcriptExcerpt ?? '',
    triggeringContext: fields.triggeringContext ?? '',
    expectedBehavior: fields.expectedBehavior ?? '',
    likelyRootCause: fields.likelyRootCause ?? '',
    reproducibilityEstimate: fields.reproducibilityEstimate ?? 0.5,
    sourceSessions: fields.sourceSessions ?? [],
    sourceTurnRange: fields.sourceTurnRange ?? null,
    status: fields.status ?? 'candidate',
    detectionType: fields.detectionType ?? 'explicit',
    createdAt: fields.createdAt ?? new Date().toISOString(),
  };
  const validation = validateMistakeCandidate(candidate);
  if (!validation.ok) {
    const err = new Error(`Invalid mistake candidate: ${validation.errors.join('; ')}`);
    err.validationErrors = validation.errors;
    throw err;
  }
  return candidate;
}
