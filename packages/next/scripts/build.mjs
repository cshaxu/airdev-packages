import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const resourcesRoot = path.join(repoRoot, 'resources');
const tmpRoot = path.join(repoRoot, 'tmp');
const logPath = path.join(tmpRoot, 'extract.log');
const sourceRepoRoot = resolveSourceRepoRoot();
const extractScriptPath = path.join(repoRoot, 'scripts', 'extract.mjs');

if (!fs.existsSync(extractScriptPath)) {
  throw new Error(`extract.mjs not found: ${extractScriptPath}`);
}

fs.mkdirSync(resourcesRoot, { recursive: true });
fs.mkdirSync(tmpRoot, { recursive: true });

execFileSync(
  process.execPath,
  [extractScriptPath, sourceRepoRoot, resourcesRoot, logPath],
  {
    cwd: repoRoot,
    stdio: 'inherit',
  }
);

function resolveSourceRepoRoot() {
  const candidates = [
    process.env.BAREBONE_NEXT_REPO_PATH,
    process.env.AIRDEV_NEXT_SOURCE_REPO_PATH,
    path.resolve(repoRoot, '..', '..', 'repos', 'barebone-next'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      return resolved;
    }
  }

  throw new Error(
    [
      'Unable to locate barebone-next source repo.',
      'Set BAREBONE_NEXT_REPO_PATH or AIRDEV_NEXT_SOURCE_REPO_PATH,',
      'or place barebone-next at ../../repos/barebone-next relative to this package.',
    ].join(' ')
  );
}
