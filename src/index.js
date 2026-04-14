import { validateTranscript } from './schemas/transcript.js';
import { detectExplicitCorrections } from './detectors/explicit-correction.js';
import { detectRuntimeFailureLoops } from './detectors/runtime-failure.js';
import { CandidateStore } from './repository/candidate-store.js';

export async function runA2({ transcript, outputDir }) {
  const validatedTranscript = validateTranscript(transcript);
  const candidates = [
    ...detectExplicitCorrections(validatedTranscript),
    ...detectRuntimeFailureLoops(validatedTranscript),
  ];
  const store = new CandidateStore(outputDir);
  const saved = await store.saveAll(candidates);

  return {
    transcript: validatedTranscript,
    candidates,
    saved,
  };
}
