import { createMistakeCandidate } from '../schemas/mistake-candidate.js';

const DEFAULT_PATTERNS = [
  /that's wrong/i,
  /that is wrong/i,
  /don't do that/i,
  /do not do that/i,
  /you missed/i,
  /i asked for/i,
  /not what i asked/i,
  /you forgot/i,
  /that's not right/i,
];

function findPreviousAssistantTurn(turns, index) {
  for (let i = index - 1; i >= 0; i -= 1) {
    if (turns[i]?.role === 'assistant') return turns[i];
  }
  return null;
}

export function detectExplicitCorrections(ingestedSession, options = {}) {
  const patterns = options.patterns ?? DEFAULT_PATTERNS;
  const turns = ingestedSession.turns ?? [];
  const candidates = [];

  turns.forEach((turn, index) => {
    if (turn?.role !== 'user' || typeof turn.content !== 'string') return;
    const matched = patterns.some((pattern) => pattern.test(turn.content));
    if (!matched) return;

    const priorAssistant = findPreviousAssistantTurn(turns, index);
    if (!priorAssistant) return;

    candidates.push(createMistakeCandidate({
      id: `${ingestedSession.sessionId}:${index}`,
      title: 'Explicit user correction detected',
      mistakeType: 'explicit_user_correction',
      severity: 'medium',
      confidence: 0.95,
      transcriptExcerpt: `Assistant: ${priorAssistant.content}
User: ${turn.content}`,
      triggeringContext: priorAssistant.content,
      expectedBehavior: turn.content,
      likelyRootCause: 'assistant_response_misaligned_with_user_request',
      reproducibilityEstimate: 0.7,
      sourceSessions: [ingestedSession.sessionId],
      sourceTurnRange: { start: index - 1, end: index },
      detectionType: 'explicit',
      status: 'candidate',
    }));
  });

  return candidates;
}
