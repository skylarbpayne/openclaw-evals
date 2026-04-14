export function detectRuntimeFailureLoops(transcript) {
  const candidates = [];

  for (let index = 0; index < transcript.turns.length; index += 1) {
    const turn = transcript.turns[index];
    if (turn.role !== 'assistant') continue;
    if (turn.kind !== 'runtime_error') continue;

    const previousUser = findPreviousUserTurn(transcript.turns, index);
    if (!previousUser) continue;

    const loopSize = countNearbyRepeatedUserRetries(transcript.turns, previousUser.content, index);
    if (loopSize < 2) continue;

    candidates.push(buildRuntimeFailureCandidate(transcript, previousUser, turn, loopSize));
  }

  return dedupeByCandidateId(candidates);
}

function findPreviousUserTurn(turns, beforeIndex) {
  for (let index = beforeIndex - 1; index >= 0; index -= 1) {
    if (turns[index].role === 'user') {
      return turns[index];
    }
  }
  return null;
}

function countNearbyRepeatedUserRetries(turns, userContent, aroundIndex) {
  let count = 0;

  for (let index = Math.max(0, aroundIndex - 12); index <= Math.min(turns.length - 1, aroundIndex + 12); index += 1) {
    const turn = turns[index];
    if (turn.role === 'user' && normalize(turn.content) === normalize(userContent)) {
      count += 1;
    }
  }

  return count;
}

function buildRuntimeFailureCandidate(transcript, userTurn, assistantTurn, retryCount) {
  return {
    candidateId: `a3-${transcript.sessionId}-${userTurn.index}-${assistantTurn.index}`,
    storyId: 'A3',
    mistakeType: 'runtime_provider_failure_loop',
    sourceSessionId: transcript.sessionId,
    sourceTurnRange: {
      start: userTurn.index,
      end: assistantTurn.index,
    },
    provenance: {
      channel: transcript.channel,
      model: transcript.model,
      instructionVersion: transcript.instructionVersion,
      userTimestamp: userTurn.timestamp,
      assistantTimestamp: assistantTurn.timestamp,
      errorMessage: assistantTurn.errorMessage ?? assistantTurn.content,
      retryCount,
    },
    transcriptExcerpt: {
      triggeringUserTurn: {
        role: userTurn.role,
        content: userTurn.content,
        index: userTurn.index,
      },
      runtimeFailureTurn: {
        role: assistantTurn.role,
        content: assistantTurn.content,
        index: assistantTurn.index,
        kind: assistantTurn.kind,
        errorMessage: assistantTurn.errorMessage ?? null,
      },
    },
    correctedExpectation: `Handle provider/runtime failures gracefully instead of repeating the same failing attempt ${retryCount} times.`,
    title: 'Repeated provider/runtime failure loop',
  };
}

function dedupeByCandidateId(candidates) {
  return [...new Map(candidates.map((candidate) => [candidate.candidateId, candidate])).values()];
}

function normalize(value) {
  return String(value).trim().replaceAll(/\s+/g, ' ');
}
