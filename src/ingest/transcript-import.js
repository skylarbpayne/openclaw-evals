import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { validateTranscript } from '../schemas/transcript.js';

export async function importTranscriptFile(filePath) {
  const transcript = await readJsonFile(filePath);

  try {
    return validateTranscript(transcript);
  } catch (error) {
    throw new Error(`Invalid transcript file ${filePath}: ${error.message}`);
  }
}

export async function importTranscriptDirectory(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.join(directoryPath, entry.name))
    .sort();

  const transcripts = [];
  for (const filePath of jsonFiles) {
    transcripts.push(await importTranscriptFile(filePath));
  }

  return transcripts;
}

async function readJsonFile(filePath) {
  let content;
  try {
    content = await readFile(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Unable to read transcript file ${filePath}: ${error.message}`);
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid JSON in transcript file ${filePath}: ${error.message}`);
  }
}
