export function attachRanking(candidate) {
  const frequency = deriveFrequency(candidate);
  const severity = deriveSeverity(candidate, frequency);

  return {
    ...candidate,
    ranking: {
      severity,
      frequency,
      priorityBand: derivePriorityBand(severity, frequency),
      reasons: deriveReasons(candidate, severity, frequency),
    },
  };
}

function deriveFrequency(candidate) {
  const retryCount = Number(candidate?.provenance?.retryCount ?? 1);
  if (retryCount >= 5) {
    return { label: 'repeated', retryCount };
  }
  if (retryCount >= 2) {
    return { label: 'recurring', retryCount };
  }
  return { label: 'single', retryCount };
}

function deriveSeverity(candidate, frequency) {
  if (candidate.mistakeType === 'runtime_provider_failure_loop') {
    if (frequency.retryCount >= 5) {
      return 'high';
    }
    return 'medium';
  }

  if (candidate.mistakeType === 'explicit_user_correction') {
    return 'low';
  }

  return 'low';
}

function derivePriorityBand(severity, frequency) {
  if (severity === 'high' && frequency.label === 'repeated') {
    return 'investigate-now';
  }
  if (severity === 'medium' || frequency.label === 'recurring') {
    return 'review-soon';
  }
  return 'routine';
}

function deriveReasons(candidate, severity, frequency) {
  const reasons = [];

  if (candidate.mistakeType === 'runtime_provider_failure_loop') {
    reasons.push('runtime/provider failure loop');
  }

  if (frequency.retryCount >= 2) {
    reasons.push(`${frequency.retryCount} repeated attempts observed`);
  }

  if (severity === 'high') {
    reasons.push('high operational impact due to repeated failure');
  }

  if (reasons.length === 0) {
    reasons.push('baseline candidate ranking');
  }

  return reasons;
}
