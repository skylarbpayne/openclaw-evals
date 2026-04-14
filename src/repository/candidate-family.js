import { createHash } from 'node:crypto';

export function attachFamily(candidate) {
  const family = deriveFamily(candidate);
  if (!family) {
    return candidate;
  }

  return {
    ...candidate,
    family,
  };
}

function deriveFamily(candidate) {
  if (candidate.mistakeType !== 'runtime_provider_failure_loop') {
    return null;
  }

  const errorSignature = normalizeRuntimeError(candidate?.provenance?.errorMessage);
  const familyKeySource = [candidate.storyId, candidate.mistakeType, errorSignature].join('::');
  const familyId = `family-${createHash('sha1').update(familyKeySource).digest('hex').slice(0, 12)}`;

  return {
    familyId,
    familyKey: familyKeySource,
    familyType: 'runtime_provider_failure',
    displayName: buildDisplayName(errorSignature),
    signature: {
      storyId: candidate.storyId,
      mistakeType: candidate.mistakeType,
      errorSignature,
    },
  };
}

function normalizeRuntimeError(value) {
  const raw = String(value ?? '').toLowerCase().trim().replaceAll(/\s+/g, ' ');

  if (raw.includes('oauth authentication is currently not allowed')) {
    return 'oauth-auth-not-allowed';
  }

  if (raw.includes('permission_error')) {
    return 'permission-error';
  }

  return raw.replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/(^-|-$)/g, '') || 'unknown-runtime-error';
}

function buildDisplayName(errorSignature) {
  if (errorSignature === 'oauth-auth-not-allowed') {
    return 'OAuth auth not allowed runtime failures';
  }

  if (errorSignature === 'permission-error') {
    return 'Permission error runtime failures';
  }

  return `Runtime failure family: ${errorSignature}`;
}
