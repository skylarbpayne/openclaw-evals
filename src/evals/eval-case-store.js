import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export class EvalCaseStore {
  constructor(baseDir, options = {}) {
    this.baseDir = baseDir;
    this.dirName = options.dirName ?? 'eval-cases';
  }

  async save(evalCase) {
    const dir = this.getDir();
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `${evalCase.evalCaseId}.json`);
    await writeFile(filePath, `${JSON.stringify(evalCase, null, 2)}\n`, 'utf8');
    return filePath;
  }

  async read(evalCaseId) {
    const filePath = path.join(this.getDir(), `${evalCaseId}.json`);
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content);
  }

  getDir() {
    return path.join(this.baseDir, this.dirName);
  }
}
