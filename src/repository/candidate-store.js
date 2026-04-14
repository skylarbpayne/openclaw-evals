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
      const filePath = await this.save(candidate);
      saved.push({ candidate, filePath });
    }

    return saved;
  }

  async save(candidate) {
    await mkdir(this.baseDir, { recursive: true });
    const normalized = normalizeCandidate(candidate);
    const filePath = this.getPath(normalized.candidateId);
    await writeFile(filePath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
    return filePath;
  }

  async read(candidateId) {
    return this.readFile(this.getPath(candidateId));
  }

  async readFile(filePath) {
    const content = await readFile(filePath, 'utf8');
    return normalizeCandidate(JSON.parse(content));
  }

  getPath(candidateId) {
    return path.join(this.baseDir, `${candidateId}.json`);
  }
}

function normalizeCandidate(candidate) {
  return {
    ...candidate,
    status: candidate.status ?? 'candidate',
    auditHistory: Array.isArray(candidate.auditHistory) ? candidate.auditHistory : [],
  };
}
