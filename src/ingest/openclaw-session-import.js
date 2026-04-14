import { readFile } from 'node:fs/promises';
import { validateTranscript } from '../schemas/transcript.js';

export async function importOpenClawSessionLog(filePath) {
  const content = await readFile(filePath, 'utf8');
  const events = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  const session = events.find((event) => event.type === 'session');
  if (!session?.id) {
    throw new Error(`Session log ${filePath} is missing a session header`);
  }

  const turns = [];
  for (const event of events) {
    if (event.type !== 'message' || !event.message) {
      continue;
    }

    const role = event.message.role;
    if (role !== 'user' && role !== 'assistant') {
      continue;
    }

    const text = extractText(event.message.content);
    const errorMessage = role === 'assistant' ? event.message.errorMessage ?? event.errorMessage ?? null : null;
    if (!text && !errorMessage) {
      continue;
    }

    turns.push({
      role,
      content: text || errorMessage,
      timestamp: event.timestamp ?? event.message.timestamp ?? null,
      kind: errorMessage ? 'runtime_error' : 'text',
      errorMessage,
    });
  }

  if (turns.length === 0) {
    throw new Error(`Session log ${filePath} did not contain usable user/assistant text turns`);
  }

  return validateTranscript({
    sessionId: session.id,
    channel: 'openclaw-session-log',
    model: events.find((event) => event.type === 'model_change')?.modelId,
    turns,
  });
}

function extractText(content) {
  if (!Array.isArray(content)) {
    return '';
  }

  return content
    .filter((part) => part?.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text.trim())
    .filter(Boolean)
    .join('\n\n');
}
