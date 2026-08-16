#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

main();

function main() {
  const [sourceArg, targetArg, logArg] = process.argv.slice(2);
  if (!sourceArg || !targetArg || process.argv.length > 5) {
    console.error(
      'Usage: extract.mjs <source-dir> <resources-dir> [log-file]'
    );
    process.exit(1);
  }

  const repoRoot = path.resolve(sourceArg);
  const targetRoot = path.resolve(targetArg);
  const logPath = logArg ? path.resolve(logArg) : null;
  const requiredDir = path.join(targetRoot, 'required');
  const optionalDir = path.join(targetRoot, 'optional');

  if (!fs.existsSync(repoRoot) || !fs.statSync(repoRoot).isDirectory()) {
    throw new Error(`Source repo not found: ${repoRoot}`);
  }

  if (targetRoot === path.parse(targetRoot).root) {
    throw new Error(`Refusing to write to target: ${targetRoot}`);
  }

  fs.rmSync(requiredDir, { recursive: true, force: true });
  fs.rmSync(optionalDir, { recursive: true, force: true });
  fs.mkdirSync(requiredDir, { recursive: true });
  fs.mkdirSync(optionalDir, { recursive: true });

  const createdDirs = new Set([requiredDir, optionalDir]);
  const requiredEntries = [];
  const optionalEntries = [];
  const skippedEntries = [];
  const ignoreMatcher = createIgnoreMatcher(repoRoot);

  processDirectory(repoRoot, '', {
    targetRoot,
    requiredDir,
    optionalDir,
    ignoreMatcher,
    createdDirs,
    requiredEntries,
    optionalEntries,
    skippedEntries,
  });

  if (logPath) {
    ensureDir(path.dirname(logPath), createdDirs);
    fs.writeFileSync(
      logPath,
      buildLog({
        requiredEntries,
        optionalEntries,
        skippedEntries,
      }),
      'utf8'
    );
  }

  console.log(`Required: ${requiredEntries.length}`);
  console.log(`Optional: ${optionalEntries.length}`);
  console.log(`Skipped: ${skippedEntries.length}`);
}

function processDirectory(absDirPath, relDirPath, context) {
  const {
    targetRoot,
    requiredDir,
    optionalDir,
    ignoreMatcher,
    createdDirs,
    requiredEntries,
    optionalEntries,
    skippedEntries,
  } = context;
  const directoryBucket = getDirectoryBucket(absDirPath);
  const childDirectories = [];

  for (const entry of fs.readdirSync(absDirPath, { withFileTypes: true })) {
    const relPath = relDirPath
      ? path.join(relDirPath, entry.name)
      : entry.name;
    const normalizedRelPath = normalizePath(relPath);
    const absPath = path.join(absDirPath, entry.name);

    if (isWithinTarget(absPath, targetRoot)) {
      continue;
    }

    if (ignoreMatcher(normalizedRelPath, entry.isDirectory())) {
      continue;
    }

    if (entry.isDirectory()) {
      childDirectories.push({ absPath, relPath });
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (entry.name === 'airdev-next') {
      skippedEntries.push(relPath);
      continue;
    }

    if (relPath.startsWith(`src${path.sep}airdev${path.sep}`)) {
      copyFile(absPath, path.join(requiredDir, relPath), createdDirs);
      requiredEntries.push(relPath);
      continue;
    }

    const bucket = directoryBucket ?? classifyFile(absPath);
    if (bucket === 'required') {
      copyFile(absPath, path.join(requiredDir, relPath), createdDirs);
      requiredEntries.push(relPath);
    } else if (bucket === 'optional') {
      copyFile(absPath, path.join(optionalDir, relPath), createdDirs);
      optionalEntries.push(relPath);
    } else {
      skippedEntries.push(relPath);
    }
  }

  for (const childDirectory of childDirectories) {
    processDirectory(childDirectory.absPath, childDirectory.relPath, context);
  }
}

function createIgnoreMatcher(repoRoot) {
  const rules = parseIgnoreRules(path.join(repoRoot, '.gitignore'));
  const alwaysIgnore = new Set(['.git', 'node_modules']);

  return (relPath, isDirectory) => {
    const segments = relPath.split('/');
    if (segments.some((segment) => alwaysIgnore.has(segment))) {
      return true;
    }

    let ignored = false;
    for (const rule of rules) {
      if (!matchesRule(rule, relPath, isDirectory)) {
        continue;
      }
      ignored = !rule.negated;
    }
    return ignored;
  };
}

function parseIgnoreRules(ignoreFilePath) {
  if (!fs.existsSync(ignoreFilePath)) {
    return [];
  }

  return fs
    .readFileSync(ignoreFilePath, 'utf8')
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const negated = line.startsWith('!');
      const rawPattern = negated ? line.slice(1) : line;
      const directoryOnly = rawPattern.endsWith('/');
      const anchored = rawPattern.startsWith('/');
      const pattern = rawPattern.replace(/^\//u, '').replace(/\/$/u, '');

      return { anchored, directoryOnly, negated, pattern };
    })
    .filter((rule) => rule.pattern);
}

