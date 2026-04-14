import process from 'node:process';
import { createReviewServer } from '../ui/review-server.js';

const baseDir = process.argv[2];
const port = Number(process.argv[3] ?? 3041);

if (!baseDir) {
  console.error('Usage: node src/cli/run-review-ui.js <registry-dir> [port]');
  process.exit(1);
}

const server = createReviewServer({ baseDir });
server.listen(port, () => {
  console.log(`Review UI listening on http://127.0.0.1:${port}`);
  console.log(`Registry dir: ${baseDir}`);
});
