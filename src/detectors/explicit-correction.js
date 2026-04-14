const CORRECTION_PATTERNS = [
  /\bthat(?:'| i)?s wrong\b/i,
  /\bdon't do that\b/i,
  /\byou missed\b/i,
  /\bi asked for\b/i,
  /\bnot an?\b/i,
];

export function detectExplicitCorrections(transcript) {
  const candidates = [];

  for (const turn of transcript.turns) {
    if (turn.role !== 'user') continue;
    if (!CORRECTION_PATTERNS.some((pattern) => pattern.test(turn.content))) continue;

    const assistantTurn = findPreviousAssistantTurn(transcript.turns, turn.index);
    if (!assistantTurn) continue;

    candidates.push(buildCandidate(transcript, assistantTurn, turn));
  }

  return candidates;
}

function findPreviousAssistantTurn(turns, beforeIndex) {
  for (let index = beforeIndex - 1; index >= 0; index -= 1) {
    if (turns[index].role === 'assistant') {
      return turns[index];
    }
  }

  return null;
}

function buildCandidate(transcript, assistantTurn, userTurn) {
  return {
    candidateId: `a2-${transcript.sessionId}-${assistantTurn.index}-${userTurn.index}`,
    storyId: 'A2',
    mistakeType: 'explicit_user_correction',
    sourceSessionId: transcript.sessionId,
    sourceTurnRange: {
      start: assistantTurn.index,
      end: userTurn.index,
    },
    provenance: {
      channel: transcript.channel,
      model: transcript.model,
      instructionVersion: transcript.instructionVersion,
      assistantTimestamp: assistantTurn.timestamp,
      userTimestamp: userTurn.timestamp,
    },
    transcriptExcerpt: {
      correctedAssistantTurn: {
        role: assistantTurn.role,
        content: assistantTurn.content,
        index: assistantTurn.index,
      },
      correctingUserTurn: {
        role: userTurn.role,
        content: userTurn.content,
        index: userTurn.index,
      },
    },
    correctedExpectation: userTurn.content,
  };
}