function matchesRule(rule, relPath, isDirectory) {
  if (rule.directoryOnly && !isDirectory) {
    return false;
  }

  const basename = path.posix.basename(relPath);
  const hasSlash = rule.pattern.includes('/');

  if (rule.directoryOnly) {
    if (rule.anchored) {
      return relPath === rule.pattern || relPath.startsWith(`${rule.pattern}/`);
    }
    return (
      relPath === rule.pattern ||
      relPath.startsWith(`${rule.pattern}/`) ||
      relPath.includes(`/${rule.pattern}/`)
    );
  }

  if (!hasSlash) {
    return matchesGlob(basename, rule.pattern);
  }

  if (rule.anchored) {
    return matchesGlob(relPath, rule.pattern);
  }

  return matchesGlob(relPath, rule.pattern) || matchesGlob(relPath, `**/${rule.pattern}`);
}

function getDirectoryBucket(absDirPath) {
  const markerPath = path.join(absDirPath, 'airdev-next');
  if (!fs.existsSync(markerPath) || !fs.statSync(markerPath).isFile()) {
    return null;
  }

  return classifyDirectoryMarker(markerPath);
}

function isWithinTarget(absPath, targetRoot) {
  const relativePath = path.relative(targetRoot, absPath);
  return (
    relativePath === '' ||
    (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))
  );
}

function matchesGlob(value, pattern) {
  return globToRegExp(pattern).test(value);
}

function globToRegExp(pattern) {
  let regex = '^';

  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];

    if (char === '\\') {
      const nextChar = pattern[index + 1];
      if (nextChar !== undefined) {
        regex += escapeRegExp(nextChar);
        index += 1;
      } else {
        regex += escapeRegExp(char);
      }
      continue;
    }

    if (char === '*') {
      const nextChar = pattern[index + 1];
      if (nextChar === '*') {
        const afterNextChar = pattern[index + 2];
        if (afterNextChar === '/') {
          regex += '(?:.*/)?';
          index += 2;
        } else {
          regex += '.*';
          index += 1;
        }
      } else {
        regex += '[^/]*';
      }
      continue;
    }

    if (char === '?') {
      regex += '[^/]';
      continue;
    }

    regex += escapeRegExp(char);
  }

  return new RegExp(`${regex}$`, 'u');
}

function escapeRegExp(value) {
  return value.replace(/[|\\{}()[\]^$+?.]/gu, '\\$&');
}

function classifyFile(filePath) {
  const header = readHeader(filePath);
  if (header === null) {
    return null;
  }

  if (
    header.includes('@airdev/next managed') ||
    header.includes('"@airdev/next": "managed"')
  ) {
    return 'required';
  }

  if (
    header.includes('@airdev/next seeded') ||
    header.includes('"@airdev/next": "seeded"')
  ) {
    return 'optional';
  }

  return null;
}

function classifyDirectoryMarker(filePath) {
  const firstLine = readFirstLine(filePath);
  if (firstLine === null) {
    return null;
  }

  const normalizedFirstLine = firstLine.trim().toLowerCase();
  if (normalizedFirstLine === 'managed') {
    return 'required';
  }

  if (normalizedFirstLine === 'seeded') {
    return 'optional';
  }

  return null;
}

function readHeader(filePath) {
  const fd = fs.openSync(filePath, 'r');
  try {
    const buffer = Buffer.alloc(4096);
    const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
    const chunk = buffer.subarray(0, bytesRead);

    if (chunk.includes(0)) {
      return null;
    }

    const text = chunk.toString('utf8');
    const lines = text.split(/\r?\n/u).slice(0, 2);
    return lines.join('\n');
  } finally {
    fs.closeSync(fd);
  }
}

function readFirstLine(filePath) {
  const fd = fs.openSync(filePath, 'r');
  try {
    const buffer = Buffer.alloc(1024);
    const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
    const chunk = buffer.subarray(0, bytesRead);

    if (chunk.includes(0)) {
      return null;
    }

    const text = chunk.toString('utf8');
    return text.split(/\r?\n/u, 1)[0] ?? '';
  } finally {
    fs.closeSync(fd);
  }
}

function copyFile(sourcePath, targetPath, createdDirs) {
  ensureDir(path.dirname(targetPath), createdDirs);
  fs.copyFileSync(sourcePath, targetPath);
}

function ensureDir(dirPath, createdDirs) {
  if (createdDirs.has(dirPath)) {
    return;
  }
  fs.mkdirSync(dirPath, { recursive: true });
  createdDirs.add(dirPath);
}

function buildLog({ requiredEntries, optionalEntries, skippedEntries }) {
  return [
    `Required (${requiredEntries.length}):`,
    ...requiredEntries,
    '',
    `Optional (${optionalEntries.length}):`,
    ...optionalEntries,
    '',
    `Skipped (${skippedEntries.length}):`,
    ...skippedEntries,
    '',
  ].join('\n');
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/');
}
