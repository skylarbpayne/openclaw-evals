export function ingestSessionTranscript(session) {
  if (!session || typeof session !== 'object') throw new Error('session is required');
  return {
    sessionId: session.sessionId,
    channel: session.channel ?? 'unknown',
    model: session.model ?? 'unknown',
    instructionVersion: session.instructionVersion ?? 'unknown',
    turns: Array.isArray(session.turns) ? session.turns : [],
    ingestedAt: new Date().toISOString(),
  };
}
