import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export class EvalResultStore {
  constructor(baseDir, options = {}) {
    this.baseDir = baseDir;
    this.dirName = options.dirName ?? 'eval-results';
  }

  async save(result) {
    const dir = this.getDir();
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `${result.runId}.json`);
    await writeFile(filePath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
    return filePath;
  }

  async read(runId) {
    const filePath = path.join(this.getDir(), `${runId}.json`);
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content);
  }

  async list() {
    const dir = this.getDir();
    await mkdir(dir, { recursive: true });
    const entries = await readdir(dir);
    return entries.filter((entry) => entry.endsWith('.json')).sort();
  }

  getDir() {
    return path.join(this.baseDir, this.dirName);
  }
}
