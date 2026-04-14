export function validateTranscript(transcript) {
  if (!transcript || typeof transcript !== 'object') {
    throw new Error('Transcript must be an object');
  }

  const { sessionId, turns } = transcript;

  if (!sessionId || typeof sessionId !== 'string') {
    throw new Error('Transcript.sessionId must be a non-empty string');
  }

  if (!Array.isArray(turns) || turns.length === 0) {
    throw new Error('Transcript.turns must be a non-empty array');
  }

  return {
    sessionId,
    channel: transcript.channel ?? null,
    model: transcript.model ?? null,
    instructionVersion: transcript.instructionVersion ?? null,
    turns: turns.map((turn, index) => validateTurn(turn, index)),
  };
}

function validateTurn(turn, index) {
  if (!turn || typeof turn !== 'object') {
    throw new Error(`Turn ${index} must be an object`);
  }

  if (!['user', 'assistant'].includes(turn.role)) {
    throw new Error(`Turn ${index} role must be user or assistant`);
  }

  if (typeof turn.content !== 'string' || turn.content.trim() === '') {
    throw new Error(`Turn ${index} content must be a non-empty string`);
  }

  return {
    index,
    role: turn.role,
    content: turn.content,
    timestamp: turn.timestamp ?? null,
  };
}
