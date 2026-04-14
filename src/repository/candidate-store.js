import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export class CandidateStore {
  constructor(baseDir) {
    this.baseDir = baseDir;
  }

  async saveAll(candidates) {
    await mkdir(this.baseDir, { recursive: true });
    const saved = [];

    for (const candidate of candidates) {
      const filePath = path.join(this.baseDir, `${candidate.candidateId}.json`);
      await writeFile(filePath, `${JSON.stringify(candidate, null, 2)}\n`, 'utf8');
      saved.push({ candidate, filePath });
    }

    return saved;
  }

  async read(candidateId) {
    const filePath = path.join(this.baseDir, `${candidateId}.json`);
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content);
  }
}
